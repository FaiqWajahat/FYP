"use client";
import React, { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  FileText, Clock, XCircle, Eye, Loader2, Search,
  RefreshCw, Trash2, ClipboardList, ShieldCheck, ArrowUpRight, Plus
} from "lucide-react";
import DashboardPageHeader from "@/Components/common/DashboardPageHeader";
import Loader from "@/Components/common/Loader";
import ConfirmationDialog from "@/Components/common/ConfirmationDialog";
import toast from "react-hot-toast";

const STATUS_STYLE = {
  'accepted': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  'quoted': 'bg-purple-50 text-purple-600 border-purple-200',
  'reviewed': 'bg-blue-50 text-blue-600 border-blue-200',
  'pending': 'bg-amber-50 text-amber-600 border-amber-200',
  'rejected': 'bg-red-50 text-red-600 border-red-200',
  'archived': 'bg-base-200 text-base-content/60 border-base-300',
};

const STATUS_ICONS = {
  'accepted': ShieldCheck,
  'quoted': ArrowUpRight,
  'reviewed': Eye,
  'pending': Clock,
  'rejected': XCircle,
  'archived': FileText,
};

export default function AdminInquiriesSlugPage() {
  const pathname = usePathname();
  const slug = pathname.split("/").pop() || "All";

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, inquiry: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/inquiries`);
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries || []);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error('Failed to load inquiries: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInquiries(); }, []);

  const handleDeleteTrigger = (inq, e) => {
    e.stopPropagation();
    setDeleteDialog({ open: true, inquiry: inq });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.inquiry) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/inquiries?id=${deleteDialog.inquiry.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Inquiry deleted');
        setInquiries(prev => prev.filter(i => i.id !== deleteDialog.inquiry.id));
        setDeleteDialog({ open: false, inquiry: null });
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error('Delete failed: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = useMemo(() => {
    let result = inquiries;

    // Slug-based filtering (matching sidebar sub-links)
    if (slug === "Pending") {
      result = result.filter(i => i.status === 'pending');
    } else if (slug === "Quoted") {
      result = result.filter(i => i.status === 'quoted');
    } else if (slug === "Accepted") {
      result = result.filter(i => i.status === 'accepted');
    } else if (slug === "Rejected") {
      result = result.filter(i => i.status === 'rejected');
    }
    // "All" shows everything

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(inq =>
        (inq.category_name || '').toLowerCase().includes(q) ||
        (inq.company_name || '').toLowerCase().includes(q) ||
        (inq.contact_name || '').toLowerCase().includes(q) ||
        (inq.email || '').toLowerCase().includes(q) ||
        (inq.profiles?.full_name || '').toLowerCase().includes(q) ||
        `INQ-${1000 + (inq.display_id || 0)}`.toLowerCase().includes(q)
      );
    }

    return result;
  }, [inquiries, slug, searchQuery]);

  const breadData = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Inquiries', href: '/admin/Inquiries/All' },
    { name: `${slug} Inquiries`, href: `/admin/Inquiries/${slug}` },
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader breadData={breadData} heading={`${slug} Inquiries`} />

      <div className="w-full bg-base-100 rounded-xl shadow-lg p-4 lg:p-6">
        {/* Header: Search + Actions */}
        <div className="flex flex-row justify-between gap-3 mb-6">
          <div className="w-full md:w-1/2">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, Client, Category or Email..."
              className="input input-bordered w-full text-sm"
            />
          </div>
          <div className="w-full md:w-auto flex justify-end gap-2">
            <button onClick={fetchInquiries} className="btn btn-ghost rounded-xl px-3">
              <RefreshCw size={16} className="text-base-content/60" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="w-full bg-base-50/50 rounded-lg border border-base-200">
          {loading ? (
            <Loader variant="inline" message="Loading inquiries..." />
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 border-2 border-dashed border-base-content/10 rounded-2xl">
              <ClipboardList className="w-12 h-12 text-base-content/20" />
              <p className="text-[10px] uppercase font-black tracking-widest text-base-content/40">No Inquiries Found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full table-md">
                <thead className="text-xs font-semibold text-base-content/70 bg-base-200 uppercase tracking-wide">
                  <tr>
                    <th>Inquiry</th>
                    <th>Client</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Quote</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inq) => {
                    const StatusIcon = STATUS_ICONS[inq.status] || Clock;
                    const fmtDate = new Date(inq.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

                    return (
                      <tr key={inq.id} className="hover:bg-base-200/40 transition">
                        {/* Inquiry ID + Date */}
                        <td>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-mono text-xs font-bold text-[var(--primary)]">
                              #INQ-{1000 + (inq.display_id || 0)}
                            </span>
                            <span className="text-[10px] text-base-content/40 hidden md:block">
                              {fmtDate}
                            </span>
                          </div>
                        </td>

                        {/* Client */}
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="w-9 h-9 rounded-lg overflow-hidden ring-1 ring-base-300 ring-offset-1 bg-base-200">
                                {inq.profiles?.profile_image ? (
                                  <img src={inq.profiles.profile_image} className="w-full h-full object-cover" alt="" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs font-black text-base-content/30 bg-base-100 uppercase">
                                    {(inq.profiles?.full_name || inq.contact_name || 'G')[0]}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-xs text-base-content">
                                {inq.profiles?.full_name || inq.contact_name || 'Guest'}
                              </span>
                              <span className="text-[10px] text-base-content/40 max-w-[130px] truncate">
                                {inq.email || inq.profiles?.email || '—'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-medium text-base-content max-w-[160px] truncate">
                              {inq.category_name || 'Custom Product'}
                            </span>
                            {inq.total_quantity > 0 && (
                              <span className="font-mono text-[10px] text-base-content/40 uppercase">
                                {inq.total_quantity} PCS
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${STATUS_STYLE[inq.status] || STATUS_STYLE.pending}`}>
                            <StatusIcon size={10} /> {inq.status}
                          </span>
                        </td>

                        {/* Quote */}
                        <td className="font-bold text-sm">
                          {inq.quoted_amount
                            ? `$${Number(inq.quoted_amount).toLocaleString()}`
                            : '—'}
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="flex justify-end items-center gap-1">
                            <Link
                              href={`/admin/Inquiries/Review?id=${inq.id}`}
                              className="btn btn-ghost btn-circle btn-xs hover:bg-base-300 p-1"
                              title="Review"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={(e) => handleDeleteTrigger(inq, e)}
                              className="btn btn-ghost btn-circle btn-xs hover:bg-base-300 hover:text-error p-1"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, inquiry: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Inquiry"
        message={`Are you sure you want to permanently delete Inquiry #INQ-${
          1000 + (deleteDialog.inquiry?.display_id || 0)
        }? This action cannot be undone.`}
        confirmText="Yes, Delete Inquiry"
        isLoading={isDeleting}
      />
    </div>
  );
}
