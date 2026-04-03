"use client";
import React from 'react';
import { ArrowLeft, Download, RefreshCw, MessageSquare, Calendar, Package, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function OrderOverviewCard({ orderId, status, date, totalUnits = 500, productName = "Heavyweight Cotton Fleece Hoodie" }) {
  const isProduction = status === 'In Production';
  const isCompleted = status === 'Completed';
  const isProcessing = status === 'Processing';

  const progressPercent = isCompleted ? 100 : isProduction ? 65 : isProcessing ? 20 : 10;
  const daysActive = isCompleted ? 28 : 12;
  const eta = isCompleted ? 'Delivered' : 'Oct 14, 2026';

  const statusStyle = isCompleted
    ? { color: '#16a34a', bg: 'rgba(22,163,74,0.08)', border: 'rgba(22,163,74,0.25)' }
    : isProduction
    ? { color: 'var(--primary)', bg: 'color-mix(in srgb, var(--primary) 8%, transparent)', border: 'color-mix(in srgb, var(--primary) 30%, transparent)' }
    : { color: '#d97706', bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.25)' };

  return (
    <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden font-sans relative">
      <div className="absolute top-0 left-0 w-full h-[3px]"
        style={{ background: `linear-gradient(90deg, var(--primary), color-mix(in srgb, var(--primary) 40%, transparent))` }} />

      <div className="p-5 md:p-6">
        {/* Top Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-start gap-3">
            <Link href="/dashboard/orders" className="btn btn-circle btn-sm btn-ghost hover:bg-base-200 mt-0.5 shrink-0">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-base-content">
                  Order #{orderId?.toUpperCase()}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border"
                  style={{ color: statusStyle.color, backgroundColor: statusStyle.bg, borderColor: statusStyle.border }}>
                  {isProduction && (
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: statusStyle.color }} />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: statusStyle.color }} />
                    </span>
                  )}
                  {status}
                </span>
              </div>
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1.5 text-[11px] text-base-content/50 font-mono pl-0.5">
                <span className="flex items-center gap-1"><Calendar size={11} /> Placed: {date}</span>
                <span className="hidden sm:block w-1 h-1 rounded-full bg-base-300" />
                <span className="truncate max-w-[220px]">{productName}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap pl-11 lg:pl-0">
            <button className="btn btn-ghost btn-sm h-9 gap-1.5 border border-base-200 text-[11px] uppercase tracking-wider font-semibold">
              <Download size={13} /> Invoice
            </button>
            <button className="btn btn-ghost btn-sm h-9 gap-1.5 border border-base-200 text-[11px] uppercase tracking-wider font-semibold">
              <RefreshCw size={13} /> Reorder
            </button>
            <button className="btn btn-sm h-9 gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-white border-none hover:opacity-90"
              style={{ backgroundColor: 'var(--primary)' }}>
              <MessageSquare size={13} /> Message
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-base-200/40 rounded-xl p-3 border border-base-200/60 flex items-center gap-3">
            <div className="radial-progress font-bold text-[10px] shrink-0"
              style={{ '--value': progressPercent, '--size': '2.8rem', '--thickness': '4px', color: 'var(--primary)' }}>
              {progressPercent}%
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/50">Progress</p>
              <p className="text-xs font-semibold text-base-content mt-0.5">
                {isCompleted ? 'Complete' : isProduction ? 'Printing' : 'Processing'}
              </p>
            </div>
          </div>

          <div className="bg-base-200/40 rounded-xl p-3 border border-base-200/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 12%, transparent)' }}>
              <Package size={16} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/50">Units</p>
              <p className="text-xs font-bold text-base-content mt-0.5">{totalUnits.toLocaleString()} <span className="font-normal text-base-content/40">pcs</span></p>
            </div>
          </div>

          <div className="bg-base-200/40 rounded-xl p-3 border border-base-200/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-info/10 flex items-center justify-center shrink-0">
              <Clock size={16} className="text-info" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/50">Active</p>
              <p className="text-xs font-bold text-base-content mt-0.5">{daysActive} <span className="font-normal text-base-content/40">days</span></p>
            </div>
          </div>

          <div className="bg-base-200/40 rounded-xl p-3 border border-base-200/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
              <TrendingUp size={16} className="text-warning" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/50">ETA</p>
              <p className="text-xs font-bold text-base-content mt-0.5">{eta}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
