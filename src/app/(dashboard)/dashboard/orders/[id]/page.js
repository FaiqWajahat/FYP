"use client";
import React, { useEffect, useState, use } from 'react';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import DeepProductionTracker from '@/Components/user-dashboard/orders/DeepProductionTracker';
import MockupApprovalSection from '@/Components/user-dashboard/orders/MockupApprovalSection';
import OrderFilesAndSpecs from '@/Components/user-dashboard/orders/OrderFilesAndSpecs';
import OrderOverviewCard from '@/Components/user-dashboard/orders/OrderOverviewCard';
import SplitPaymentModule from '@/Components/user-dashboard/orders/SplitPaymentModule';
import OrderItemsList from '@/Components/user-dashboard/orders/OrderItemsList';
import OrderActivityLog from '@/Components/user-dashboard/orders/OrderActivityLog';
import Loader from '@/Components/common/Loader';
import { AlertCircle } from 'lucide-react';

export default function OrderDetailsPage({ params }) {
  const { id } = use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/orders?id=${id}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader variant="inline" message="Loading Order Data..." /></div>;
  }

  if (error || !order) {
    return (
      <div className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-200">
        <AlertCircle className="w-5 h-5 inline mr-2" /> Error loading order: {error || 'Order not found'}
      </div>
    );
  }

  const isCompleted = order.status?.toLowerCase() === 'completed';
  const orderStatus = order.status || 'Processing';
  const dateStr = new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  // Compute Volume and Pricing from generic specs
  let totalUnits = 0;
  if (order.sizing) {
    if (Array.isArray(order.sizing)) {
      totalUnits = order.sizing.reduce((a, b) => a + (Number(b.qty) || 0), 0);
    } else {
      totalUnits = Object.values(order.sizing).reduce((a, b) => a + (Number(b) || 0), 0);
    }
  } else if (order.pricing?.totalUnits) {
    totalUnits = order.pricing.totalUnits;
  }



  return (
    <div className="space-y-5 pb-20 w-full mx-auto">

      {/* Breadcrumb Header */}
      <DashboardPageHeader
        heading="Order Details"
        breadData={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Orders', href: '/dashboard/orders' },
          { name: `ORD-${order.display_id || id.slice(0, 8)}`, href: `/dashboard/orders/${id}` },
        ]}
      />

      {/* 0. Urgent Notification Banner */}
      {order.invoices?.some(inv => inv.status === 'pending' || inv.status === 'unpaid') && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm border-l-4 border-l-amber-400">
           <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                 <AlertCircle size={24} />
              </div>
              <div className="space-y-1">
                 <h4 className="text-lg font-black text-amber-900 tracking-tight leading-none">Payment Action Required</h4>
                 <p className="text-sm text-amber-700 font-bold uppercase tracking-widest text-[10px] opacity-80">Settlement required to initialize manufacturing pipeline</p>
              </div>
           </div>
           <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link 
                href={`/dashboard/invoices?orderId=${order.display_id ? `ORD-${order.display_id}` : order.id}`}
                className="btn btn-md bg-amber-600 hover:bg-amber-700 text-white border-none rounded-2xl font-black uppercase tracking-widest text-[10px] flex-1 sm:flex-none shadow-lg shadow-amber-200"
              >
                 Approve & Pay Invoice →
              </Link>
           </div>
        </div>
      )}

      {/* 1. Hero Overview */}
      <OrderOverviewCard
        orderId={order.display_id ? `1000${order.display_id}` : id}
        status={orderStatus}
        date={dateStr}
        totalUnits={totalUnits}
        productName={order.product_name || order.product?.name || "Custom Order"}
        order={order}
      />

      {/* 2. Proof Approvals — mockup approval logic */}
      {!isCompleted && false && (
        // Feature flagged out for now until mockup approval API is done
        <MockupApprovalSection order={order} />
      )}

      {/* 3. Order Items & Pricing */}
      <OrderItemsList order={order} />

      {/* Main Execution Flow: 3 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-20 items-stretch mt-6">
        
        {/* Left: Financial Pipeline (4 cols) */}
       

        {/* Center: Live Production Engine (4 cols) */}
        <div className="md:col-span-12 lg:col-span-6  flex flex-col gap-8">
          <DeepProductionTracker order={order} />
        </div>

        {/* Right: Spec Engine & Verification (4 cols) */}
       

         <div className="md:col-span-12 lg:col-span-6 flex flex-col gap-8">
          <SplitPaymentModule order={order} />
        </div>
      </div>

      {/* Activity Log (Full Width) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-20 items-stretch mt-6">
        <div className="md:col-span-12 lg:col-span-6 xl:col-span-6 flex flex-col gap-8">
          <OrderActivityLog order={order} />
        </div>
         <div className="md:col-span-12 lg:col-span-6 xl:col-span-6 flex flex-col gap-8">
          <OrderFilesAndSpecs order={order} />
        </div>
      </div>
    </div>
  );
}
