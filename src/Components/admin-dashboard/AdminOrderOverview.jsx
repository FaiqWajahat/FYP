"use client";
import React from 'react';
import { Package, Calendar, Clock, User, Mail } from 'lucide-react';

export default function AdminOrderOverview({ order }) {
  if (!order) return null;

  const displayId = `ORD-${1000 + (order.display_id || 0)}`;
  const date = new Date(order.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="bg-base-100 rounded-3xl shadow-sm border border-base-200 overflow-hidden font-sans">
      <div className="p-8 lg:p-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
        
        {/* Left Section: Identity & Primary Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-base-50 flex items-center justify-center text-[var(--primary)] shadow-inner border border-base-200">
            <Package size={28} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-base-content">{displayId}</h1>
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                order.status === 'Completed' 
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                : 'bg-[var(--primary)] text-white shadow-sm'
              }`}>
                {order.status || 'Processing'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-base-content/60">{order.product_name}</p>
              <span className="w-1 h-1 rounded-full bg-base-300" />
              <p className="font-mono text-[10px] font-bold text-base-content/30 uppercase tracking-widest">{order.sku}</p>
            </div>
          </div>
        </div>

        {/* Right Section: Metadata Cards (Minimalist) */}
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Date */}
          <div className="flex-1 sm:flex-none flex items-center gap-3 px-5 py-3 bg-base-50/50 rounded-2xl border border-base-200">
            <Calendar size={16} className="text-base-content/20" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-base-content/30">Order Date</p>
              <p className="text-xs font-bold text-base-content">{date}</p>
            </div>
          </div>

          {/* Client */}
          <div className="flex-1 sm:flex-none flex items-center gap-3 px-5 py-3 bg-base-50/50 rounded-2xl border border-base-200">
            <User size={16} className="text-base-content/20" />
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-widest text-base-content/30">Customer</p>
              <p className="text-xs font-bold text-base-content truncate">{order.profiles?.full_name || 'Guest'}</p>
            </div>
          </div>

          {/* Security Banner (Minimalist) */}
          {!order.is_deposit_paid ? (
            <div className="flex-1 sm:flex-none flex items-center gap-3 px-5 py-3 bg-rose-50 rounded-2xl border border-rose-100">
               <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
               <p className="text-[10px] font-black uppercase tracking-widest text-rose-600">Awaiting Deposit</p>
            </div>
          ) : (
            <div className="flex-1 sm:flex-none flex items-center gap-3 px-5 py-3 bg-emerald-50 rounded-2xl border border-emerald-100">
               <div className="w-2 h-2 rounded-full bg-emerald-500" />
               <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Vetted & Active</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
