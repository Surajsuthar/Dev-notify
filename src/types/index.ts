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

export type GetReposResponse =
  | {
      success: boolean;
      data: Repo[];
    }
  | {
      success: boolean;
      message: string;
      error: string;
    }
  | {
      success: boolean;
      message: string;
    };

export type Issue = {
  id: number;
  title: string;
  issueNumber?: number;
  state: "open" | "closed";
  labels?: string[];
  issue_url: string;
  assigned?: boolean;
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

export type repoRecommandation = 
  | {
    success: boolean,
    data: {
      id: number,
      title: string,
      description: string,
      author: string,
      stars: string,
      language: string,
      labels: string[],
    }[]
  | {
    success: boolean,
    message: string
  }
  }