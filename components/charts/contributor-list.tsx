'use client';

import { Contributor } from '@/types/github';
import { formatNumber } from '@/lib/utils';
import Image from 'next/image';

interface ContributorListProps {
  contributors: Contributor[];
}

export function ContributorList({ contributors }: ContributorListProps) {
  if (!contributors || contributors.length === 0) {
    return <div className="text-gray-500">No contributor data available</div>;
  }

  return (
    <div className="space-y-3">
      {contributors.map((contributor, index) => (
        <a
          key={contributor.login}
          href={contributor.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold text-blue-600 dark:text-blue-300">
            {index + 1}
          </div>

          <Image
            src={contributor.avatar_url}
            alt={contributor.login}
            width={40}
            height={40}
            className="rounded-full"
          />

          <div className="flex-1 min-w-0">
            <div className="font-medium truncate text-gray-900 dark:text-gray-100">{contributor.login}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {formatNumber(contributor.contributions)} contributions
            </div>
          </div>

          <div className="hidden sm:block w-24">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    (contributor.contributions / contributors[0].contributions) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}