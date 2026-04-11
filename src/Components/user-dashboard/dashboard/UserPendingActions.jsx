import React from 'react';
import { AlertTriangle, Clock, ArrowRight, ArrowRightCircle } from 'lucide-react';
import Link from 'next/link';

export default function UserPendingActions() {
  const actions = [
    {
       id: 1,
       type: 'Mockup Approval',
       description: 'Design Mockup #1021 for ORD-9982 is ready for your review.',
       time: '2 hours ago',
       urgency: 'high',
       link: '/dashboard/mockups'
    },
    {
       id: 2,
       type: 'Invoice Payment',
       description: '50% upfront payment required to begin bulk manufacturing for Quote-92.',
       time: 'Yesterday',
       urgency: 'medium',
       link: '/dashboard/invoices'
    },
    {
       id: 3,
       type: 'Shipping Details',
       description: 'Please confirm the final delivery address for your upcoming shipment.',
       time: '2 days ago',
       urgency: 'low',
       link: '/dashboard/profile'
    }
  ];

  return (
    <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden flex flex-col h-full font-sans">
      <div className="p-5 border-b border-base-200/60 flex justify-between items-center shrink-0">
        <h3 className="text-sm font-semibold tracking-wider uppercase text-base-content/80 flex items-center gap-2">
           <AlertTriangle size={16} className="text-warning" /> Requires Action
        </h3>
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-error/10 text-xs font-bold text-error">
          {actions.length}
        </span>
      </div>

      <div className="p-5 flex-grow overflow-y-auto w-full custom-scrollbar">
        <div className="space-y-4">
           {actions.map((action) => (
             <div key={action.id} className="group relative bg-base-200/40 hover:bg-base-200 transition-colors rounded-lg p-4 border border-base-200/50 cursor-pointer">
                <div className="flex justify-between items-start gap-3">
                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                         {action.urgency === 'high' && <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>}
                         {action.urgency === 'medium' && <span className="w-2 h-2 rounded-full bg-warning"></span>}
                         {action.urgency === 'low' && <span className="w-2 h-2 rounded-full bg-success"></span>}
                         <h4 className="text-xs font-bold uppercase tracking-wide text-base-content">{action.type}</h4>
                      </div>
                      <p className="text-xs text-base-content/70 pr-4 mt-1.5 leading-relaxed">{action.description}</p>
                      
                      <div className="flex items-center gap-1.5 mt-3 text-[10px] text-base-content/40 font-mono uppercase tracking-widest">
                         <Clock size={10} /> {action.time}
                      </div>
                   </div>
                   <div className="shrink-0 p-2 text-base-content/20 group-hover:text-primary transition-colors">
                      <ArrowRightCircle size={20} />
                   </div>
                </div>
                
                <Link href={action.link} className="absolute inset-0 z-10">
                   <span className="sr-only">View action</span>
                </Link>
             </div>
           ))}
        </div>
      </div>
      
      <div className="p-3 border-t border-base-200/60 bg-base-50 text-center">
         <button className="btn btn-ghost btn-xs text-[10px] uppercase tracking-widest text-base-content/50 hover:text-primary">
            View All Notifications <ArrowRight size={10} className="ml-1" />
         </button>
      </div>
    </div>
  );
}

