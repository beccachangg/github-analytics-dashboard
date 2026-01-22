'use client';

// line chart showing issue and pr velocity over time

import { IssueOrPR } from '@/types/github';
import { groupByDate } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface ActivityChartProps {
  issues: IssueOrPR[];
  pullRequests: IssueOrPR[];
  days?: number;
}

export function ActivityChart({ issues, pullRequests, days = 30 }: ActivityChartProps) {
  // group issues and prs by date
  const issueData = groupByDate(issues, days);
  const prData = groupByDate(pullRequests, days);

  // combine data for the chart
  const chartData = issueData.map((item, index) => ({
    date: format(new Date(item.date), 'MMM d'),
    issues: item.count,
    pullRequests: prData[index]?.count || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
        />
        <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="issues"
          stroke="#ef4444"
          strokeWidth={2}
          name="Issues Created"
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="pullRequests"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Pull Requests"
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}