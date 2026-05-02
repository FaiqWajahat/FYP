"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  FileText, Download, Eye, CheckCircle, XCircle, Clock,
  AlertCircle, Search, DollarSign, Landmark, Globe, Banknote,
  Wallet, X, Info, ChevronRight, ShieldCheck, ArrowUpRight
} from "lucide-react";
import { useSearchParams } from 'next/navigation';
import StatusFilterBar from "@/Components/user-dashboard/StatusFilterBar";
import toast from "react-hot-toast";
import Loader from '@/Components/common/Loader';

const PAYMENT_METHOD_META = {
  paypal: { name: "PayPal", icon: DollarSign, color: "text-blue-600" },
  bank: { name: "Bank Transfer", icon: Landmark, color: "text-emerald-700" },
  western_union: { name: "Western Union", icon: Globe, color: "text-yellow-700" },
  payoneer: { name: "Payoneer", icon: Banknote, color: "text-orange-700" },
};

const STATUS_META = {
  pending: { label: "Pending Review", dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  approved: { label: "Approved", dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  rejected: { label: "Rejected", dot: "bg-red-400", text: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  paid: { label: "Paid", dot: "bg-[var(--primary)]", text: "text-[var(--primary)]", bg: "bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]", border: "border-[color-mix(in_srgb,var(--primary)_20%,transparent)]" },
  unpaid: { label: "Unpaid", dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
};

const MILESTONE_META = {
  deposit: { label: "01 Deposit", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  final: { label: "02 Balance", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  full: { label: "Full Payment", color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200" },
};

const fmt = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount || 0);

const fmtDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
};

const isOverdue = (dueDate, status) =>
  dueDate && (status === "pending" || status === "unpaid") && new Date(dueDate) < new Date();

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${m.bg} ${m.border} ${m.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

function MilestoneBadge({ type }) {
  const m = MILESTONE_META[type] || MILESTONE_META.full;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${m.bg} ${m.border} ${m.color}`}>
      {m.label}
    </span>
  );
}

function InvoiceCard({ invoice, onView, onApprove, onReject, isUpdating }) {
  const isPending = invoice.status === "pending" || invoice.status === "unpaid";
  const overdue = isOverdue(invoice.due_date, invoice.status);

  const displayId = invoice.id.slice(0, 8).toUpperCase();
  const orderDisplayId = invoice.orders?.display_id ? `ORD-${invoice.orders.display_id}` : invoice.order_id?.slice(0, 8);
  const productName = invoice.orders?.product_name || "Custom Order";

  return (
    <div className={`bg-base-100 rounded-3xl border shadow-sm transition-all duration-300 overflow-hidden group ${isPending ? "border-amber-200 hover:shadow-lg hover:shadow-black/5" : "border-base-200 hover:shadow-lg hover:shadow-black/5"
      }`}>
      <div className="p-6 md:p-8">
        {/* Top Segment: Identity */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${isPending ? "bg-amber-50 border-amber-100 text-amber-600" : "bg-base-50 border-base-200 text-base-content/20"
              }`}>
              <FileText size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-black text-lg text-base-content tracking-tight">INV-{displayId}</p>
                <ChevronRight size={14} className="text-base-content/20" />
              </div>
              <p className="text-xs font-bold text-base-content/60 truncate max-w-[220px]">{productName}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] font-mono font-bold text-base-content/30 uppercase tracking-widest">Linked:</span>
                <span className="text-[10px] font-mono font-bold text-[var(--primary)] uppercase tracking-widest">{orderDisplayId}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
            <StatusBadge status={invoice.status} />
            <MilestoneBadge type={invoice.milestone_type} />
          </div>
        </div>

        {/* Mid Segment: Financial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="bg-base-50/50 border border-base-200/60 rounded-2xl px-5 py-4">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/30 mb-1.5">Amount Due</p>
            <p className="text-xl font-black text-base-content tracking-tighter">{fmt(invoice.amount, invoice.currency)}</p>
          </div>
          <div className="bg-base-50/50 border border-base-200/60 rounded-2xl px-5 py-4">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/30 mb-1.5">Date Issued</p>
            <p className="text-sm font-bold text-base-content">{fmtDate(invoice.created_at)}</p>
          </div>
          <div className={`${overdue ? "bg-rose-50 border-rose-100" : "bg-base-50/50 border-base-200/60"} border rounded-2xl px-5 py-4`}>
            <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1.5 ${overdue ? "text-rose-600" : "text-base-content/30"}`}>
              {overdue ? "Overdue Since" : "Payment Due"}
            </p>
            <p className={`text-sm font-bold ${overdue ? "text-rose-600" : "text-base-content"}`}>
              {fmtDate(invoice.due_date)}
            </p>
          </div>
        </div>

        {/* Bottom Segment: Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-base-100">
          <button
            onClick={() => onView(invoice)}
            className="btn btn-ghost border-base-200 hover:bg-base-50 rounded-xl px-5 font-bold uppercase tracking-wider text-[10px] h-10 min-h-0"
          >
            <Eye size={14} className="mr-1" /> Full Details
          </button>

          {invoice.pdf_url && (
            <a href={invoice.pdf_url} target="_blank" rel="noopener noreferrer"
              className="btn btn-ghost border-base-200 hover:bg-base-50 rounded-xl px-5 font-bold uppercase tracking-wider text-[10px] h-10 min-h-0">
              <Download size={14} className="mr-1" /> PDF
            </a>
          )}

          {isPending && (
            <div className="flex items-center gap-2 ml-auto">
              <button disabled={isUpdating === invoice.id} onClick={() => onReject(invoice.id)}
                className="btn btn-ghost text-rose-600 hover:bg-rose-50 hover:text-rose-700 border-rose-100 rounded-xl px-5 font-bold uppercase tracking-wider text-[10px] h-10 min-h-0">
                {isUpdating === invoice.id ? '...' : 'Reject'}
              </button>
              <button disabled={isUpdating === invoice.id} onClick={() => onApprove(invoice.id)}
                className="btn bg-[var(--primary)] text-white hover:brightness-110 border-none shadow-md shadow-[var(--primary)]/20 rounded-xl px-6 font-bold uppercase tracking-wider text-[10px] h-10 min-h-0">
                <ArrowUpRight size={14} className="mr-1" /> {isUpdating === invoice.id ? 'Wait' : 'Approve & Pay'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InvoiceModal({ invoice, onClose, onApprove, onReject, isUpdating }) {
  if (!invoice) return null;
  const isPending = invoice.status === "pending" || invoice.status === "unpaid";
  const overdue = isOverdue(invoice.due_date, invoice.status);

  const displayId = invoice.id.slice(0, 8).toUpperCase();
  const orderDisplayId = invoice.orders?.display_id ? `ORD-${invoice.orders.display_id}` : invoice.order_id?.slice(0, 8);
  const productName = invoice.orders?.product_name || "Custom Order";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-base-content/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-base-100 rounded-[2rem] shadow-2xl w-full max-w-xl border border-base-200 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300" style={{ maxHeight: "90vh" }}>
        {/* Modal Header */}
        <div className="shrink-0 flex items-center justify-between px-8 py-6 border-b border-base-200 bg-base-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20">
              <FileText size={22} />
            </div>
            <div>
              <p className="font-black text-lg text-base-content tracking-tight leading-none mb-1.5">Invoice Details</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest">INV-{displayId}</span>
                <span className="w-1 h-1 rounded-full bg-base-300" />
                <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest">Order {orderDisplayId}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose}
            className="btn btn-circle btn-sm btn-ghost text-base-content/20 hover:text-base-content">
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar">
          {/* Status Segment */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/30">Settlement State</p>
              <StatusBadge status={invoice.status} />
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/30">Payment Phase</p>
              <MilestoneBadge type={invoice.milestone_type} />
            </div>
          </div>

          {overdue && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-xs font-bold shadow-sm">
              <AlertCircle size={18} className="text-rose-500" />
              This invoice is overdue. Settlement is required to maintain the production timeline.
            </div>
          )}

          {/* Details Matrix */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Product Context", value: productName },
              { label: "Currency", value: invoice.currency },
              { label: "Issued Date", value: fmtDate(invoice.created_at) },
              { label: "Due Until", value: fmtDate(invoice.due_date) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-base-50 p-5 rounded-2xl border border-base-200/50">
                <p className="text-[9px] font-black uppercase tracking-widest text-base-content/20 mb-1">{label}</p>
                <p className="text-sm font-bold text-base-content tracking-tight truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* Amount Hero */}
          <div className="bg-base-900 text-white rounded-[1.5rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <ShieldCheck size={120} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2 relative z-10">Grand Total Due</p>
            <h2 className="text-5xl font-black tracking-tighter relative z-10">
              {fmt(invoice.amount, invoice.currency)}
            </h2>
            <div className="mt-6 flex items-center gap-2 relative z-10">
              <div className="px-2 py-0.5 rounded-md bg-white/10 text-[9px] font-black uppercase tracking-widest">Secured Payment</div>
              <div className="px-2 py-0.5 rounded-md bg-white/10 text-[9px] font-black uppercase tracking-widest">PDF Attached</div>
            </div>
          </div>

          {invoice.notes && (
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-base-content/30 flex items-center gap-2">
                <Info size={12} /> Admin Directives
              </p>
              <div className="bg-base-50 rounded-2xl p-5 border border-base-200/60 text-sm text-base-content/70 leading-relaxed font-medium italic">
                "{invoice.notes}"
              </div>
            </div>
          )}

          {invoice.pdf_url && (
            <a href={invoice.pdf_url} target="_blank" rel="noopener noreferrer"
              className="btn btn-outline btn-md w-full rounded-2xl gap-2 font-bold uppercase tracking-widest text-[11px] border-base-200">
              <Download size={16} /> Export as PDF
            </a>
          )}
        </div>

        {/* Modal Actions */}
        <div className="shrink-0 px-8 py-6 border-t border-base-200 bg-base-50/50 flex gap-4">
          {isPending ? (
            <>
              <button disabled={isUpdating === invoice.id} onClick={() => { onReject(invoice.id); onClose(); }}
                className="btn btn-ghost flex-1 rounded-2xl text-rose-600 hover:bg-rose-50 font-black uppercase tracking-widest text-[11px]">
                Reject
              </button>
              <button disabled={isUpdating === invoice.id} onClick={() => { onApprove(invoice.id); onClose(); }}
                className="btn bg-emerald-600 text-white flex-1 rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 font-black uppercase tracking-widest text-[11px]">
                Approve & Pay
              </button>
            </>
          ) : (
            <button onClick={onClose}
              className="btn btn-block rounded-2xl font-black uppercase tracking-widest text-[11px] border-base-200">
              Return to Pipeline
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InvoiceList() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId');

  const [invoices, setInvoices] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [modalInvoice, setModalInvoice] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/user/invoices');
        const data = await res.json();
        if (data.success) {
          setInvoices(data.invoices || []);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // Sync effect: automatically search for orderId or set status if present in URL
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (orderIdParam) {
      setSearch(orderIdParam);
      setActiveTab("all");
    } else if (statusParam === 'pending') {
      setActiveTab("pending");
      setSearch("");
    }
  }, [orderIdParam, searchParams]);

  const handleUpdateStatus = async (id, status) => {
    try {
      setIsUpdating(id);
      const res = await fetch('/api/user/invoices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: status } : inv));
        toast.success(`Invoice marked as ${status}`);
      } else {
        toast.error(data.error || 'Failed to update invoice');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleApprove = (id) => handleUpdateStatus(id, "approved");
  const handleReject = (id) => handleUpdateStatus(id, "rejected");

  const counts = {
    all: invoices.length,
    pending: invoices.filter((i) => i.status === "pending" || i.status === "unpaid").length,
    approved: invoices.filter((i) => i.status === "approved" || i.status === "paid").length,
    rejected: invoices.filter((i) => i.status === "rejected").length,
  };

  const totalPending = invoices.filter((i) => i.status === "pending" || i.status === "unpaid").reduce((a, b) => a + (b.amount || 0), 0);
  const totalApproved = invoices.filter((i) => i.status === "approved" || i.status === "paid").reduce((a, b) => a + (b.amount || 0), 0);

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const statusGroup = inv.status;
      let mappedStatus = statusGroup;
      if (statusGroup === 'unpaid') mappedStatus = 'pending';
      if (statusGroup === 'paid') mappedStatus = 'approved';

      const matchTab = activeTab === "all" || mappedStatus === activeTab;
      const matchSearch = search === "" ||
        inv.id.toLowerCase().includes(search.toLowerCase()) ||
        (inv.orders?.product_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (inv.orders?.display_id ? `ORD-${inv.orders.display_id}` : "").toLowerCase().includes(search.toLowerCase()) ||
        (inv.order_id || "").toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [invoices, activeTab, search]);

  const TABS = [
    { key: "all", label: "All Documents", count: counts.all },
    { key: "pending", label: "Awaiting Action", count: counts.pending },
    { key: "approved", label: "Paid & Cleared", count: counts.approved },
    { key: "rejected", label: "Contested", count: counts.rejected },
  ];

  if (loading) return <Loader message="Analyzing financial records..." variant="full" />;

  if (error) {
    return (
      <div className="bg-rose-50 p-8 rounded-3xl border border-rose-100 flex flex-col items-center gap-4 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <div>
          <h3 className="text-lg font-black text-rose-900 tracking-tight">Access Error</h3>
          <p className="text-sm text-rose-600 font-medium">Unable to synchronize financial records: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 font-sans pb-24">
      {/* 1. Dashboard KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Volume", value: counts.all, icon: FileText, color: "text-[var(--primary)]", bg: "bg-[var(--primary)]/5" },
          { label: "Action required", value: counts.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Cleared Records", value: counts.approved, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Oustanding Pool", value: fmt(totalPending), icon: Wallet, color: "text-amber-600", bg: "bg-amber-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-base-100 border border-base-200 rounded-3xl px-6 py-6 shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:border-base-300">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${bg} border border-black/5`}>
              <Icon size={22} className={color} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 truncate mb-1">{label}</p>
              <p className="text-2xl font-black text-base-content tracking-tighter">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Controls & Search */}


      <div className=" w-full lg:w-full group">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/20 group-focus-within:text-[var(--primary)] transition-colors" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Reference, SKU, or Product…"
          className="pl-12 pr-6 py-3.5 text-sm font-bold border border-base-200 rounded-2xl focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 bg-base-100 w-full placeholder:text-base-content/20 transition-all shadow-sm"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/20 hover:text-base-content">
            <X size={16} />
          </button>
        )}
      </div>


      <div className="w-full lg:w-auto overflow-x-auto pb-2 sm:pb-0">
        <StatusFilterBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} label="Filter Documents:" />
      </div>
      {/* 3. Alerts */}
      {counts.pending > 0 && activeTab !== "pending" && (
        <div className="bg-[var(--primary)] text-white rounded-3xl px-8 py-5 flex flex-col sm:flex-row items-center gap-6 shadow-xl shadow-[var(--primary)]/20 animate-in slide-in-from-top-4 duration-500">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <AlertCircle size={24} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h4 className="text-lg font-black tracking-tight leading-none mb-1">Unsettled Invoices Detected</h4>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest text-xs">
              You have {counts.pending} invoices totalling <strong>{fmt(totalPending)}</strong> awaiting settlement.
            </p>
          </div>
          <button onClick={() => setActiveTab("pending")} className="btn bg-white text-[var(--primary)] border-none hover:bg-base-100 rounded-2xl px-6 font-black uppercase tracking-widest text-[10px]">
            View Pending →
          </button>
        </div>
      )}

      {/* 4. Grid System */}
      {filtered.length === 0 ? (
        <div className="bg-base-50/50 border border-base-200 border-dashed rounded-[3rem] py-32 flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-[2rem] bg-base-100 flex items-center justify-center shadow-lg border border-base-200 text-base-content/10">
            <FileText size={32} />
          </div>
          <div className="text-center max-w-xs px-6">
            <p className="text-lg font-black text-base-content tracking-tight">No Matching Records</p>
            <p className="text-sm font-bold text-base-content/30 mt-2 leading-relaxed">
              We couldn't find any documents matching your criteria. Try adjusting your filters or search term.
            </p>
            {search && (
              <button onClick={() => setSearch("")} className="mt-6 text-[var(--primary)] font-black uppercase tracking-widest text-[10px] hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {filtered.map((inv) => (
            <InvoiceCard
              key={inv.id}
              invoice={inv}
              onView={setModalInvoice}
              onApprove={handleApprove}
              onReject={handleReject}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      )}



      {modalInvoice && (
        <InvoiceModal
          invoice={modalInvoice}
          onClose={() => setModalInvoice(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
}

