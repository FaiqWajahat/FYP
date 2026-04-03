import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import DeepProductionTracker from '@/Components/user-dashboard/orders/DeepProductionTracker';
import MockupApprovalSection from '@/Components/user-dashboard/orders/MockupApprovalSection';
import OrderFilesAndSpecs from '@/Components/user-dashboard/orders/OrderFilesAndSpecs';
import OrderOverviewCard from '@/Components/user-dashboard/orders/OrderOverviewCard';
import SplitPaymentModule from '@/Components/user-dashboard/orders/SplitPaymentModule';
import OrderItemsList from '@/Components/user-dashboard/orders/OrderItemsList';
import OrderActivityLog from '@/Components/user-dashboard/orders/OrderActivityLog';
import React from 'react';

/**
 * Order Detail Page — User Dashboard
 *
 * In this project, an order is a single custom-manufactured garment batch.
 * The payment model:
 *   grandTotal = productionSubtotal + transferFee (based on payment method)
 *   paymentDivision = 'full' (100% upfront) | 'split' (50% now, 50% before shipping)
 *
 * In a real app, the order data would be fetched from an API by orderId.
 * For now, we pass demo data that mirrors the actual store shape.
 */
export default async function OrderDetailsPage({ params }) {
  const { id } = await params;

  const isCompleted = id.toUpperCase() === 'ORD-1004';
  const orderStatus = isCompleted ? 'Completed' : 'In Production';
  const dateStr = 'Oct 1, 2026';

  // These mirror the useOrderStore shape
  const totalUnits = 500;
  const unitPrice = 15.00;
  const brandingAddon = 1.50;
  const productionSubtotal = totalUnits * (unitPrice + brandingAddon); // 8,250

  return (
    <div className="space-y-5 pb-20 max-w-[1600px] w-full mx-auto">

      {/* Breadcrumb Header */}
      <DashboardPageHeader
        heading="Order Details"
        breadData={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Orders', href: '/dashboard/orders' },
          { name: id.toUpperCase(), href: `/dashboard/orders/${id}` },
        ]}
      />

      {/* 1. Hero Overview */}
      <OrderOverviewCard
        orderId={id}
        status={orderStatus}
        date={dateStr}
        totalUnits={totalUnits}
        productName="Heavyweight Cotton Fleece Hoodie"
      />

      {/* 2. Proof Approvals — only when order is active */}
      {!isCompleted && (
        <MockupApprovalSection />
      )}

      {/* 3. Order Items & Pricing */}
      <OrderItemsList />

      {/* 4. Two-column grid: Tracker + Financials */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">

        {/* Left: Production Timeline + Activity Log */}
        <div className="xl:col-span-7 flex flex-col gap-5">
          <DeepProductionTracker />
          <OrderActivityLog />
        </div>

        {/* Right: Payment Summary + Order Specs */}
        <div className="xl:col-span-5 flex flex-col gap-5">
          <SplitPaymentModule
            productionSubtotal={productionSubtotal}
            paymentMethodId="bank"
            paymentDivision="split"
            totalUnits={totalUnits}
            unitPrice={unitPrice}
            brandingAddon={brandingAddon}
            brandingFormat="Screen Print"
          />
          <OrderFilesAndSpecs />
        </div>

      </div>
    </div>
  );
}
