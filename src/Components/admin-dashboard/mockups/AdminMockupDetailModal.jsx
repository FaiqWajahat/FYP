"use client";
import React, { useState } from "react";
import {
  X, Download, ThumbsUp, ThumbsDown, Check,
  AlertCircle, ExternalLink, Tag, Clock, User, Link2
} from "lucide-react";
import toast from "react-hot-toast";

const STATUS_STYLE = {
  pending:  { bg: "bg-amber-50",   border: "border-amber-200",  text: "text-amber-700",   dot: "bg-amber-400" },
  approved: { bg: "bg-emerald-50", border: "border-emerald-200",text: "text-emerald-700", dot: "bg-emerald-400" },
  rejected: { bg: "bg-rose-50",    border: "border-rose-200",   text: "text-rose-600",    dot: "bg-rose-400" },
};

export default function AdminMockupDetailModal({ mockup, onClose, onStatusChange }) {
  const [loading, setLoading] = useState(false);
  if (!mockup) return null;

  const s = STATUS_STYLE[mockup.status] || STATUS_STYLE.pending;
  const orderLabel = mockup.orders?.display_id
    ? `ORD-${1000 + mockup.orders.display_id}`
    : mockup.order_id?.slice(0, 8).toUpperCase() || "—";

  const handleStatus = async (newStatus) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/mockups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: mockup.id, status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success(`Mockup marked as ${newStatus}`);
      onStatusChange?.(mockup.id, newStatus);
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-content/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-base-100 rounded-[2rem] w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-base-200 animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between p-6 border-b border-base-200 bg-base-50/50 shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="font-black text-lg uppercase tracking-wide flex items-center gap-3">
                {mockup.title}
                <span className={`text-[10px] px-2.5 py-1 rounded-full border font-black inline-flex items-center gap-1.5 ${s.bg} ${s.border} ${s.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {mockup.status}
                </span>
              </h3>
              <div className="flex items-center gap-4 text-[10px] mt-1.5 text-base-content/40 font-mono uppercase tracking-widest">
                <span>{mockup.type}</span>
                <span>·</span>
                <span>{mockup.version}</span>
                <span>·</span>
                <span className="text-[var(--primary)]">{orderLabel}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm text-base-content/30 hover:text-base-content">
            <X size={20} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

          {/* Image Panel */}
          <div className="flex-1 bg-base-200/30 flex items-center justify-center p-6 overflow-auto min-h-[280px]">
            <img
              src={mockup.url}
              alt={mockup.title}
              className="max-w-full max-h-[600px] object-contain rounded-xl drop-shadow-xl"
            />
          </div>

          {/* Details Panel */}
          <div className="w-full md:w-80 bg-base-100 p-7 flex flex-col border-l border-base-200 overflow-y-auto">
            <p className="text-[10px] font-black uppercase tracking-widest text-base-content/30 mb-5">Mockup Details</p>

            <div className="space-y-5 flex-1">

              {/* Meta grid */}
              {[
                { icon: Clock,  label: "Uploaded",    value: new Date(mockup.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
                { icon: Tag,    label: "Type",         value: mockup.type },
                { icon: Hash,   label: "Version",      value: mockup.version },
                { icon: User,   label: "Client",       value: mockup.profiles?.full_name || "—" },
                { icon: Link2,  label: "Linked Order", value: orderLabel, highlight: true },
              ].map(({ icon: Icon, label, value, highlight }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-base-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={13} className="text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30 mb-0.5">{label}</p>
                    <p className={`text-sm font-bold ${highlight ? "text-[var(--primary)]" : "text-base-content"}`}>{value}</p>
                  </div>
                </div>
              ))}

              {/* Designer Notes */}
              {mockup.notes && (
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30 mb-2">Designer Notes</p>
                  <div className="bg-base-200/50 p-3 rounded-xl text-[12px] text-base-content/70 border border-base-200 leading-relaxed italic">
                    "{mockup.notes}"
                  </div>
                </div>
              )}

              {/* Client Feedback */}
              {mockup.client_feedback && (
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30 mb-2">Client Feedback</p>
                  <div className="bg-rose-50 p-3 rounded-xl text-[12px] text-rose-700 border border-rose-100 leading-relaxed italic">
                    "{mockup.client_feedback}"
                  </div>
                </div>
              )}

              {/* Status hint banners */}
              {mockup.status === "pending" && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex gap-2 items-start">
                  <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold text-amber-700">Awaiting review. Approve or reject to notify the client.</p>
                </div>
              )}
              {mockup.status === "approved" && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex gap-2 items-start">
                  <Check size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold text-emerald-700">Approved. Manufacturing may proceed with this design.</p>
                </div>
              )}
              {mockup.status === "rejected" && (
                <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex gap-2 items-start">
                  <ThumbsDown size={15} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold text-rose-600">Rejected. Upload a revised version when ready.</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3 pt-5 border-t border-base-200/60">
              <a
                href={mockup.url}
                download
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm w-full rounded-xl uppercase tracking-widest font-black text-[10px] border-base-200 gap-2"
              >
                <Download size={14} /> Download Full Res
              </a>
              <a
                href={mockup.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost btn-sm w-full rounded-xl uppercase tracking-widest font-black text-[10px] border-base-200 gap-2"
              >
                <ExternalLink size={14} /> Open in New Tab
              </a>

              {mockup.status === "pending" && (
                <div className="flex gap-2 pt-1">
                  <button
                    disabled={loading}
                    onClick={() => handleStatus("approved")}
                    className="btn btn-success btn-sm flex-1 rounded-xl uppercase font-black tracking-widest text-[10px] gap-1"
                  >
                    <ThumbsUp size={13} /> Approve
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => handleStatus("rejected")}
                    className="btn btn-error btn-outline btn-sm flex-1 rounded-xl uppercase font-black tracking-widest text-[10px] gap-1"
                  >
                    <ThumbsDown size={13} /> Reject
                  </button>
                </div>
              )}

              {mockup.status !== "pending" && (
                <button
                  disabled={loading}
                  onClick={() => handleStatus("pending")}
                  className="btn btn-ghost btn-sm w-full rounded-xl uppercase font-black tracking-widest text-[10px] border-base-200"
                >
                  Reset to Pending
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Missing import fix
function Hash({ size, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/>
      <line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>
    </svg>
  );
}
