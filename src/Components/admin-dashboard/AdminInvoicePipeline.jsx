"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CreditCard, CheckCircle2, AlertCircle, DollarSign,
  ExternalLink, FilePlus, Loader2, ShieldCheck, RotateCcw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export default function AdminInvoicePipeline({ order, onUpdate }) {
  const router = useRouter();
  if (!order) return null;

  const invoices = order.invoices || [];
  const totalAmount = order.total_amount || 0;
  const depositAmount = totalAmount * 0.5;
  const balanceAmount = totalAmount * 0.5;

  const depositInvoice = invoices.find(inv => inv.milestone_type === 'deposit' || inv.milestone_type === 'full');
  const finalInvoice = invoices.find(inv => inv.milestone_type === 'final');

  const [loadingId, setLoadingId] = useState(null);

  const handleMarkPaid = async (invoiceId) => {
    setLoadingId(invoiceId);
    try {
      const res = await fetch('/api/admin/invoices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: invoiceId, status: 'paid' })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Payment confirmed & Order synced");
        onUpdate();
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleReversePayment = async (invoiceId) => {
    setLoadingId(invoiceId);
    try {
      const res = await fetch('/api/admin/invoices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: invoiceId, status: 'unpaid' })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Payment reversed & Order synced");
        onUpdate();
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingId(null);
    }
  };

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
          : 'bg-warning text-warning-content border-warning'
          }`}>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${depositInvoice?.status === 'paid'
                ? 'bg-success border-success text-success-content shadow-sm'
                : 'bg-base-50 border-base-200 text-base-content/20'
                }`}>
                {depositInvoice?.status === 'paid' ? <CheckCircle2 size={24} /> : <CreditCard size={24} />}
              </div>
              <div>
                <span className="text-[10px] font-bold text-base-content/30 uppercase tracking-widest">Milestone 01</span>
                <h4 className="text-sm font-bold text-base-content tracking-tight uppercase">Commitment Deposit (50%)</h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-xl font-black text-[var(--primary)] tracking-tighter">{fmt(depositAmount)}</p>
                  <span className="text-[9px] font-bold text-base-content/20 uppercase">USD</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {depositInvoice ? (
                <>
                  <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border flex items-center justify-center h-9 ${depositInvoice.status === 'paid' ? 'bg-success text-success-content border-success' : 'bg-base-200 text-base-content border-base-300'
                    }`}>
                    {depositInvoice.status === 'paid' ? 'Paid' : 'Awaiting'}
                  </div>
                  {depositInvoice.status !== 'paid' ? (
                    <button
                      onClick={() => handleMarkPaid(depositInvoice.id)}
                      disabled={loadingId === depositInvoice.id}
                      className="btn btn-xs h-9 px-4 bg-[var(--primary)] text-white hover:brightness-110 border-none rounded-lg font-bold uppercase tracking-wider shadow-sm transition-all"
                    >
                      {loadingId === depositInvoice.id ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Payment'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReversePayment(depositInvoice.id)}
                      disabled={loadingId === depositInvoice.id}
                      className="btn btn-xs h-9 px-4 bg-error text-white hover:bg-error/90 border-none rounded-lg font-bold uppercase tracking-wider shadow-sm transition-all"
                    >
                      {loadingId === depositInvoice.id ? <Loader2 size={14} className="animate-spin" /> : <><RotateCcw size={14} /> Reverse</>}
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => router.push(`/Dashboard/Invoices/Add?orderId=${order.id}&type=deposit`)}
                  className="btn btn-xs h-9 px-4 bg-slate-800 text-white hover:bg-slate-700 border-none rounded-lg font-bold uppercase tracking-wider shadow-sm"
                >
                  <FilePlus size={14} /> Create Invoice
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Milestone 2: Balance */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${finalInvoice?.status === 'paid'
          ? 'bg-success/20 text-success-content border-success'
          : 'bg-warning text-warning-content border-warning'
          } ${!order.is_deposit_paid ? 'opacity-30 blur-[1px]' : ''}`}>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${finalInvoice?.status === 'paid'
                ? 'bg-success border-success text-success-content shadow-sm'
                : 'bg-base-50 border-base-200 text-base-content/20'
                }`}>
                {finalInvoice?.status === 'paid' ? <CheckCircle2 size={24} /> : <CreditCard size={24} />}
              </div>
              <div>
                <span className="text-[10px] font-bold text-base-content/30 uppercase tracking-widest">Milestone 02</span>
                <h4 className="text-sm font-bold text-base-content tracking-tight uppercase">Project Balance (50%)</h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-xl font-black text-[var(--primary)] tracking-tighter">{fmt(balanceAmount)}</p>
                  <span className="text-[9px] font-bold text-base-content/20 uppercase">USD</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {finalInvoice ? (
                <>
                  <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border flex items-center justify-center h-9 ${finalInvoice.status === 'paid' ? 'bg-success text-success-content border-success' : 'bg-base-200 text-base-content border-base-300'
                    }`}>
                    {finalInvoice.status === 'paid' ? 'Paid' : 'Awaiting'}
                  </div>
                  {finalInvoice.status !== 'paid' ? (
                    <button
                      onClick={() => handleMarkPaid(finalInvoice.id)}
                      disabled={loadingId === finalInvoice.id}
                      className="btn btn-xs h-9 px-4 bg-[var(--primary)] text-white hover:brightness-110 border-none rounded-lg font-bold uppercase tracking-wider shadow-sm transition-all"
                    >
                      {loadingId === finalInvoice.id ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Payment'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReversePayment(finalInvoice.id)}
                      disabled={loadingId === finalInvoice.id}
                      className="btn btn-xs h-9 px-4 bg-error text-white hover:bg-error/90 border-none rounded-lg font-bold uppercase tracking-wider shadow-sm transition-all"
                    >
                      {loadingId === finalInvoice.id ? <Loader2 size={14} className="animate-spin" /> : <><RotateCcw size={14} /> Reverse</>}
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => router.push(`/Dashboard/Invoices/Add?orderId=${order.id}&type=final`)}
                  disabled={!order.is_deposit_paid}
                  className="btn btn-xs h-9 px-4 bg-slate-800 text-white hover:bg-slate-700 border-none rounded-lg font-bold uppercase tracking-wider shadow-sm"
                >
                  <FilePlus size={14} /> Create Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary (Minimalist) */}
      <div className="m-6 p-6 bg-base-50 border border-base-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <div>
            <p className="text-[9px] font-bold text-base-content/30 uppercase tracking-widest mb-1">Project Total</p>
            <p className="text-xl font-black text-base-content tracking-tighter">{fmt(totalAmount)}</p>
          </div>
          <div className="w-px h-8 bg-base-300" />
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
