"use client";
import React, { useState } from "react";
import {
  FileText, Download, Eye, CheckCircle, XCircle, Clock,
  AlertCircle, ChevronRight, Search, Filter, ArrowUpRight,
} from "lucide-react";
import StatusFilterBar from "@/Components/user-dashboard/StatusFilterBar";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_INVOICES = [
  {
    id: "INV-2024-001",
    orderId: "ORD-5821",
    orderName: "Custom Hoodie — 500 pcs",
    issuedDate: "2024-03-10",
    dueDate: "2024-03-25",
    amount: 4850.0,
    currency: "USD",
    status: "pending",
    pdfUrl: null,
    notes: "50% milestone payment for bulk hoodie production.",
  },
  {
    id: "INV-2024-002",
    orderId: "ORD-5799",
    orderName: "Polo Shirt — 200 pcs",
    issuedDate: "2024-02-20",
    dueDate: "2024-03-05",
    amount: 1240.0,
    currency: "USD",
    status: "approved",
    pdfUrl: null,
    notes: "Final payment for polo shirt order.",
  },
  {
    id: "INV-2024-003",
    orderId: "ORD-5740",
    orderName: "Track Pants — 300 pcs",
    issuedDate: "2024-01-15",
    dueDate: "2024-01-30",
    amount: 2100.0,
    currency: "USD",
    status: "rejected",
    pdfUrl: null,
    notes: "Initial deposit. Rejected due to pricing discrepancy.",
  },
  {
    id: "INV-2024-004",
    orderId: "ORD-5900",
    orderName: "Bomber Jacket — 100 pcs",
    issuedDate: "2024-03-18",
    dueDate: "2024-04-01",
    amount: 3300.0,
    currency: "USD",
    status: "pending",
    pdfUrl: null,
    notes: "Production deposit for jacket order.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_META = {
  pending: {
    label: "Pending Review",
    icon: Clock,
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-400",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle,
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-600",
    dot: "bg-red-400",
  },
};

const fmt = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

const fmtDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.pending;
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${m.bg} ${m.border} ${m.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

function InvoiceCard({ invoice, onView, onApprove, onReject }) {
  const isPending = invoice.status === "pending";
  return (
    <div className={`bg-base-100 border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 ${
      isPending ? "border-amber-200" : "border-base-200"
    }`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isPending ? "bg-amber-50" : "bg-base-200"
          }`}>
            <FileText size={18} className={isPending ? "text-amber-600" : "text-base-content/50"} />
          </div>
          <div>
            <p className="font-bold text-sm text-base-content">{invoice.id}</p>
            <p className="text-xs text-base-content/50 mt-0.5">{invoice.orderName}</p>
            <p className="text-xs text-base-content/30 mt-0.5">Order #{invoice.orderId}</p>
          </div>
        </div>
        <StatusBadge status={invoice.status} />
      </div>

      {/* Amounts + dates */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-base-200/50 rounded-xl px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-0.5">Amount</p>
          <p className="text-sm font-extrabold text-base-content">{fmt(invoice.amount, invoice.currency)}</p>
        </div>
        <div className="bg-base-200/50 rounded-xl px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-0.5">Issued</p>
          <p className="text-xs font-semibold text-base-content">{fmtDate(invoice.issuedDate)}</p>
        </div>
        <div className="bg-base-200/50 rounded-xl px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-0.5">Due</p>
          <p className="text-xs font-semibold text-base-content">{fmtDate(invoice.dueDate)}</p>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <p className="text-xs text-base-content/50 bg-base-200/40 rounded-xl px-3 py-2 mb-4 leading-relaxed">
          {invoice.notes}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onView(invoice)}
          className="flex items-center gap-1.5 text-xs font-semibold text-base-content/60 hover:text-primary border border-base-200 hover:border-primary/30 px-3 py-2 rounded-xl transition-all"
        >
          <Eye size={13} /> View Invoice
        </button>

        {invoice.pdfUrl && (
          <a
            href={invoice.pdfUrl}
            download
            className="flex items-center gap-1.5 text-xs font-semibold text-base-content/60 hover:text-primary border border-base-200 hover:border-primary/30 px-3 py-2 rounded-xl transition-all"
          >
            <Download size={13} /> Download PDF
          </a>
        )}

        {isPending && (
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => onReject(invoice.id)}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-xl transition-all"
            >
              <XCircle size={13} /> Reject
            </button>
            <button
              onClick={() => onApprove(invoice.id)}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-xl transition-all"
            >
              <CheckCircle size={13} /> Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function InvoiceModal({ invoice, onClose, onApprove, onReject }) {
  if (!invoice) return null;
  const isPending = invoice.status === "pending";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel — flex column, capped height, scroll on body only */}
      <div
        className="relative bg-base-100 rounded-2xl shadow-2xl w-full max-w-md border border-base-200 flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        {/* ── Pinned Header ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-base-200 bg-base-50 rounded-t-2xl">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText size={16} className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-base-content">{invoice.id}</p>
              <p className="text-xs text-base-content/40 truncate">{invoice.orderName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-base-200 flex items-center justify-center text-base-content/40 hover:text-base-content transition-colors flex-shrink-0 ml-3"
          >
            ✕
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-5 space-y-4">

          {/* Status */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-base-content/40 uppercase tracking-wider">Status</p>
            <StatusBadge status={invoice.status} />
          </div>

          {/* PDF area */}
          <div className={`rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-8 gap-2.5 ${
            invoice.pdfUrl ? "border-primary/30 bg-primary/5" : "border-base-300 bg-base-200/40"
          }`}>
            {invoice.pdfUrl ? (
              <embed src={invoice.pdfUrl} type="application/pdf" className="w-full h-56 rounded-lg" />
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-base-300 flex items-center justify-center">
                  <FileText size={22} className="text-base-content/30" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-base-content/40">No PDF attached yet</p>
                  <p className="text-xs text-base-content/25 mt-0.5">Admin will attach the invoice PDF</p>
                </div>
              </>
            )}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: "Invoice ID", value: invoice.id },
              { label: "Order",      value: invoice.orderId },
              { label: "Issued",     value: fmtDate(invoice.issuedDate) },
              { label: "Due Date",   value: fmtDate(invoice.dueDate) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-base-200/60 rounded-xl px-3.5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-1">{label}</p>
                <p className="text-sm font-semibold text-base-content">{value}</p>
              </div>
            ))}
          </div>

          {/* Amount */}
          <div className="bg-primary/5 border border-primary/15 rounded-xl px-5 py-3.5 flex items-center justify-between">
            <p className="text-xs font-bold text-primary/60 uppercase tracking-wider">Total Amount</p>
            <p className="text-2xl font-extrabold text-primary">{fmt(invoice.amount, invoice.currency)}</p>
          </div>

          {/* Admin notes */}
          {invoice.notes && (
            <div className="bg-base-200/50 rounded-xl px-4 py-3.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-2">Notes from Admin</p>
              <p className="text-sm text-base-content/70 leading-relaxed">{invoice.notes}</p>
            </div>
          )}

          {/* Download */}
          {invoice.pdfUrl && (
            <a
              href={invoice.pdfUrl}
              download
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-base-200 hover:border-primary/30 text-sm font-semibold text-base-content/60 hover:text-primary transition-all"
            >
              <Download size={14} /> Download PDF
            </a>
          )}
        </div>

        {/* ── Pinned Footer ── */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-base-200 bg-base-50 rounded-b-2xl flex gap-3">
          {isPending ? (
            <>
              <button
                onClick={() => { onReject(invoice.id); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition-all"
              >
                <XCircle size={14} /> Reject
              </button>
              <button
                onClick={() => { onApprove(invoice.id); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all"
              >
                <CheckCircle size={14} /> Approve
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center py-2.5 rounded-xl text-sm font-semibold border border-base-200 hover:bg-base-200 transition-all"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InvoiceList() {
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [modalInvoice, setModalInvoice] = useState(null);

  const handleApprove = (id) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "approved" } : inv))
    );
  };

  const handleReject = (id) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "rejected" } : inv))
    );
  };

  const counts = {
    all: invoices.length,
    pending: invoices.filter((i) => i.status === "pending").length,
    approved: invoices.filter((i) => i.status === "approved").length,
    rejected: invoices.filter((i) => i.status === "rejected").length,
  };

  const filtered = invoices.filter((inv) => {
    const matchTab = activeTab === "all" || inv.status === activeTab;
    const matchSearch =
      search === "" ||
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.orderName.toLowerCase().includes(search.toLowerCase()) ||
      inv.orderId.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalPending = invoices
    .filter((i) => i.status === "pending")
    .reduce((a, b) => a + b.amount, 0);

  const TABS = [
    { key: "all", label: "All", count: counts.all },
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "approved", label: "Approved", count: counts.approved },
    { key: "rejected", label: "Rejected", count: counts.rejected },
  ];

  return (
    <div className="space-y-5">

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Invoices", value: counts.all, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
          { label: "Awaiting Review", value: counts.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Approved", value: counts.approved, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Amount Pending", value: fmt(totalPending), icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-base-100 border border-base-200 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/40">{label}</p>
              <p className="text-lg font-extrabold text-base-content">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex-1">
          <StatusFilterBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} label="Status:" />
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoices…"
            className="pl-9 pr-4 py-2.5 text-sm border border-base-200 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 bg-base-100 w-full sm:w-56 placeholder:text-base-content/25 transition-all"
          />
        </div>
      </div>

      {/* Pending banner */}
      {counts.pending > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 flex items-center gap-3">
          <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-700 font-medium">
            You have <strong>{counts.pending} invoice{counts.pending > 1 ? "s" : ""}</strong> awaiting your review.{" "}
            <button onClick={() => setActiveTab("pending")} className="underline font-semibold hover:text-amber-900 transition-colors">
              View now
            </button>
          </p>
        </div>
      )}

      {/* Invoice grid */}
      {filtered.length === 0 ? (
        <div className="bg-base-100 border border-base-200 rounded-2xl py-16 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center">
            <FileText size={22} className="text-base-content/20" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-base-content/50">No invoices found</p>
            <p className="text-xs text-base-content/30 mt-1">
              {search ? "Try a different search term" : "Your invoices will appear here when issued"}
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

      {/* Modal */}
      <InvoiceModal
        invoice={modalInvoice}
        onClose={() => setModalInvoice(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
