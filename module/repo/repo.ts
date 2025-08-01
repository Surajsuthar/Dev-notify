"use server";

import { GitHubService } from "@/lib/github";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { GetReposResponse, IssueDataTableType, Repo } from "@/types";
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
});

export const getReposFromGithub = reactCache(
  async (): Promise<GetReposResponse> => {
    try {
      const session = await auth();
      if (!session?.user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      const githubClient = await getGithubService();
      if (!githubClient) {
        return {
          success: false,
          message: "Github client not found",
        };
      }

      const starredRepos = await githubClient.getStarredRepos();
      const userRepos: Repo[] = starredRepos.map((repo) => ({
        github_id: String(repo.id),
        node_id: repo.node_id,
        name: repo.name,
        owner: repo.owner.login,
        description: repo.description,
        full_name: repo.full_name,
        github_url: repo.html_url,
        topics: repo.topics,
        language: repo.language || "",
        homepage_url: repo.homepage,
        stars: repo.stargazers_count,
        issues: repo.open_issues_count,
      }));

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
  },
);

export const getAllStarredReposFromGithub = reactCache(async () => {
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

    const userRepo = await getReposFromGithub();

    if (!userRepo.success || !("data" in userRepo)) {
      return {
        success: false,
        message: "Repo not found",
      };
    }

    const uniqueRepos = Array.from(
      new Map(userRepo.data.map((r: Repo) => [r.node_id, r])).values(),
    );

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
              github_url: repo.github_url,
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
              github_url: repo.github_url,
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
      }),
    );

    const allUserRepo = await db.userRepo.findMany({
      where: {
        userId: user?.id!,
      },
      select: {
        repo: {
          select: {
            id: true,
            node_id: true,
          },
        },
      },
    });

    const newRepoNodeIds = new Set(uniqueRepos.map((repo) => repo.node_id));
    const userRepoIdsToDelete = allUserRepo
      .filter((userRepo) => !newRepoNodeIds.has(userRepo.repo.node_id))
      .map((userRepo) => userRepo.repo.id);

    if (userRepoIdsToDelete.length > 0) {
      await db.userRepo.deleteMany({
        where: {
          userId: user?.id,
          repoId: {
            in: userRepoIdsToDelete,
          },
        },
      });
    }

    return {
      success: true,
      data: uniqueRepos,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching repositories",
      error: error instanceof Error ? error.message : String(error),
    };
  }
});

export const getStarredReposForUser = reactCache(async () => {
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
    include: {
      repo: true,
    },
  });

  return {
    success: true,
    data: userRepos.map((userRepo) => ({
      ...userRepo.repo,
      issues: userRepo.repo.issues,
    })),
  };
});

export const getAllIssuesFromGithub = reactCache(async () => {
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

  const allRepos = await db.userRepo.findMany({
    where: {
      userId: user?.id,
    },
    select: {
      repo: true,
    },
  });

  const userRepo = await getReposFromGithub();

  if (!userRepo.success || !("data" in userRepo)) {
    return {
      success: false,
      message: "Repo not found",
    };
  }

  if (userRepo.success && userRepo.data.length > 0) {
    const issues: IssueDataTableType[] = [];
    await Promise.all(
      userRepo.data.map(async (repo) => {
        const issuesData = await githubClient.getIssues(repo.owner, repo.name);
        if (issuesData.length > 0) {
          issuesData.forEach(async (issue) => {
            if (Object.keys(issue?.pull_request || {}).length > 0) {
              return;
            }
            issues.push({
              issueNumber: issue.number,
              owner: repo.owner,
              title: issue.title,
              issue_url: issue.html_url,
              createdAt: issue.created_at,
              labels:
                issue.labels.map((label) => {
                  if (typeof label === "string") {
                    return label;
                  }
                  return label.name || "";
                }) || [],
              state: issue.state as "open" | "closed",
              comments: issue.comments,
              reactions: issue.reactions?.total_count || 0,
              assigned: (issue.assignees?.length || 0) > 0,
              language: repo.language || "No Language",
            });
          });
        }
      }),
    );

    issues.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

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
