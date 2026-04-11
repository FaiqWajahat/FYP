import React from 'react';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import InvoiceList from '@/Components/user-dashboard/invoices/InvoiceList';

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        heading="Invoices"
        breadData={[
          { name: "Dashboard", href: "/admin" },
          { name: "Invoices", href: "/admin/invoices" },
        ]}
      />
      <InvoiceList />
    </div>
  );
}


