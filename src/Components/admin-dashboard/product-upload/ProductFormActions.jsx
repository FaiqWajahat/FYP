"use client";
import React from "react";
import { Send, Save, ArrowLeft, RefreshCcw, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ProductFormActions({
  onPublish,
  onSaveDraft,
  onReset,
  isSubmitting,
  isDrafting,
  errorCount
}) {
  return (
    <div className=" bg-base-100/95 backdrop-blur-xl border-t border-base-content/10 shadow-[0_-20px_40px_rgb(0,0,0,0.03)] transition-all mt-8 rounded-t-2xl lg:rounded-lg">
      <div className="w-full mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left side: Validation info */}
        <div className="flex items-center gap-4">
          {errorCount > 0 ? (
            <div className="flex items-center gap-2 bg-error/10 text-error py-2 px-4 rounded-xl font-bold text-xs shadow-sm border border-error/20">
              <AlertTriangle className="w-4 h-4" /> {errorCount} Fields need attention
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-success/10 text-success py-2 px-4 rounded-xl font-bold text-xs shadow-sm border border-success/20">
              <CheckCircle2 className="w-4 h-4" /> Ready to Publish
            </div>
          )}
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-2 rounded-lg gap-1.5 text-base-content/40 hover:text-base-content hover:bg-base-200 active:scale-95 transition-all text-xs font-black uppercase tracking-widest flex items-center"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        {/* Right side: Primary Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/admin/Products/All"
            className="px-6 py-3 rounded-xl border border-transparent text-base-content/50 font-bold text-xs hover:bg-base-200 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> CANCEL
          </Link>

          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isDrafting || isSubmitting}
            className="px-6 py-3 rounded-xl border-2 font-bold text-xs transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 bg-base-100 hover:bg-base-200 shadow-sm"
            style={{ color: "var(--primary)", borderColor: "color-mix(in srgb, var(--primary) 30%, transparent)" }}
          >
            {isDrafting ? <span className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></span> : <Save className="w-4 h-4" />}
            SAVE DRAFT
          </button>

          <button
            type="button"
            onClick={onPublish}
            disabled={isSubmitting || isDrafting || errorCount > 0}
            className="px-8 py-3 rounded-xl text-white font-bold text-xs shadow-lg shadow-[var(--primary)]/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 border border-transparent hover:brightness-110"
            style={{ background: "var(--primary)" }}
          >
            {isSubmitting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <Send className="w-4 h-4" />}
            PUBLISH PRODUCT
          </button>
        </div>
      </div>
    </div>
  );
}
