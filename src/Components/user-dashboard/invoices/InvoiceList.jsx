"use client";
import React, { useState } from "react";
import {
  FileText, Download, Eye, CheckCircle, XCircle, Clock,
  AlertCircle, Search, DollarSign, Landmark, Globe, Banknote,
  X, ShieldCheck, ArrowUpRight, Info, Wallet, ChevronDown, ChevronUp,
} from "lucide-react";
import StatusFilterBar from "@/Components/user-dashboard/StatusFilterBar";

// ─── Payment Method Meta (mirrors PaymentMethodSection.jsx) ──────────────────
const PAYMENT_METHOD_META = {
  paypal:        { name: "PayPal",               icon: DollarSign, color: "text-blue-600",    bg: "bg-blue-50",    feeLabel: "4.4% + $0.30"  },
  bank:          { name: "Bank Transfer (T/T)",   icon: Landmark,   color: "text-emerald-700", bg: "bg-emerald-50", feeLabel: "$35.00 flat"    },
  western_union: { name: "Western Union",          icon: Globe,      color: "text-yellow-700",  bg: "bg-yellow-50",  feeLabel: "~2% of total"   },
  payoneer:      { name: "Payoneer",               icon: Banknote,   color: "text-orange-700",  bg: "bg-orange-50",  feeLabel: "3% + $3.00"     },
};

// ─── Mock Invoice Data ────────────────────────────────────────────────────────
// Each invoice corresponds to a payment milestone from the review page.
const MOCK_INVOICES = [
  {
    id: "INV-2024-001",
    orderId: "ORD-5821",
    orderName: "Heavyweight Cotton Fleece Hoodie",
    milestoneType: "deposit",          // 'deposit' | 'final' | 'full'
    paymentSchedule: "split",          // 'split' | 'full'
    paymentMethodId: "bank",
    issuedDate: "2024-03-10",
    dueDate: "2024-03-25",
    productionSubtotal: 8250.00,       // 500 units × $16.50
    transferFee: 35.00,                // $35 flat bank TT fee
    grandTotal: 8285.00,
    amount: 4142.50,                   // 50% of grand total (deposit)
    currency: "USD",
    status: "pending",
    pdfUrl: null,
    notes: "50% deposit invoice to initiate production of 500 units. Remaining 50% ($4,142.50) due before shipment.",
    sizing: { XS: 50, S: 75, M: 150, L: 150, XL: 50, "2XL": 25 },
    totalUnits: 500,
    unitPrice: 15.00,
    brandingAddon: 1.50,
    brandingFormat: "Screen Print",
  },
  {
    id: "INV-2024-002",
    orderId: "ORD-5799",
    orderName: "Polo Shirt — Standard Fit",
    milestoneType: "full",
    paymentSchedule: "full",
    paymentMethodId: "paypal",
    issuedDate: "2024-02-20",
    dueDate: "2024-03-05",
    productionSubtotal: 1100.00,       // 200 units × $5.50
    transferFee: 48.70,                // 4.4% + $0.30
    grandTotal: 1148.70,
    amount: 1148.70,
    currency: "USD",
    status: "approved",
    pdfUrl: null,
    notes: "Full payment for 200-unit polo shirt production order. Approved and production started.",
    sizing: { S: 50, M: 80, L: 50, XL: 20 },
    totalUnits: 200,
    unitPrice: 5.00,
    brandingAddon: 0.50,
    brandingFormat: "3D Embroidery",
  },
  {
    id: "INV-2024-003",
    orderId: "ORD-5740",
    orderName: "Track Pants — Custom Sizing",
    milestoneType: "deposit",
    paymentSchedule: "split",
    paymentMethodId: "western_union",
    issuedDate: "2024-01-15",
    dueDate: "2024-01-30",
    productionSubtotal: 3900.00,       // 300 units × $13.00
    transferFee: 78.00,                // 2% WU fee
    grandTotal: 3978.00,
    amount: 1989.00,
    currency: "USD",
    status: "rejected",
    pdfUrl: null,
    notes: "Invoice rejected due to pricing discrepancy — unit price should be $12.50 not $13.00. Admin has been notified to reissue.",
    sizing: [{ name: "S/M", qty: 100 }, { name: "L/XL", qty: 150 }, { name: "XXL+", qty: 50 }],
    totalUnits: 300,
    unitPrice: 13.00,
    brandingAddon: 0,
    brandingFormat: null,
  },
  {
    id: "INV-2024-004",
    orderId: "ORD-5900",
    orderName: "Bomber Jacket — 100 pcs",
    milestoneType: "final",
    paymentSchedule: "split",
    paymentMethodId: "payoneer",
    issuedDate: "2024-03-18",
    dueDate: "2024-04-01",
    productionSubtotal: 3200.00,       // 100 units × $32.00
    transferFee: 99.00,                // 3% + $3
    grandTotal: 3299.00,
    amount: 1649.50,                   // 50% final payment
    currency: "USD",
    status: "pending",
    pdfUrl: null,
    notes: "Final 50% payment before shipment of completed Bomber Jacket order.",
    sizing: { S: 20, M: 35, L: 30, XL: 15 },
    totalUnits: 100,
    unitPrice: 32.00,
    brandingAddon: 0,
    brandingFormat: null,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_META = {
  pending:  { label: "Pending Review", dot: "bg-amber-400",   text: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200"  },
  approved: { label: "Approved",        dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  rejected: { label: "Rejected",        dot: "bg-red-400",     text: "text-red-600",     bg: "bg-red-50",     border: "border-red-200"    },
};

const MILESTONE_META = {
  deposit: { label: "50% Deposit",      color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200"   },
  final:   { label: "Final Payment",    color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  full:    { label: "Full Payment",     color: "text-slate-600",  bg: "bg-slate-100", border: "border-slate-200"  },
};

const fmt = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

const fmtDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const isOverdue = (dueDate, status) =>
  status === "pending" && new Date(dueDate) < new Date();

// ─── StatusBadge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${m.bg} ${m.border} ${m.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

// ─── MilestoneBadge ───────────────────────────────────────────────────────────
function MilestoneBadge({ type }) {
  const m = MILESTONE_META[type] || MILESTONE_META.full;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${m.bg} ${m.border} ${m.color}`}>
      {m.label}
    </span>
  );
}

// ─── Invoice Card ─────────────────────────────────────────────────────────────
function InvoiceCard({ invoice, onView, onApprove, onReject }) {
  const [expanded, setExpanded] = useState(false);
  const isPending = invoice.status === "pending";
  const overdue = isOverdue(invoice.dueDate, invoice.status);
  const method = PAYMENT_METHOD_META[invoice.paymentMethodId] || PAYMENT_METHOD_META.bank;
  const MethodIcon = method.icon;

  return (
    <div className={`bg-base-100 rounded-2xl border shadow-sm transition-all duration-200 overflow-hidden ${
      isPending ? "border-amber-200 hover:shadow-md hover:shadow-amber-100/50" : "border-base-200 hover:shadow-md"
    }`}>
      {/* Urgency strip for pending */}
      {isPending && (
        <div className={`h-[3px] w-full ${overdue ? "bg-red-500" : "bg-amber-400"}`} />
      )}

      <div className="p-5">
        {/* Top Row: Icon + IDs + Status */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isPending ? "bg-amber-50" : invoice.status === "approved" ? "bg-emerald-50" : "bg-base-200"
            }`}>
              <FileText size={18} className={
                isPending ? "text-amber-600" : invoice.status === "approved" ? "text-emerald-600" : "text-base-content/40"
              } />
            </div>
            <div>
              <p className="font-bold text-sm text-base-content">{invoice.id}</p>
              <p className="text-xs text-base-content/50 mt-0.5 truncate max-w-[200px]">{invoice.orderName}</p>
              <p className="text-[10px] font-mono text-base-content/30 mt-0.5">Order #{invoice.orderId}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <StatusBadge status={invoice.status} />
            <MilestoneBadge type={invoice.milestoneType} />
          </div>
        </div>

        {/* KPI Chips */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-base-200/50 rounded-xl px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-0.5">Amount Due</p>
            <p className="text-sm font-extrabold text-base-content">{fmt(invoice.amount)}</p>
          </div>
          <div className="bg-base-200/50 rounded-xl px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-0.5">Issued</p>
            <p className="text-xs font-semibold text-base-content">{fmtDate(invoice.issuedDate)}</p>
          </div>
          <div className={`rounded-xl px-3 py-2.5 ${overdue ? "bg-red-50" : "bg-base-200/50"}`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${overdue ? "text-red-500" : "text-base-content/40"}`}>
              {overdue ? "Overdue!" : "Due Date"}
            </p>
            <p className={`text-xs font-semibold ${overdue ? "text-red-600" : "text-base-content"}`}>
              {fmtDate(invoice.dueDate)}
            </p>
          </div>
        </div>

        {/* Payment method mini-badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold ${method.bg} ${method.color} border-current/10`}>
            <MethodIcon size={12} />
            {method.name}
            <span className="text-current/60 font-normal">· {method.feeLabel}</span>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <p className="text-[11px] text-base-content/50 bg-base-200/40 rounded-xl px-3 py-2.5 mb-4 leading-relaxed border border-base-200/50">
            {invoice.notes}
          </p>
        )}

        {/* Expandable Breakdown */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-base-content/40 hover:text-base-content/60 transition-colors mb-2"
        >
          <span>Pricing Breakdown</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {expanded && (
          <div className="space-y-1.5 text-[11px] border border-base-200/60 rounded-xl p-3 mb-4 bg-base-200/20">
            <div className="flex justify-between text-base-content/60">
              <span>{invoice.totalUnits} units × ${invoice.unitPrice.toFixed(2)}</span>
              <span className="font-semibold">${(invoice.totalUnits * invoice.unitPrice).toFixed(2)}</span>
            </div>
            {invoice.brandingAddon > 0 && (
              <div className="flex justify-between text-base-content/60">
                <span>{invoice.brandingFormat} branding × {invoice.totalUnits}</span>
                <span className="font-semibold">+${(invoice.totalUnits * invoice.brandingAddon).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base-content/60 border-t border-base-200/60 pt-1.5">
              <span className="font-semibold">Production Subtotal</span>
              <span className="font-semibold">${invoice.productionSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-amber-700">
              <span>Transfer Fee ({method.feeLabel})</span>
              <span className="font-semibold">+${invoice.transferFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base-content border-t border-base-200/60 pt-1.5">
              <span>Grand Total</span>
              <span style={{ color: "var(--primary)" }}>${invoice.grandTotal.toFixed(2)}</span>
            </div>
            {invoice.paymentSchedule === "split" && (
              <div className="flex justify-between text-base-content/50 italic">
                <span>This Invoice ({invoice.milestoneType === "deposit" ? "50% Deposit" : "50% Final"})</span>
                <span className="font-semibold not-italic text-base-content">${invoice.amount.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onView(invoice)}
            className="flex items-center gap-1.5 text-xs font-semibold text-base-content/60 hover:text-[var(--primary)] border border-base-200 hover:border-[var(--primary)]/30 px-3 py-2 rounded-xl transition-all"
          >
            <Eye size={13} /> View Invoice
          </button>
          {invoice.pdfUrl && (
            <a href={invoice.pdfUrl} download
              className="flex items-center gap-1.5 text-xs font-semibold text-base-content/60 hover:text-[var(--primary)] border border-base-200 hover:border-[var(--primary)]/30 px-3 py-2 rounded-xl transition-all">
              <Download size={13} /> Download PDF
            </a>
          )}
          {isPending && (
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={() => onReject(invoice.id)}
                className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-xl transition-all">
                <XCircle size={13} /> Reject
              </button>
              <button onClick={() => onApprove(invoice.id)}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-xl transition-all shadow-sm shadow-emerald-200">
                <CheckCircle size={13} /> Approve
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Invoice Modal ─────────────────────────────────────────────────────────────
function InvoiceModal({ invoice, onClose, onApprove, onReject }) {
  if (!invoice) return null;
  const isPending = invoice.status === "pending";
  const overdue = isOverdue(invoice.dueDate, invoice.status);
  const method = PAYMENT_METHOD_META[invoice.paymentMethodId] || PAYMENT_METHOD_META.bank;
  const MethodIcon = method.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-base-100 rounded-2xl shadow-2xl w-full max-w-lg border border-base-200 flex flex-col" style={{ maxHeight: "92vh" }}>

        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-base-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "color-mix(in srgb, var(--primary) 10%, transparent)" }}>
              <FileText size={18} style={{ color: "var(--primary)" }} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-base-content">{invoice.id}</p>
              <p className="text-xs text-base-content/40 truncate">{invoice.orderName}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-base-200 flex items-center justify-center text-base-content/40 hover:text-base-content transition-colors shrink-0 ml-3">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-5 space-y-4">

          {/* Status + Milestone Row */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <StatusBadge status={invoice.status} />
            <MilestoneBadge type={invoice.milestoneType} />
          </div>

          {/* Overdue warning */}
          {overdue && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
              <AlertCircle size={14} />
              This invoice is overdue. Please review and approve immediately to avoid production delays.
            </div>
          )}

          {/* PDF Area */}
          <div className={`rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-8 gap-3 ${
            invoice.pdfUrl ? "border-[var(--primary)]/30 bg-[var(--primary)]/5" : "border-base-300 bg-base-200/40"
          }`}>
            {invoice.pdfUrl ? (
              <embed src={invoice.pdfUrl} type="application/pdf" className="w-full h-56 rounded-lg" />
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-base-300 flex items-center justify-center">
                  <FileText size={22} className="text-base-content/25" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-base-content/40">No PDF attached yet</p>
                  <p className="text-xs text-base-content/25 mt-0.5">Admin will attach the invoice PDF once generated</p>
                </div>
              </>
            )}
          </div>

          {/* Invoice Meta Grid */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Invoice ID",  value: invoice.id },
              { label: "Order",       value: "#" + invoice.orderId },
              { label: "Issued",      value: fmtDate(invoice.issuedDate) },
              { label: "Due Date",    value: fmtDate(invoice.dueDate) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-base-200/60 rounded-xl px-3.5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-1">{label}</p>
                <p className="text-sm font-semibold text-base-content">{value}</p>
              </div>
            ))}
          </div>

          {/* Full Pricing Breakdown */}
          <div className="rounded-xl border border-base-200/60 overflow-hidden">
            <div className="bg-base-200/40 px-4 py-2 border-b border-base-200/60">
              <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/50">Pricing Breakdown</p>
            </div>
            <div className="px-4 py-3 space-y-2 text-xs">
              <div className="flex justify-between text-base-content/60">
                <span>{invoice.totalUnits} units × ${invoice.unitPrice.toFixed(2)}/unit</span>
                <span className="font-semibold">${(invoice.totalUnits * invoice.unitPrice).toFixed(2)}</span>
              </div>
              {invoice.brandingAddon > 0 && (
                <div className="flex justify-between text-base-content/60">
                  <span>{invoice.brandingFormat} × {invoice.totalUnits} units</span>
                  <span className="font-semibold">+${(invoice.totalUnits * invoice.brandingAddon).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base-content border-t border-base-200/50 pt-2 font-semibold">
                <span>Production Subtotal</span>
                <span>${invoice.productionSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-amber-700">
                <span className="flex items-center gap-1"><Info size={10} /> Transfer Fee ({method.feeLabel})</span>
                <span className="font-semibold">+${invoice.transferFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base-content font-bold border-t border-base-200/50 pt-2 text-sm">
                <span>Grand Total (incl. fee)</span>
                <span style={{ color: "var(--primary)" }}>${invoice.grandTotal.toFixed(2)}</span>
              </div>
              {invoice.paymentSchedule === "split" && (
                <>
                  <div className="w-full h-px bg-base-200/50" />
                  <div className="flex justify-between text-base-content/60">
                    <span>50% Deposit</span>
                    <span className="font-semibold">${(invoice.grandTotal * 0.5).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base-content/60">
                    <span>50% Final (before shipping)</span>
                    <span className="font-semibold">${(invoice.grandTotal * 0.5).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
            {/* Amount due highlighted */}
            <div className="px-4 py-3 bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] border-t border-[color-mix(in_srgb,var(--primary)_15%,transparent)] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "color-mix(in srgb, var(--primary) 70%, transparent)" }}>
                  {invoice.paymentSchedule === "split"
                    ? invoice.milestoneType === "deposit" ? "50% Deposit — Due Now" : "50% Final — Due Now"
                    : "Full Payment — Due Now"}
                </p>
                {invoice.paymentSchedule === "split" && (
                  <p className="text-[10px] text-base-content/40 mt-0.5 font-mono">of ${invoice.grandTotal.toFixed(2)} total</p>
                )}
              </div>
              <p className="text-2xl font-black" style={{ color: "var(--primary)" }}>{fmt(invoice.amount)}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className={`flex items-center gap-3 p-3 rounded-xl border ${method.bg} border-current/10`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/60`}>
              <MethodIcon size={15} className={method.color} />
            </div>
            <div>
              <p className={`text-xs font-bold ${method.color}`}>{method.name}</p>
              <p className="text-[10px] text-base-content/50 mt-0.5">Transfer fee: {method.feeLabel}</p>
            </div>
          </div>

          {/* Admin Notes */}
          {invoice.notes && (
            <div className="bg-base-200/50 rounded-xl px-4 py-3.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-2">Notes from Admin</p>
              <p className="text-sm text-base-content/70 leading-relaxed">{invoice.notes}</p>
            </div>
          )}

          {invoice.pdfUrl && (
            <a href={invoice.pdfUrl} download
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-base-200 hover:border-[var(--primary)]/30 text-sm font-semibold text-base-content/60 hover:text-[var(--primary)] transition-all">
              <Download size={14} /> Download PDF
            </a>
          )}
        </div>

        {/* Pinned Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-base-200 flex gap-3">
          {isPending ? (
            <>
              <button onClick={() => { onReject(invoice.id); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition-all">
                <XCircle size={14} /> Reject
              </button>
              <button onClick={() => { onApprove(invoice.id); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-100 transition-all">
                <CheckCircle size={14} /> Approve & Pay
              </button>
            </>
          ) : (
            <button onClick={onClose}
              className="w-full flex items-center justify-center py-2.5 rounded-xl text-sm font-semibold border border-base-200 hover:bg-base-200 transition-all">
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function InvoiceList() {
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [modalInvoice, setModalInvoice] = useState(null);

  const handleApprove = (id) =>
    setInvoices((prev) => prev.map((inv) => inv.id === id ? { ...inv, status: "approved" } : inv));

  const handleReject = (id) =>
    setInvoices((prev) => prev.map((inv) => inv.id === id ? { ...inv, status: "rejected" } : inv));

  const counts = {
    all:      invoices.length,
    pending:  invoices.filter((i) => i.status === "pending").length,
    approved: invoices.filter((i) => i.status === "approved").length,
    rejected: invoices.filter((i) => i.status === "rejected").length,
  };

  const totalPending  = invoices.filter((i) => i.status === "pending").reduce((a, b) => a + b.amount, 0);
  const totalApproved = invoices.filter((i) => i.status === "approved").reduce((a, b) => a + b.amount, 0);

  const filtered = invoices.filter((inv) => {
    const matchTab    = activeTab === "all" || inv.status === activeTab;
    const matchSearch = search === "" ||
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.orderName.toLowerCase().includes(search.toLowerCase()) ||
      inv.orderId.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const TABS = [
    { key: "all",      label: "All",      count: counts.all      },
    { key: "pending",  label: "Pending",  count: counts.pending  },
    { key: "approved", label: "Approved", count: counts.approved },
    { key: "rejected", label: "Rejected", count: counts.rejected },
  ];

  return (
    <div className="space-y-5 font-sans">

      {/* ─── Stats Strip ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Invoices",   value: counts.all,             icon: FileText,    color: "text-[var(--primary)]", bg: "bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]" },
          { label: "Awaiting Review",  value: counts.pending,         icon: Clock,       color: "text-amber-600",        bg: "bg-amber-50"   },
          { label: "Approved",         value: counts.approved,        icon: CheckCircle, color: "text-emerald-600",      bg: "bg-emerald-50" },
          { label: "Amount Pending",   value: fmt(totalPending),      icon: Wallet,      color: "text-amber-600",        bg: "bg-amber-50"   },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-base-100 border border-base-200 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 truncate">{label}</p>
              <p className="text-lg font-extrabold text-base-content">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Filter + Search ─── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex-1">
          <StatusFilterBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} label="Status:" />
        </div>
        <div className="relative shrink-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoices…"
            className="pl-9 pr-4 py-2.5 text-sm border border-base-200 rounded-xl focus:outline-none focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-[var(--primary)]/10 bg-base-100 w-full sm:w-60 placeholder:text-base-content/25 transition-all"
          />
        </div>
      </div>

      {/* ─── Pending Action Banner ─── */}
      {counts.pending > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 flex items-start gap-3">
          <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-amber-800 font-semibold">
              {counts.pending} invoice{counts.pending > 1 ? "s" : ""} awaiting your approval
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              Total pending: <strong>{fmt(totalPending)}</strong>.{" "}
              Approve invoices to keep production on schedule.{" "}
              <button onClick={() => setActiveTab("pending")} className="underline font-bold hover:text-amber-900 transition-colors">
                Review now →
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ─── How Invoices Work (info card) ─── */}
      <div className="flex items-start gap-3 p-4 bg-base-100 rounded-2xl border border-base-200 shadow-sm">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: "color-mix(in srgb, var(--primary) 10%, transparent)" }}>
          <Info size={16} style={{ color: "var(--primary)" }} />
        </div>
        <div className="text-xs text-base-content/60 leading-relaxed">
          <p className="font-bold text-base-content/80 mb-0.5">How invoices work</p>
          Invoices are issued by the admin for each payment milestone —{" "}
          <strong>50% deposit</strong> at order start and <strong>50% final</strong> before shipping (or full payment for single-payment orders).
          Each invoice reflects the production cost + your chosen transfer fee (PayPal, Bank T/T, Western Union, or Payoneer).
          <span className="text-[var(--primary)] font-semibold"> Approve to confirm payment.</span>
        </div>
      </div>

      {/* ─── Invoice Grid ─── */}
      {filtered.length === 0 ? (
        <div className="bg-base-100 border border-base-200 rounded-2xl py-20 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center">
            <FileText size={22} className="text-base-content/20" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-base-content/50">No invoices found</p>
            <p className="text-xs text-base-content/30 mt-1">
              {search ? "Try a different search term" : "Your invoices will appear here when issued by admin"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((inv) => (
            <InvoiceCard
              key={inv.id}
              invoice={inv}
              onView={setModalInvoice}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}

      {/* ─── Invoice Modal ─── */}
      <InvoiceModal
        invoice={modalInvoice}
        onClose={() => setModalInvoice(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
