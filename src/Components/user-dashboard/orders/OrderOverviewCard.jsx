"use client";
import React from 'react';
import { Package, Calendar, Clock, ArrowLeft, MessageSquare, RefreshCw, ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OrderOverviewCard({ orderId, status, date, totalUnits, productName, order }) {
  if (!order) return null;

  const isDepositPaid = order.is_deposit_paid;
  const isCompleted = status === 'Completed';
  const router = useRouter();

  return (
    <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden font-sans w-full">
      <div className="p-8 lg:p-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">

        {/* Left Section: Identity & Primary Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Link href="/dashboard/orders" className="btn btn-circle btn-ghost border border-base-200 shadow-sm hover:bg-base-50">
            <ArrowLeft size={20} />
          </Link>
          <div className="w-16 h-16 rounded-2xl bg-base-50 flex items-center justify-center text-[var(--primary)] shadow-inner border border-base-200">
            <Package size={28} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tight text-base-content">{orderId}</h1>
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${isCompleted
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : 'bg-[var(--primary)] text-white shadow-sm'
                }`}>
                {status || 'Processing'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-base-content/60">{productName}</p>
              <span className="w-1 h-1 rounded-full bg-base-300" />
              <p className="font-mono text-[10px] font-bold text-base-content/30 uppercase tracking-widest">{order.sku}</p>
            </div>
          </div>
        </div>

        {/* Right Section: Metadata Cards & Actions */}
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Volume */}
          <div className="flex-1 sm:flex-none flex items-center gap-3 px-5 py-3 bg-base-50/50 rounded-2xl border border-base-200">
            <Clock size={16} className="text-base-content/20" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-base-content/30">Order Volume</p>
              <p className="text-xs font-bold text-base-content">{totalUnits} units</p>
            </div>
          </div>

          {/* Date */}
          <div className="flex-1 sm:flex-none flex items-center gap-3 px-5 py-3 bg-base-50/50 rounded-2xl border border-base-200">
            <Calendar size={16} className="text-base-content/20" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-base-content/30">Release Date</p>
              <p className="text-xs font-bold text-base-content">{date}</p>
            </div>
          </div>

          {/* Status Pill */}
          {!isDepositPaid ? (
            <div className="flex-1 sm:flex-none flex items-center gap-3 px-5 py-3 bg-rose-50 rounded-2xl border border-rose-100">
              <AlertCircle size={16} className="text-rose-500 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-600">Action Required</p>
            </div>
          ) : (
            <div className="flex-1 sm:flex-none flex items-center gap-3 px-5 py-3 bg-emerald-50 rounded-2xl border border-emerald-100">
              <ShieldCheck size={16} className="text-emerald-500" />
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Pipeline Active</p>
            </div>
          )}

          {/* Action Set */}
          <div className="flex items-center gap-2 ml-auto xl:ml-4">

            <button onClick={() => { router.push('/dashboard/messages') }} className="btn btn-md bg-[var(--primary)] text-white gap-2 border-none shadow-lg px-6 rounded-2xl font-bold uppercase tracking-wider text-xs">
              <MessageSquare size={16} /> Contact Us
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}


