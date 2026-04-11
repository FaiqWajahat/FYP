"use client";
import React from 'react';
import {
  Wallet, CheckCircle, AlertCircle, Clock, Receipt,
  CreditCard, DollarSign, Landmark, Globe, Banknote, Info,
  FileText, ArrowUpRight, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

// Must stay in sync with PaymentMethodSection.jsx in the review page
const PAYMENT_METHOD_META = {
  paypal:        { name: 'PayPal',               icon: DollarSign, color: 'text-blue-600',    bg: 'bg-blue-50',    feeLabel: '4.4% + $0.30', instructions: 'Send payment to: payments@venpagarments.com via PayPal.' },
  bank:          { name: 'Bank Transfer (T/T)',   icon: Landmark,   color: 'text-emerald-700', bg: 'bg-emerald-50', feeLabel: '$35.00 flat',   instructions: 'Wire transfer via SWIFT to account details provided in the invoice PDF.' },
  western_union: { name: 'Western Union',          icon: Globe,      color: 'text-yellow-700',  bg: 'bg-yellow-50',  feeLabel: '~2% of total',  instructions: 'Send to recipient details listed in the invoice. Share the MTCN after transfer.' },
  payoneer:      { name: 'Payoneer',               icon: Banknote,   color: 'text-orange-700',  bg: 'bg-orange-50',  feeLabel: '3% + $3.00',    instructions: 'Transfer to Payoneer email: payoneer@venpagarments.com.' },
};

/**
 * SplitPaymentModule — Order Detail Page
 *
 * WORKFLOW:
 *  1. User submits order → Order appears with status "Payment Pending"
 *  2. Admin issues an Invoice (PDF) linked to this order
 *  3. User goes to Invoices → approves → manually transfers money
 *  4. Admin confirms payment → order moves to "Processing" / "In Production"
 *
 * This module DOES NOT process payments inline.
 * It shows the financial summary and the status of linked invoices.
 */
export default function SplitPaymentModule({
  productionSubtotal = 8250.00,
  paymentMethodId    = 'bank',
  paymentDivision    = 'split',
  totalUnits         = 500,
  unitPrice          = 15.00,
  brandingAddon      = 1.50,
  brandingFormat     = 'Screen Print',
  // In production these come from the API — linked invoices for this order
  invoices = [
    {
      id: 'INV-2024-001',
      milestone: 'deposit',
      label: '50% Deposit',
      status: 'paid',          // 'pending' | 'paid' | 'rejected'
      amount: 4142.50,
      issuedDate: 'Oct 5, 2026',
    },
    {
      id: 'INV-2024-002',
      milestone: 'final',
      label: '50% Final Payment',
      status: 'pending',
      amount: 4142.50,
      dueDate: 'Before Shipping',
    },
  ],
}) {
  const method     = PAYMENT_METHOD_META[paymentMethodId] || PAYMENT_METHOD_META.bank;
  const MethodIcon = method.icon;

  // Correct fee calculation matching ReviewContent.jsx
  const transferFee  = parseFloat(
    (productionSubtotal * (
      paymentMethodId === 'paypal'        ? 0.044 :
      paymentMethodId === 'western_union' ? 0.02  :
      paymentMethodId === 'payoneer'      ? 0.03  : 0
    ) + (
      paymentMethodId === 'bank'     ? 35   :
      paymentMethodId === 'paypal'   ? 0.30 :
      paymentMethodId === 'payoneer' ? 3    : 0
    )).toFixed(2)
  );
  const grandTotal = productionSubtotal + transferFee;

  const milestones = paymentDivision === 'split'
    ? invoices
    : [invoices[0]]; // for full payment, only one invoice

  const paidAmount     = milestones.filter(m => m.status === 'paid').reduce((s, m) => s + m.amount, 0);
  const pendingInvoice = milestones.find(m => m.status === 'pending');
  const paidPercent    = grandTotal > 0 ? Math.round((paidAmount / grandTotal) * 100) : 0;

  return (
    <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden font-sans">

      {/* Header */}
      <div className="p-5 border-b border-base-200/60 flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-base-content/80">
          <Wallet size={15} style={{ color: 'var(--primary)' }} />
          Payment Summary
        </h3>
        <span className="text-[10px] font-mono text-base-content/40 uppercase tracking-widest">
          {paymentDivision === 'split' ? '50 / 50 Split' : 'Full Payment'}
        </span>
      </div>

      <div className="p-5 space-y-4">

        {/* Action Banner — pending invoice requires user action */}
        {pendingInvoice && (
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-amber-800">Invoice awaiting your approval</p>
              <p className="text-[11px] text-amber-600 mt-0.5 leading-relaxed">
                {pendingInvoice.id} for <strong>${pendingInvoice.amount.toFixed(2)}</strong> is pending.
                Approve it and transfer the amount via {method.name} to proceed.
              </p>
              <Link href="/dashboard/invoices"
                className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-amber-800 underline hover:text-amber-900 transition-colors">
                Go to Invoices <ArrowUpRight size={11} />
              </Link>
            </div>
          </div>
        )}

        {/* Pricing Breakdown */}
        <div className="rounded-xl border border-base-200/60 overflow-hidden">
          <div className="bg-base-200/40 px-4 py-2 border-b border-base-200/60">
            <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/50">Pricing Breakdown</p>
          </div>
          <div className="px-4 py-3 space-y-2 text-xs">
            {/* Base production cost */}
            <div className="flex justify-between text-base-content/60">
              <div>
                <p className="font-medium">Production Cost</p>
                <p className="text-[10px] font-mono text-base-content/40 mt-0.5">
                  {totalUnits.toLocaleString()} units × ${unitPrice.toFixed(2)}/unit
                </p>
              </div>
              <span className="font-semibold text-base-content">${(totalUnits * unitPrice).toFixed(2)}</span>
            </div>

            {/* Branding addon */}
            {brandingAddon > 0 && (
              <div className="flex justify-between text-base-content/60">
                <div>
                  <p className="font-medium">{brandingFormat} Add-on</p>
                  <p className="text-[10px] font-mono text-base-content/40 mt-0.5">
                    {totalUnits.toLocaleString()} units × ${brandingAddon.toFixed(2)}/unit
                  </p>
                </div>
                <span className="font-semibold text-base-content">+${(totalUnits * brandingAddon).toFixed(2)}</span>
              </div>
            )}

            {/* Production subtotal */}
            <div className="flex justify-between pt-2 border-t border-base-200/50 font-semibold text-base-content">
              <span>Production Subtotal</span>
              <span>${productionSubtotal.toFixed(2)}</span>
            </div>

            {/* Transfer fee */}
            <div className="flex justify-between text-amber-700">
              <div className="flex items-start gap-1.5">
                <Info size={10} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Transfer Fee ({method.name})</p>
                  <p className="text-[10px] text-amber-600/70 font-mono mt-0.5">{method.feeLabel}</p>
                </div>
              </div>
              <span className="font-semibold">+${transferFee.toFixed(2)}</span>
            </div>

            {/* Shipping */}
            <div className="flex justify-between text-base-content/35 italic text-[10px]">
              <span>Shipping</span>
              <span>Calculated after production</span>
            </div>
          </div>

          {/* Grand Total */}
          <div className="px-4 py-3 border-t border-base-200/60 bg-base-200/30 flex justify-between items-center">
            <p className="text-xs font-bold text-base-content/60 uppercase tracking-wider">Grand Total (incl. fee)</p>
            <p className="text-xl font-black" style={{ color: 'var(--primary)' }}>${grandTotal.toFixed(2)}</p>
          </div>
        </div>

        {/* Payment Progress */}
        <div>
          <div className="flex justify-between items-center mb-1.5 text-[11px]">
            <span className="font-bold text-base-content/50 uppercase tracking-widest">Payment Progress</span>
            <span className="font-mono" style={{ color: 'var(--primary)' }}>{paidPercent}% settled</span>
          </div>
          <div className="w-full bg-base-200 rounded-full h-2 overflow-hidden">
            <div className="h-full rounded-full bg-success transition-all duration-700" style={{ width: `${paidPercent}%` }} />
          </div>
          <div className="flex justify-between text-[10px] mt-1.5 font-mono">
            <span className="text-success font-bold">${paidAmount.toFixed(2)} paid</span>
            <span className="text-base-content/40">${(grandTotal - paidAmount).toFixed(2)} remaining</span>
          </div>
        </div>

        {/* Invoice Milestones */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/40">Payment Milestones</p>
          {milestones.map((m) => (
            <div key={m.id}
              className={`relative flex items-center justify-between p-3.5 rounded-xl border overflow-hidden ${
                m.status === 'paid'
                  ? 'border-success/20 bg-success/5'
                  : m.status === 'rejected'
                  ? 'border-error/20 bg-error/5'
                  : 'border-base-300 bg-base-100 shadow-sm'
              }`}
            >
              {/* Left accent */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
                style={{
                  backgroundColor:
                    m.status === 'paid'     ? '#16a34a' :
                    m.status === 'rejected' ? '#dc2626' :
                    'var(--primary)'
                }}
              />

              <div className="flex items-center gap-3 pl-1 min-w-0">
                {m.status === 'paid'
                  ? <CheckCircle size={15} className="text-success shrink-0" />
                  : m.status === 'rejected'
                  ? <AlertCircle size={15} className="text-error shrink-0" />
                  : <Clock size={15} style={{ color: 'var(--primary)' }} className="shrink-0" />
                }
                <div className="min-w-0">
                  <p className={`font-bold text-xs truncate ${m.status === 'pending' ? 'text-base-content' : 'text-base-content/70'}`}>
                    {m.label}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-[10px] font-mono text-base-content/30">{m.id}</p>
                    {m.status === 'paid' && m.issuedDate && (
                      <p className="text-[10px] text-base-content/30 font-mono">· Paid {m.issuedDate}</p>
                    )}
                    {m.status === 'pending' && m.dueDate && (
                      <p className="text-[10px] text-amber-500 font-mono">· Due: {m.dueDate}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 ml-2 flex flex-col items-end gap-1.5">
                <p className={`font-bold text-sm ${m.status === 'pending' ? 'text-base-content' : 'text-base-content/60'}`}>
                  ${m.amount.toFixed(2)}
                </p>
                {m.status === 'paid' && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-success bg-success/10 px-2 py-0.5 rounded-full">Paid</span>
                )}
                {m.status === 'pending' && (
                  <Link href="/dashboard/invoices"
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-white px-2.5 py-1 rounded-lg hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: 'var(--primary)' }}>
                    <FileText size={10} /> View Invoice
                  </Link>
                )}
                {m.status === 'rejected' && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-error bg-error/10 px-2 py-0.5 rounded-full">Rejected</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Payment Method & Instructions */}
        <div className={`rounded-xl border overflow-hidden`}>
          <div className={`flex items-center gap-3 px-4 py-3 ${method.bg} border-b border-current/10`}>
            <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center shrink-0">
              <MethodIcon size={15} className={method.color} />
            </div>
            <div>
              <p className={`text-xs font-bold ${method.color}`}>{method.name}</p>
              <p className="text-[10px] text-base-content/50 mt-0.5">Transfer fee: {method.feeLabel}</p>
            </div>
          </div>
          <div className="px-4 py-3 bg-base-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-1.5">How to Pay</p>
            <p className="text-[11px] text-base-content/60 leading-relaxed">{method.instructions}</p>
          </div>
        </div>

        {/* Trust footer */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-base-content/30 uppercase tracking-widest font-bold pt-1">
          <ShieldCheck size={12} /> Secure · Factory Direct Payments
        </div>

      </div>
    </div>
  );
}

