"use client";
import React from 'react';
import {
  FileSignature, Palette, PenTool, ClipboardCheck, Scissors,
  Shirt, CheckCircle, PackageSearch, Truck, ChevronRight
} from 'lucide-react';

const PHASES = [
  {
    id: 1, title: 'Design & Tech Pack',
    desc: 'Vector designs & specs finalized',
    date: 'Oct 1', status: 'completed', icon: FileSignature,
  },
  {
    id: 2, title: 'Fabric Sourcing',
    desc: 'Procuring base fabrics & trims',
    date: 'Oct 3', status: 'completed', icon: Palette,
  },
  {
    id: 3, title: 'Pattern Making',
    desc: 'Creating & grading patterns XS–XXL',
    date: 'Oct 5', status: 'completed', icon: PenTool,
  },
  {
    id: 4, title: 'Sampling',
    desc: 'First physical sample & approval',
    date: 'Oct 8', status: 'completed', icon: ClipboardCheck,
  },
  {
    id: 5, title: 'Bulk Cutting',
    desc: 'Spreading and cutting fabric lots',
    date: 'Oct 10', status: 'completed', icon: Scissors,
  },
  {
    id: 6, title: 'Printing & Embroidery',
    desc: 'Applying logos and sub-prints',
    activeDesc: 'Sublimation printing panels (45%)',
    completion: 45,
    date: 'Oct 12',
    eta: '3 Days',
    status: 'current',
    icon: Shirt,
  },
  {
    id: 7, title: 'Stitching & Assembly',
    desc: 'Final sewing construction',
    status: 'upcoming', icon: CheckCircle,
  },
  {
    id: 8, title: 'Finishing & QA',
    desc: 'Trimming, pressing & quality check',
    status: 'upcoming', icon: PackageSearch,
  },
  {
    id: 9, title: 'Packaging & Dispatch',
    desc: 'Bagging, labeling & shipment',
    status: 'upcoming', icon: Truck,
  },
];

export default function DeepProductionTracker() {
  const completedCount = PHASES.filter(p => p.status === 'completed').length;
  const totalCount = PHASES.length;

  return (
    <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden flex flex-col font-sans">
      {/* Header */}
      <div className="p-5 border-b border-base-200/60 flex justify-between items-center shrink-0">
        <div>
          <h3 className="text-sm font-bold tracking-wider uppercase text-base-content/80">
            Production Tracking
          </h3>
          <p className="text-[11px] text-base-content/40 mt-0.5 font-mono">
            {completedCount} of {totalCount} phases complete
          </p>
        </div>
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] uppercase font-bold tracking-wider border"
          style={{
            color: 'var(--primary)',
            backgroundColor: 'color-mix(in srgb, var(--primary) 8%, transparent)',
            borderColor: 'color-mix(in srgb, var(--primary) 25%, transparent)',
          }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--primary)' }} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: 'var(--primary)' }} />
          </span>
          Active: Printing
        </span>
      </div>

      {/* Overall Progress Bar */}
      <div className="px-6 pt-4 pb-2">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/40">Overall Progress</span>
          <span className="text-[10px] font-bold font-mono" style={{ color: 'var(--primary)' }}>
            {Math.round((completedCount / totalCount) * 100)}%
          </span>
        </div>
        <div className="w-full bg-base-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.round((completedCount / totalCount) * 100)}%`,
              background: 'linear-gradient(90deg, var(--primary), color-mix(in srgb, var(--primary) 70%, #a855f7))',
            }}
          />
        </div>
      </div>

      {/* Custom Timeline */}
      <div className="px-6 py-5 flex-grow">
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[17px] top-2 bottom-2 w-[2px] bg-base-200" />

          <ul className="space-y-0">
            {PHASES.map((phase, idx) => {
              const Icon = phase.icon;
              const isCompleted = phase.status === 'completed';
              const isCurrent = phase.status === 'current';
              const isUpcoming = phase.status === 'upcoming';
              const isLast = idx === PHASES.length - 1;

              return (
                <li key={phase.id} className={`relative flex gap-4 ${isLast ? '' : 'pb-6'}`}>
                  {/* Icon Circle */}
                  <div className="relative z-10 shrink-0">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted
                          ? 'border-transparent'
                          : isCurrent
                          ? 'border-transparent shadow-lg'
                          : 'border-base-200 bg-base-100'
                      }`}
                      style={
                        isCompleted
                          ? { backgroundColor: 'var(--primary)', boxShadow: 'none' }
                          : isCurrent
                          ? {
                              backgroundColor: 'color-mix(in srgb, var(--primary) 12%, transparent)',
                              borderColor: 'var(--primary)',
                              boxShadow: '0 0 0 4px color-mix(in srgb, var(--primary) 15%, transparent)',
                            }
                          : {}
                      }
                    >
                      <Icon
                        size={14}
                        className={isUpcoming ? 'text-base-content/25' : ''}
                        style={
                          isCompleted
                            ? { color: 'white' }
                            : isCurrent
                            ? { color: 'var(--primary)' }
                            : {}
                        }
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 min-w-0 pt-1.5 ${isUpcoming ? 'opacity-40' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`text-[13px] font-bold leading-tight truncate ${
                            isCurrent ? '' : isUpcoming ? 'text-base-content/60' : 'text-base-content'
                          }`}
                          style={isCurrent ? { color: 'var(--primary)' } : {}}
                        >
                          {phase.title}
                        </h4>
                        <p className="text-[11px] text-base-content/50 mt-0.5 font-medium truncate">
                          {isCurrent ? phase.activeDesc : phase.desc}
                        </p>
                      </div>

                      {!isUpcoming && (
                        <div className="shrink-0 text-right">
                          <span className="text-[10px] font-mono bg-base-200/60 px-2 py-0.5 rounded border border-base-200/60 text-base-content/50 uppercase tracking-widest">
                            {phase.date}
                          </span>
                          {isCompleted && (
                            <p className="text-[9px] text-success font-bold uppercase tracking-wider mt-1 text-right">Done</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Active Phase Progress Bar */}
                    {isCurrent && (
                      <div className="mt-3 bg-base-200/40 rounded-lg border border-base-200/60 p-3">
                        <div className="flex justify-between items-center mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
                          <span>Phase Progress</span>
                          <span>{phase.completion}%</span>
                        </div>
                        <div className="w-full bg-base-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${phase.completion}%`,
                              background: 'linear-gradient(90deg, var(--primary), color-mix(in srgb, var(--primary) 70%, #a855f7))',
                            }}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-[10px] text-base-content/40 font-mono">ETA: {phase.eta}</p>
                          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--primary)' }}>
                            In Progress
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
