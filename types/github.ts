// type definitions for github api responses and app data structures

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  created_at: string;
  updated_at: string;
  html_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface Contributor {
  login: string;
  contributions: number;
  avatar_url: string;
  html_url: string;
}

export interface CommitActivity {
  week: number; // unix timestamp
  total: number;
  days: number[]; // array of 7 numbers (Sun-Sat)
}

export interface LanguageStats {
  [language: string]: number; // language name -> bytes of code
}

export interface IssueOrPR {
  created_at: string;
  state: 'open' | 'closed';
  title: string;
}

export interface RepoAnalytics {
  repository: Repository;
  contributors: Contributor[];
  commitActivity: CommitActivity[];
  languages: LanguageStats;
  recentIssues: IssueOrPR[];
  recentPRs: IssueOrPR[];
}