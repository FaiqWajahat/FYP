import React, { Suspense } from 'react';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import InvoiceList from '@/Components/user-dashboard/invoices/InvoiceList';
import Loader from '@/Components/common/Loader';

export default function InvoicesPage() {
  return (
    <div className="space-y-6 pb-20 max-w-[1600px] w-full mx-auto">
      <DashboardPageHeader
        heading="Invoices"
        breadData={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Invoices", href: "/dashboard/invoices" },
        ]}
      />
      <Suspense fallback={<Loader message="Synchronizing invoices..." variant="inline" />}>
        <InvoiceList />
      </Suspense>
    </div>
  );
}


