"use client";
import React from "react";
import {
  Eye, ThumbsUp, ThumbsDown, Trash2,
  Download, Maximize2, Layers, Clock, Calendar
} from "lucide-react";

const STATUS_STYLE = {
  pending:  { 
    bg: "bg-amber-50/80", 
    border: "border-amber-200/50", 
    text: "text-amber-700", 
    dot: "bg-amber-500",
    pulse: "animate-pulse"
  },
  approved: { 
    bg: "bg-emerald-50/80", 
    border: "border-emerald-200/50", 
    text: "text-emerald-700", 
    dot: "bg-emerald-500",
    pulse: ""
  },
  rejected: { 
    bg: "bg-rose-50/80", 
    border: "border-rose-200/50", 
    text: "text-rose-600", 
    dot: "bg-rose-500",
    pulse: ""
  },
};

export default function AdminMockupCard({ mockup, onView, onStatusChange, onDelete }) {
  const s = STATUS_STYLE[mockup.status] || STATUS_STYLE.pending;
  
  const orderLabel = mockup.orders?.display_id
    ? `ORD-${1000 + mockup.orders.display_id}`
    : mockup.order_id?.slice(0, 8).toUpperCase() || "—";
    
  const clientName = mockup.profiles?.full_name || "Unknown Client";
  const dateStr = new Date(mockup.created_at).toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric" 
  });

  return (
    <div className="group flex flex-col bg-base-100 rounded-[2rem] shadow-sm hover:shadow-2xl border border-base-200 transition-all duration-500 hover:-translate-y-1 overflow-hidden h-full">

      {/* ── Image Section ── */}
      <div
        className="relative aspect-[4/3] w-full bg-base-200 overflow-hidden cursor-pointer"
        onClick={() => onView(mockup)}
      >
        <img
          src={mockup.url}
          alt={mockup.title}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />

        {/* Gradient Overlay for better contrast */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Status badge: Glassmorphism */}
        <div className={`absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.15em] backdrop-blur-xl shadow-lg ring-1 ring-white/20 ${s.bg} ${s.border} ${s.text}`}>
          <div className="relative flex items-center justify-center">
            {s.pulse && <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${s.dot} ${s.pulse}`} />}
            <span className={`relative inline-flex w-1.5 h-1.5 rounded-full ${s.dot}`} />
          </div>
          {mockup.status}
        </div>

        {/* Version: Floating pill */}
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest border border-white/10 shadow-lg">
          {mockup.version}
        </div>

        {/* Center Hover Action */}
        <div className="absolute inset-0 bg-[var(--primary)]/10 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[var(--primary)] shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
            <Maximize2 size={20} />
          </div>
        </div>
      </div>

      {/* ── Content Section ── */}
      <div className="p-6 flex flex-col flex-1">
        
        {/* Title & Order ID */}
        <div className="flex justify-between items-start mb-4 gap-4">
          <div className="min-w-0">
            <h4 className="font-black text-base text-base-content lowercase first-letter:uppercase tracking-tighter truncate group-hover:text-[var(--primary)] transition-colors">
              {mockup.title || "Untitled Design"}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest">{mockup.type}</span>
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-end">
             <span className="text-[9px] font-black uppercase tracking-widest text-[var(--primary)] bg-[var(--primary)]/5 px-2.5 py-1 rounded-lg border border-[var(--primary)]/10 whitespace-nowrap shadow-sm">
              {orderLabel}
            </span>
          </div>
        </div>

        {/* Client & Metadata */}
        <div className="grid grid-cols-2 gap-4 mb-5 pt-4 border-t border-base-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-base-200 flex items-center justify-center text-base-content/30 group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)] transition-colors">
               <Layers size={14} />
            </div>
            <p className="text-[10px] font-bold text-base-content/60 truncate">{clientName}</p>
          </div>
          <div className="flex items-center gap-2.5 justify-end">
            <p className="text-[10px] font-bold text-base-content/30 uppercase tracking-tighter">{dateStr}</p>
            <Calendar size={12} className="text-base-content/20" />
          </div>
        </div>

        {/* Description / Notes snippet */}
        {mockup.notes && (
          <div className="mb-6 relative">
             <p className="text-[11px] text-base-content/50 line-clamp-2 leading-relaxed italic pl-3 border-l-2 border-base-200 group-hover:border-[var(--primary)]/30 transition-colors">
              "{mockup.notes}"
            </p>
          </div>
        )}

        {/* ── Actions Row ── */}
        <div className="mt-auto pt-5 flex gap-2">
          {mockup.status === "pending" ? (
            <>
              <button
                onClick={() => onStatusChange(mockup.id, "approved")}
                className="btn btn-sm flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md shadow-emerald-500/10 active:scale-95 transition-all"
              >
                <ThumbsUp size={14} /> Approve
              </button>
              <button
                onClick={() => onStatusChange(mockup.id, "rejected")}
                className="btn btn-sm flex-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm active:scale-95 transition-all"
              >
                <ThumbsDown size={14} /> Reject
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onView(mockup)}
                className="btn btn-ghost border-base-200 btn-sm flex-1 text-[10px] font-black uppercase tracking-widest rounded-xl bg-white hover:bg-base-200 transition-all font-sans"
              >
                <Maximize2 size={14} className="mr-1" /> View High Res
              </button>
              <a
                href={mockup.url}
                download
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost border-base-200 btn-sm px-4 bg-white hover:bg-[var(--primary)] hover:text-white text-[var(--primary)] transition-all rounded-xl shadow-sm"
                title="Download Source"
              >
                <Download size={14} />
              </a>
            </>
          )}
          <button
            onClick={() => onDelete(mockup.id)}
            className="btn btn-ghost border-transparent hover:border-rose-200 btn-sm px-3 bg-transparent hover:bg-rose-50 text-base-content/20 hover:text-rose-600 transition-all rounded-xl"
            title="Delete Mockup"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
