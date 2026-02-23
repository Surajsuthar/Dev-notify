import { Octokit } from "@octokit/rest";
import type { Endpoints } from "@octokit/types";

type StarredRepo = Endpoints["GET /user/starred"]["response"]["data"][number];
type UserRepo = Endpoints["GET /user/repos"]["response"]["data"][number];
type Issue =
	Endpoints["GET /repos/{owner}/{repo}/issues"]["response"]["data"][number];
type SearchReposResult =
	Endpoints["GET /search/repositories"]["response"]["data"];

export class GitHubService {
	private octokit: Octokit;

	constructor(accessToken: string) {
		this.octokit = new Octokit({
			auth: accessToken,
		});
	}

	async getStarredRepos(): Promise<StarredRepo[]> {
		try {
			let allRepos: StarredRepo[] = [];
			let page = 1;
			let fetched: number;
			do {
				const { data } =
					await this.octokit.activity.listReposStarredByAuthenticatedUser({
						per_page: 100,
						page,
					});
				fetched = data.length;
				allRepos = allRepos.concat(data as StarredRepo[]);
				page++;
			} while (fetched === 100);
			return allRepos;
		} catch (error) {
			console.error("Error fetching starred repos:", error);
			return [];
		}
	}

	async getIssues(
		owner: string,
		repo: string,
		since?: string,
	): Promise<Issue[]> {
		try {
			const { data } = await this.octokit.issues.listForRepo({
				owner,
				repo,
				state: "open",
				since:
					since || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
			});
			return data.filter((issue) => !issue.pull_request) as Issue[];
		} catch (error) {
			console.error(`Error fetching issues for ${owner}/${repo}:`, error);
			return [];
		}
	}

	async getUserForks(): Promise<UserRepo[]> {
		try {
			let allRepos: UserRepo[] = [];
			let page = 1;
			let fetched: number;
			do {
				const { data } = await this.octokit.repos.listForAuthenticatedUser({
					per_page: 100,
					page,
				});
				fetched = data.length;
				allRepos = allRepos.concat(data as UserRepo[]);
				page++;
			} while (fetched === 100);
			return allRepos.filter((repo) => repo.fork);
		} catch (error) {
			console.error("Error fetching user forks:", error);
			return [];
		}
	}

	async getRateLimit() {
		try {
			const { data } = await this.octokit.rateLimit.get();
			return data;
		} catch (error) {
			console.error("Error fetching rate limit:", error);
			return null;
		}
	}

	async searchRepoByLang(
		query: string,
		language?: string,
	): Promise<SearchReposResult | null> {
		try {
			let q = query;
			if (language) {
				q += ` language:${language}`;
			}
			const { data } = await this.octokit.search.repos({
				q,
				sort: "stars",
				order: "desc",
			});
			return data;
		} catch (error) {
			console.error("Error searching repos by language:", error);
			return null;
		}
	}

	async searchRepoByTopics(topic: string): Promise<SearchReposResult | null> {
		try {
			const { data } = await this.octokit.search.repos({
				q: `topic:${topic}`,
				sort: "stars",
				order: "desc",
			});
			return data;
		} catch (error) {
			console.error("Error searching repos by topic:", error);
			return null;
		}
	}
}