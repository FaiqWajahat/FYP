"use client";
import React, { useState, useEffect } from "react";
import DashboardPageHeader from "@/Components/common/DashboardPageHeader";
import UserDashboardTopStats from "@/Components/user-dashboard/dashboard/UserDashboardTopStats";
import UserSpendChart from "@/Components/user-dashboard/dashboard/UserSpendChart";
import UserPendingActions from "@/Components/user-dashboard/dashboard/UserPendingActions";
import UserRecentActivity from "@/Components/user-dashboard/dashboard/UserRecentActivity";
import UserStatusChart from "@/Components/user-dashboard/dashboard/UserStatusChart";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {},
    charts: { spendHistory: [], statusDistribution: [] },
    pendingActions: [],
    recentOrders: []
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/dashboard");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      toast.error("Failed to sync dashboard: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 font-sans pb-16 animate-in fade-in duration-700">
      <DashboardPageHeader 
        heading="User Dashboard" 
        breadData={[{ name: "Dashboard", href: "/dashboard" }]} 
      />
      
      {/* ── Section 1: Top Metrics ── */}
      <section>
         <UserDashboardTopStats stats={data.stats} loading={loading} />
      </section>

      {/* ── Section 2: Visual Intelligence ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
         <div className="flex flex-col h-full min-h-[400px]">
            <UserSpendChart data={data.charts.spendHistory} loading={loading} />
         </div>
         <div className="flex flex-col h-full min-h-[400px]">
            <UserStatusChart data={data.charts.statusDistribution} loading={loading} />
         </div>
      </section>

      {/* ── Section 3: History (Full Width) ── */}
      <section className="w-full">
         <div className="flex flex-col h-full">
            <UserRecentActivity orders={data.recentOrders} loading={loading} />
         </div>
         {/* 
         <div className="lg:col-span-4 flex flex-col h-full">
            <UserPendingActions actions={data.pendingActions} loading={loading} />
         </div> 
         */}
      </section>
    </div>
  );
}
