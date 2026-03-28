"use client";
import React from 'react';
import { ArrowLeft, MessageSquare, MapPin, Calendar, CheckSquare } from 'lucide-react';
import Link from 'next/link';

export default function OrderOverviewCard({ orderId, status, date, managerName = "Sarah Jenkins" }) {
  const isProduction = status === 'In Production';
  const progressPercent = isProduction ? 65 : (status === 'Completed' ? 100 : 15);

  return (
    <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden relative font-sans">
      <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: 'var(--primary)' }}></div>
      <div className="p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        
        <div className="space-y-3 w-full md:w-auto">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/orders" className="btn btn-circle btn-xs btn-ghost hover:bg-base-200">
              <ArrowLeft size={14} />
            </Link>
            <div className="flex bg-base-200/50 rounded-md border border-base-200 text-[10px] font-semibold tracking-wider uppercase divide-x divide-base-300">
               <span className="px-3 py-1.5 flex items-center gap-1.5 text-base-content/70">
                 <Calendar size={12} /> {date}
               </span>
               <span className={`px-3 py-1.5 flex items-center gap-1.5 font-bold`} style={{ color: isProduction ? 'var(--primary)' : 'var(--color-success, #16a34a)' }}>
                 {status}
               </span>
            </div>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-base-content">
               Project #{orderId?.toUpperCase() || 'P-4829X'}
            </h1>
            <p className="text-xs text-base-content/60 mt-1 flex items-center gap-2">
              Manager: 
              <span className="font-semibold text-base-content flex items-center gap-1.5">
                 <img src="https://i.pravatar.cc/150?img=47" className="w-4 h-4 rounded-full border border-base-300" alt="Manager" />
                 {managerName}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5 w-full md:w-auto bg-base-100 p-4 rounded-lg border border-base-200/60 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="radial-progress font-bold text-xs" style={{ "--value": progressPercent, "--size": "2.5rem", "--thickness": "4px", color: 'var(--primary)' }} role="progressbar">
              {progressPercent}%
            </div>
            <div className="text-xs">
              <p className="font-bold text-base-content uppercase tracking-wider text-[10px]">Progress</p>
              <p className="text-base-content/60 mt-0.5">{isProduction ? 'Currently Printing' : 'Awaiting Approval'}</p>
            </div>
          </div>
          
          <div className="hidden sm:block h-8 w-px bg-base-200"></div>
          
          <div className="w-full sm:w-auto">
             <button className="btn btn-outline btn-xs h-8 px-4 w-full justify-center gap-1.5 rounded uppercase tracking-wider text-[10px] font-semibold" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
               <MessageSquare size={12} /> Contact
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
