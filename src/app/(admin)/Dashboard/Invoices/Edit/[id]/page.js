import React from 'react';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import EditInvoiceForm from '@/Components/admin-dashboard/invoices/EditInvoiceForm';

export default async function EditInvoicePage({ params }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        heading="Edit Invoice"
        breadData={[
          { name: "Dashboard", href: "/Dashboard" },
          { name: "Invoices", href: "/Dashboard/Invoices" },
          { name: "Edit", href: "#" },
        ]}
      />
      
      <div className="container max-w-5xl mx-auto">
        <EditInvoiceForm invoiceId={id} />
      </div>
    </div>
  );
}
