import React from 'react';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import OrderList from '@/Components/user-dashboard/orders/OrderList';


export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader 
        heading="My Orders" 
        breadData={[{ name: "Dashboard", href: "/admin" }, { name: "Orders", href: "/admin/orders" }]} 
      />
      <OrderList />
    </div>
  );
}


