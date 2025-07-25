export type Repo = {
  github_id: string;
  node_id: string;
  name: string;
  owner: string;
  description: string;
  full_name: string;
  github_url: string;
  homepage_url: string;
  stars: number;
  language: string;
  topics: string[];
  issues: number;
};

export type Issue = {
  id: number;
  title: string;
  issueNumber?: number;
  state: "open" | "closed";
  labels?: string[];
  issue_url: string;
  assignees?: boolean;
  comments?: number;
  reactions?: number;
  createdAt: string;
  created_by?: string;
};

export type IsuueDataTabel = Issue & {
  language?: string;
  owner: string;
};

export type RepoDataTableType = Omit<
  Repo,
  "node_id" | "github_id" | "owner" | "full_name"
>;

export type IssueDataTableType = Omit<IsuueDataTabel, "id" | "created_by">;
