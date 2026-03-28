import React from 'react';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader 
        heading="General Settings" 
        breadData={[{ name: "Dashboard", href: "/dashboard" }, { name: "Settings", href: "/dashboard/settings" }]} 
      />
      
      <div className="card bg-base-100 shadow-xl border border-base-300 p-6">
        <p>This is where your general settings will be.</p>
      </div>
    </div>
  );
}
