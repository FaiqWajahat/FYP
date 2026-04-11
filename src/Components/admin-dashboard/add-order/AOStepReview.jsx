"use client";
import React from "react";
import {
  User, Package, DollarSign, Ruler, CreditCard,
  CheckCircle2, Scissors, Palette,
} from "lucide-react";

const Row = ({ label, value, mono = false }) =>
  value ? (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-base-100 last:border-0">
      <span className="text-[10px] font-black uppercase tracking-widest text-base-content/40 shrink-0">{label}</span>
      <span className={`text-[11px] font-bold text-base-content text-right ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  ) : null;

export default function AOStepReview({ form }) {
  const stdQty = form.standardQuantities || {};
  const customRows = form.customSizeRows || [];
  const sizingMode = form.sizingMode || "standard";

  const totalQty =
    sizingMode === "standard"
      ? Object.values(stdQty).reduce((a, b) => a + b, 0)
      : customRows.reduce((a, r) => a + (parseInt(r.qty) || 0), 0);

  const unitPrice = parseFloat(form.unitPrice || 0);
  const subtotal = form.overrideTotal ? parseFloat(form.overrideTotal) : totalQty * unitPrice;

  const SectionCard = ({ icon: Icon, title, children }) => (
    <div className="bg-base-100 rounded-2xl border border-base-200 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-base-100 bg-base-50">
        <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
          <Icon size={15} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-base-content/60">{title}</span>
      </div>
      <div className="px-5 py-1">{children}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-base-200">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
          <CheckCircle2 size={20} />
        </div>
        <div>
          <h3 className="font-black text-base-content text-sm uppercase tracking-widest">Review & Confirm</h3>
          <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">Double-check everything before submitting</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Customer */}
        <SectionCard icon={User} title="Customer">
          <Row label="Name" value={form.customerName} />
          <Row label="Email" value={form.customerEmail} />
          <Row label="Phone" value={form.customerPhone} />
          <Row label="Company" value={form.companyName} />
          <Row label="Country" value={form.country} />
        </SectionCard>

        {/* Product */}
        <SectionCard icon={Package} title="Product">
          <Row label="Name" value={form.productName} />
          <Row label="SKU" value={form.productSKU} mono />
          <Row label="Color" value={form.productColor} />
          <Row label="Material" value={form.productMaterial} />
          <Row label="Branding" value={form.brandingMethod || "None"} />
          {form.productImageFile && <Row label="Image" value={form.productImageFile.name} />}
        </SectionCard>

        {/* Sizing */}
        <SectionCard icon={Ruler} title={`Sizing — ${sizingMode === "standard" ? "Standard" : "Custom Chart"}`}>
          <Row label="Mode" value={sizingMode} />
          <Row label="Total Qty" value={`${totalQty} pcs`} />
          {sizingMode === "standard" && Object.entries(stdQty).map(([s, q]) =>
            q > 0 ? <Row key={s} label={s} value={`${q} pcs`} /> : null
          )}
          {sizingMode === "custom" && customRows.map((r) => (
            <Row key={r.id} label={r.name || "—"} value={`${r.qty} pcs`} />
          ))}
          {form.sizeChartFileName && <Row label="Chart File" value={form.sizeChartFileName} />}
        </SectionCard>

        {/* Pricing */}
        <SectionCard icon={DollarSign} title="Pricing & Payment">
          <Row label="Unit Price" value={`$${unitPrice.toFixed(2)}`} />
          <Row label="Total Units" value={`${totalQty} pcs`} />
          <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
          <Row label="Currency" value={form.currency || "USD"} />
          <Row label="Method" value={form.paymentMethod} />
          <Row label="Schedule" value={form.paymentDivision} />
          <Row label="Status" value={form.status} />
          <Row label="Est. Delivery" value={form.estimatedDelivery} />
        </SectionCard>
      </div>

      {/* Final confirm banner */}
      <div className="alert bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-2xl">
        <CheckCircle2 size={18} className="text-[var(--primary)] shrink-0" />
        <div>
          <p className="text-[11px] font-black text-base-content uppercase tracking-wider">Ready to Submit</p>
          <p className="text-[10px] font-bold text-base-content/50 mt-0.5">
            This order will be created immediately. You can manage it from the Orders dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
