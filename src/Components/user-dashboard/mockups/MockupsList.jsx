"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FileText, RefreshCw, AlertCircle } from "lucide-react";
import MockupCard from "./MockupCard";
import MockupDetailModal from "./MockupDetailModal";
import StatusFilterBar from "@/Components/user-dashboard/StatusFilterBar";
import Loader from "@/Components/common/Loader";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  pending: "bg-warning/10 border-warning/30 text-warning-content",
  approved: "bg-success/10 border-success/30 text-success",
  rejected: "bg-error/10 border-error/30 text-error",
};

export default function MockupsList() {
  const [mockups, setMockups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedMockup, setSelectedMockup] = useState(null);

  // ── Fetch from real API ──────────────────────────────────────────
  const fetchMockups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/user/mockups");
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to load mockups");
      setMockups(data.mockups || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMockups(); }, [fetchMockups]);

  // ── Approve / Reject via API ─────────────────────────────────────
  const handleAction = async (id, newStatus, clientFeedback = "") => {
    try {
      const res = await fetch("/api/user/mockups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, client_feedback: clientFeedback }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setMockups((prev) => prev.map((m) => m.id === id ? { ...m, status: newStatus } : m));
      if (selectedMockup?.id === id) setSelectedMockup({ ...selectedMockup, status: newStatus });
      toast.success(`Mockup ${newStatus === "approved" ? "approved ✅" : "rejected — revision requested"}`);
    } catch (err) {
      toast.error(err.message || "Failed to update mockup");
    }
  };

  const filteredMockups = mockups.filter((m) =>
    activeTab === "all" ? true : m.status === activeTab
  );

  const mockupTabs = [
    { key: "all", label: "All", count: mockups.length },
    { key: "pending", label: "Pending", count: mockups.filter((m) => m.status === "pending").length },
    { key: "approved", label: "Approved", count: mockups.filter((m) => m.status === "approved").length },
    { key: "rejected", label: "Rejected", count: mockups.filter((m) => m.status === "rejected").length },
  ];

  // ── Loading ──────────────────────────────────────────────────────
  if (loading) return <Loader message="Loading design mockups…" variant="inline" />;

  // ── Error ────────────────────────────────────────────────────────
  if (error) return (
    <div className="bg-rose-50 p-8 rounded-3xl border border-rose-100 flex flex-col items-center gap-4 text-center">
      <AlertCircle className="w-10 h-10 text-rose-400" />
      <div>
        <p className="font-black text-rose-800 tracking-tight">Unable to Load Mockups</p>
        <p className="text-sm text-rose-500 font-medium mt-1">{error}</p>
      </div>
      <button onClick={fetchMockups} className="btn btn-sm bg-rose-600 text-white border-none rounded-xl uppercase tracking-widest font-black gap-2">
        <RefreshCw size={14} /> Retry
      </button>
    </div>
  );

  // ── Pending mockup alert ─────────────────────────────────────────
  const pendingCount = mockups.filter((m) => m.status === "pending").length;

  return (
    <>
      {/* Pending alert banner */}
      {pendingCount > 0 && activeTab !== "pending" && (
        <div className="bg-[var(--primary)] text-white rounded-2xl px-7 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-[var(--primary)]/20 mb-6 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-4">
            <AlertCircle size={22} />
            <div>
              <p className="font-black tracking-tight">
                {pendingCount} Design{pendingCount > 1 ? "s" : ""} Awaiting Your Approval
              </p>
              <p className="text-[11px] font-bold opacity-70 uppercase tracking-widest">
                Please review and approve or request changes.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("pending")}
            className="btn btn-sm bg-white text-[var(--primary)] border-none rounded-xl font-black uppercase tracking-widest text-[10px]"
          >
            Review Now →
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <StatusFilterBar
        tabs={mockupTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        label="Mockup Status:"
      />

      {/* Grid */}
      {filteredMockups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {filteredMockups.map((mockup) => (
            <MockupCard
              key={mockup.id}
              mockup={mockup}
              statusColors={STATUS_COLORS}
              handleAction={handleAction}
              setSelectedMockup={setSelectedMockup}
            />
          ))}
        </div>
      ) : (
        <div className="bg-base-100 border border-base-200/60 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px] mt-6">
          <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-4">
            <FileText size={24} className="text-base-content/30" />
          </div>
          <h3 className="text-lg font-black text-base-content mb-2 tracking-wide">No Mockups Found</h3>
          <p className="text-sm text-base-content/50 max-w-sm mb-6 font-bold">
            {activeTab === "all"
              ? "No design mockups have been uploaded for your orders yet. Our design team will upload them here once ready."
              : `No mockups with "${activeTab}" status right now.`}
          </p>
          {activeTab !== "all" && (
            <button
              onClick={() => setActiveTab("all")}
              className="btn btn-outline btn-sm uppercase tracking-widest text-xs rounded-xl font-black"
            >
              Clear Filter
            </button>
          )}
        </div>
      )}

      {/* Detail Modal */}
      <MockupDetailModal
        selectedMockup={selectedMockup}
        setSelectedMockup={setSelectedMockup}
        statusColors={STATUS_COLORS}
        handleAction={handleAction}
      />
    </>
  );
}
