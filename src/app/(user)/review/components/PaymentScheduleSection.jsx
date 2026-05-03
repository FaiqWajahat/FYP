'use client';

import React from 'react';
import { FileText, AlertCircle } from 'lucide-react';

const PAYMENT_DIVISIONS = [
  {
    id: 'full',
    label: '100% Full Payment',
    description: 'Pay the entire order amount upfront. Order goes into production immediately.',
    icon: '💯',
  },
  {
    id: 'split',
    label: '50% Now · 50% After Completion',
    description: '50% paid upfront to start production. Remaining 50% due before shipment.',
    icon: '✂️',
  },
  {
    id: 'split_30_40_30',
    label: '30% · 40% · 30% Milestone Plan',
    description: '30% upfront to start, 40% mid-production, and 30% due before shipment.',
    icon: '⏳',
  },
];

function RadioDot({ selected, color = 'border-blue-600' }) {
  return (
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected ? color : 'border-slate-300'}`}>
      {selected && <div className="w-2.5 h-2.5 bg-current rounded-full" />}
    </div>
  );
}

export default function PaymentScheduleSection({ selectedDivision, onDivisionSelect, grandTotal }) {
  // If order is under $200, only allow 100% full payment
  const isBelowMinimum = grandTotal < 200;
  const availableDivisions = isBelowMinimum 
    ? PAYMENT_DIVISIONS.filter(d => d.id === 'full') 
    : PAYMENT_DIVISIONS;

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl"><FileText size={20} /></div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Payment Schedule</h2>
          <p className="text-xs text-slate-500 mt-0.5">Choose how you'd like to structure the payment.</p>
        </div>
      </div>

      {isBelowMinimum && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Order Minimum for Splitting:</strong> Orders under $200.00 require 100% upfront payment. Payment splitting (50/50 or 30/40/30) is available for larger orders.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {availableDivisions.map((div) => {
          const isSelected = selectedDivision === div.id;
          const dueNow = div.id === 'split' ? grandTotal * 0.5 : (div.id === 'split_30_40_30' ? grandTotal * 0.3 : grandTotal);

          return (
            <div
              key={div.id}
              onClick={() => onDivisionSelect(div.id)}
              className={`p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${isSelected ? 'border-blue-600 bg-blue-50/40 shadow-sm' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-2xl">{div.icon}</span>
                <RadioDot selected={isSelected} />
              </div>
              <p className="font-bold text-slate-900 text-sm leading-snug mb-1.5">{div.label}</p>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{div.description}</p>
              <div className={`mt-auto pt-3 border-t ${isSelected ? 'border-blue-200' : 'border-slate-200'}`}>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Due Now</p>
                <p className="text-lg font-black text-slate-900">${dueNow.toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conditional split notes */}
      {selectedDivision === 'split' && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
          <AlertCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-800 leading-relaxed">
            <strong>50% Upfront:</strong> ${(grandTotal * 0.5).toFixed(2)} due now to start production.
            The remaining <strong>50% (${(grandTotal * 0.5).toFixed(2)})</strong> will be due after order completion and before shipment.
          </p>
        </div>
      )}

      {selectedDivision === 'split_30_40_30' && (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
          <AlertCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-emerald-800 leading-relaxed">
            <strong>30% Upfront:</strong> ${(grandTotal * 0.3).toFixed(2)} due now to begin production.<br/>
            <strong>40% Midpoint:</strong> ${(grandTotal * 0.4).toFixed(2)} due upon mid-production photo approval.<br/>
            <strong>30% Final:</strong> ${(grandTotal * 0.3).toFixed(2)} due after order completion before shipment.
          </p>
        </div>
      )}
    </section>
  );
}
