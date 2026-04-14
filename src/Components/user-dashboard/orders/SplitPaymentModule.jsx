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
export default function SplitPaymentModule({ order }) {
  if (!order) return null;

  const invoices = order.invoices || [];
  const totalAmount = order.total_amount || 0;
  const depositAmount = totalAmount * 0.5;
  const balanceAmount = totalAmount * 0.5;

  const depositInvoice = invoices.find(inv => inv.milestone_type === 'deposit' || inv.milestone_type === 'full');
  const finalInvoice = invoices.find(inv => inv.milestone_type === 'final');

  const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  return (
    <div className="bg-base-100 rounded-3xl shadow-sm border border-base-200 overflow-hidden font-sans h-full flex flex-col">
      <div className="p-6 border-b border-base-200 flex flex-col sm:flex-row justify-between items-center bg-base-50/50 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl border border-base-200 flex items-center justify-center text-[var(--primary)] shadow-sm">
            <DollarSign size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-base-content leading-none">Financial Milestones</h3>
            <p className="text-[10px] text-base-content/40 mt-1 uppercase tracking-widest font-bold">Billing & settlement pipeline</p>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${order.is_deposit_paid && order.is_final_paid
          ? 'bg-base-200 text-success border-success'
          : 'bg-base-200 text-warning border-warning'
          }`}>
          {order.is_deposit_paid && order.is_final_paid ? 'Project Fully Funded' : 'Pending Verification'}
        </div>
      </div>

      <div className="p-8 space-y-6 flex-1">
        {/* Milestone 1: Deposit */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${depositInvoice?.status === 'paid'
          ? 'bg-success/20 text-success-content border-success'
          : depositInvoice
          ? 'bg-warning/20 text-warning-content border-warning'
          : 'bg-base-50 text-base-content/50 border-base-200'
          }`}>
          <div className="flex flex-col xl:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${depositInvoice?.status === 'paid'
                ? 'bg-success border-success text-success-content shadow-sm'
                : depositInvoice
                ? 'bg-warning border-warning text-warning-content shadow-sm'
                : 'bg-base-50 border-base-200 text-base-content/20'
                }`}>
                {depositInvoice?.status === 'paid' ? <CheckCircle size={24} /> : <CreditCard size={24} />}
              </div>
              <div>
                <span className="text-[10px] font-bold text-base-content/30 uppercase tracking-widest">Milestone 01</span>
                <h4 className={`text-sm font-bold tracking-tight uppercase ${!depositInvoice && 'text-base-content/40'}`}>Commitment Deposit (50%)</h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className={`text-xl font-black tracking-tighter ${depositInvoice ? 'text-[var(--primary)]' : 'text-base-content/30'}`}>{fmt(depositAmount)}</p>
                  <span className="text-[9px] font-bold text-base-content/20 uppercase">USD</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start xl:items-end gap-2">
              {depositInvoice ? (
                <>
                  <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border flex items-center justify-center h-9 ${depositInvoice.status === 'paid' ? 'bg-success text-success-content border-success' : 'bg-warning text-warning-content border-warning'
                    }`}>
                    {depositInvoice.status === 'paid' ? 'Paid' : 'Awaiting Payment'}
                  </div>
                  {depositInvoice.status !== 'paid' && (
                    <Link
                      href={`/dashboard/invoices?orderId=${order.display_id ? `ORD-${order.display_id}` : order.id}`}
                      className="btn btn-xs h-9 px-4 bg-[var(--primary)] text-white hover:brightness-110 border-none rounded-lg font-bold uppercase tracking-wider shadow-sm transition-all"
                    >
                      <FileText size={14} /> Pay Invoice
                    </Link>
                  )}
                </>
              ) : (
                <div className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border bg-base-200/50 text-base-content/30 border-base-200 flex items-center justify-center h-9">
                  Awaiting Invoice
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Milestone 2: Balance */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${finalInvoice?.status === 'paid'
          ? 'bg-success/20 text-success-content border-success'
          : finalInvoice
          ? 'bg-warning/20 text-warning-content border-warning'
          : 'bg-base-50 text-base-content/50 border-base-200'
          } ${!order.is_deposit_paid ? 'opacity-40 grayscale blur-[1px] pointer-events-none' : ''}`}>
          <div className="flex flex-col xl:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${finalInvoice?.status === 'paid'
                ? 'bg-success border-success text-success-content shadow-sm'
                : finalInvoice
                ? 'bg-warning border-warning text-warning-content shadow-sm'
                : 'bg-base-50 border-base-200 text-base-content/20'
                }`}>
                {finalInvoice?.status === 'paid' ? <CheckCircle size={24} /> : <CreditCard size={24} />}
              </div>
              <div>
                <span className="text-[10px] font-bold text-base-content/30 uppercase tracking-widest">Milestone 02</span>
                <h4 className={`text-sm font-bold tracking-tight uppercase ${!finalInvoice && 'text-base-content/40'}`}>Project Balance (50%)</h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className={`text-xl font-black tracking-tighter ${finalInvoice ? 'text-[var(--primary)]' : 'text-base-content/30'}`}>{fmt(balanceAmount)}</p>
                  <span className="text-[9px] font-bold text-base-content/20 uppercase">USD</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start xl:items-end gap-2">
              {finalInvoice ? (
                <>
                  <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border flex items-center justify-center h-9 ${finalInvoice.status === 'paid' ? 'bg-success text-success-content border-success' : 'bg-warning text-warning-content border-warning'
                    }`}>
                    {finalInvoice.status === 'paid' ? 'Paid' : 'Awaiting Payment'}
                  </div>
                  {finalInvoice.status !== 'paid' && (
                    <Link
                      href={`/dashboard/invoices?orderId=${order.display_id ? `ORD-${order.display_id}` : order.id}`}
                      className="btn btn-xs h-9 px-4 bg-[var(--primary)] text-white hover:brightness-110 border-none rounded-lg font-bold uppercase tracking-wider shadow-sm transition-all"
                    >
                      <FileText size={14} /> Pay Invoice
                    </Link>
                  )}
                </>
              ) : (
                <div className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border bg-base-200/50 text-base-content/30 border-base-200 flex items-center justify-center h-9">
                  Awaiting Invoice
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="m-6 p-6 bg-base-50 border border-base-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-8">
          <div>
            <p className="text-[9px] font-bold text-base-content/30 uppercase tracking-widest mb-1">Project Total</p>
            <p className="text-xl font-black text-base-content tracking-tighter">{fmt(totalAmount)}</p>
          </div>
          <div className="w-px h-8 bg-base-300 hidden sm:block" />
          <div>
            <p className="text-[9px] font-bold text-base-content/30 uppercase tracking-widest mb-1">Funded</p>
            <p className="text-xl font-black text-emerald-600 tracking-tighter">
              {fmt(order.is_deposit_paid ? (order.is_final_paid ? totalAmount : depositAmount) : 0)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <p className="text-[9px] font-black text-base-content/40 tracking-widest uppercase">Funding Health</p>
            <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-tighter">Manufacturing Pool</p>
          </div>
          <div className="radial-progress text-[var(--primary)] bg-[var(--primary)]/5 border-2 border-transparent"
            style={{
              "--value": order.is_deposit_paid ? (order.is_final_paid ? 100 : 50) : 0,
              "--size": "3rem",
              "--thickness": "3px"
            }}>
            <span className="text-[10px] font-black text-base-content">{order.is_deposit_paid ? (order.is_final_paid ? "100" : "50") : "0"}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

