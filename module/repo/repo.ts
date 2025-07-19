"use server";

import { GitHubService } from "@/lib/github";
import { auth } from "../../auth";
import { db } from "@/lib/prisma";
import { Issue, Repo } from "@/types";

export const getAllWithGithub = async () => {
  try {
    const session = await auth();

    if (!session?.user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const githubClient = new GitHubService(session.user.accessToken as string);
    const starredRepos = await githubClient.getStarredRepos();

    const userRepos: Repo[] = starredRepos.map((repo) => {
      return {
        github_id: String(repo.id),
        node_id: repo.node_id,
        name: repo.name,
        owner: repo.owner.login,
        description: repo.description,
        full_name: repo.full_name,
        html_url: repo.html_url,
        topics: repo.topics,
        language: repo.language || "",
        avatar_url: repo.owner.avatar_url,
        homepage_url: repo.homepage,
        stars: repo.stargazers_count,
        issues: repo.open_issues_count,
        is_forked: repo.fork,
      };
    });

    return {
      success: true,
      data: userRepos,
    };

  } catch (error) {
    return {
      success: false,
      message: "Error fetching repositories",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};


export const getUserRepos = async () => {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  const userRepos = await db.userRepos.findMany({
    where: {
      user_id: session.user.id,
    },
    include: {
      allRepos: true,
    },
  });

  return {
    success: true,
    data: userRepos,
  };
};

export const getUserIssue = async () => {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "User not found",
    };
  }
  const githubClient = new GitHubService(session.user.accessToken as string);
  const allUserRepos = await getAllWithGithub()
  if(allUserRepos.success && allUserRepos.data && allUserRepos.data?.length > 0) {
    const issues: any[] = [];
    allUserRepos?.data.forEach(async (repo) => {
      const issuesData = await githubClient.getIssues(repo.owner, repo.name);
      issuesData.forEach((issue) => {
        issues.push(issue);
      });
    });

    console.log("issues", issues);
    return {
      success: true,
      data: issues,
    };
  }

  return {
    success: false,
    message: "No repositories found",
  };
}