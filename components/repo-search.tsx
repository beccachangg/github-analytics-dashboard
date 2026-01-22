'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

interface RepoSearchProps {
  onSearch: (owner: string, repo: string) => void;
  isLoading: boolean;
}

export function RepoSearch({ onSearch, isLoading }: RepoSearchProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const match = input.match(/github\.com\/([^\/]+)\/([^\/\s]+)|^([^\/]+)\/([^\/\s]+)$/);
    
    if (match) {
      const owner = match[1] || match[3];
      const repo = match[2] || match[4];
      onSearch(owner, repo);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter GitHub repo (e.g., facebook/react or full URL)"
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>
    </form>
  );
}