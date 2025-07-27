import { Octokit } from "@octokit/rest";

export class GitHubService {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken,
    });
  }

  async getStarredRepos() {
    let allRepos: any[] = [];
    let page = 1;
    let fetched;
    do {
      const { data } =
        await this.octokit.activity.listReposStarredByAuthenticatedUser({
          per_page: 100,
          page,
        });
      fetched = data.length;
      allRepos = allRepos.concat(data);
      page++;
    } while (fetched === 100);
    return allRepos;
  }

  async getIssues(owner: string, repo: string, since?: string) {
    const { data } = await this.octokit.issues.listForRepo({
      owner,
      repo,
      state: "open",
      since: since || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    });
    return data;
  }

  async createComment(
    owner: string,
    repo: string,
    issueNumber: number,
    body: string,
  ) {
    const { data } = await this.octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body,
    });
    return data;
  }

  async listUserRepos() {
    const { data } = await this.octokit.repos.listForAuthenticatedUser();
    return data;
  }

  async createWebhook(
    owner: string,
    repo: string,
    webhookUrl: string,
    secret: string,
  ) {
    const { data } = await this.octokit.repos.createWebhook({
      owner,
      repo,
      config: {
        url: webhookUrl,
        content_type: "json",
        secret: secret,
      },
      events: ["issues"],
      active: true,
    });
    return data;
  }

  async forkRepo(owner: string, repo: string, organization?: string) {
    const { data } = await this.octokit.repos.createFork({
      owner,
      repo,
      organization,
    });
    return data;
  }

  async checkIfForked(owner: string, repo: string) {
    try {
      const { data } = await this.octokit.repos.get({
        owner,
        repo,
      });
      return data.fork;
    } catch (error) {
      console.log("error",error)
      return false;
    }
  }

  async getUserForks() {
    const { data } = await this.octokit.repos.listForAuthenticatedUser({
      per_page: 100,
    });
    // Filter to only return forks
    return data.filter((repo) => repo.fork);
  }

  async createWebhookOnFork(
    forkOwner: string,
    forkRepo: string,
    webhookUrl: string,
    secret: string,
  ) {
    // Create webhook on the forked repo (you have admin access)
    const { data } = await this.octokit.repos.createWebhook({
      owner: forkOwner,
      repo: forkRepo,
      config: {
        url: webhookUrl,
        content_type: "json",
        secret: secret,
      },
      events: ["issues"],
      active: true,
    });
    return data;
  }

  async setupWebhookForRepo(
    originalOwner: string,
    originalRepo: string,
    webhookUrl: string,
    secret: string,
  ) {
    try {
      // Check if we already have a fork of this repo
      const userRepos = await this.listUserRepos();
      const existingFork = userRepos.find(
        (repo) => repo.fork && repo.name.includes(originalRepo),
      );

      let forkOwner: string;
      let forkRepo: string;

      if (existingFork) {
        // Use existing fork
        forkOwner = existingFork.owner.login;
        forkRepo = existingFork.name;
        console.log(`Using existing fork: ${forkOwner}/${forkRepo}`);
      } else {
        // Create new fork
        const forkData = await this.forkRepo(originalOwner, originalRepo);
        forkOwner = forkData.owner.login;
        forkRepo = forkData.name;
        console.log(`Created new fork: ${forkOwner}/${forkRepo}`);
      }

      // Create webhook on the fork
      const webhook = await this.createWebhookOnFork(
        forkOwner,
        forkRepo,
        webhookUrl,
        secret,
      );
      console.log(`Webhook created for ${forkOwner}/${forkRepo}`);

      return {
        originalRepo: `${originalOwner}/${originalRepo}`,
        forkRepo: `${forkOwner}/${forkRepo}`,
        webhook,
      };
    } catch (error) {
      console.error(
        `Failed to setup webhook for ${originalOwner}/${originalRepo}:`,
        error,
      );
      throw error;
    }
  }

  async setupWebhooksForStarredRepos(webhookUrl: string, secret: string) {
    try {
      const starredRepos = await this.getStarredRepos();
      const results = [];

      for (const repo of starredRepos) {
        try {
          const result = await this.setupWebhookForRepo(
            repo.owner.login,
            repo.name,
            webhookUrl,
            secret,
          );
          results.push(result);
        } catch (error) {
          console.error(
            `Failed to setup webhook for ${repo.owner.login}/${repo.name}:`,
            error,
          );
          results.push({
            originalRepo: `${repo.owner.login}/${repo.name}`,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      return results;
    } catch (error) {
      console.error("Failed to setup webhooks for starred repos:", error);
      throw error;
    }
  }

  async getRateLimit() {
    const { data } = await this.octokit.rateLimit.get();
    return data;
  }
}
