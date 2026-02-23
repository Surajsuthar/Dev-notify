"use server";

import { cache as reactCache } from "react";
import { auth } from "@/auth";
import { GitHubService } from "@/lib/github";
import { db } from "@/lib/prisma";
import type { GetReposResponse, IssueDataTableType, Repo } from "@/types";
import { getUser } from "../user/user";

export const getGithubService = reactCache(async () => {
	try {
		const session = await auth();
		if (!session?.user) return null;
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
				return { success: false, message: "User not found" };
			}

			const githubClient = await getGithubService();
			if (!githubClient) {
				return { success: false, message: "Github client not found" };
			}

			const starredRepos = await githubClient.getStarredRepos();
			const userRepos: Repo[] = starredRepos.map((repo) => ({
				github_id: String(repo.id),
				node_id: repo.node_id,
				name: repo.name,
				owner: repo.owner.login,
				description: repo.description ?? null,
				full_name: repo.full_name,
				github_url: repo.html_url,
				topics: repo.topics ?? [],
				language: repo.language ?? "",
				homepage_url: repo.homepage ?? null,
				stars: repo.stargazers_count,
				issues: repo.open_issues_count,
			}));

			return { success: true, data: userRepos };
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
			return { success: false, message: "User not found" };
		}

		const user = await getUser(session.user.githubId);
		if (!user) return null;

		const githubClient = await getGithubService();
		if (!githubClient) {
			return { success: false, message: "Github client not found" };
		}

		const userRepo = await getReposFromGithub();
		if (!userRepo.success || !("data" in userRepo)) {
			return { success: false, message: "Repo not found" };
		}

		const uniqueRepos = Array.from(
			new Map(userRepo.data.map((r: Repo) => [r.node_id, r])).values(),
		);

		// Step 1: Upsert all repos in a single transaction
		await db.$transaction(
			uniqueRepos.map((repo) =>
				db.repo.upsert({
					where: { node_id: repo.node_id },
					update: {
						name: repo.name,
						owner: repo.owner,
						description: repo.description,
						full_name: repo.full_name,
						github_url: repo.github_url,
						stars: String(repo.stars),
						issues: String(repo.issues),
						language: repo.language,
						topics: repo.topics ?? [],
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
						topics: repo.topics ?? [],
						homepage_url: repo.homepage_url,
					},
					select: { id: true },
				}),
			),
			{ isolationLevel: "ReadCommitted" },
		);

		// Step 2: Fetch all inserted/updated repo IDs by node_id
		const dbRepos = await db.repo.findMany({
			where: { node_id: { in: uniqueRepos.map((r) => r.node_id) } },
			select: { id: true, node_id: true },
		});

		// Step 3: Bulk upsert userRepo join table
		await db.userRepo.createMany({
			data: dbRepos.map((dbRepo) => ({
				userId: user.id,
				repoId: dbRepo.id,
			})),
			skipDuplicates: true,
		});

		// Step 4: Delete userRepo entries that are no longer starred
		const allUserRepos = await db.userRepo.findMany({
			where: { userId: user.id },
			select: { repo: { select: { id: true, node_id: true } } },
		});

		const newRepoNodeIds = new Set(uniqueRepos.map((r) => r.node_id));
		const repoIdsToDelete = allUserRepos
			.filter((ur) => !newRepoNodeIds.has(ur.repo.node_id))
			.map((ur) => ur.repo.id);

		if (repoIdsToDelete.length > 0) {
			await db.userRepo.deleteMany({
				where: { userId: user.id, repoId: { in: repoIdsToDelete } },
			});
		}

		return { success: true, data: uniqueRepos };
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
		return { success: false, message: "User not found" };
	}

	const user = await getUser(session.user.githubId);
	if (!user) return null;

	const userRepos = await db.userRepo.findMany({
		where: { userId: user.id },
		include: { repo: true },
	});

	return {
		success: true,
		data: userRepos.map((ur) => ur.repo),
	};
});

export const getAllIssuesFromGithub = reactCache(async () => {
	const session = await auth();
	if (!session?.user) {
		return { success: false, message: "User not found" };
	}

	const githubClient = await getGithubService();
	if (!githubClient) {
		return { success: false, message: "Github client not found" };
	}

	const userRepo = await getReposFromGithub();
	if (
		!userRepo.success ||
		!("data" in userRepo) ||
		userRepo.data.length === 0
	) {
		return { success: false, message: "No repositories found" };
	}

	// Fetch issues in batches of 10 to avoid rate limiting
	const BATCH_SIZE = 10;
	const issues: IssueDataTableType[] = [];

	for (let i = 0; i < userRepo.data.length; i += BATCH_SIZE) {
		const batch = userRepo.data.slice(i, i + BATCH_SIZE);
		const batchResults = await Promise.all(
			batch.map((repo) => githubClient.getIssues(repo.owner, repo.name)),
		);

		for (let j = 0; j < batch.length; j++) {
			const repo = batch[j];
			const issuesData = batchResults[j];
			for (const issue of issuesData) {
				if (issue.pull_request) continue;
				issues.push({
					issueNumber: issue.number,
					owner: repo.owner,
					title: issue.title,
					issue_url: issue.html_url,
					createdAt: issue.created_at,
					labels: issue.labels.map((label) =>
						typeof label === "string" ? label : (label.name ?? ""),
					),
					state: issue.state as "open" | "closed",
					comments: issue.comments,
					reactions: issue.reactions?.total_count ?? 0,
					assigned: (issue.assignees?.length ?? 0) > 0,
					language: repo.language || "No Language",
				});
			}
		}
	}

	issues.sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);

	return { success: true, data: issues };
});

export const getUserRecommandedRepo = async () => {
	try {
		const session = await auth();
		if (!session?.user) {
			return { success: false, message: "User not found" };
		}

		const user = await getUser(session.user.githubId);

		const githubClient = await getGithubService();
		if (!githubClient) {
			return { success: false, message: "Github client not found" };
		}

		const allRepos = await db.userRepo.findMany({
			where: { userId: { not: user?.id } },
			select: { repo: true },
		});

		return {
			success: true,
			data: allRepos.map((r) => r.repo),
		};
	} catch (error) {
		return { success: false, message: "Error fetching repositories" };
	}
};

export const searchGithubRepos = reactCache(async (searchQuery: string) => {
	try {
		const session = await auth();
		if (!session?.user) {
			return { success: false, message: "User not found" };
		}

		const githubClient = await getGithubService();
		if (!githubClient) {
			return { success: false, message: "Github client not found" };
		}

		const searchResults = await githubClient.searchRepoByLang(searchQuery);
		if (!searchResults?.items) {
			return { success: false, message: "No search results found" };
		}

		const repos: Repo[] = searchResults.items.map((repo) => ({
			github_id: String(repo.id),
			node_id: repo.node_id,
			name: repo.name,
			owner: repo.owner?.login ?? "",
			description: repo.description ?? null,
			full_name: repo.full_name,
			github_url: repo.html_url,
			topics: repo.topics ?? [],
			language: repo.language ?? "",
			homepage_url: repo.homepage ?? null,
			stars: repo.stargazers_count ?? 0,
			issues: repo.open_issues_count ?? 0,
		}));

		return { success: true, data: repos };
	} catch (error) {
		return {
			success: false,
			message: "Error searching repositories",
			error: error instanceof Error ? error.message : String(error),
		};
	}
});