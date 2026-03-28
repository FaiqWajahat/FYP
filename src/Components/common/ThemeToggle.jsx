'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useConfigStore } from '@/store/useConfigStore';

const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useConfigStore();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2.5 rounded-xl bg-base-200 hover:bg-base-300 transition-colors duration-200 text-base-content"
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700" />
      )}
    </button>
  );
};

export default ThemeToggle;
