// utility functions for formatting and data manipulation

// merge tailwind classes properly
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}

// format large numbers (1000 -> 1K, 1000000 -> 1M)
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// format date to readable string
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// calculate percentage
export function calculatePercentage(value: number, total: number): number {
  return total === 0 ? 0 : Math.round((value / total) * 100);
}

// group data by date for time series charts
export function groupByDate(items: { created_at: string }[], days: number = 30) {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  // initialize counts for each day
  const counts: { [date: string]: number } = {};
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    counts[dateStr] = 0;
  }
  
  // count items per day
  items.forEach(item => {
    const dateStr = item.created_at.split('T')[0];
    if (counts[dateStr] !== undefined) {
      counts[dateStr]++;
    }
  });
  
  return Object.entries(counts).map(([date, count]) => ({
    date,
    count,
  }));
}