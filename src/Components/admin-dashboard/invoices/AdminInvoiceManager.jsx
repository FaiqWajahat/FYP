"use client";
import React, { useState, useRef, useEffect } from "react";
import Loader from "@/Components/common/Loader";
import {
  FileText, Upload, Trash2, Eye, Search, Plus, X, CheckCircle,
  Clock, XCircle, AlertCircle, Download, ChevronDown, Building2,
} from "lucide-react";

// ─── Mock data (in real app this'd be fetched from DB) ────────────────────────
const MOCK_USERS = [
  { id: "u1", name: "John Doe", company: "Apex Apparel", email: "john@apex.com" },
  { id: "u2", name: "Sara Ahmed", company: "Nova Brands", email: "sara@nova.com" },
  { id: "u3", name: "Mike Chen", company: "Peak Wear", email: "mike@peak.com" },
];

const INITIAL_INVOICES = [
  {
    id: "INV-2024-001", userId: "u1", orderId: "ORD-5821",
    orderName: "Custom Hoodie — 500 pcs", issuedDate: "2024-03-10",
    dueDate: "2024-03-25", amount: 4850, currency: "USD",
    status: "pending", notes: "50% milestone payment.", pdfFile: null,
  },
  {
    id: "INV-2024-002", userId: "u2", orderId: "ORD-5799",
    orderName: "Polo Shirt — 200 pcs", issuedDate: "2024-02-20",
    dueDate: "2024-03-05", amount: 1240, currency: "USD",
    status: "approved", notes: "Final payment.", pdfFile: null,
  },
  {
    id: "INV-2024-003", userId: "u1", orderId: "ORD-5740",
    orderName: "Track Pants — 300 pcs", issuedDate: "2024-01-15",
    dueDate: "2024-01-30", amount: 2100, currency: "USD",
    status: "rejected", notes: "Pricing discrepancy — awaiting correction.", pdfFile: null,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_META = {
  pending: { label: "Pending", Icon: Clock, classes: "bg-amber-50 text-amber-700 border-amber-200" },
  approved: { label: "Approved", Icon: CheckCircle, classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  rejected: { label: "Rejected", Icon: XCircle, classes: "bg-red-50 text-red-600 border-red-200" },
};
const fmt = (n, c = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency: c }).format(n);
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
const genId = () => `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900 + 100)).padStart(3, "0")}`;

// ─── Upload Invoice Modal ─────────────────────────────────────────────────────
function UploadModal({ onClose, onSave }) {
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    userId: "", orderId: "", orderName: "", issuedDate: new Date().toISOString().split("T")[0],
    dueDate: "", amount: "", currency: "USD", notes: "", pdfFile: null,
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const valid = form.userId && form.orderId && form.amount && form.dueDate;

  const handleSubmit = () => {
    if (!valid) return;
    onSave({
      id: genId(),
      userId: form.userId,
      orderId: form.orderId,
      orderName: form.orderName || `Order ${form.orderId}`,
      issuedDate: form.issuedDate,
      dueDate: form.dueDate,
      amount: parseFloat(form.amount),
      currency: form.currency,
      status: "pending",
      notes: form.notes,
      pdfFile: form.pdfFile,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-base-100 rounded-2xl shadow-2xl w-full max-w-lg border border-base-200 overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-200 bg-base-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center">
              <Plus size={16} className="text-[var(--primary)]" />
            </div>
            <div>
              <p className="font-bold text-sm">Upload Invoice</p>
              <p className="text-xs text-base-content/40">Create &amp; send to client</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-base-200 flex items-center justify-center text-base-content/40 hover:text-base-content transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

          {/* Client */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-1.5 block">
              Client <span className="text-error">*</span>
            </label>
            <div className="relative">
              <select value={form.userId} onChange={e => set("userId", e.target.value)}
                className="w-full border border-base-300 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:border-[var(--primary)]/60 focus:ring-2 focus:ring-[var(--primary)]/10 bg-base-100">
                <option value="">Select a client…</option>
                {MOCK_USERS.map(u => (
                  <option key={u.id} value={u.id}>{u.name} — {u.company}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/30 pointer-events-none" />
            </div>
          </div>

          {/* Order */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-1.5 block">
                Order ID <span className="text-error">*</span>
              </label>
              <input type="text" value={form.orderId} onChange={e => set("orderId", e.target.value)}
                placeholder="ORD-0000"
                className="w-full border border-base-300 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-[var(--primary)]/60 focus:ring-2 focus:ring-[var(--primary)]/10 bg-base-100 placeholder:text-base-content/25" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-1.5 block">Order Description</label>
              <input type="text" value={form.orderName} onChange={e => set("orderName", e.target.value)}
                placeholder="e.g. Hoodie — 500 pcs"
                className="w-full border border-base-300 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-[var(--primary)]/60 focus:ring-2 focus:ring-[var(--primary)]/10 bg-base-100 placeholder:text-base-content/25" />
            </div>
          </div>

          {/* Amount */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-1.5 block">
                Amount <span className="text-error">*</span>
              </label>
              <input type="number" value={form.amount} onChange={e => set("amount", e.target.value)}
                placeholder="0.00" min="0" step="0.01"
                className="w-full border border-base-300 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-[var(--primary)]/60 focus:ring-2 focus:ring-[var(--primary)]/10 bg-base-100 placeholder:text-base-content/25" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-1.5 block">Currency</label>
              <select value={form.currency} onChange={e => set("currency", e.target.value)}
                className="w-full border border-base-300 rounded-xl px-3 py-3 text-sm focus:outline-none bg-base-100">
                {["USD", "EUR", "GBP", "AED", "PKR"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-1.5 block">Issue Date</label>
              <input type="date" value={form.issuedDate} onChange={e => set("issuedDate", e.target.value)}
                className="w-full border border-base-300 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-[var(--primary)]/60 bg-base-100 text-base-content/70" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-1.5 block">
                Due Date <span className="text-error">*</span>
              </label>
              <input type="date" value={form.dueDate} onChange={e => set("dueDate", e.target.value)}
                className="w-full border border-base-300 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-[var(--primary)]/60 bg-base-100 text-base-content/70" />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-1.5 block">Notes for Client</label>
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)}
              placeholder="Payment instructions, milestone description, etc."
              rows={2}
              className="w-full border border-base-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)]/60 bg-base-100 placeholder:text-base-content/25 resize-none" />
          </div>

          {/* PDF Upload */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-1.5 block">Invoice PDF</label>
            <button type="button" onClick={() => fileRef.current?.click()}
              className={`w-full border-2 border-dashed rounded-xl transition-all group ${form.pdfFile ? "border-[var(--primary)]/40 bg-[var(--primary)]/5 py-3 px-4" : "border-base-300 hover:border-[var(--primary)]/50 hover:bg-base-50 py-5 px-4"
                }`}>
              {form.pdfFile ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText size={14} className="text-[var(--primary)]" />
                  </div>
                  <span className="text-sm font-medium text-[var(--primary)] truncate flex-1">{form.pdfFile.name}</span>
                  <button type="button"
                    onClick={e => { e.stopPropagation(); set("pdfFile", null); }}
                    className="text-base-content/30 hover:text-error flex-shrink-0"><X size={14} /></button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-base-content/40 group-hover:text-[var(--primary)]/60 transition-colors">
                  <Upload size={22} />
                  <div className="text-center">
                    <p className="text-sm font-semibold">Upload Invoice PDF</p>
                    <p className="text-xs mt-0.5">PDF · Max 20MB</p>
                  </div>
                </div>
              )}
            </button>
            <input ref={fileRef} type="file" accept=".pdf" className="hidden"
              onChange={e => set("pdfFile", e.target.files?.[0] || null)} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-base-200 bg-base-50 flex gap-3 flex-shrink-0">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-base-200 hover:bg-base-200 transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!valid}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${valid ? "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 shadow-md" : "bg-base-200 text-base-content/30 cursor-not-allowed"
              }`}>
            <Upload size={14} /> Send Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Invoice Row ──────────────────────────────────────────────────────────────
function InvoiceRow({ invoice, user, onDelete }) {
  const m = STATUS_META[invoice.status] || STATUS_META.pending;
  const Icon = m.Icon;
  return (
    <div className="bg-base-100 border border-base-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4">
      {/* Info */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-bold text-base-content">{invoice.id}</p>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${m.classes}`}>
            <Icon size={9} /> {m.label}
          </span>
        </div>
        <p className="text-xs text-base-content/50 truncate">{invoice.orderName}</p>
        {user && (
          <p className="text-xs text-base-content/30 flex items-center gap-1 mt-0.5">
            <Building2 size={10} /> {user.company} · {user.name}
          </p>
        )}
      </div>

      {/* Amount */}
      <div className="text-right">
        <p className="text-sm font-extrabold text-base-content">{fmt(invoice.amount, invoice.currency)}</p>
        <p className="text-[10px] text-base-content/30">Due {fmtDate(invoice.dueDate)}</p>
      </div>

      {/* PDF badge */}
      <div>
        {invoice.pdfFile ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded-lg border border-[var(--primary)]/20">
            <FileText size={10} /> PDF
          </span>
        ) : (
          <span className="text-[10px] text-base-content/25 font-medium">No PDF</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {invoice.pdfFile && (
          <button className="w-8 h-8 rounded-lg border border-base-200 hover:border-[var(--primary)]/30 hover:text-[var(--primary)] flex items-center justify-center text-base-content/40 transition-all" title="Download PDF">
            <Download size={13} />
          </button>
        )}
        <button
          onClick={() => onDelete(invoice.id)}
          className="w-8 h-8 rounded-lg border border-base-200 hover:border-red-200 hover:text-red-500 hover:bg-red-50 flex items-center justify-center text-base-content/30 transition-all"
          title="Delete invoice"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Admin Component ─────────────────────────────────────────────────────
export default function AdminInvoiceManager() {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = (inv) => setInvoices(p => [inv, ...p]);
  const handleDelete = (id) => setInvoices(p => p.filter(i => i.id !== id));

  const counts = {
    all: invoices.length,
    pending: invoices.filter(i => i.status === "pending").length,
    approved: invoices.filter(i => i.status === "approved").length,
    rejected: invoices.filter(i => i.status === "rejected").length,
  };

  const filtered = invoices.filter(inv => {
    const user = MOCK_USERS.find(u => u.id === inv.userId);
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || inv.id.toLowerCase().includes(q)
      || inv.orderName.toLowerCase().includes(q)
      || user?.name.toLowerCase().includes(q)
      || user?.company.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const totalOutstanding = invoices
    .filter(i => i.status === "pending")
    .reduce((a, b) => a + b.amount, 0);
  
  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-base-100 rounded-3xl border border-base-200">
        <Loader variant="inline" message="Retrieving financial records..." />
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Invoices", value: counts.all, Icon: FileText, color: "text-[var(--primary)]", bg: "bg-[var(--primary)]/10" },
          { label: "Awaiting Approval", value: counts.pending, Icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Approved", value: counts.approved, Icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Outstanding Amount", value: fmt(totalOutstanding), Icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
        ].map(({ label, value, Icon, color, bg }) => (
          <div key={label} className="bg-base-100 border border-base-200 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40">{label}</p>
              <p className="text-lg font-extrabold text-base-content">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status filter chips */}
        <div className="flex items-center gap-1.5 bg-base-100 border border-base-200 rounded-xl p-1.5 shadow-sm">
          {["all", "pending", "approved", "rejected"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${statusFilter === s
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-base-content/50 hover:bg-base-200"
                }`}>
              {s === "all" ? `All (${counts.all})` : `${s} (${counts[s]})`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search invoices, clients…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-base-200 rounded-xl focus:outline-none focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-[var(--primary)]/10 bg-base-100 placeholder:text-base-content/25 transition-all" />
        </div>

        {/* Upload CTA */}
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[var(--primary)] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[var(--primary)]/90 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
          <Plus size={15} /> Upload Invoice
        </button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-base-100 border border-base-200 rounded-2xl py-16 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center">
            <FileText size={22} className="text-base-content/20" />
          </div>
          <p className="text-sm font-semibold text-base-content/40">No invoices found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(inv => (
            <InvoiceRow
              key={inv.id}
              invoice={inv}
              user={MOCK_USERS.find(u => u.id === inv.userId)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <UploadModal onClose={() => setShowModal(false)} onSave={handleSave} />
      )}
    </div>
  );
}
