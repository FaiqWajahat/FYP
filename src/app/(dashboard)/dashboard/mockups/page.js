"use client";
import React from 'react';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import MockupsList from '@/Components/user-dashboard/mockups/MockupsList';

export default function MockupsPage() {
  return (
    <div className="space-y-8 font-sans pb-10">
      <DashboardPageHeader 
        heading="Design Mockups" 
        breadData={[{ name: "Dashboard", href: "/dashboard" }, { name: "Mockups", href: "/dashboard/mockups" }]} 
      />
      
      <MockupsList />
    </div>
  );
}
