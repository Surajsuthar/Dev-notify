"use server";

import { GitHubService } from "@/lib/github";
import { auth } from "../../auth";
import { db } from "@/lib/prisma";
import { Repo } from "@/types";
import { Issue } from "./type";
import { getUser } from "../user/user";
import { cache as reactCache } from "react";


export const getGithubService = reactCache(async () => {
  try {
    const session = await auth();
    if (!session?.user) {
      return null;
    }
    return new GitHubService(session.user.accessToken as string);
  } catch (error) {
    console.error("Error getting Github service", error);
    return null;
  }
})

export const getAllWithGithub = reactCache(async () => {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const user = await getUser(session.user.email);

    const githubClient = await getGithubService();
    if (!githubClient) {
      return {
        success: false,
        message: "Github client not found",
      };
    }

    const rateLimit = await githubClient.getRateLimit();
    console.log("Rate limit", rateLimit);

    const starredRepos = await githubClient.getStarredRepos();

    const userRepos: Repo[] = starredRepos.map((repo) => ({
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
    }));

    const uniqueRepos = Array.from(new Map(userRepos.map(r => [r.node_id, r])).values());
    await Promise.all(
      uniqueRepos.map(async (repo) => {
        try {
          const dbRepo = await db.repo.upsert({
            where: {
              node_id: repo.node_id,
            },
            update: {
              name: repo.name,
              owner: repo.owner,
              description: repo.description,
              full_name: repo.full_name,
              github_url: repo.html_url,
              stars: String(repo.stars),
              issues: String(repo.issues),
              language: repo.language,
              topics: repo.topics,
              homepage_url: repo.homepage_url,
            },
            create: {
              node_id: repo.node_id,
              name: repo.name,
              owner: repo.owner,
              description: repo.description,
              full_name: repo.full_name,
              github_url: repo.html_url,
              stars: String(repo.stars),
              issues: String(repo.issues),
              language: repo.language,
              topics: repo.topics,
              homepage_url: repo.homepage_url,
            },
            select: { id: true },
          });

          await db.userRepo.upsert({
            where: {
              userId_repoId: {
                userId: user?.id!,
                repoId: dbRepo.id,
              },
            },
            update: {},
            create: {
              userId: user?.id!,
              repoId: dbRepo.id,
            },
          });
        } catch (err) {
          console.error(`Failed to process repo ${repo.full_name}`, err);
        }
      })
    );

    // Optional: Fetch synced data from DB
    const syncedRepos = await db.userRepo.findMany({
      where: { userId: user?.id! },
      include: { repo: true },
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
});


export const getUserRepos = reactCache(async () => {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  const user = await getUser(session.user.email);

  const userRepos = await db.userRepo.findMany({
    where: { userId: user?.id! },
  });

});

export const getUserIssue = reactCache(async () => {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "User not found",
    };
  }
  const githubClient = await getGithubService();
  const allUserRepos = await getAllWithGithub()

  if (allUserRepos.success && allUserRepos.data && allUserRepos.data.length > 0) {
    const issues: Issue[] = [];
    await Promise.all(
      allUserRepos.data.map(async (repo) => {
        if (!githubClient) {
          return;
        }
        const issuesData = await githubClient.getIssues(repo.owner, repo.name);
        if (issuesData.length > 0) {
          issuesData.forEach((issue) => {
            if(Object.keys(issue?.pull_request || {}).length > 0) {
              return;
            }
            issues.push({
              id: issue.id,
              title: issue.title,
              issueNumber: issue.number,
              issue_url: issue.html_url,
              createdAt: issue.created_at,
              created_by: issue.user?.login,
              label: issue.labels.map((label) => {
                if (typeof label === 'string') {
                  return label;
                }
                return label.name || '';
              }) || [],
              state: issue.state as "open" | "closed",
              comments: issue.comments,
              body: issue.body || "",
              reactions: issue.reactions?.total_count,
              assignees: (issue.assignees?.length || 0) > 0,
              owner: repo.owner,
              language: repo.language,
            });
          });
        }
      })
    );

    return {
      success: true,
      data: issues,
    };
  }

  return {
    success: false,
    message: "No repositories found",
  };
});