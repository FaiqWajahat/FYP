"use client";
import React from "react";
import { DollarSign, CreditCard, Wallet, Building, Calendar, SplitSquareHorizontal } from "lucide-react";

const PAYMENT_METHODS = [
  { id: "wire",   label: "Wire Transfer", desc: "Bank-to-bank",    icon: Building },
  { id: "paypal", label: "PayPal",         desc: "Online payment",  icon: Wallet },
  { id: "stripe", label: "Stripe",         desc: "Card processing", icon: CreditCard },
];

const PAYMENT_DIVISIONS = [
  {
    id: "full",
    label: "Full Payment",
    desc: "100% due upfront before production begins.",
    badge: "Standard",
    badgeClass: "badge-ghost",
  },
  {
    id: "split",
    label: "50 / 50 Split",
    desc: "50% deposit now, balance on delivery.",
    badge: "Recommended",
    badgeClass: "badge-warning",
  },
  {
    id: "deposit30",
    label: "30% Deposit",
    desc: "30% deposit now, balance before dispatch.",
    badge: "Flexible",
    badgeClass: "badge-info",
  },
];

const ORDER_STATUSES = [
  "payment pending",
  "Processing",
  "Quality Check",
  "Dispatched",
  "Completed",
  "On Hold",
  "Cancelled",
];

export default function AOStepPricing({ form, errors, onChange }) {
  const totalQty =
    form.sizingMode === "standard"
      ? Object.values(form.standardQuantities || {}).reduce((a, b) => a + b, 0)
      : (form.customSizeRows || []).reduce((a, r) => a + (parseInt(r.qty) || 0), 0);

  const unitPrice = parseFloat(form.unitPrice || 0);
  const subtotal = totalQty * unitPrice;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-base-200">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
          <DollarSign size={20} />
        </div>
        <div>
          <h3 className="font-black text-base-content text-sm uppercase tracking-widest">Pricing & Payment</h3>
          <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">Set pricing, payment terms and order status</p>
        </div>
      </div>

      {/* Live Pricing Summary */}
      <div className="bg-base-200/60 rounded-2xl p-5 grid grid-cols-3 divide-x divide-base-300">
        {[
          { label: "Total Units", value: totalQty.toLocaleString(), sub: "pieces" },
          { label: "Unit Price", value: `$${unitPrice.toFixed(2)}`, sub: "per piece" },
          { label: "Subtotal", value: `$${subtotal.toFixed(2)}`, sub: "estimated", highlight: true },
        ].map((s, i) => (
          <div key={i} className={`text-center px-4 ${i > 0 ? "" : ""}`}>
            <p className="text-[9px] font-black uppercase tracking-widest text-base-content/40">{s.label}</p>
            <p className={`text-xl font-black mt-1 leading-none ${s.highlight ? "text-[var(--primary)]" : "text-base-content"}`}>
              {s.value}
            </p>
            <p className="text-[9px] text-base-content/30 font-bold uppercase tracking-wider mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Price Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Unit Price */}
        <div className="form-control gap-1">
          <label className="label py-0">
            <span className="label-text text-[11px] font-black uppercase tracking-widest text-base-content/50 flex items-center gap-1">
              <DollarSign size={12} /> Unit Price (USD) <span className="text-[var(--primary)]">*</span>
            </span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.unitPrice || ""}
            onChange={(e) => onChange("unitPrice", e.target.value)}
            placeholder="0.00"
            className={`input input-bordered w-full rounded-xl text-sm h-11 font-bold focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 ${errors.unitPrice ? "input-error" : ""}`}
          />
          {errors.unitPrice && <p className="text-error text-[10px] font-bold">{errors.unitPrice}</p>}
        </div>

        {/* Override Total */}
        <div className="form-control gap-1">
          <label className="label py-0">
            <span className="label-text text-[11px] font-black uppercase tracking-widest text-base-content/50">
              Override Total (USD)
            </span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.overrideTotal || ""}
            onChange={(e) => onChange("overrideTotal", e.target.value)}
            placeholder={subtotal.toFixed(2)}
            className="input input-bordered w-full rounded-xl text-sm h-11 font-bold focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
          <label className="label py-0">
            <span className="label-alt text-[9px] text-base-content/30 font-bold">Leave blank to use calculated total</span>
          </label>
        </div>

        {/* Currency */}
        <div className="form-control gap-1">
          <label className="label py-0">
            <span className="label-text text-[11px] font-black uppercase tracking-widest text-base-content/50">
              Currency
            </span>
          </label>
          <select
            value={form.currency || "USD"}
            onChange={(e) => onChange("currency", e.target.value)}
            className="select select-bordered w-full rounded-xl text-sm h-11 font-bold focus:border-[var(--primary)]"
          >
            {["USD", "EUR", "GBP", "PKR", "AED", "SAR"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Delivery Date */}
      <div className="form-control gap-1 max-w-xs">
        <label className="label py-0">
          <span className="label-text text-[11px] font-black uppercase tracking-widest text-base-content/50 flex items-center gap-1">
            <Calendar size={12} /> Estimated Delivery
          </span>
        </label>
        <input
          type="date"
          value={form.estimatedDelivery || ""}
          onChange={(e) => onChange("estimatedDelivery", e.target.value)}
          className="input input-bordered w-full rounded-xl text-sm h-11 font-medium focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
        />
      </div>

      {/* Payment Method */}
      <div className="space-y-3">
        <p className="text-[11px] font-black uppercase tracking-widest text-base-content/50 flex items-center gap-1.5">
          <CreditCard size={12} /> Payment Method
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PAYMENT_METHODS.map((m) => {
            const Icon = m.icon;
            const selected = form.paymentMethod === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onChange("paymentMethod", m.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  selected
                    ? "border-[var(--primary)] bg-[var(--primary)]/5"
                    : "border-base-200 bg-base-100 hover:border-base-300"
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${selected ? "bg-[var(--primary)] text-white" : "bg-base-200 text-base-content/40"}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <p className={`text-[11px] font-black uppercase tracking-tight ${selected ? "text-[var(--primary)]" : "text-base-content/70"}`}>{m.label}</p>
                  <p className="text-[9px] font-bold text-base-content/30">{m.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment Division */}
      <div className="space-y-3">
        <p className="text-[11px] font-black uppercase tracking-widest text-base-content/50 flex items-center gap-1.5">
          <SplitSquareHorizontal size={12} /> Payment Schedule
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PAYMENT_DIVISIONS.map((d) => {
            const selected = form.paymentDivision === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => onChange("paymentDivision", d.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selected
                    ? "border-[var(--primary)] bg-[var(--primary)]/5"
                    : "border-base-200 bg-base-100 hover:border-base-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className={`text-[11px] font-black uppercase tracking-tight ${selected ? "text-[var(--primary)]" : "text-base-content/70"}`}>{d.label}</p>
                  <span className={`badge badge-xs font-black text-[8px] ${d.badgeClass}`}>{d.badge}</span>
                </div>
                <p className="text-[9px] font-bold text-base-content/30 leading-snug">{d.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Order Status */}
      <div className="form-control gap-1 max-w-xs">
        <label className="label py-0">
          <span className="label-text text-[11px] font-black uppercase tracking-widest text-base-content/50">
            Initial Order Status
          </span>
        </label>
        <select
          value={form.status || "payment pending"}
          onChange={(e) => onChange("status", e.target.value)}
          className="select select-bordered w-full rounded-xl text-sm h-11 font-bold focus:border-[var(--primary)]"
        >
          {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );
}
