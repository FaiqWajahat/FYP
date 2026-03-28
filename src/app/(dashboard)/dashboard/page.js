import React from 'react';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import UserDashboardTopStats from '@/Components/user-dashboard/dashboard/UserDashboardTopStats';
import UserSpendChart from '@/Components/user-dashboard/dashboard/UserSpendChart';
import UserPendingActions from '@/Components/user-dashboard/dashboard/UserPendingActions';
import UserRecentActivity from '@/Components/user-dashboard/dashboard/UserRecentActivity';

export default function DashboardPage() {
  return (
    <div className="space-y-8 font-sans pb-12">
      <DashboardPageHeader 
        heading="User Dashboard" 
        breadData={[{ name: "Dashboard", href: "/dashboard" }]} 
      />
      
      {/* Top Level Stats Summary */}
      <section>
         <UserDashboardTopStats />
      </section>

      {/* Analytics & Alerts Row */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         <div className="lg:col-span-8 flex flex-col h-full min-h-[350px]">
            <UserSpendChart />
         </div>
         <div className="lg:col-span-4 flex flex-col h-full min-h-[350px]">
            <UserPendingActions />
         </div>
      </section>

      {/* Active Work */}
      <section className="gap-6">
       
            <UserRecentActivity />
      
        
      </section>
    </div>
  );
}
