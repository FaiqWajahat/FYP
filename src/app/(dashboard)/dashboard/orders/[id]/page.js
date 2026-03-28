import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import DeepProductionTracker from '@/Components/user-dashboard/orders/DeepProductionTracker';
import MockupApprovalSection from '@/Components/user-dashboard/orders/MockupApprovalSection';
import OrderFilesAndSpecs from '@/Components/user-dashboard/orders/OrderFilesAndSpecs';
import OrderOverviewCard from '@/Components/user-dashboard/orders/OrderOverviewCard';
import SplitPaymentModule from '@/Components/user-dashboard/orders/SplitPaymentModule';
import React from 'react';


export default async function OrderDetailsPage({ params }) {
  const { id } = await params;
  
  // Dummy logic for demo
  const isCompleted = id.toUpperCase() === 'ORD-1004';
  const orderStatus = isCompleted ? 'Completed' : 'In Production';
  const dateStr = 'Oct 1, 2026';

  return (
    <div className="space-y-6 pb-20 max-w-[1600px] w-full mx-auto">
      
      {/* 0. Page Header with Breadcrumbs */}
      <DashboardPageHeader
        heading="Order Details" 
        breadData={[
          { name: "Dashboard", href: "/dashboard" }, 
          { name: "Orders", href: "/dashboard/orders" },
          { name: id.toUpperCase(), href: `/dashboard/orders/${id}` }
        ]} 
      />

      {/* 1. Header Overview Component */}
      <OrderOverviewCard orderId={id} status={orderStatus} date={dateStr} />
      
      {/* 2. Interactive Mockup Approvals (Visible if not completed) */}
      {!isCompleted && (
        <MockupApprovalSection />
      )}
      
      {/* Main Grid Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6 items-start">
        
        {/* Left Column (Primary Tracking) */}
        <div className="xl:col-span-7 w-full">
           <DeepProductionTracker />
        </div>
        
        {/* Right Column (Financials & Specs) */}
        <div className="xl:col-span-5 flex flex-col gap-6 h-max">
           <SplitPaymentModule />
           <OrderFilesAndSpecs />
        </div>
        
      </div>
    </div>
  );
}
