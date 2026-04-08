"use client";
import React from "react";
import Link from "next/link";
import { ShoppingBag, ChevronRight, ArrowLeft, Save } from "lucide-react";

const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Pricing & Stock" },
  { id: 3, label: "Details" },
  { id: 4, label: "Media" },
];

export default function ProductFormHeader({ activeStep = 1, onSaveDraft, saving }) {
  return (
    <div className="bg-base-100/95 backdrop-blur-xl border-b rounded-xl border-base-content/5 px-6 py-4 sticky top-0 z-40 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">

        {/* Left: Branding & Title */}
        <div className="flex items-center gap-4 text-base-content">
          <Link
            href="/Dashboard/Products/All"
            className="p-2 rounded-xl border border-base-content/10 text-base-content/40 hover:text-base-content hover:bg-base-200 transition-colors"
            title="Back to Products"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="hidden sm:flex w-[1px] h-8 bg-base-content/10"></div>

          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-base-content/40 tracking-widest uppercase mb-0.5">
              <Link href="/Dashboard" className="hover:text-[var(--primary)] transition-colors">Dashboard</Link>
              <ChevronRight className="w-3 h-3 opacity-50" />
              <Link href="/Dashboard/Products/All" className="hover:text-[var(--primary)] transition-colors">Products</Link>
            </div>
            <h1 className="text-lg font-black text-base-content leading-none tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" style={{ color: "var(--primary)" }} /> Add New Product
            </h1>
          </div>
        </div>

        {/* Center: Step Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {STEPS.map((step, i) => {
            const done = step.id < activeStep;
            const active = step.id === activeStep;
            return (
              <React.Fragment key={step.id}>
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all duration-500 relative overflow-hidden ${active
                      ? "text-[var(--primary)] shadow-sm border"
                      : done
                        ? "text-base-content/70 border border-base-content/10 bg-base-200"
                        : "text-base-content/40 border border-transparent opacity-60"
                    }`}
                  style={active ? { borderColor: "color-mix(in srgb, var(--primary) 20%, transparent)", backgroundColor: "color-mix(in srgb, var(--primary) 5%, transparent)" } : {}}
                >
                  <span
                    className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-black transition-colors duration-500 ${active
                        ? "bg-[var(--primary)] text-white shadow-sm"
                        : done
                          ? "bg-base-300 text-base-content/60"
                          : "bg-base-200 text-base-content/40"
                      }`}
                  >
                    {done ? "✓" : step.id}
                  </span>
                  {active && <span className="mr-0.5">{step.label}</span>}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 min-w-[12px] rounded-full transition-all duration-700 ${done ? "bg-base-content/20" : "bg-base-200"
                      }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 hidden sm:flex">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 border border-base-content/10 hover:bg-base-200 text-base-content/60 active:scale-95"
          >
            <Save className="w-3.5 h-3.5" style={!saving ? { color: "var(--primary)" } : {}} />
            {saving ? "SAVING…" : "QUICK DRAFT"}
          </button>
        </div>
      </div>
    </div>
  );
}
