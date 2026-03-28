"use client";
import React from 'react';
import { Settings, PenTool, Scissors, UserCheck, PackageCheck, Box } from 'lucide-react';

const PHASES = [
  { id: 'design', label: 'Design Approved', icon: PenTool, status: 'completed' },
  { id: 'sourcing', label: 'Material Sourcing', icon: Box, status: 'completed' },
  { id: 'cutting', label: 'Cutting & Sewing', icon: Scissors, status: 'current' },
  { id: 'assembly', label: 'Assembly', icon: Settings, status: 'pending' },
  { id: 'qa', label: 'Quality Assurance', icon: UserCheck, status: 'pending' },
  { id: 'packaging', label: 'Packaging', icon: PackageCheck, status: 'pending' },
];

export default function ProductionPhaseTracker({ currentPhase }) {
  // Let's assume currentPhase is passed e.g., 'Cutting'
  let currentIndex = PHASES.findIndex(p => p.label.includes(currentPhase)) || 2;
  if(currentIndex === -1) currentIndex = 2; // Default to middle for demo

  return (
    <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 p-8 w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
           Manufacturing Phase
        </h3>
        <span className="badge badge-info gap-1 badge-lg">
          <Settings size={14} className="animate-spin-slow" /> In Production
        </span>
      </div>
      
      <div className="bg-base-200/50 rounded-xl p-6">
        <ul className="steps steps-vertical lg:steps-horizontal w-full">
          {PHASES.map((phase, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const Icon = phase.icon;
            
            return (
              <li 
                key={phase.id} 
                className={`step ${isCompleted ? 'step-accent font-medium' : isCurrent ? 'step-accent' : 'text-base-content/40'}`}
                data-content={isCompleted ? "✓" : isCurrent ? "●" : ""}
              >
                <div className="mt-4 flex flex-col items-center gap-2">
                  <div className={`p-4 rounded-full ${isCompleted ? 'bg-accent text-accent-content' : isCurrent ? 'bg-accent/20 text-accent ring-2 ring-accent ring-offset-2 ring-offset-base-100' : 'bg-base-300 text-base-content/50'}`}>
                     <Icon size={20} />
                  </div>
                  <div className="text-center mt-2">
                    <p className={`font-semibold ${isCurrent ? 'text-accent' : ''}`}>{phase.label}</p>
                    {isCurrent && <p className="text-xs text-base-content/70 mt-1 flex items-center justify-center gap-1">In Progress...</p>}
                    {isCompleted && <p className="text-xs text-success mt-1">Done</p>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
