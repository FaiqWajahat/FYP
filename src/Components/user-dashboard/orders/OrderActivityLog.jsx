"use client";
import React from 'react';
import {
  ShoppingCart, CreditCard, Factory, Camera, CheckCircle, MessageSquare, FileText
} from 'lucide-react';

const EVENTS = [
  {
    id: 1,
    icon: ShoppingCart,
    title: 'Order Placed',
    desc: 'Order #ORD-1005 submitted with 500 units.',
    time: 'Oct 1, 2026 — 09:14 AM',
    color: 'text-base-content/60',
    bgColor: 'bg-base-200/70',
  },
  {
    id: 2,
    icon: CreditCard,
    title: 'Initial Payment Received',
    desc: '$2,500 deposit confirmed via Visa •••• 4242.',
    time: 'Oct 5, 2026 — 11:30 AM',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    id: 3,
    icon: FileText,
    title: 'Tech Pack Approved',
    desc: 'Design & tech pack signed off. Production cleared.',
    time: 'Oct 5, 2026 — 02:45 PM',
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  {
    id: 4,
    icon: Factory,
    title: 'Production Started',
    desc: 'Factory floor initiated bulk cutting phase.',
    time: 'Oct 6, 2026 — 08:00 AM',
    color: 'text-base-content/60',
    bgColor: 'bg-base-200/70',
  },
  {
    id: 5,
    icon: Camera,
    title: 'Physical Sample Uploaded',
    desc: 'Admin uploaded proof #3 — awaiting your approval.',
    time: 'Oct 9, 2026 — 04:22 PM',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    id: 6,
    icon: MessageSquare,
    title: 'Manager Note',
    desc: '"Sublimation printing is underway. ETA 3 days." — Sarah Jenkins',
    time: 'Oct 10, 2026 — 10:05 AM',
    color: 'text-base-content/60',
    bgColor: 'bg-base-200/70',
  },
];

export default function OrderActivityLog() {
  return (
    <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden font-sans">
      {/* Header */}
      <div className="p-5 border-b border-base-200/60 flex justify-between items-center">
        <h3 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2 text-base-content/80">
          <CheckCircle size={15} style={{ color: 'var(--primary)' }} />
          Activity Log
        </h3>
        <span className="text-[10px] font-mono text-base-content/40 uppercase tracking-widest">
          {EVENTS.length} events
        </span>
      </div>

      {/* Timeline */}
      <div className="p-5">
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[17px] top-2 bottom-2 w-[2px] bg-base-200" />

          <ul className="space-y-5">
            {EVENTS.map((event, idx) => {
              const Icon = event.icon;
              const isLast = idx === EVENTS.length - 1;

              return (
                <li key={event.id} className="relative flex gap-4">
                  {/* Icon */}
                  <div className="relative z-10 shrink-0">
                    <div className={`w-9 h-9 rounded-full ${event.bgColor} flex items-center justify-center border border-base-200/60`}>
                      <Icon size={15} className={event.color} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <p className="text-xs font-bold text-base-content leading-tight">{event.title}</p>
                      <span className="text-[10px] font-mono text-base-content/35 uppercase tracking-wider whitespace-nowrap shrink-0">
                        {event.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-base-content/55 mt-1 leading-relaxed">{event.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
