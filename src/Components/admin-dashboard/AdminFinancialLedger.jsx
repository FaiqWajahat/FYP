"use client";
import React from 'react';
import { CreditCard, CheckCircle2, AlertCircle, DollarSign, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

const fmt = (n, c = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency: c }).format(n);

export default function AdminFinancialLedger({ order, onUpdate }) {
  if (!order) return null;

  const total = order.total_amount || 0;
  const deposit = total * 0.5;
  const balance = total * 0.5;

  const handleTogglePayment = async (field, value) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id, [field]: value })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Payment status updated`);
        onUpdate();
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-base-100 rounded-xl border border-base-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-base-200/50 border-b border-base-200 flex items-center justify-between">
         <h3 className="text-xs font-black uppercase tracking-widest text-base-content/60 flex items-center gap-2">
            <DollarSign size={14} /> Financial Ledger
         </h3>
         <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
           order.is_deposit_paid && order.is_final_paid ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
           order.is_deposit_paid ? 'bg-amber-50 text-amber-600 border-amber-200' : 
           'bg-base-200 text-base-content/40 border-base-300'
         }`}>
           {order.is_deposit_paid && order.is_final_paid ? 'Fully Paid' : order.is_deposit_paid ? 'Partially Paid' : 'Awaiting Payment'}
         </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Milestone 1: Deposit */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-base-200 bg-base-50/30">
           <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.is_deposit_paid ? 'bg-emerald-100 text-emerald-600' : 'bg-base-200 text-base-content/30'}`}>
                 {order.is_deposit_paid ? <CheckCircle2 size={20} /> : <CreditCard size={20} />}
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-base-content/40">Milestone 1: Deposit</span>
                 <span className="text-sm font-black text-base-content">50% Commitment <span className="font-mono text-xs opacity-50">({fmt(deposit)})</span></span>
              </div>
           </div>
           <button 
             onClick={() => handleTogglePayment('is_deposit_paid', !order.is_deposit_paid)}
             className={`btn btn-sm text-[10px] font-black uppercase tracking-widest transition-all ${
               order.is_deposit_paid ? 'btn-ghost text-emerald-600' : 'bg-[var(--primary)] text-white hover:brightness-110 shadow-md'
             }`}
           >
             {order.is_deposit_paid ? 'Paid' : 'Mark as Paid'}
           </button>
        </div>

        {/* Milestone 2: Balance */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-base-200 bg-base-50/30">
           <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.is_final_paid ? 'bg-emerald-100 text-emerald-600' : 'bg-base-200 text-base-content/30'}`}>
                 {order.is_final_paid ? <CheckCircle2 size={20} /> : <CreditCard size={20} />}
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-base-content/40">Milestone 2: Final Balance</span>
                 <span className="text-sm font-black text-base-content">50% Pre-Dispatch <span className="font-mono text-xs opacity-50">({fmt(balance)})</span></span>
              </div>
           </div>
           <button 
             disabled={!order.is_deposit_paid}
             onClick={() => handleTogglePayment('is_final_paid', !order.is_final_paid)}
             className={`btn btn-sm text-[10px] font-black uppercase tracking-widest transition-all ${
               order.is_final_paid ? 'btn-ghost text-emerald-600' : 'bg-[var(--primary)] text-white hover:brightness-110 shadow-md'
             }`}
           >
             {order.is_final_paid ? 'Paid' : 'Mark as Paid'}
           </button>
        </div>

        {/* Invoice Links */}
        {order.invoices && order.invoices.length > 0 && (
          <div className="mt-8 pt-6 border-t border-base-200">
             <h4 className="text-[9px] font-black uppercase tracking-widest text-base-content/30 mb-4">Associated Invoice Records</h4>
             <div className="grid grid-cols-1 gap-2">
                {order.invoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between py-2 px-3 bg-base-200/40 rounded-lg hover:bg-base-200 transition-colors">
                     <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${inv.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        <span className="text-[10px] font-black text-base-content uppercase tracking-tight">{inv.milestone_type} Invoice</span>
                        <span className="text-[10px] font-mono text-base-content/40">{fmt(inv.amount)}</span>
                     </div>
                     <a href={`/Dashboard/Invoices?id=${inv.id}`} className="text-[var(--primary)] hover:opacity-70 transition-opacity p-1">
                        <ExternalLink size={14} />
                     </a>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
