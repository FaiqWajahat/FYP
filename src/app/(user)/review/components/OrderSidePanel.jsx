'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { PAYMENT_METHODS } from './PaymentMethodSection';

export default function OrderSidePanel({
  orderId,
  subtotal,
  selectedMethod,
  transferFee,
  grandTotal,
  paymentDivision,
  amountDueNow,
  agreedToTerms,
  setAgreedToTerms,
  canSubmit,
  isSubmitting,
  onSubmit
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl lg:sticky lg:top-32 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-slate-900 text-white">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
        <p className="font-mono font-bold text-white text-lg">{orderId}</p>
      </div>

      {/* Summary Lines */}
      <div className="p-6 space-y-3 border-b border-slate-100">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Production Subtotal</span>
          <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
        </div>
        {selectedMethod && (
          <div className="flex justify-between text-sm">
            <span className="text-amber-600">Transfer Fee ({selectedMethod.name})</span>
            <span className="font-semibold text-amber-700">+${transferFee.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs text-slate-400 italic">
          <span>Shipping</span>
          <span>Calculated after production</span>
        </div>
        <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
          <span>Total {selectedMethod ? '' : '(excl. transfer fee)'}</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Dynamic Due Now */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {paymentDivision === 'split' ? 'Due Now (50%)' : 'Amount Due Now'}
            </p>
            <p className="text-3xl font-black text-slate-900 mt-1">${amountDueNow.toFixed(2)}</p>
          </div>
          {paymentDivision === 'split' && (
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">After Completion</p>
              <p className="text-sm font-bold text-slate-600">${(grandTotal * 0.5).toFixed(2)}</p>
            </div>
          )}
        </div>

        {/* Selected payment method tag */}
        {selectedMethod && (
          <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${selectedMethod.bg} ${selectedMethod.color} border border-current/10`}>
            {PAYMENT_METHODS.find(m => m.id === selectedMethod.id)?.icon && 
              React.createElement(PAYMENT_METHODS.find(m => m.id === selectedMethod.id).icon, { size: 13 })}
            via {selectedMethod.name}
          </div>
        )}
      </div>

      {/* Terms + Submit */}
      <div className="p-6 space-y-4">
        {/* Terms checkbox */}
        <div
          onClick={() => setAgreedToTerms(!agreedToTerms)}
          className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-colors group"
        >
          <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${agreedToTerms ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
            {agreedToTerms && <CheckCircle2 size={13} className="text-white" />}
          </div>
          <span className="text-xs text-slate-500 leading-relaxed select-none">
            I confirm all order details, sizes, and payment terms. I agree to the{' '}
            <span className="text-slate-800 underline font-medium">Terms of Production</span>.
          </span>
        </div>

        {/* Validation hints */}
        {!selectedMethod && (
          <p className="text-xs text-amber-600 flex items-center gap-1.5">
            <AlertCircle size={13} /> Please select a payment method.
          </p>
        )}
        {selectedMethod && !paymentDivision && (
          <p className="text-xs text-amber-600 flex items-center gap-1.5">
            <AlertCircle size={13} /> Please select a payment schedule.
          </p>
        )}

        {/* Submit CTA */}
        <button
          disabled={!canSubmit || isSubmitting}
          onClick={onSubmit}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-500 shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100 group"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting Order…
            </>
          ) : (
            <>
              Submit Order Request
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-2">
          <ShieldCheck size={13} /> Secure · Factory Direct Portal
        </div>
      </div>
    </div>
  );
}
