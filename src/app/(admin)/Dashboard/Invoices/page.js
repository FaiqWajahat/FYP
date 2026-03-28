import React from 'react';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import AdminInvoiceManager from '@/Components/admin-dashboard/invoices/AdminInvoiceManager';

export default function AdminInvoicesPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        heading="Invoice Management"
        breadData={[
          { name: "Dashboard", href: "/Dashboard" },
          { name: "Invoices", href: "/Dashboard/Invoices" },
        ]}
      />
      <AdminInvoiceManager />
    </div>
  );
}
