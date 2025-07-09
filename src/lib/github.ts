import { Octokit } from "@octokit/rest"

export class GitHubService {
  private octokit: Octokit

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken
    })
  }

  async getStarredRepos() {
    const { data } = await this.octokit.activity.listReposStarredByAuthenticatedUser({})
    return data
  }

  async getIssues(owner: string, repo: string, since?: string) {
    const { data } = await this.octokit.issues.listForRepo({
      owner,
      repo,
      state: 'open',
      since: since || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    })
    return data
  }

  async createComment(owner: string, repo: string, issueNumber: number, body: string) {
    const { data } = await this.octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body
    })
    return data
  }
}
