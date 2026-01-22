'use client';

// pie chart showing breakdown of programming languages in the repository

import { LanguageStats } from '@/types/github';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface LanguageChartProps {
  data: LanguageStats;
}

// colors for different languages 
const LANGUAGE_COLORS: { [key: string]: string } = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3776ab',
  Java: '#007396',
  'C++': '#00599c',
  C: '#555555',
  'C#': '#239120',
  Ruby: '#cc342d',
  Go: '#00add8',
  Rust: '#000000',
  PHP: '#777bb4',
  Swift: '#ffac45',
  Kotlin: '#7f52ff',
  HTML: '#e34c26',
  CSS: '#1572b6',
  Shell: '#89e051',
  Default: '#8884d8',
};

export function LanguageChart({ data }: LanguageChartProps) {
  if (!data || Object.keys(data).length === 0) {
    return <div className="text-gray-500">No language data available</div>;
  }

  // convert language stats to chart data
  const total = Object.values(data).reduce((sum, bytes) => sum + bytes, 0);
  const chartData = Object.entries(data)
    .map(([name, bytes]) => ({
      name,
      value: bytes,
      percentage: ((bytes / total) * 100).toFixed(1),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Show top 8 languages

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percentage }) => `${name} ${percentage}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={LANGUAGE_COLORS[entry.name] || LANGUAGE_COLORS.Default}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [
            `${((value / total) * 100).toFixed(1)}%`,
            'Percentage',
          ]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}