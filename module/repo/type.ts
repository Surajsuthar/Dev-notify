export type Repo = {
  id: string;
  github_id: string;
  node_id: string;
  name: string;
  owner: string;
  description: string;
  full_name: string;
  html_url: string;
  topics: string[];
  language: string[];
  avatar_url: string;
  homepage_url: string;
  open_issues_count: number;
  is_forked: boolean;
};
