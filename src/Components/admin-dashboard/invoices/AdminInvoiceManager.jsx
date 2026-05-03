"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Loader from "@/Components/common/Loader";
import {
  FileText, Trash2, Search, Plus, CheckCircle,
  Clock, AlertCircle, Edit, Eye, UserPlus,
  ArrowRight, DollarSign, Package
} from "lucide-react";
import Link from "next/link";
import ConfirmationDialog from "@/Components/common/ConfirmationDialog";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_META = {
  unpaid: { label: "Unpaid", classes: "badge-warning text-warning" },
  paid: { label: "Paid", classes: "badge-success text-success" },
  overdue: { label: "Overdue", classes: "badge-error text-error" },
};

const fmt = (n, c = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency: c }).format(n);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A";

// ─── Main Admin Component ─────────────────────────────────────────────────────
export default function AdminInvoiceManager({ slug = "All" }) {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Deletion State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/invoices');
      const data = await res.json();
      if (data.success) {
        setInvoices(data.invoices);
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDeleteTrigger = (inv) => {
    setInvoiceToDelete(inv);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!invoiceToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/invoices?id=${invoiceToDelete.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success("Invoice removed successfully");
        setInvoices(p => p.filter(i => i.id !== invoiceToDelete.id));
        setDeleteDialogOpen(false);
      } else throw new Error(data.error);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const counts = {
    All: invoices.length,
    Unpaid: invoices.filter(i => i.status === "unpaid").length,
    Paid: invoices.filter(i => i.status === "paid").length,
    Overdue: invoices.filter(i => i.status === "overdue").length,
  };

  const filtered = invoices.filter(inv => {
    const user = inv.profiles;
    const matchStatus = slug.toLowerCase() === "all" || inv.status.toLowerCase() === slug.toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = !q
      || inv.display_id?.toString().includes(q)
      || inv.orders?.product_name?.toLowerCase().includes(q)
      || user?.full_name?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const totalOutstanding = invoices
    .filter(i => i.status === "unpaid")
    .reduce((a, b) => a + b.amount, 0);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-base-100 rounded-3xl border border-base-200">
        <Loader variant="inline" message="Connecting to financial core..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Stats Board ─── */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Invoices", value: counts.All, Icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Unpaid Count", value: counts.Unpaid, Icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Paid Count", value: counts.Paid, Icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total Receivables", value: fmt(totalOutstanding), Icon: DollarSign, color: "text-red-500", bg: "bg-red-50" },
        ].map(({ label, value, Icon, color, bg }) => (
          <div key={label} className="bg-base-100 border border-base-200 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md group">
            <div className="flex justify-between items-start mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
                <Icon size={18} className={color} />
              </div>
            </div>
            <p className="text-2xl font-black text-base-content tracking-tight">{value}</p>
            <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest mt-1">{label}</p>
          </div>
        ))}
      </div> */}

      {/* ─── Main Content Card ─── */}
      <div className="w-full bg-base-100 rounded-xl shadow-lg p-4 lg:p-6">

        {/* Header Section (Unified with Users Page Style) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <label className="input input-sm h-10 flex items-center gap-2 rounded-lg w-full md:w-64 shadow-sm">
              <Search size={16} className="text-base-content/40" />
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ID, Client, Order..."

              />
            </label>
          </div>

          {/* Action */}
          <div className="w-full md:w-auto flex justify-end">
            <Link
              href="/admin/Invoices/Add"
              className="btn bg-[var(--primary)] text-white border-transparent hover:brightness-110 rounded-lg gap-2 text-sm font-medium shadow-sm transition-all active:scale-95 h-11 px-6 w-full md:w-auto"
            >
              <Plus size={18} strokeWidth={3} />
              Issue New Invoice
            </Link>
          </div>
        </div>

        {/* Table Area (Base-50 Wrap Pattern) */}
        <div className="w-full bg-base-50/50 rounded-lg border border-base-200">
          <div className="w-full overflow-x-auto">
            <table className="table w-full table-md">
              <thead className="text-xs font-semibold text-base-content/70 bg-base-200 uppercase tracking-wide">
                <tr>
                  <th className="py-4"># ID</th>
                  <th>Invoice / Record</th>
                  <th>Source Assoc.</th>
                  <th>Status</th>
                  <th>Financials</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-100">
                {filtered.map(inv => {
                  const sm = STATUS_META[inv.status] || STATUS_META.unpaid;
                  return (
                    <tr key={inv.id} className="hover:bg-base-200/40 transition-all duration-200 group">

                      {/* SKU Pattern ID */}
                      <td className="font-mono text-[10px] opacity-40 font-black tracking-tighter whitespace-nowrap">
                        #{inv.display_id || inv.id.slice(0, 8)}
                      </td>

                      {/* Primary Info (User Pattern) */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-10 h-10 rounded-lg overflow-hidden ring-1 ring-base-300 ring-offset-1 bg-base-200 flex items-center justify-center">
                              <FileText size={18} className="text-base-content/40" />
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <h3 className="font-medium text-xs text-base-content">{inv.profiles?.full_name || "Guest Client"}</h3>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${inv.status === 'paid' ? 'bg-success' : 'bg-warning'}`}></span>
                              <span className="text-[9px] font-medium text-base-content/40 uppercase tracking-tight">Active Record</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category Pattern Source */}
                      <td>
                        <div className="flex flex-col">
                          <p className="text-xs font-semibold text-base-content truncate max-w-[150px]">{inv.orders?.product_name || "Custom Project"}</p>
                          <p className="text-[9px] font-black text-primary/50 uppercase tracking-tighter mt-0.5 whitespace-nowrap">ORD-{1000 + (inv.orders?.display_id || 0)}</p>
                        </div>
                      </td>

                      {/* Status Patterns */}
                      <td>
                        <span className={`badge badge-outline rounded-lg text-[9px] font-black uppercase tracking-widest ${sm.classes}`}>
                          {sm.label}
                        </span>
                      </td>

                      {/* Stock Pattern Financials */}
                      <td>
                        <div className="flex flex-col">
                          <span className="font-extrabold text-sm text-base-content">{fmt(inv.amount, inv.currency)}</span>
                          <span className="text-[10px] opacity-40 font-medium">Due {fmtDate(inv.due_date)}</span>
                        </div>
                      </td>

                      {/* Action Patterns */}
                      <td>
                        <div className="flex justify-end items-center gap-1">
                          {inv.pdf_url && (
                            <a
                              href={inv.pdf_url}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-ghost btn-circle btn-xs hover:bg-base-300 p-1 text-info"
                              title="View Document"
                            >
                              <Eye size={16} />
                            </a>
                          )}
                          <Link
                            href={`/admin/Invoices/Edit/${inv.id}`}
                            className="btn btn-ghost btn-circle btn-xs hover:bg-base-300 p-1"
                            title="Edit Invoice"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDeleteTrigger(inv)}
                            className="btn btn-ghost btn-circle btn-xs hover:bg-base-300 hover:text-error p-1"
                            title="Delete Invoice"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-4 border-dashed border-base-content/10 rounded-2xl">
                <FileText className="w-12 h-12 text-base-content/20" />
                <p className="text-[10px] uppercase font-black tracking-widest text-base-content/40">No Financial Records Found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Cancel Invoice"
        message={`Are you sure you want to permanently delete INV-${invoiceToDelete?.display_id}? This action will remove the record from financial reports and cannot be undone.`}
        confirmText="Confirm Deletion"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
}
