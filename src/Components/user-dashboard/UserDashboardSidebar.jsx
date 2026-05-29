'use client';

import React from 'react';
import UserDashboardMenu from './UserDashboardMenu';
import DashboardSidebarHead from '@/Components/common/DashboardSidebarHead';
import DashboardSidebarBottom from '@/Components/common/DashboardSidebarBottom';

const UserDashboardSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <aside
      className={`
        relative h-screen max-h-screen bg-base-100 flex flex-col 
        border-r border-base-200 transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'w-full' : 'w-0 opacity-0 overflow-hidden'}
      `}
    >
      {/* Header section */}
      <div className="flex-none px-4 py-4 border-b border-base-300">
        <DashboardSidebarHead sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Scrollable menu section */}
      <div className="flex-1 w-full px-3 py-4 overflow-y-auto no-scrollbar overflow-x-hidden">
        <div className="pb-4">
          <UserDashboardMenu />
        </div>
      </div>

      {/* Bottom user card section */}
      <div className="flex-none p-3 border-t border-base-200/50">
        <DashboardSidebarBottom role="User" />
      </div>
    </aside>
  );
};

export default UserDashboardSidebar;
