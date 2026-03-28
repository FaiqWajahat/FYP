'use client';
import { Package, ClipboardCheck, DollarSignIcon, MessageSquare } from 'lucide-react';
import React from 'react';
import CountUp from 'react-countup';

const UserDashboardTopStats = () => {
  return (
    <div className="stats bg-base-100 w-full stats-vertical md:stats-horizontal overflow-hidden shadow-sm border border-base-200">
      
      <div className="stat">
        <div className="stat-figure bg-primary/10 rounded-md p-2 border border-primary/20">
          <Package className='w-8 h-8 text-primary'/>
        </div>
        <div className="pb-1 text-base-content/70 font-semibold tracking-wide uppercase text-xs">Active Orders</div>
        <div className="stat-value text-base-content">
          <CountUp start={0} end={4} duration={2.75} />
        </div>
        <div className="stat-desc mt-1">2 in production</div>
      </div>

      <div className="stat">
        <div className="stat-figure bg-warning/10 rounded-md p-2 border border-warning/20">
          <ClipboardCheck className='w-8 h-8 text-warning'/>
        </div>
        <div className="pb-1 text-base-content/70 font-semibold tracking-wide uppercase text-xs">Pending Approvals</div>
        <div className="stat-value text-base-content">
          <CountUp start={0} end={3} duration={2.75} />
        </div>
        <div className="stat-desc mt-1 font-medium text-warning">Requires your action</div>
      </div>
       
      <div className="stat">
        <div className="stat-figure bg-success/10 rounded-md p-2 border border-success/20">
          <DollarSignIcon className='w-8 h-8 text-success'/>
        </div>
        <div className="pb-1 text-base-content/70 font-semibold tracking-wide uppercase text-xs">Total Spend</div>
        <div className="stat-value text-base-content flex items-baseline">
          $
          <CountUp start={0} end={14.2} decimals={1} duration={2.75} suffix='k' />
        </div>
        <div className="stat-desc mt-1 text-success">Lifetime combined value</div>
      </div>

      <div className="stat">
        <div className="stat-figure bg-secondary/10 rounded-md p-2 border border-secondary/20">
          <MessageSquare className='w-8 h-8 text-secondary'/>
        </div>
        <div className="pb-1 text-base-content/70 font-semibold tracking-wide uppercase text-xs">New Messages</div>
        <div className="stat-value text-base-content">
          <CountUp start={0} end={1} duration={2.75} />
        </div>
        <div className="stat-desc mt-1">From your dedicated rep</div>
      </div>

    </div>
  );
}

export default UserDashboardTopStats;
