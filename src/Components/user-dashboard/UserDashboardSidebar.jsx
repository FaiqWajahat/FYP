'use client';

import React from 'react'
import UserDashboardMenu from './UserDashboardMenu';
import DashboardSidebarHead from '@/Components/common/DashboardSidebarHead';
import DashboardSidebarBottom from '@/Components/common/DashboardSidebarBottom';

const UserDashboardSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div className='w-full h-screen max-h-screen bg-base-100  flex flex-col justify-between pt-4 pb-2 '>
      <div className='px-4 flex-none border-b border-base-300 pb-4'>
        <DashboardSidebarHead sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>
      <div className='flex-1 w-full p-2 mt-4 overflow-y-auto overflow-x-hidden'>
        <UserDashboardMenu />
      </div>

      <div className='flex-none px-2 pt-2 border-t border-base-300'>
        <DashboardSidebarBottom role="User" />
      </div>
    </div>
  )
}

export default UserDashboardSidebar
