"use client";
import React from 'react';
import { FileSignature, Palette, PenTool, ClipboardCheck, Scissors, Shirt, CheckCircle, PackageSearch, Truck } from 'lucide-react';

const PHASES = [
  { id: 1, title: 'Design & Tech Pack', desc: 'Vector designs & specs finalized', date: 'Oct 1', status: 'completed', icon: FileSignature },
  { id: 2, title: 'Fabric Sourcing', desc: 'Procuring base fabrics & trims', date: 'Oct 3', status: 'completed', icon: Palette },
  { id: 3, title: 'Pattern Making', desc: 'Creating & grading patterns XS-XXL', date: 'Oct 5', status: 'completed', icon: PenTool },
  { id: 4, title: 'Sampling', desc: 'First physical sample & approval', date: 'Oct 8', status: 'completed', icon: ClipboardCheck },
  { id: 5, title: 'Bulk Cutting', desc: 'Spreading and cutting fabric lots', date: 'Oct 10', status: 'completed', icon: Scissors },
  { id: 6, title: 'Printing & Embroidery', desc: 'Applying logos and sub-prints', activeDesc: 'Sublimation printing panels (45%)', completion: 45, date: 'Oct 12', status: 'current', icon: Shirt },
  { id: 7, title: 'Stitching & Assembly', desc: 'Final sewing construction', status: 'upcoming', icon: CheckCircle },
  { id: 8, title: 'Finishing & QA', desc: 'Trimming, pressing & quality check', status: 'upcoming', icon: PackageSearch },
  { id: 9, title: 'Packaging & Dispatch', desc: 'Bagging, labeling & shipment', status: 'upcoming', icon: Truck },
];

export default function DeepProductionTracker() {
  return (
    <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden flex flex-col font-sans">
      <div className="p-5 border-b border-base-200/60 bg-base-100/30 flex justify-between items-center shrink-0">
        <h3 className="text-sm font-semibold tracking-wider uppercase text-base-content/80">Production Tracking</h3>
        <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-base-200/50 text-[10px] uppercase font-bold tracking-widest text-base-content/80 border border-base-200 shadow-sm relative">
          <span className="w-1.5 h-1.5 rounded-full animate-ping absolute" style={{ backgroundColor: 'var(--primary)' }}></span>
          <span className="w-1.5 h-1.5 rounded-full z-10" style={{ backgroundColor: 'var(--primary)' }}></span>
          Active: Printing
        </span>
      </div>

      <div className="p-6 md:p-8 flex-grow">
        <ul className="steps steps-vertical w-full -ml-2">
          {PHASES.map((phase) => {
            const Icon = phase.icon;
            const isCompleted = phase.status === 'completed';
            const isCurrent = phase.status === 'current';
            const isUpcoming = phase.status === 'upcoming';

            return (
              <li
                key={phase.id}
                className={`step step-xs ${isCompleted || isCurrent ? 'step-info' : 'text-base-content/20'}`}
                style={{ '--p': isCompleted || isCurrent ? 'var(--primary)' : '' }}
                data-content={isCompleted ? "✓" : isCurrent ? "●" : ""}
              >
                <div className={`text-left ml-4 mb-5 w-full ${isUpcoming ? 'opacity-40' : 'opacity-100'}`}>
                  <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center w-full gap-2">
                    <div className="flex-grow">
                      <h4 className={`text-[16px] font-bold flex items-center gap-2 ${isCurrent ? '' : isUpcoming ? 'text-base-content/60' : 'text-base-content'}`} style={{ color: isCurrent ? 'var(--primary)' : '' }}>
                        <Icon size={14} style={{ color: isCompleted || isCurrent ? 'var(--primary)' : 'inherit' }} className={`shrink-0 ${isUpcoming ? 'text-base-content/40' : ''}`} />
                        <span className="truncate">{phase.title}</span>
                      </h4>
                      <p className="text-[11px] mt-0.5 max-w-[260px] lg:max-w-sm text-base-content/60 tracking-wide font-medium truncate">
                        {isCurrent ? phase.activeDesc : phase.desc}
                      </p>
                    </div>

                    {!isUpcoming && (
                      <span className="w-max shrink-0 text-[10px] font-mono bg-base-100/50 px-2 py-0.5 rounded border border-base-200/60 text-base-content/50 uppercase tracking-widest relative top-0 xl:-top-2">
                        {phase.date}
                      </span>
                    )}
                  </div>

                  {isCurrent && (
                    <div className="mt-3 bg-base-200/30 p-3 rounded-lg border border-base-200/60 w-full xl:w-5/6">
                      <div className="flex justify-between items-center mb-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
                        <span>Progress</span>
                        <span>{phase.completion}%</span>
                      </div>
                      <div className="w-full bg-base-300 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full transition-all duration-500" style={{ width: `${phase.completion}%`, backgroundColor: 'var(--primary)' }}></div>
                      </div>
                      <p className="text-[10px] text-base-content/50 mt-2 font-mono flex items-center gap-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
                        ETA: 3 Days
                      </p>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: var(--fallback-bc,oklch(var(--bc)/0.2));
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
