"use server";

import { GitHubService } from "@/lib/github";
import { auth } from "../../auth";

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

    const userRepos = starredRepos.map((repo) => {
      return {
        github_id: repo.id,
        node_id: repo.node_id,
        name: repo.name,
        owner: repo.owner.login,
        description: repo.description,
        full_name: repo.full_name,
        html_url: repo.html_url,
        topics: repo.topics,
        language: repo.language,
        avatar_url: repo.owner.avatar_url,
        homepage_url: repo.homepage,
        stars: repo.stargazers_count,
        issues: repo.open_issues_count,
        open_issues_count: repo.open_issues_count,
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
