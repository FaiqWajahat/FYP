'use client';
import { Package, ClipboardCheck, DollarSignIcon, Layers } from 'lucide-react';
import React from 'react';
import CountUp from 'react-countup';

const UserDashboardTopStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-base-100 rounded-2xl animate-pulse border border-base-200 shadow-sm" />
        ))}
      </div>
    );
  }

  const items = [
    {
      label: "Total Projects",
      value: stats?.totalOrders || 0,
      icon: Package,
      color: "text-primary",
      bg: "bg-primary/5",
      desc: "Order history count",
      isMoney: false
    },
    {
      label: "Ongoing Work",
      value: stats?.ongoingProjects || 0,
      icon: Layers,
      color: "text-amber-600",
      bg: "bg-amber-50",
      desc: "Currently in pipeline",
      isMoney: false
    },
    {
      label: "Total Investment",
      value: stats?.totalSpent || 0,
      icon: DollarSignIcon,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      desc: "Paid invoices sum",
      isMoney: true
    },
    {
      label: "Open Tasks",
      value: stats?.pendingActionsCount || 0,
      icon: ClipboardCheck,
      color: "text-rose-500",
      bg: "bg-rose-50",
      desc: "Requires your review",
      isMoney: false
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {items.map((stat, idx) => (
        <div key={idx} className="bg-base-100 rounded-2xl px-6 py-6 shadow-sm border border-base-200 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg} border border-black/5`}>
            <stat.icon size={26} className={stat.color} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-base-content/30 mb-1">{stat.label}</p>
            <div className="text-2xl font-black text-base-content tracking-tighter flex items-center gap-1">
              {stat.isMoney && <span className="text-lg opacity-40">$</span>}
              <CountUp
                start={0}
                end={stat.value}
                duration={2}
                separator=","
                decimals={stat.isMoney ? 0 : 0}
              />
            </div>
            <p className="text-[9px] font-bold text-base-content/20 uppercase tracking-tighter mt-1">{stat.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserDashboardTopStats;
