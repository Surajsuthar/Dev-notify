export type Repo = {
  github_id: string;
  node_id: string;
  full_name: string;
  html_url: string;
  owner: string;
  name: string;
  description: string;
  language: string;
  topics: string[];
  issues: number;
  avatar_url: string;
  stars: number;
  is_forked: boolean;
  homepage_url: string;
};

export type Issue = {
  id: number;
  title: string;
  body: string;
};