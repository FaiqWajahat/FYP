'use client';
import React, { useEffect, useState } from 'react';
import BrandLoader from '@/Components/common/BrandLoader';
import BreadCrumps from '@/Components/common/BreadCrumps';
import DashboardTopStats from '@/Components/admin-dashboard/DashboardTopStats';
import SalesChart from '@/Components/admin-dashboard/SalesChart';
import Calender from '@/Components/common/Calender';
import RevenueChart from '@/Components/admin-dashboard/RevenueChart';
import RecentOrders from '@/Components/admin-dashboard/RecentOrders';
import toast from 'react-hot-toast';

const Page = () => {
  const breadData = [
    { name: "Dashboard", href: "/admin" }
  ];

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {},
    recentOrders: [],
    charts: { monthlySales: [], weeklySales: [], monthlyRevenue: [], weeklyRevenue: [] }
  });

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      const json = await res.json();
      if (json.success) {
        setData({
          stats: json.stats,
          recentOrders: json.recentOrders,
          charts: json.charts
        });
      } else {
        throw new Error(json.error);
      }
    } catch (err) {
      toast.error("Failed to load dashboard data");
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 800); // give a brief premium load effect
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <BrandLoader />;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4 w-full ">
        <h2 className="text-xl font-medium">Platform Command</h2>
        <BreadCrumps breadData={breadData} />
      </div>

      <div className='mt-8'>
        <DashboardTopStats stats={data.stats} />
      </div>
     
      <div className='mt-12 grid grid-cols-12 gap-4 overflow-hidden'>
        <div className='col-span-12 lg:col-span-8 h-full'>
          <SalesChart aggData={data.charts} />
        </div>
         <div className='col-span-12 lg:col-span-4'>
          <Calender />
        </div>
      </div>

      <div className='mt-12 overflow-hidden'>
        <RevenueChart aggData={data.charts} />
      </div>

      <div className='mt-12 w-full'>
        <RecentOrders orders={data.recentOrders} />
      </div>
    </>
  );
};

export default Page;


