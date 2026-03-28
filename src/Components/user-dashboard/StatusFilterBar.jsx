"use client";
import React from 'react';
import { Filter } from 'lucide-react';

/**
 * Shared StatusFilterBar component for the user dashboard.
 *
 * Props:
 *   tabs       - array of { key: string, label: string, count: number }
 *   activeTab  - currently active tab key (string)
 *   onChange   - (key: string) => void  callback when a tab is clicked
 *   label      - optional prefix label, defaults to "Filter Status:"
 */
export default function StatusFilterBar({ tabs, activeTab, onChange, label = 'Filter Status:' }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 p-4 rounded-xl shadow-sm border border-base-200">
      <div className="flex items-center gap-2 shrink-0">
        <Filter size={16} className="text-base-content/50" />
        <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">{label}</span>
      </div>
      <div className="flex bg-base-200/50 p-1 rounded-lg w-full sm:w-auto gap-0.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-base-100 shadow-sm text-[var(--primary)]'
                  : 'text-base-content/55 hover:text-base-content hover:bg-base-100/50'
              }`}
            >
              {tab.label}
              <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-extrabold transition-colors ${
                isActive
                  ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                  : 'bg-base-300/50 text-base-content/50'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
