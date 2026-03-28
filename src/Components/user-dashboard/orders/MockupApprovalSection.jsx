"use client";
import React from 'react';
import { Eye, ThumbsUp, ThumbsDown, Camera, Check } from 'lucide-react';

const MOCKUPS = [
  { id: 1, type: 'Digital Tech Pack', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', status: 'approved', date: 'Oct 4' },
  { id: 2, type: 'Fabric Swatch', url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80', status: 'approved', date: 'Oct 6' },
  { id: 3, type: 'Physical Sample', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80', status: 'pending', date: 'Oct 9' }
];

export default function MockupApprovalSection() {
  return (
    <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden h-full font-sans">
      <div className="p-5 border-b border-base-200/60 bg-base-100/30 flex justify-between items-center">
        <h3 className="text-sm font-semibold tracking-wider uppercase flex items-center gap-2 text-base-content/80">
           <Camera size={16} style={{ color: 'var(--primary)' }} /> Proof Approvals
        </h3>
        <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-warning/10 text-[10px] uppercase font-bold tracking-widest text-warning border border-warning/20 shadow-sm relative">
           1 Pending
        </span>
      </div>
      
      <div className="p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCKUPS.map((mockup) => (
          <div key={mockup.id} className={`group rounded-lg overflow-hidden border ${mockup.status === 'pending' ? 'border-warning/50 bg-warning/5' : 'border-base-200/60 bg-base-100'} transition-all`}>
             <div className="bg-base-200 relative w-full h-36">
               <img src={mockup.url} alt={mockup.type} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
               {mockup.status === 'approved' && (
                 <div className="absolute top-2 right-2 bg-success text-success-content p-1 rounded border border-success/20 shadow-sm">
                    <Check size={12} strokeWidth={3} />
                 </div>
               )}
             </div>
             
             <div className="p-4">
                <p className="font-bold text-xs uppercase tracking-wide text-base-content/90">{mockup.type}</p>
                <p className="text-[10px] text-base-content/50 mt-1 font-mono uppercase tracking-widest">Added: {mockup.date}</p>
                
                {mockup.status === 'pending' ? (
                  <div className="mt-3 flex gap-2 w-full">
                     <button className="btn btn-success btn-xs flex-1 h-7 min-h-0 text-[10px] uppercase tracking-wider font-bold">
                       <ThumbsUp size={12} /> Approve
                     </button>
                     <button className="btn btn-error btn-outline btn-xs flex-1 h-7 min-h-0 text-[10px] uppercase tracking-wider font-bold border-base-300">
                       <ThumbsDown size={12} /> Reject
                     </button>
                  </div>
                ) : (
                  <div className="mt-3">
                     <button className="btn btn-ghost border border-base-200 btn-xs w-full h-7 min-h-0 bg-base-100 hover:bg-base-200 text-[10px] uppercase tracking-wider font-bold text-base-content/60">
                       <Eye size={12} /> View
                     </button>
                  </div>
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
