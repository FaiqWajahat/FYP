import React from 'react';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import OrderList from '@/Components/user-dashboard/orders/OrderList';


export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader 
        heading="My Orders" 
        breadData={[{ name: "Dashboard", href: "/dashboard" }, { name: "Orders", href: "/dashboard/orders" }]} 
      />
      <OrderList />
    </div>
  );
}
