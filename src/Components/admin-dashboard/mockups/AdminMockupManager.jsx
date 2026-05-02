"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Image as ImageIcon, Plus, Search, X,
  AlertCircle, RefreshCw, Layers, LayoutGrid
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import Loader from "@/Components/common/Loader";
import AdminMockupCard from "./AdminMockupCard";
import AdminMockupDetailModal from "./AdminMockupDetailModal";

const TABS = [
  { key: "all",      label: "All" },
  { key: "pending",  label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

export default function AdminMockupManager() {
  const [mockups, setMockups]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error,   setError]           = useState(null);
  const [activeTab, setActiveTab]     = useState("all");
  const [search,  setSearch]          = useState("");
  const [selected,  setSelected]      = useState(null);    // detail modal

  // ── Fetch mockups ────────────────────────────────────────────────
  const fetchMockups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res  = await fetch("/api/admin/mockups");
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setMockups(data.mockups || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMockups(); }, [fetchMockups]);

  // ── Status change (inline card) ──────────────────────────────────
  const handleStatusChange = async (id, status) => {
    try {
      const res  = await fetch("/api/admin/mockups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setMockups((prev) => prev.map((m) => m.id === id ? { ...m, status } : m));
      if (selected?.id === id) setSelected({ ...selected, status });
      toast.success(`Mockup marked as ${status}`);
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  // ── Delete ───────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm("Delete this mockup? This cannot be undone.")) return;
    try {
      const res  = await fetch(`/api/admin/mockups?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setMockups((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success("Mockup deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete");
    }
  };

  // ── Filtered list ────────────────────────────────────────────────
  const filtered = mockups.filter((m) => {
    const matchTab = activeTab === "all" || m.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      m.title?.toLowerCase().includes(q) ||
      m.type?.toLowerCase().includes(q) ||
      m.profiles?.full_name?.toLowerCase().includes(q) ||
      m.orders?.product_name?.toLowerCase().includes(q) ||
      (m.orders?.display_id ? `ord-${1000 + m.orders.display_id}` : "").includes(q);
    return matchTab && matchSearch;
  });

  // ── KPI counts ───────────────────────────────────────────────────
  const counts = {
    all:      mockups.length,
    pending:  mockups.filter((m) => m.status === "pending").length,
    approved: mockups.filter((m) => m.status === "approved").length,
    rejected: mockups.filter((m) => m.status === "rejected").length,
  };

  if (loading) return <Loader message="Loading design mockups…" variant="inline" />;

  if (error) return (
    <div className="bg-rose-50 p-8 rounded-3xl border border-rose-100 flex flex-col items-center gap-4 text-center">
      <AlertCircle className="w-10 h-10 text-rose-400" />
      <div>
        <p className="font-black text-rose-800 tracking-tight">Failed to load mockups</p>
        <p className="text-sm text-rose-500 font-medium mt-1">{error}</p>
      </div>
      <button onClick={fetchMockups} className="btn btn-sm bg-rose-600 text-white border-none rounded-xl uppercase tracking-widest font-black">
        <RefreshCw size={14} /> Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-8 pb-16">

      {/* ── KPI Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Mockups", value: counts.all,      color: "text-[var(--primary)]",  bg: "bg-[var(--primary)]/8", icon: ImageIcon },
          { label: "Pending Review", value: counts.pending,  color: "text-amber-600",          bg: "bg-amber-50",           icon: Layers },
          { label: "Approved",       value: counts.approved, color: "text-emerald-600",        bg: "bg-emerald-50",         icon: Layers },
          { label: "Rejected",       value: counts.rejected, color: "text-rose-500",           bg: "bg-rose-50",            icon: Layers },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className="bg-base-100 border border-base-200 rounded-2xl px-5 py-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bg} border border-black/5`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 mb-1">{label}</p>
              <p className="text-2xl font-black text-base-content tracking-tighter">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Container ── */}
      <div className="w-full bg-base-100 rounded-[1.5rem] shadow-lg p-6 lg:p-8 space-y-8 border border-base-200/60">
        
        {/* Header Area: Tabs + Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-base-200 pb-6">
           <div className="flex items-center gap-1 bg-base-50 border border-base-200 rounded-2xl p-1 w-fit shadow-inner">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all
                  ${activeTab === tab.key
                    ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                    : "text-base-content/40 hover:text-base-content hover:bg-base-100"
                  }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-lg text-[9px] border font-bold
                  ${activeTab === tab.key
                    ? "bg-white/20 border-white/30 text-white"
                    : "bg-base-200 border-base-300 text-base-content/40"
                  }`}
                >
                  {counts[tab.key]}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
             <button onClick={fetchMockups} className="btn btn-ghost border-base-200 rounded-xl px-4 font-black uppercase tracking-widest text-[10px] bg-white shadow-sm transition-all hover:scale-105 active:scale-95">
                <RefreshCw size={14} />
              </button>
              <Link
                href="/admin/Mockups/Add"
                className="btn bg-[var(--primary)] text-white border-none rounded-xl px-7 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[var(--primary)]/20 hover:brightness-110 transition-all gap-2 h-11"
              >
                <Plus size={16} /> Add Mockup
              </Link>
          </div>
        </div>

        {/* Controls: Search + Secondary actions */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, project, or client name..."
              className="pl-11 pr-10 py-3.5 text-sm font-bold border border-base-200 rounded-2xl focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 bg-base-50/50 w-full placeholder:text-base-content/20 placeholder:italic transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/20 hover:text-base-content">
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 px-4 py-3 bg-base-50/50 border border-base-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-base-content/40">
            <LayoutGrid size={14} />
            Displaying {filtered.length} Results
          </div>
        </div>

        {/* Alert for pending mockups */}
        {counts.pending > 0 && activeTab !== "pending" && (
          <div className="bg-gradient-to-r from-[var(--primary)] to-blue-700 text-white rounded-2xl px-7 py-5 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shadow-[var(--primary)]/20 animate-in slide-in-from-top-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <AlertCircle size={22} />
              </div>
              <div>
                <p className="font-black tracking-tight text-lg leading-none">{counts.pending} Designs Awaiting Review</p>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-[0.2em] mt-2">Immediate client approval pending</p>
              </div>
            </div>
            <button onClick={() => setActiveTab("pending")} className="btn btn-sm h-10 px-5 bg-white text-[var(--primary)] border-none rounded-xl font-black uppercase tracking-widest text-[10px] shrink-0 shadow-lg hover:scale-105 active:scale-95 transition-all">
              Go to Pending
            </button>
          </div>
        )}

        {/* Gallery Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in duration-700">
            {filtered.map((m) => (
              <AdminMockupCard
                key={m.id}
                mockup={m}
                onView={setSelected}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-base-50/30 border-2 border-dashed border-base-200 rounded-[2.5rem] py-32 flex flex-col items-center gap-6">
            <div className="w-24 h-24 rounded-[2.5rem] bg-base-100 flex items-center justify-center border border-base-200 text-base-content/5 shadow-inner">
              <ImageIcon size={48} />
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-base-content tracking-tight">No Designs Found</p>
              <p className="text-sm font-bold text-base-content/30 mt-2 max-w-xs mx-auto leading-relaxed uppercase tracking-tighter">
                {activeTab === "all"
                  ? "Your design library is empty. Start by uploading a new mockup."
                  : `Currently no mockups categorized as "${activeTab}".`}
              </p>
            </div>
            {activeTab === "all" && (
              <Link
                href="/admin/Mockups/Add"
                className="btn bg-[var(--primary)] text-white border-none rounded-xl px-7 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[var(--primary)]/20 gap-2 h-11 transition-all hover:scale-105 active:scale-95"
              >
                <Plus size={18} /> Upload New Design
              </Link>
            )}
          </div>
        )}
      </div>

      {/* ── Detail Modal (Still a modal as it's a viewer) ── */}
      {selected && (
        <AdminMockupDetailModal
          mockup={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
