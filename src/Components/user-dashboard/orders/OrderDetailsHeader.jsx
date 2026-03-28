"use client";
import React from 'react';
import { Download, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailsHeader({ orderId, date, status }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'Production': return 'badge-info';
      case 'Processing': return 'badge-warning';
      case 'Payment Pending': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-base-100 rounded-xl shadow-sm border border-base-200">
      <div className="space-y-4 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/orders" className="btn btn-circle btn-sm btn-ghost">
              <ChevronLeft size={20} />
            </Link>
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                Order #{orderId?.toUpperCase() || 'ORD-0000'}
                <span className={`badge uppercase font-semibold text-xs py-2 px-3 ${getStatusBadge(status)}`}>
                  {status || 'Unknown'}
                </span>
              </h2>
              <p className="text-base-content/60 mt-1 pl-12 text-sm">Placed on {date || 'N/A'}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="btn btn-outline btn-neutral btn-sm h-10 px-4">
              <Download size={16} /> 
              Download Invoice
            </button>
            <button className="btn btn-primary btn-sm h-10 px-4">
              Reorder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
