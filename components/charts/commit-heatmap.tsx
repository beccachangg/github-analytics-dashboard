'use client';

import { CommitActivity } from '@/types/github';
import { format, fromUnixTime } from 'date-fns';

interface CommitHeatmapProps {
  data: CommitActivity[];
}

export function CommitHeatmap({ data }: CommitHeatmapProps) {
  // Add validation and handle empty/invalid data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="text-gray-500">No commit activity data available</div>;
  }

  // Get max commits for color scaling
  const allCommits = data.flatMap(week => week.days || []);
  const maxCommits = Math.max(...allCommits, 1); // Ensure at least 1 to avoid division by zero
  
  // Color intensity based on commit count
  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    const intensity = Math.ceil((count / maxCommits) * 4);
    const colors = [
      'bg-green-200 dark:bg-green-900',
      'bg-green-300 dark:bg-green-700',
      'bg-green-400 dark:bg-green-600',
      'bg-green-500 dark:bg-green-500',
    ];
    return colors[Math.min(intensity - 1, 3)];
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Take last 52 weeks of data
  const recentData = data.slice(-52);

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 justify-between py-2">
            {days.map((day, i) => (
              <div key={day} className="h-3 text-xs text-gray-500 flex items-center">
                {i % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-1">
            {recentData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {(week.days || []).map((count, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm ${getColor(count)} transition-colors hover:ring-2 hover:ring-blue-500`}
                    title={`${count} commits on ${week.week ? format(fromUnixTime(week.week), 'MMM d, yyyy') : 'Unknown date'}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
            <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
            <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-700" />
            <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-600" />
            <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-500" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}