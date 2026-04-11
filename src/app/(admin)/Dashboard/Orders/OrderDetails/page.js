"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import Loader from '@/Components/common/Loader';

// NEW HIGH-FIDELITY COMPONENTS
import AdminOrderOverview from '@/Components/admin-dashboard/AdminOrderOverview';
import AdminProductionManager from '@/Components/admin-dashboard/AdminProductionManager';
import AdminOrderSpecs from '@/Components/admin-dashboard/AdminOrderSpecs';
import AdminInvoicePipeline from '@/Components/admin-dashboard/AdminInvoicePipeline';
import OrderActivityLog from '@/Components/user-dashboard/orders/OrderActivityLog';

const OrderDetailsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  const fetchOrder = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/orders?id=${id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error("Failed to load order: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleAdvanceStage = async (nextIndex) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id, 
          stage_index: nextIndex,
          production_stage: PHASES[nextIndex]?.title || order.production_stage 
        })
      });
      const data = await res.json();
      if (data.success) {
        const isRevert = nextIndex < (order.stage_index ?? 0);
        toast.success(isRevert
          ? `Reverted to: ${data.order.production_stage}`
          : `Advanced to: ${data.order.production_stage}`
        );
        fetchOrder();
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Phases for mapping stage_index to titles (consistent with AdminProductionManager)
  const PHASES = [
    { title: 'Design & Tech Pack' },
    { title: 'Fabric Sourcing' },
    { title: 'Pattern Making' },
    { title: 'Sampling' },
    { title: 'Bulk Cutting' },
    { title: 'Printing & Embroidery' },
    { title: 'Stitching & Assembly' },
    { title: 'Finishing & QA' },
    { title: 'Packaging & Dispatch' },
    { title: 'Delivered / Complete' },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
       <Loader variant="inline" message="Compiling Manufacturing Data..." />
    </div>
  );
  
  if (!order) return (
    <div className="text-center py-20">
      <p className="text-base-content/40 font-black uppercase text-xs tracking-widest">Order Not Found</p>
    </div>
  );

  const displayId = `ORD-${1000 + (order.display_id || 0)}`;
  const breadData = [
    { name: 'Dashboard', href: '/Dashboard' },
    { name: 'Orders', href: '/Dashboard/Orders/All' },
    { name: displayId, href: `/Dashboard/Orders/OrderDetails?id=${id}` },
  ];

  return (
    <div className="w-full space-y-6 pb-20 max-w-[1600px] mx-auto">
      
      {/* 1. Header & Breadcrumbs */}
      <DashboardPageHeader 
        breadData={breadData} 
        heading={`Manufacturing Command: ${displayId}`} 
      />

      {/* 2. Page Hero: Status & Client Info */}
      <AdminOrderOverview order={order} />
      
      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Requirements & Activity */}
        <div className="xl:col-span-7 space-y-6">
           <AdminOrderSpecs order={order} />
           <OrderActivityLog order={order} />
        </div>

        {/* Right Column: Execution & Financials */}
        <div className="xl:col-span-5 space-y-6">
           <AdminProductionManager 
             order={order} 
             onAdvance={handleAdvanceStage} 
           />
           <AdminInvoicePipeline 
             order={order} 
             onUpdate={fetchOrder} 
           />
        </div>
      </div>
      
    </div>
  );
};

const OrderDetailsPage = () => {
  return (
    <Suspense fallback={<Loader variant="inline" />}>
      <OrderDetailsContent />
    </Suspense>
  )
}

export default OrderDetailsPage;