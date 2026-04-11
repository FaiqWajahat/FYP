"use client";
import React from 'react';
import {
  ShoppingCart, CreditCard, Factory, Camera, CheckCircle2,
  MessageSquare, FileText, Info, RefreshCcw, Lock, Unlock,
  ArrowRight, ArrowLeft, AlertTriangle, Package
} from 'lucide-react';

// ─── Icon & color resolver by event type ─────────────────────────────────────
const resolveEvent = (event) => {
  const type = event.type || '';
  const msg  = (event.message || '').toLowerCase();

  // By explicit type
  if (type === 'payment') {
    if (msg.includes('reversed') || msg.includes('⚠️')) {
      return { Icon: AlertTriangle, bg: 'bg-amber-50', text: 'text-amber-500', border: 'border-amber-100', label: 'Payment Reversed' };
    }
    return { Icon: CreditCard, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', label: 'Payment' };
  }

  if (type === 'production') {
    if (msg.includes('reverted') || msg.includes('⏪')) {
      return { Icon: ArrowLeft, bg: 'bg-amber-50', text: 'text-amber-500', border: 'border-amber-100', label: 'Stage Reverted' };
    }
    if (msg.includes('locked') || msg.includes('lock')) {
      return { Icon: Lock, bg: 'bg-rose-50', text: 'text-rose-500', border: 'border-rose-100', label: 'Pipeline Locked' };
    }
    if (msg.includes('unlocked') || msg.includes('🔓') || msg.includes('active')) {
      return { Icon: Unlock, bg: 'bg-blue-50', text: 'text-blue-500', border: 'border-blue-100', label: 'Pipeline Unlocked' };
    }
    return { Icon: ArrowRight, bg: 'bg-[var(--primary)]/5', text: 'text-[var(--primary)]', border: 'border-[var(--primary)]/10', label: 'Production' };
  }

  if (type === 'status') {
    if (msg.includes('completed') || msg.includes('✅')) {
      return { Icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', label: 'Completed' };
    }
    return { Icon: RefreshCcw, bg: 'bg-base-200', text: 'text-base-content/50', border: 'border-base-300', label: 'Status' };
  }

  // Fallback: infer from message text
  if (msg.includes('paid') || msg.includes('deposit') || msg.includes('payment')) {
    return { Icon: CreditCard, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', label: 'Payment' };
  }
  if (msg.includes('advanced') || msg.includes('manufacturing') || msg.includes('production')) {
    return { Icon: Factory, bg: 'bg-[var(--primary)]/5', text: 'text-[var(--primary)]', border: 'border-[var(--primary)]/10', label: 'Production' };
  }
  if (msg.includes('reverted') || msg.includes('⏪')) {
    return { Icon: ArrowLeft, bg: 'bg-amber-50', text: 'text-amber-500', border: 'border-amber-100', label: 'Reverted' };
  }
  if (msg.includes('design') || msg.includes('tech pack')) {
    return { Icon: FileText, bg: 'bg-indigo-50', text: 'text-indigo-500', border: 'border-indigo-100', label: 'Design' };
  }
  if (msg.includes('sample') || msg.includes('proof')) {
    return { Icon: Camera, bg: 'bg-purple-50', text: 'text-purple-500', border: 'border-purple-100', label: 'Sample' };
  }
  if (msg.includes('note') || msg.includes('message')) {
    return { Icon: MessageSquare, bg: 'bg-base-200', text: 'text-base-content/50', border: 'border-base-300', label: 'Note' };
  }
  if (msg.includes('order') && msg.includes('placed')) {
    return { Icon: ShoppingCart, bg: 'bg-[var(--primary)]/5', text: 'text-[var(--primary)]', border: 'border-[var(--primary)]/10', label: 'Order' };
  }

  return { Icon: Info, bg: 'bg-base-200', text: 'text-base-content/40', border: 'border-base-200', label: 'Event' };
};

const fmtDate = (d) => {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
const fmtTime = (d) => {
  const dt = new Date(d);
  return dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export default function OrderActivityLog({ order }) {
  const activityLog = order?.activity_log || [];
  // Show newest first
  const sortedLog = [...activityLog].reverse();

  return (
    <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden font-sans">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-base-200 bg-base-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={15} className="text-[var(--primary)]" />
          <h3 className="text-sm font-bold uppercase tracking-wide text-base-content/80">
            Activity Log
          </h3>
        </div>
        <span className="text-[10px] font-mono text-base-content/30 uppercase tracking-widest">
          {activityLog.length} event{activityLog.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="p-6">
        {sortedLog.length > 0 ? (
          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-[17px] top-2 bottom-2 w-[2px] bg-base-200 rounded-full" />

            <ul className="space-y-5">
              {sortedLog.map((event, idx) => {
                const { Icon, bg, text, border, label } = resolveEvent(event);

                // Clean the message of emoji prefixes for cleaner display
                const cleanMessage = event.message
                  .replace(/^[💳✅⚠️🏭⏪🔓📋🔒🛒]\s?/, '')
                  .trim();

                const actor = event.user || 'System';
                const isSystem = actor === 'System';

                return (
                  <li key={idx} className="relative flex gap-4 group">
                    {/* Icon node */}
                    <div className="relative z-10 shrink-0">
                      <div className={`w-9 h-9 rounded-full ${bg} ${border} border flex items-center justify-center shadow-sm`}>
                        <Icon size={14} className={text} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-0.5">
                        <div className="min-w-0">
                          {/* Event type badge + message */}
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${bg} ${text} ${border}`}>
                              {label}
                            </span>
                          </div>
                          <p className="text-[13px] font-semibold text-base-content leading-snug">
                            {cleanMessage}
                          </p>
                          <p className={`text-[10px] mt-1 font-medium ${isSystem ? 'text-base-content/30 italic' : 'text-base-content/40'}`}>
                            By {actor}
                          </p>
                        </div>
                        {/* Timestamp */}
                        <div className="text-right shrink-0 mt-0.5">
                          <p className="text-[10px] font-mono text-base-content/30 whitespace-nowrap">{fmtDate(event.date)}</p>
                          <p className="text-[10px] font-mono text-base-content/20 whitespace-nowrap">{fmtTime(event.date)}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 bg-base-200 rounded-2xl flex items-center justify-center mx-auto text-base-content/20">
              <Package size={24} />
            </div>
            <p className="text-xs font-bold text-base-content/30 uppercase tracking-widest">No activity recorded yet</p>
            <p className="text-[10px] text-base-content/20 font-medium">Events will appear here as the order progresses.</p>
          </div>
        )}
      </div>
    </div>
  );
}
