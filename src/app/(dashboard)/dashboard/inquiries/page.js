"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search, Eye, ClipboardList, AlertCircle, FileText, ArrowUpRight,
  Loader2, ShieldCheck, Clock, Plus, RefreshCw, XCircle, Package
} from "lucide-react";
import DashboardPageHeader from "@/Components/common/DashboardPageHeader";
import Loader from "@/Components/common/Loader";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { id: 'All', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'reviewed', label: 'Reviewed' },
  { id: 'quoted', label: 'Quoted' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'rejected', label: 'Rejected' },
];

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

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries || []);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error("Failed to load inquiries: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const filteredInquiries = inquiries.filter(inq => {
    const matchesTab = activeTab === "All" || inq.status === activeTab;
    const category = inq.category_name || "Custom";
    const displayId = `INQ-${1000 + (inq.display_id || 0)}`;
    const matchesSearch =
      displayId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (loading) return <Loader message="Loading inquiries..." variant="full" />;

  const pendingCount = inquiries.filter(i => i.status === 'pending').length;
  const quotedCount = inquiries.filter(i => i.status === 'quoted').length;
  const acceptedCount = inquiries.filter(i => i.status === 'accepted').length;

  return (
    <div className="space-y-6 font-sans pb-16 animate-in fade-in duration-700">
      <DashboardPageHeader
        heading="My Inquiries"
        breadData={[{ name: "Dashboard", href: "/dashboard" }, { name: "Inquiries", href: "/dashboard/inquiries" }]}
      />

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-[2rem] bg-base-100 border border-base-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/40">
            <ClipboardList size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40">Total</p>
            <p className="text-2xl font-black text-base-content">{inquiries.length}</p>
          </div>
        </div>
        <div className="p-5 rounded-[2rem] bg-amber-50 border border-amber-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600/60">Pending</p>
            <p className="text-2xl font-black text-amber-700">{pendingCount}</p>
          </div>
        </div>
        <div className="p-5 rounded-[2rem] bg-purple-50 border border-purple-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
            <ArrowUpRight size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-purple-600/60">Quoted</p>
            <p className="text-2xl font-black text-purple-700">{quotedCount}</p>
          </div>
        </div>
        <div className="p-5 rounded-[2rem] bg-emerald-50 border border-emerald-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600/60">Accepted</p>
            <p className="text-2xl font-black text-emerald-700">{acceptedCount}</p>
          </div>
        </div>
      </div>

      {/* ── Filter Tabs + Search ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-base-100 rounded-2xl border border-base-200 shadow-sm w-full sm:w-auto">
          {STATUS_OPTIONS.map(s => (
            <button key={s.id} onClick={() => setActiveTab(s.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === s.id ? 'bg-[var(--primary)] text-white shadow-md' : 'text-base-content/50 hover:bg-base-200'
              }`}>
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* <div className="relative flex-1 sm:w-64">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-sm h-11 w-full pl-11 bg-base-100 border-base-200 focus:border-[var(--primary)]/50 rounded-2xl placeholder:text-base-content/40 text-sm transition-all"
              placeholder="Search ID, category..."
            />
          </div> */}
          <button onClick={fetchInquiries} className="btn btn-sm h-11 bg-base-100 border-base-200 hover:bg-base-200 rounded-2xl px-4 shadow-sm">
            <RefreshCw size={14} className="text-base-content/60" />
          </button>
          <Link
            href="/smart-inquiry"
            className="btn btn-sm h-11 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white border-none rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[var(--primary)]/20 flex items-center gap-2 px-5"
          >
            <Plus size={14} /> New
          </Link>
        </div>
      </div>

      {/* ── Table ── */}
      {inquiries.length > 0 ? (
        <div className="bg-base-100 rounded-[2rem] shadow-sm border border-base-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-md w-full border-separate border-spacing-0">
              <thead className="bg-base-200/40 text-base-content/50 uppercase text-[9px] font-black tracking-[0.2em] border-b border-base-200">
                <tr>
                  <th className="py-6 pl-10">Inquiry Identity</th>
                  <th className="py-6 text-center">Date Submitted</th>
                  <th className="py-6 text-center">Status Pipeline</th>
                  <th className="py-6 text-center">Quotation</th>
                  <th className="py-6 text-right pr-10">Admin Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-100">
                {filteredInquiries.length > 0 ? (
                  filteredInquiries.map((inq) => {
                    const displayId = inq.display_id ? `${inq.display_id}` : inq.id.slice(0, 8);
                    const categoryName = inq.category_name || 'Custom Product';
                    const StatusIcon = STATUS_ICONS[inq.status] || Clock;
                    const dateObj = new Date(inq.created_at);

                    return (
                      <tr key={inq.id} className="hover:bg-base-50/50 transition-all duration-300 group">
                        {/* Identity */}
                        <td className="py-8 pl-10">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-base-50 border border-base-200 flex items-center justify-center text-base-content/20 group-hover:text-[var(--primary)] group-hover:border-[var(--primary)]/20 transition-all shadow-inner">
                              <ClipboardList size={20} />
                            </div>
                            <div className="space-y-1">
                              <p className="font-black text-base text-base-content tracking-tight leading-none">INQ-{1000 + (displayId || 0)}</p>
                              <p className="text-xs font-bold text-base-content/40 tracking-tight">{categoryName}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {inq.fabric_id && <span className="text-[9px] font-mono font-bold text-base-content/30 uppercase tracking-widest">{inq.fabric_id}</span>}
                                {inq.total_quantity > 0 && <span className="text-[9px] font-mono font-bold text-base-content/30 uppercase tracking-widest">• {inq.total_quantity} PCS</span>}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-8 text-center">
                          <p className="text-sm font-black text-base-content tracking-tight">{dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                          <p className="text-[9px] font-bold text-base-content/30 uppercase tracking-[0.2em] mt-1">{dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </td>

                        {/* Status */}
                        <td className="py-8 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${STATUS_STYLE[inq.status] || STATUS_STYLE.pending}`}>
                            <StatusIcon size={10} /> {inq.status}
                          </span>
                        </td>

                        {/* Quotation */}
                        <td className="py-8 text-center">
                          {inq.quoted_amount ? (
                            <>
                              <p className="text-lg font-black text-emerald-600 tracking-tighter">
                                ${Number(inq.quoted_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </p>
                              <p className="text-[9px] font-bold text-base-content/30 uppercase tracking-[0.2em] mt-1">Quote Ready</p>
                            </>
                          ) : (
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-8 h-1 rounded-full bg-base-200 animate-pulse" />
                              <p className="text-[10px] font-bold text-base-content/25 uppercase tracking-widest">Pending</p>
                            </div>
                          )}
                        </td>

                        {/* Admin Notes */}
                        <td className="py-8 text-right pr-10 max-w-[220px]">
                          {inq.admin_notes ? (
                            <div className="bg-blue-50 border border-blue-100 p-3 rounded-2xl inline-block text-left max-w-[200px]">
                              <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Response</p>
                              <p className="text-xs font-bold text-blue-800 line-clamp-2">{inq.admin_notes}</p>
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-base-content/15">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-32">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 rounded-3xl bg-base-50 flex items-center justify-center border border-base-200 shadow-inner">
                          <Search size={28} className="text-base-content/10" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-black text-base-content tracking-tight">No Matches Found</p>
                          <p className="text-sm font-bold text-base-content/30">Try adjusting your filters or search query.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-32 px-8 rounded-[2rem] border border-base-200 bg-base-100 shadow-sm">
          <div className="w-20 h-20 rounded-[2rem] bg-[var(--primary)]/5 flex items-center justify-center mx-auto mb-6 border border-[var(--primary)]/10">
            <ClipboardList size={32} className="text-[var(--primary)]" />
          </div>
          <h3 className="text-xl font-black text-base-content mb-2 tracking-tight">No Inquiries Yet</h3>
          <p className="text-sm text-base-content/50 mb-8 max-w-sm mx-auto font-medium">
            Submit your first manufacturing inquiry to get a custom quotation from our team.
          </p>
          <Link href="/smart-inquiry" className="btn btn-md bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white border-none rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[var(--primary)]/20 px-8">
            <Plus size={14} className="mr-1" /> Start New Inquiry
          </Link>
        </div>
      )}
    </div>
  );
}
