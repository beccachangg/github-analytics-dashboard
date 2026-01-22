// api route for fetching github repository analytics

import { NextRequest, NextResponse } from 'next/server';
import {
  getRepository,
  getContributors,
  getCommitActivity,
  getLanguages,
  getIssues,
  getPullRequests,
} from '@/lib/github-api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');

  // validate parameters
  if (!owner || !repo) {
    return NextResponse.json(
      { error: 'Owner and repo parameters are required' },
      { status: 400 }
    );
  }

  try {
    // fetch all data in parallel for better performance
    const [repository, contributors, commitActivity, languages, recentIssues, recentPRs] =
      await Promise.all([
        getRepository(owner, repo),
        getContributors(owner, repo),
        getCommitActivity(owner, repo),
        getLanguages(owner, repo),
        getIssues(owner, repo),
        getPullRequests(owner, repo),
        ]);
        // return combined analytics data
      return NextResponse.json({
        repository,
        contributors,
        commitActivity,
        languages,
        recentIssues,
        recentPRs,
        });
        } catch (error) {
            console.error('GitHub API Error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch repository data. Please check the repository name and try again.' },
                { status: 500 }
            );
        }
    }