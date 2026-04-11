"use client";
import React from "react";
import { Check } from "lucide-react";

export default function AOStepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        const isLast = i === steps.length - 1;
        const Icon = step.icon;

        return (
          <React.Fragment key={i}>
            {/* Step node */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-sm"
                    : isCurrent
                    ? "bg-white border-[var(--primary)] text-[var(--primary)] shadow-lg ring-4 ring-[var(--primary)]/10"
                    : "bg-base-200 border-base-300 text-base-content/30"
                }`}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : <Icon size={16} />}
              </div>
              <span
                className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${
                  isCurrent
                    ? "text-[var(--primary)]"
                    : isCompleted
                    ? "text-base-content/60"
                    : "text-base-content/25"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-6 rounded-full transition-all duration-500 ${
                  isCompleted ? "bg-[var(--primary)]" : "bg-base-300"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
