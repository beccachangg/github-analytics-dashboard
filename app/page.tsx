'use client';

import { useState } from 'react';
import { RepoSearch } from '@/components/repo-search';
import { ThemeToggle } from '@/components/theme-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CommitHeatmap } from '@/components/charts/commit-heatmap';
import { LanguageChart } from '@/components/charts/language-chart';
import { ContributorList } from '@/components/charts/contributor-list';
import { ActivityChart } from '@/components/charts/activity-chart';
import { RepoAnalytics } from '@/types/github';
import { formatNumber, formatDate } from '@/lib/utils';
import { GitFork, Star, AlertCircle, GitPullRequest, Calendar } from 'lucide-react';

export default function Home() {
  const [analytics, setAnalytics] = useState<RepoAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (owner: string, repo: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/github/analytics?owner=${owner}&repo=${repo}`);
      if (!response.ok) {
        throw new Error('Failed to fetch repository data');
      }
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAnalytics(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">GitHub Analytics Dashboard</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Visualize repository metrics and trends</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <RepoSearch onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-shimmer h-32 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Card className="border-red-200 dark:border-red-900">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {analytics && !isLoading && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl text-gray-900 dark:text-gray-100">{analytics.repository.full_name}</CardTitle>
                    <CardDescription className="mt-2 text-gray-600 dark:text-gray-400">{analytics.repository.description || 'No description available'}</CardDescription>
                  </div>
                  <a href={analytics.repository.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">View on GitHub</a>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatNumber(analytics.repository.stargazers_count)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Stars</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <GitFork className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatNumber(analytics.repository.forks_count)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Forks</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatNumber(analytics.repository.open_issues_count)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Issues</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatDate(analytics.repository.created_at)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Created</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Commit Activity (Last 52 Weeks)</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Contribution frequency over the past year</CardDescription>
                </CardHeader>
                <CardContent>
                  <CommitHeatmap data={analytics.commitActivity} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Language Distribution</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Codebase composition by language</CardDescription>
                </CardHeader>
                <CardContent>
                  <LanguageChart data={analytics.languages} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Top Contributors</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Most active contributors</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContributorList contributors={analytics.contributors} />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Issue & PR Velocity (Last 30 Days)</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Activity trends for issues and pull requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityChart issues={analytics.recentIssues} pullRequests={analytics.recentPRs} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {!analytics && !isLoading && !error && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                <GitPullRequest className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Search for a GitHub Repository</h3>
              <p className="text-gray-600 dark:text-gray-400">Enter a repository URL or owner/repo name to view detailed analytics</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}