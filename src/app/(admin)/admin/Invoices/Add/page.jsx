'use client';

import React, { Suspense } from 'react';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import AddInvoiceForm from '@/Components/admin-dashboard/invoices/AddInvoiceForm';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddInvoicePage() {
  const router = useRouter();

  const handleCreateInvoice = async (formData) => {
    try {
      const response = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create invoice");
      }

      toast.success(result.message || "Invoice generated successfully!");
      router.push('/admin/Invoices');
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const breadData = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Invoices', href: '/admin/Invoices' },
    { name: 'New Invoice', href: '/admin/Invoices/Add' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <DashboardPageHeader
          breadData={breadData}
          heading="Issue New Invoice"
          subHeading="Create a professional payment request and notify your client instantly."
        />


      </div>

      <div className="w-full">
        <Suspense fallback={<div className="p-10 flex justify-center"><span className="loading loading-spinner text-[var(--primary)]"></span></div>}>
          <AddInvoiceForm onSave={handleCreateInvoice} />
        </Suspense>
      </div>

      {/* Help Card */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
          <FileText size={20} className="text-blue-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-900">Pro Tip: Professional Billing</h4>
          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
            Always attach a PDF copy of your invoice. Clients are 30% more likely to pay on time when they can view a structured breakdown of costs. Invoices are automatically set to 'Pending' until the client approves and confirms payment.
          </p>
        </div>
      </div>
    </div>
  );
}

// Reuse icon since we used it in notes
function FileText({ size, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
    </svg>
  );
}

