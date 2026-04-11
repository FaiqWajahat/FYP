"use client";
import React from 'react';
import {
  FileSignature, Palette, PenTool, ClipboardCheck, Scissors,
  Shirt, Settings, PackageSearch, Truck, CheckCircle2, Home
} from 'lucide-react';

const PHASES = [
  { id: 1, title: 'Design & Tech Pack', icon: FileSignature, desc: 'Finalizing vector artwork and garment specs' },
  { id: 2, title: 'Fabric Sourcing', icon: Palette, desc: 'Procuring base fabrics, trims, and zippers' },
  { id: 3, title: 'Pattern Making', icon: PenTool, desc: 'Developing master patterns and size grading' },
  { id: 4, title: 'Sampling', icon: ClipboardCheck, desc: 'First physical sample production and photos' },
  { id: 5, title: 'Bulk Cutting', icon: Scissors, desc: 'Layering and precision cutting of fabric lots' },
  { id: 6, title: 'Printing & Embroidery', icon: Shirt, desc: 'Applying logos, prints, and brand labels' },
  { id: 7, title: 'Stitching & Assembly', icon: Settings, desc: 'Final garment construction and sewing' },
  { id: 8, title: 'Finishing & QA', icon: PackageSearch, desc: 'Trimming, pressing, and 100% quality audit' },
  { id: 9, title: 'Packaging & Dispatch', icon: Truck, desc: 'Bagging, labeling, and handover to courier' },
  { id: 10, title: 'Delivered / Complete', icon: Home, desc: 'Order successfully fulfilled and shipped' },
];

export default function AdminOrderPhases({ currentStage = 1, onAdvance }) {
  return (
    <div className="bg-base-100 rounded-xl border border-base-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-base-200/50 border-b border-base-200">
        <h3 className="text-xs font-black uppercase tracking-widest text-base-content/60">Manufacturing Pipeline</h3>
      </div>
      <div className="p-5 flex flex-col gap-6">
        {PHASES.map((phase, idx) => {
          const Icon = phase.icon;
          const isCompleted = phase.id < currentStage;
          const isCurrent = phase.id === currentStage;
          const isUpcoming = phase.id > currentStage;

          return (
            <div key={phase.id} className="relative flex gap-4 group">
              {/* Connector */}
              {idx < PHASES.length - 1 && (
                <div className={`absolute left-[17px] top-9 w-[2px] h-6 ${isCompleted ? 'bg-[var(--primary)]' : 'bg-base-200'}`} />
              )}

              {/* Icon Circle */}
              <div className="relative z-10 shrink-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${isCompleted ? 'bg-[var(--primary)] border-[var(--primary)] text-white' :
                    isCurrent ? 'bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)] shadow-sm' :
                      'bg-base-100 border-base-200 text-base-content/30'
                  }`}>
                  {isCompleted ? <CheckCircle2 size={16} strokeWidth={3} /> : <Icon size={16} />}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-bold ${isCurrent ? 'text-[var(--primary)]' : isUpcoming ? 'text-base-content/40' : 'text-base-content'}`}>
                    {phase.title}
                  </h4>
                  {isCurrent && (
                    <button
                      onClick={() => onAdvance(phase.id + 1)}
                      className="btn btn-xs bg-[var(--primary)] text-white border-none font-black uppercase tracking-tighter rounded-md h-7 px-3 hover:brightness-110"
                    >
                      Mark Complete
                    </button>
                  )}
                  {isCompleted && (
                    <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">Done</span>
                  )}
                </div>
                <p className={`text-[10px] mt-0.5 leading-relaxed ${isUpcoming ? 'text-base-content/25' : 'text-base-content/50'}`}>
                  {phase.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
