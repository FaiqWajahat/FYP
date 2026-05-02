import React from 'react';
import { AlertTriangle, Clock, ArrowRightCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function UserPendingActions({ actions = [], loading }) {
  if (loading) {
    return (
      <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 h-full p-6 animate-pulse space-y-4">
        <div className="h-6 w-32 bg-base-200 rounded-lg mb-8" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-base-200/50 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden flex flex-col h-full font-sans">
      <div className="p-6 border-b border-base-200/60 flex justify-between items-center shrink-0">
        <h3 className="text-sm font-black tracking-widest uppercase text-base-content flex items-center gap-2">
           <AlertTriangle size={18} className="text-amber-500" /> Pending Tasks
        </h3>
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-rose-500/10 text-[10px] font-black text-rose-600 border border-rose-500/20">
          {actions.length}
        </span>
      </div>

      <div className="p-4 flex-grow overflow-y-auto w-full custom-scrollbar min-h-[350px]">
        {actions.length > 0 ? (
          <div className="space-y-3">
            {actions.map((action) => (
              <div key={action.id} className="group relative bg-base-50/50 hover:bg-white hover:shadow-xl hover:shadow-[var(--primary)]/5 transition-all duration-300 rounded-xl p-5 border border-base-200/50 hover:border-[var(--primary)]/30 cursor-pointer overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-base-200 group-hover:bg-[var(--primary)]" />
                
                <div className="flex justify-between items-start gap-4">
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                         <div className={`w-2 h-2 rounded-full ${
                            action.urgency === 'high' ? 'bg-rose-500 animate-pulse' : 
                            action.urgency === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                         }`} />
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-base-content/40">{action.type}</h4>
                      </div>
                      <p className="text-xs font-bold text-base-content leading-relaxed pr-4">{action.description}</p>
                      
                      <div className="flex items-center gap-1.5 mt-4 text-[9px] text-base-content/30 font-black uppercase tracking-widest">
                         <Clock size={10} /> 
                         {new Date(action.time).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                   </div>
                   <div className="shrink-0 p-2 text-base-content/10 group-hover:text-primary transition-colors">
                      <ArrowRightCircle size={22} />
                   </div>
                </div>
                
                <Link href={action.link} className="absolute inset-0 z-10">
                   <span className="sr-only">Go to task</span>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
            <Sparkles size={48} className="mb-4" />
            <p className="text-xs font-black uppercase tracking-widest">Everything Clear!</p>
            <p className="text-[10px] font-bold mt-1">No pending actions at this time.</p>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-base-200/60 bg-base-50/50 text-center">
         <p className="text-[9px] font-bold uppercase tracking-widest text-base-content/30 italic">
            Priority Tasks Only
         </p>
      </div>
    </div>
  );
}
