"use client";
import React from "react";
import {
  ThumbsUp, ThumbsDown, Trash2, Download, Maximize2,
  CheckCircle2, XCircle, Hourglass, User2, Sparkles
} from "lucide-react";

const STATUS_CONFIG = {
  pending: {
    label: "Awaiting Review",
    icon: <Hourglass size={10} />,
    badge: "bg-amber-400/20 text-amber-600 border-amber-400/30",
    glow: "",
    dot: "bg-amber-400 animate-pulse",
    bar: "from-amber-400 to-orange-400",
  },
  approved: {
    label: "Approved",
    icon: <CheckCircle2 size={10} />,
    badge: "bg-emerald-400/20 text-emerald-600 border-emerald-400/30",
    glow: "",
    dot: "bg-emerald-400",
    bar: "from-emerald-400 to-teal-400",
  },
  rejected: {
    label: "Changes Needed",
    icon: <XCircle size={10} />,
    badge: "bg-rose-400/20 text-rose-600 border-rose-400/30",
    glow: "",
    dot: "bg-rose-400",
    bar: "from-rose-400 to-pink-400",
  },
};

// Helper: initials from name
function Initials({ name }) {
  const parts = (name || "?").trim().split(" ");
  const initials = parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : parts[0].slice(0, 2);
  return (
    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center shrink-0">
      <span className="text-[9px] font-black uppercase text-[var(--primary)]">{initials.toUpperCase()}</span>
    </div>
  );
}

export default function AdminMockupCard({ mockup, onView, onStatusChange, onDelete }) {
  const cfg = STATUS_CONFIG[mockup.status] || STATUS_CONFIG.pending;
  const isPending = mockup.status === "pending";

  const orderLabel = mockup.orders?.display_id
    ? `ORD-${1000 + mockup.orders.display_id}`
    : mockup.order_id?.slice(0, 8).toUpperCase() || "—";

  const clientName = mockup.profiles?.full_name || "Unknown Client";
  const dateStr = new Date(mockup.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="group flex flex-col bg-base-100 rounded-3xl border border-base-200/80 overflow-hidden h-full transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/5"
      style={{ boxShadow: "0 2px 16px 0 rgba(0,0,0,0.06)" }}
    >
      {/* ── Accent top bar ── */}
      <div className={`h-0.5 w-full bg-gradient-to-r ${cfg.bar} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* ── Image Section ── */}
      <div
        className="relative aspect-[3/2] w-full bg-gradient-to-br from-base-200 to-base-300 overflow-hidden cursor-pointer"
        onClick={() => onView(mockup)}
      >
        <img
          src={mockup.url}
          alt={mockup.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Status badge – top left */}
        <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-xl border text-[9px] font-extrabold uppercase tracking-widest shadow-md ${cfg.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </div>

        {/* Version pill – top right */}
        {mockup.version && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest border border-white/10 shadow">
            {mockup.version}
          </div>
        )}

        {/* Centre expand button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
          <div className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-[var(--primary)] shadow-xl scale-75 group-hover:scale-100 transition-transform duration-400">
            <Maximize2 size={20} />
          </div>
        </div>

        {/* Bottom hover strip */}
        <div className="absolute bottom-0 inset-x-0 px-4 pb-3 pt-6 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-400">
          <span className="text-white text-[10px] font-bold uppercase tracking-widest drop-shadow">{dateStr}</span>
          <span className="text-white/70 text-[9px] font-medium drop-shadow">{orderLabel}</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-5 gap-4">

        {/* Title + Order ID */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="font-black text-sm text-base-content tracking-tight truncate leading-snug group-hover:text-[var(--primary)] transition-colors duration-300">
              {mockup.title || "Untitled Design"}
            </h4>
            <p className="text-[10px] font-semibold text-base-content/40 uppercase tracking-widest mt-0.5">
              {mockup.type}
            </p>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[var(--primary)] bg-[var(--primary)]/8 px-2.5 py-1 rounded-xl border border-[var(--primary)]/15">
            <Sparkles size={8} />
            {orderLabel}
          </span>
        </div>

        {/* Client row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Initials name={clientName} />
            <div>
              <p className="text-[11px] font-bold text-base-content/80 leading-none">{clientName}</p>
              <p className="text-[9px] font-medium text-base-content/35 uppercase tracking-widest mt-0.5">Client</p>
            </div>
          </div>
          <p className="text-[9px] font-semibold text-base-content/30 uppercase tracking-widest">{dateStr}</p>
        </div>

        {/* Notes */}
        {mockup.notes && (
          <p className="text-[11px] text-base-content/50 leading-relaxed line-clamp-2 italic border-l-2 border-base-200 group-hover:border-[var(--primary)]/40 pl-3 transition-colors duration-300">
            {mockup.notes}
          </p>
        )}

        {/* Divider */}
        <div className="border-t border-base-200/60" />

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          {isPending ? (
            <>
              <button
                onClick={() => onStatusChange(mockup.id, "approved")}
                className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-[10px] font-black uppercase tracking-widest shadow-md shadow-emerald-500/20 transition-all duration-200"
              >
                <ThumbsUp size={13} /> Approve
              </button>
              <button
                onClick={() => onStatusChange(mockup.id, "rejected")}
                className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-white hover:bg-rose-50 active:scale-95 text-rose-500 border border-rose-200/70 text-[10px] font-black uppercase tracking-widest shadow-sm transition-all duration-200"
              >
                <ThumbsDown size={13} /> Reject
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onView(mockup)}
                className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-base-200/60 hover:bg-base-200 active:scale-95 text-base-content/70 text-[10px] font-black uppercase tracking-widest transition-all duration-200"
              >
                <Maximize2 size={13} /> View Details
              </button>
              <a
                href={mockup.url}
                download
                target="_blank"
                rel="noreferrer"
                className="h-9 px-3.5 flex items-center justify-center rounded-xl bg-base-200/60 hover:bg-[var(--primary)] active:scale-95 text-base-content/50 hover:text-white border border-base-200/60 shadow-sm transition-all duration-200"
                title="Download"
              >
                <Download size={14} />
              </a>
            </>
          )}
          <button
            onClick={() => onDelete(mockup.id)}
            className="h-9 px-3 flex items-center justify-center rounded-xl bg-transparent hover:bg-rose-50 active:scale-95 text-base-content/20 hover:text-rose-500 border border-transparent hover:border-rose-200/60 transition-all duration-200"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
