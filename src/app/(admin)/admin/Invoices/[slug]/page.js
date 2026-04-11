import React from 'react';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import AdminInvoiceManager from '@/Components/admin-dashboard/invoices/AdminInvoiceManager';

export default async function AdminInvoicesSlugPage({ params }) {
  const { slug } = await params;
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        heading={`Invoices: ${slug}`}
        breadData={[
          { name: "Dashboard", href: "/admin" },
          { name: "Invoices", href: "/admin/Invoices/All" },
          { name: slug, href: `/admin/Invoices/${slug}` },
        ]}
      />
      <AdminInvoiceManager slug={slug} />
    </div>
  );
}
