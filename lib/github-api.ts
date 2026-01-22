// github api client and data fetching utilities

import { Repository, Contributor, CommitActivity, LanguageStats, IssueOrPR } from '@/types/github';

const GITHUB_API_BASE = 'https://api.github.com';

// helper function to make github api requests
async function fetchGitHub(endpoint: string) {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };

  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers,
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// fetch repository details
export async function getRepository(owner: string, repo: string): Promise<Repository> {
  return fetchGitHub(`/repos/${owner}/${repo}`);
}

// fetch repository contributors
export async function getContributors(owner: string, repo: string): Promise<Contributor[]> {
  return fetchGitHub(`/repos/${owner}/${repo}/contributors?per_page=10`);
}

// fetch commit activity (52 weeks of data)
export async function getCommitActivity(owner: string, repo: string): Promise<CommitActivity[]> {
  return fetchGitHub(`/repos/${owner}/${repo}/stats/commit_activity`);
}

// fetch language statistics
export async function getLanguages(owner: string, repo: string): Promise<LanguageStats> {
  return fetchGitHub(`/repos/${owner}/${repo}/languages`);
}

// fetch recent issues
export async function getIssues(owner: string, repo: string): Promise<IssueOrPR[]> {
  return fetchGitHub(`/repos/${owner}/${repo}/issues?state=all&per_page=100&sort=created&direction=desc`);
}

// fetch recent pull requests
export async function getPullRequests(owner: string, repo: string): Promise<IssueOrPR[]> {
  return fetchGitHub(`/repos/${owner}/${repo}/pulls?state=all&per_page=100&sort=created&direction=desc`);
}

// fetch trending repositories
export async function getTrendingRepos(language?: string): Promise<Repository[]> {
  const today = new Date();
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const dateStr = lastWeek.toISOString().split('T')[0];
  
  let query = `created:>${dateStr}`;
  if (language) {
    query += `+language:${language}`;
  }
  
  const data = await fetchGitHub(`/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=10`);
  return data.items;
}