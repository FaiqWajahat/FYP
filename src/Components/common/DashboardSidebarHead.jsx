'use client'
import { PanelLeftClose } from 'lucide-react';
import React from 'react'
import Link from 'next/link';
import { useConfigStore } from '@/store/useConfigStore';

const DashboardSidebarHead = ({ sidebarOpen, setSidebarOpen }) => {
  const { projectName } = useConfigStore();

  return (
    <div className="flex w-full items-center justify-between gap-2  ">
      {/* Brand / Logo */}
      <Link href="/" className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity cursor-pointer">
        {/* Logo mark */}
        <div className="w-8 h-8 rounded-xl bg-[var(--primary)] flex items-center justify-center shrink-0 shadow-md shadow-[var(--primary)]/25">
          <span className="text-white text-sm font-black leading-none">
            {projectName?.charAt(0) ?? 'A'}
          </span>
        </div>

        <div className="min-w-0">
          <h1 className="text-[15px] font-extrabold text-base-content leading-tight truncate">
            {projectName}
          </h1>
          <p className="text-[10px] text-base-content/45 font-medium tracking-wide leading-none mt-0.5">
            Dashboard
          </p>
        </div>
      </Link>

      {/* Collapse toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-1.5 rounded-lg hover:bg-base-200 transition-colors duration-150 text-base-content/50 hover:text-base-content shrink-0"
        title="Collapse sidebar"
      >
        <PanelLeftClose className="w-4 h-4" strokeWidth={1.8} />
      </button>
    </div>
  )
}

export default DashboardSidebarHead