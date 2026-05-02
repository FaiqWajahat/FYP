"use client";
import React from "react";
import { Eye, ThumbsUp, ThumbsDown, Maximize2, Download, Clock, Image as ImageIcon, CheckCircle2 } from "lucide-react";

export default function MockupCard({ mockup, statusColors, handleAction, setSelectedMockup }) {
  // Normalize date and display ID
  const dateStr = mockup.created_at
    ? new Date(mockup.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : mockup.date || "N/A";

  const displayId = mockup.orders?.display_id
    ? `ORD-${1000 + mockup.orders.display_id}`
    : mockup.orderId || "—";

  // Handle status specific styling
  const isPending = mockup.status === "pending";
  const isApproved = mockup.status === "approved";
  const isRejected = mockup.status === "rejected";

  const statusStyle = isPending
    ? "bg-amber-50/90 text-amber-700 border-amber-200/50"
    : isApproved
      ? "bg-emerald-50/90 text-emerald-700 border-emerald-200/50"
      : "bg-rose-50/90 text-rose-700 border-rose-200/50";

  return (
    <div className="group flex flex-col bg-base-100 rounded-[2rem] shadow-sm hover:shadow-2xl border border-base-200 transition-all duration-700 hover:-translate-y-2 overflow-hidden h-full">

      {/* ── Visual Section ── */}
      <div
        className="relative aspect-[4/3] w-full bg-base-200 overflow-hidden cursor-pointer"
        onClick={() => setSelectedMockup(mockup)}
      >
        <img
          src={mockup.url}
          alt={mockup.title || mockup.type}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />

        {/* Dynamic Status Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Glassmorphism Badge */}
        <div className={`absolute top-5 left-5 px-3.5 py-1.5 rounded-full backdrop-blur-xl border text-[9px] font-black uppercase tracking-[0.15em] shadow-xl ring-1 ring-white/20 transition-all duration-500 group-hover:scale-105 ${statusStyle}`}>
          <div className="flex items-center gap-1.5">
            {isPending && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
            {isApproved && <CheckCircle2 size={10} className="text-emerald-500" />}
            {mockup.status}
          </div>
        </div>

        {/* Version Badge */}
        <div className="absolute top-5 right-5 px-3 py-1.5 rounded-2xl bg-black/40 backdrop-blur-lg text-white text-[9px] font-black uppercase tracking-widest border border-white/10 shadow-xl transition-all group-hover:bg-[var(--primary)] group-hover:border-transparent">
          {mockup.version}
        </div>

        {/* Quick View Trigger */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[1px] flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[var(--primary)] shadow-2xl scale-50 group-hover:scale-100 transition-all duration-500 hover:bg-[var(--primary)] hover:text-white">
            <Maximize2 size={24} />
          </div>
        </div>
      </div>

      {/* ── Information Section ── */}
      <div className="p-7 flex flex-col flex-1">

        {/* Title & Category Line */}
        <div className="flex justify-between items-start mb-4">
          <div className="min-w-0">
            <h4 className="font-black text-base text-base-content lowercase first-letter:uppercase tracking-tighter truncate leading-tight group-hover:text-[var(--primary)] transition-colors">
              {mockup.title || mockup.type}
            </h4>
            <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest mt-1 block">
              {mockup.type}
            </span>
          </div>
          <div className="shrink-0">
            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--primary)] bg-[var(--primary)]/5 px-3 py-1.5 rounded-xl border border-[var(--primary)]/15 shadow-sm">
              {displayId}
            </span>
          </div>
        </div>

        {/* Meta Info Grid */}
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-base-100/50 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-base-100 border border-base-200 flex items-center justify-center text-base-content/20 group-hover:text-[var(--primary)] group-hover:border-[var(--primary)]/20 transition-all duration-500">
              <Clock size={14} />
            </div>
            <p className="text-[10px] font-black text-base-content/40 uppercase tracking-tighter">{dateStr}</p>
          </div>
          <div className="flex items-center gap-2.5 justify-end">
            <div className="w-8 h-8 rounded-xl bg-base-100 border border-base-200 flex items-center justify-center text-base-content/20">
              <ImageIcon size={14} />
            </div>
          </div>
        </div>

        {/* Narrative / Notes snippet */}
        <div className="relative mb-6">
          <p className="text-[11px] text-base-content/40 font-medium leading-relaxed italic line-clamp-2 pl-4 border-l-2 border-base-200 group-hover:border-[var(--primary)]/40 transition-colors">
            {mockup.notes || "The design team has uploaded this version for your review."}
          </p>
        </div>

        {/* ── Action Integration ── */}
        <div className="mt-auto pt-4 flex gap-3 font-sans">
          {isPending ? (
            <>
              <button
                onClick={() => handleAction(mockup.id, "approved")}
                className="btn btn-sm h-11 flex-1 bg-[var(--primary)] hover:brightness-110 text-white border-none rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[var(--primary)]/20 active:scale-95 transition-all"
              >
                <ThumbsUp size={14} /> Approve Design
              </button>
              <button
                onClick={() => handleAction(mockup.id, "rejected")}
                className="btn btn-sm h-11 flex-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-100 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest shadow-sm active:scale-95 transition-all"
              >
                <ThumbsDown size={14} /> Reject
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setSelectedMockup(mockup)}
                className="btn btn-sm h-11 flex-[2] bg-base-100 hover:bg-base-200 border-base-200 text-base-content/70 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest shadow-sm transition-all"
              >
                <Eye size={16} /> Full Specifications
              </button>
              {isApproved && (
                <button
                  onClick={(e) => { e.stopPropagation(); window.open(mockup.url, "_blank"); }}
                  className="btn btn-sm h-11 px-4 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border-emerald-100/50 rounded-[1.2rem] shadow-sm transition-all"
                  title="Download Final Asset"
                >
                  <Download size={16} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
