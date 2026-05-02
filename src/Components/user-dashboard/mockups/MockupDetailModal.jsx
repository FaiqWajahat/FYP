"use client";
import React, { useState } from "react";
import { X, Check, ThumbsDown, ThumbsUp, AlertCircle, Download, FileText, Clock, Hash, Link2, LogIn } from "lucide-react";

export default function MockupDetailModal({ selectedMockup, setSelectedMockup, statusColors, handleAction }) {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedMockup) return null;

  const dateStr = selectedMockup.created_at
    ? new Date(selectedMockup.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : selectedMockup.date || "N/A";

  const displayId = selectedMockup.orders?.display_id
    ? `ORD-${1000 + selectedMockup.orders.display_id}`
    : selectedMockup.orderId || "—";

  const s = statusColors[selectedMockup.status] || "bg-base-200 text-base-content/40";

  const onAction = async (status) => {
    setIsSubmitting(true);
    try {
      await handleAction(selectedMockup.id, status, status === "rejected" ? feedback : "");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-content/40 backdrop-blur-sm"
      onClick={() => setSelectedMockup(null)}
    >
      <div
        className="bg-base-100 rounded-[2rem] w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-base-200 animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-200 bg-base-50/50 shrink-0">
          <div>
            <h3 className="font-black text-lg uppercase tracking-wide flex items-center gap-3">
              {selectedMockup.title || selectedMockup.type}
              <span className={`text-[10px] px-2.5 py-1 rounded-full border font-black inline-flex items-center gap-1.5 ${s}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${selectedMockup.status === "pending" ? "bg-amber-400" : selectedMockup.status === "approved" ? "bg-emerald-400" : "bg-rose-400"}`} />
                {selectedMockup.status}
              </span>
            </h3>
            <p className="text-[10px] font-mono font-bold text-base-content/40 uppercase tracking-widest mt-1.5">
              Ref: {selectedMockup.id.slice(0, 8)} · Ver: {selectedMockup.version} · Order: {displayId}
            </p>
          </div>
          <button onClick={() => setSelectedMockup(null)} className="btn btn-ghost btn-circle btn-sm text-base-content/20 hover:text-base-content">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Image Area */}
          <div className="flex-1 bg-base-200/40 flex items-center justify-center p-6 overflow-auto min-h-[300px] relative">
            <img 
              src={selectedMockup.url} 
              alt={selectedMockup.type} 
              className="max-w-full max-h-full object-contain rounded-xl drop-shadow-2xl" 
            />
          </div>

          {/* Details Area */}
          <div className="w-full md:w-80 bg-base-100 p-8 flex flex-col border-l border-base-200 overflow-y-auto">
            <p className="text-[10px] font-black uppercase tracking-widest text-base-content/30 mb-6 font-sans">Specifications</p>

            <div className="space-y-6 flex-1">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-base-100 border border-base-200 flex items-center justify-center shrink-0">
                  <Clock size={14} className="text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-base-content/30 mb-0.5">Uploaded on</p>
                  <p className="text-sm font-bold text-base-content italic">{dateStr}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-base-content/30 flex items-center gap-2 mb-2">
                  <FileText size={12} className="text-[var(--primary)]" /> Designer Directives
                </p>
                <div className="bg-base-50 p-4 rounded-2xl text-[12px] text-base-content/70 border border-base-200/60 leading-relaxed font-medium italic">
                  "{selectedMockup.notes || "The designer did not provide specific notes for this mockup version."}"
                </div>
              </div>

              {selectedMockup.status === "pending" && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 text-amber-900 shadow-sm animate-pulse">
                  <AlertCircle size={18} className="text-amber-500 flex-none mt-0.5" />
                  <p className="text-[11px] font-bold leading-snug uppercase tracking-tight">
                    This design requires your formal approval before manufacturing commences.
                  </p>
                </div>
              )}

              {selectedMockup.status === "approved" && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex gap-3 text-emerald-800 shadow-sm">
                  <Check size={18} className="text-emerald-500 flex-none mt-0.5" />
                  <p className="text-[11px] font-bold leading-snug uppercase tracking-tight">
                    You have approved this design. Manufacturing is either cleared or in progress.
                  </p>
                </div>
              )}

              {selectedMockup.status === "rejected" && (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl space-y-3 shadow-sm border-l-4 border-l-rose-400">
                  <div className="flex gap-3">
                    <ThumbsDown size={18} className="text-rose-400 flex-none mt-0.5" />
                    <p className="text-[11px] font-black text-rose-800 uppercase tracking-tight">Changes Requested</p>
                  </div>
                  {selectedMockup.client_feedback && (
                    <p className="text-[11px] text-rose-600 font-bold italic bg-white/50 p-2 rounded-lg">
                      "{selectedMockup.client_feedback}"
                    </p>
                  )}
                </div>
              )}

              {/* Revision Feedback for Rejection */}
              {selectedMockup.status === "pending" && (
                <div className="pt-4 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-base-content/30 hidden sm:block">Revision Request (Optional)</label>
                  <textarea
                    className="textarea textarea-bordered w-full rounded-2xl bg-base-50 focus:border-rose-400 text-xs font-medium placeholder:text-base-content/20 border-base-200 transition-all resize-none"
                    placeholder="Describe needed changes if rejecting..."
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-8 space-y-3 pt-6 border-t border-base-200/60 font-sans">
              {selectedMockup.status === "pending" && (
                <>
                  <button 
                    disabled={isSubmitting}
                    onClick={() => onAction("approved")} 
                    className="btn bg-emerald-600 hover:bg-emerald-700 text-white w-full rounded-[1.2rem] border-none shadow-lg shadow-emerald-500/20 uppercase font-black tracking-widest text-[11px] h-12"
                  >
                    {isSubmitting ? <span className="loading loading-spinner loading-xs" /> : <ThumbsUp size={16} />} Approve & Release
                  </button>
                  <button 
                    disabled={isSubmitting}
                    onClick={() => onAction("rejected")} 
                    className="btn btn-ghost hover:bg-rose-50 text-rose-600 w-full rounded-[1.2rem] border-rose-100 uppercase font-black tracking-widest text-[11px] h-12"
                  >
                    {isSubmitting ? <span className="loading loading-spinner loading-xs" /> : <ThumbsDown size={16} />} Request Revisions
                  </button>
                </>
              )}
              {selectedMockup.status !== "pending" && (
                <button 
                  onClick={() => window.open(selectedMockup.url, "_blank")} 
                  className="btn bg-[var(--primary)] text-white w-full rounded-[1.2rem] border-none shadow-lg shadow-[var(--primary)]/20 uppercase font-black tracking-widest text-[11px] h-12"
                >
                  <Download size={16} className="-mt-0.5" /> Download Asset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
