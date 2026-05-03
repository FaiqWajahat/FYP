"use client";
import React, { useState } from 'react';
import { 
  FileSignature, Palette, PenTool, ClipboardCheck, Scissors, 
  Shirt, CheckCircle, PackageSearch, Truck, PlayCircle,
  AlertTriangle, Lock, ShieldCheck, ChevronLeft, Home
} from 'lucide-react';
import toast from 'react-hot-toast';

const PHASES = [
  { id: 0, title: 'Design & Tech Pack', desc: 'Vector designs & specs', icon: FileSignature },
  { id: 1, title: 'Fabric Sourcing', desc: 'Procuring fabrics & trims', icon: Palette },
  { id: 2, title: 'Pattern Making', desc: 'XS–XXL patterns', icon: PenTool },
  { id: 3, title: 'Sampling', desc: 'Physical sample approval', icon: ClipboardCheck },
  { id: 4, title: 'Bulk Cutting', desc: 'Cutting fabric lots', icon: Scissors },
  { id: 5, title: 'Printing & Embroidery', desc: 'Applying branding', icon: Shirt },
  { id: 6, title: 'Stitching & Assembly', desc: 'Final construction', icon: CheckCircle },
  { id: 7, title: 'Finishing & QA', desc: 'Quality control', icon: PackageSearch },
  { id: 8, title: 'Packaging & Dispatch', desc: 'Bagging & shipment', icon: Truck },
  { id: 9, title: 'Delivered / Complete', desc: 'Order successfully fulfilled', icon: Home },
];

export default function AdminProductionManager({ order, onAdvance }) {
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isReverting, setIsReverting] = useState(false);

  const currentStage = order?.stage_index ?? 0;
  const isDepositPaid = order?.is_deposit_paid || false;
  const isFinalPaid = order?.is_final_paid || false;

  // Finance gates
  const isDepositLocked = !isDepositPaid; // ALL production requires deposit
  const isFinalLocked = currentStage === 7 && !isFinalPaid; // Dispatch requires final payment

  const canAdvance = !isAdvancing && currentStage < PHASES.length - 1 && !isDepositLocked && !isFinalLocked;
  const canGoBack = !isReverting && currentStage > 0;

  const handleAdvance = async () => {
    if (!canAdvance) {
      if (isDepositLocked) {
        toast.error("Production on hold — confirm deposit payment first.");
      } else if (isFinalLocked) {
        toast.error("Dispatch locked — confirm final payment first.");
      }
      return;
    }
    setIsAdvancing(true);
    try {
      await onAdvance(currentStage + 1);
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleRevert = async () => {
    if (!canGoBack) return;
    setIsReverting(true);
    try {
      await onAdvance(currentStage - 1);
    } finally {
      setIsReverting(false);
    }
  };

  return (
    <div className="bg-base-100 rounded-3xl shadow-sm border border-base-200 overflow-hidden flex flex-col font-sans h-full">
      
      {/* ── Header ── */}
      <div className="p-6 border-b border-base-200 bg-base-50/50 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-base-200 flex items-center justify-center text-[var(--primary)] shadow-sm">
              <Shirt size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-base-content leading-none">Production Roadmap</h3>
              <p className="text-[10px] text-base-content/40 mt-1 uppercase tracking-widest font-bold">Real-time status tracking</p>
            </div>
          </div>

          {/* Stage counter */}
          <div className="text-right">
            <p className="text-[9px] font-bold text-base-content/30 uppercase tracking-widest">Stage</p>
            <p className="text-lg font-black text-base-content leading-none">
              {currentStage + 1}
              <span className="text-[10px] font-bold text-base-content/30">/{PHASES.length}</span>
            </p>
          </div>
        </div>

        {/* ── Action Buttons Row ── */}
        <div className="flex items-center gap-2">
          {/* ← Go Back */}
          <button
            onClick={handleRevert}
            disabled={!canGoBack || isAdvancing}
            title={currentStage === 0 ? "Already at first stage" : `Revert to: ${PHASES[currentStage - 1]?.title}`}
            className="btn btn-sm h-10 px-4 gap-2 rounded-xl border border-base-200 bg-white text-base-content/60 hover:bg-base-100 hover:text-base-content transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
          >
            {isReverting
              ? <span className="loading loading-spinner loading-xs" />
              : <ChevronLeft size={16} />
            }
            <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
          </button>

          {/* → Advance / Locked */}
          <button
            onClick={handleAdvance}
            disabled={isAdvancing || isReverting || currentStage >= PHASES.length - 1}
            className={`flex-1 btn btn-sm h-10 gap-2 rounded-xl border-none text-white transition-all active:scale-95 ${
              isDepositLocked
                ? 'bg-rose-500 cursor-not-allowed'
                : isFinalLocked
                ? 'bg-amber-500 cursor-not-allowed'
                : currentStage >= PHASES.length - 1
                ? 'bg-base-300 text-base-content/30 cursor-not-allowed'
                : 'bg-[var(--primary)] hover:brightness-110 shadow-sm'
            }`}
          >
            {isAdvancing
              ? <span className="loading loading-spinner loading-xs" />
              : isDepositLocked
              ? <Lock size={14} />
              : isFinalLocked
              ? <Lock size={14} />
              : <PlayCircle size={14} />
            }
            <span className="text-[10px] font-black uppercase tracking-widest">
              {isDepositLocked
                ? 'Awaiting Deposit'
                : isFinalLocked
                ? 'Awaiting Final Payment'
                : currentStage >= PHASES.length - 1
                ? 'Completed'
                : 'Advance Pipeline'}
            </span>
          </button>
        </div>
      </div>

      {/* ── Finance Alert Banners ── */}
      {isDepositLocked && (
        <div className="mx-6 mt-5 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
          <AlertTriangle size={16} className="text-rose-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-[11px] font-black text-rose-700 uppercase tracking-tight leading-none mb-1">Deposit Required</p>
            <p className="text-[10px] font-bold text-rose-500 leading-snug">
              Production pipeline is locked. Confirm the client's deposit payment to unlock all stages.
            </p>
          </div>
        </div>
      )}

      {isFinalLocked && !isDepositLocked && (
        <div className="mx-6 mt-5 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
          <Lock size={16} className="text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-[11px] font-black text-amber-700 uppercase tracking-tight leading-none mb-1">Dispatch Lock</p>
            <p className="text-[10px] font-bold text-amber-500 leading-snug">
              Final balance payment must be confirmed before goods can be dispatched.
            </p>
          </div>
        </div>
      )}

      {currentStage === 8 && (
        <div className="mx-6 mt-5 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
          <Truck size={16} className="text-blue-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-[11px] font-black text-blue-700 uppercase tracking-tight leading-none mb-1">Dispatch Ready</p>
            <p className="text-[10px] font-bold text-blue-500 leading-snug">
              Order is ready for logistics. Please enter the tracking number and carrier in the <strong>Logistics</strong> tab.
            </p>
          </div>
        </div>
      )}

      {/* ── Timeline ── */}
      <div className="px-8 py-8 overflow-y-auto flex-1 custom-scrollbar">
        <div className="relative">
          {/* Vertical trace line */}
          <div className="absolute left-[19px] top-2 bottom-10 w-[2px] bg-base-200 rounded-full" />

          <ul className="space-y-0">
            {PHASES.map((phase, idx) => {
              const Icon = phase.icon;
              const isCompleted = idx < currentStage;
              const isCurrent  = idx === currentStage;
              const isUpcoming = idx > currentStage;
              const isLast = idx === PHASES.length - 1;

              // Show lock on next stage if deposit not paid, or on dispatch if final not paid
              const showLock = isUpcoming && (isDepositLocked || (idx === 8 && !isFinalPaid));

              return (
                <li key={phase.id} className={`relative flex gap-6 ${isLast ? '' : 'pb-8'}`}>
                  
                  {/* Stage indicator */}
                  <div className="relative z-10 shrink-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                        : isCurrent
                        ? isDepositLocked
                          ? 'bg-rose-500 border-rose-500 text-white shadow-lg'
                          : 'bg-white border-[var(--primary)] text-[var(--primary)] shadow-lg ring-4 ring-[var(--primary)]/5'
                        : 'bg-white border-base-200 text-base-content/20'
                    }`}>
                      {showLock ? <Lock size={14} /> : <Icon size={16} />}
                    </div>
                  </div>

                  {/* Stage text */}
                  <div className={`flex-1 min-w-0 pt-1.5 ${isUpcoming ? 'opacity-30' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`text-[13px] font-bold tracking-tight uppercase ${
                          isCurrent
                            ? isDepositLocked ? 'text-rose-600' : 'text-[var(--primary)]'
                            : isCompleted ? 'text-base-content/80' : 'text-base-content/40'
                        }`}>
                          {phase.title}
                        </h4>
                        <p className="text-[10px] font-bold text-base-content/30 mt-1 uppercase tracking-tight leading-none italic">
                          {phase.desc}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-2">
                        {isCompleted && (
                          <span className="flex items-center gap-1 text-[8px] font-black uppercase text-emerald-600 tracking-widest">
                            <ShieldCheck size={10} /> Done
                          </span>
                        )}
                        {isCurrent && !isDepositLocked && (
                          <div className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-[var(--primary)] animate-ping" />
                            <span className="text-[8px] font-black text-[var(--primary)] uppercase tracking-widest">Active</span>
                          </div>
                        )}
                        {isCurrent && isDepositLocked && (
                          <div className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
                            <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Locked</span>
                          </div>
                        )}
                      </div>
                    </div>
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
