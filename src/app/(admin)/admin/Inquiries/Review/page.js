"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText, Clock, Eye, DollarSign, Loader2, Save, ArrowLeft,
  ClipboardList, ShieldCheck, ArrowUpRight, Package, Download,
  Image as ImageIcon, Briefcase, MapPin, Calendar, Phone, Mail,
  Globe, Users, AlertCircle, XCircle, Palette, Tag
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardPageHeader from "@/Components/common/DashboardPageHeader";
import Loader from "@/Components/common/Loader";

const STATUS_OPTIONS = [
  { id: 'pending', label: 'Pending', icon: Clock },
  { id: 'reviewed', label: 'Reviewed', icon: Eye },
  { id: 'quoted', label: 'Quoted', icon: ArrowUpRight },
  { id: 'accepted', label: 'Accepted', icon: ShieldCheck },
  { id: 'rejected', label: 'Rejected', icon: XCircle },
  { id: 'archived', label: 'Archived', icon: FileText },
];

// ─── Main Content ─────────────────────────────────────────────────────────────

function InquiryReviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("pending");
  const [adminNotes, setAdminNotes] = useState("");
  const [quotedAmount, setQuotedAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchInquiry = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/inquiries?id=${id}`);
      const data = await res.json();
      if (data.success && data.inquiry) {
        setInquiry(data.inquiry);
        setStatus(data.inquiry.status || "pending");
        setAdminNotes(data.inquiry.admin_notes || "");
        setQuotedAmount(data.inquiry.quoted_amount || "");
      } else {
        throw new Error(data.error || "Inquiry not found");
      }
    } catch (err) {
      toast.error("Failed to load inquiry: " + err.message);
      router.push("/admin/Inquiries/All");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInquiry(); }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id, status,
          admin_notes: adminNotes,
          quoted_amount: quotedAmount ? parseFloat(quotedAmount) : null,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success("Quotation updated successfully");
      setInquiry(data.inquiry);
      
      // Redirect back to the inquiries list
      setTimeout(() => {
        router.push(`/admin/Inquiries/${status.charAt(0).toUpperCase() + status.slice(1)}`);
      }, 1000);
    } catch (err) {
      toast.error("Failed to update: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader variant="inline" message="Loading Inquiry Data..." />
    </div>
  );

  if (!inquiry) return (
    <div className="text-center py-20">
      <p className="text-base-content/40 font-black uppercase text-xs tracking-widest">Inquiry Not Found</p>
    </div>
  );

  const construction = inquiry.construction || {};
  const zoneColors = inquiry.zone_colors || {};
  const sizes = inquiry.sizes || {};
  const measurements = inquiry.measurements || {};
  const artworkPlacements = inquiry.artwork_placements || [];
  const packaging = inquiry.packaging || [];
  const totalQty = inquiry.total_quantity || 0;

  const displayId = `INQ-${1000 + (inquiry.display_id || 0)}`;
  const breadData = [
    { name: "Dashboard", href: "/admin" },
    { name: "Inquiries", href: "/admin/Inquiries/All" },
    { name: displayId, href: `#` },
  ];

  return (
    <div className="w-full space-y-6 pb-20 max-w-[1600px] mx-auto">

      {/* ── Header ── */}
      <DashboardPageHeader breadData={breadData} heading={`Inquiry Review: ${displayId}`} />

      {/* ── Hero Overview Card ── */}
      <div className="bg-base-100 rounded-3xl shadow-sm border border-base-200 overflow-hidden">
        <div className="bg-[var(--primary)] px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center">
              <ClipboardList size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-lg uppercase tracking-widest leading-none">{displayId}</h1>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mt-1">
                {inquiry.category_name || "Custom Product"} • {new Date(inquiry.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-white/10 border-white/20 text-white`}>
              {inquiry.status}
            </span>
          </div>
        </div>
        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-base-200 bg-base-50/50">
          <MiniStat label="Volume" value={totalQty > 0 ? `${totalQty} pcs` : "TBD"} />
          <MiniStat label="Timeline" value={inquiry.timeline === "urgent" ? "Urgent" : "Standard"} />
          <MiniStat label="Sample" value={inquiry.sample_required ? "Required" : "Not needed"} />
          <MiniStat label="Incoterm" value={(inquiry.incoterm || "FOB").toUpperCase()} />
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

        {/* ── Left Column: Full Spec Details ── */}
        <div className="xl:col-span-7 space-y-6">

          {/* Client Profile */}
          <SpecCard title="Client Profile" icon={<Users size={18} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              <InfoRow label="Full Name" value={inquiry.profiles?.full_name || inquiry.contact_name || "Guest"} />
              <InfoRow label="Email" value={inquiry.email || inquiry.profiles?.email || "—"} />
              <InfoRow label="Phone" value={inquiry.phone || "—"} />
              <InfoRow label="Company" value={inquiry.company_name || "—"} />
              <InfoRow label="Website" value={inquiry.website || "—"} />
              <InfoRow label="Destination" value={inquiry.destination || "—"} />
            </div>
          </SpecCard>

          {/* Product DNA */}
          <SpecCard title="Product DNA" icon={<Package size={18} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <SubTitle>Material Specs</SubTitle>
                <div className="space-y-3">
                  <InfoRow label="Fabric" value={inquiry.fabric_id || "Not Specified"} />
                  <InfoRow label="Weight" value={inquiry.gsm ? `${inquiry.gsm} GSM` : "Not Specified"} />
                </div>
                {inquiry.custom_fabric_notes && (
                  <NoteBlock title="Custom Fabric Notes">{inquiry.custom_fabric_notes}</NoteBlock>
                )}
              </div>
              {Object.keys(construction).length > 0 && (
                <div>
                  <SubTitle>Construction Build</SubTitle>
                  <div className="space-y-2">
                    {Object.entries(construction).map(([k, v]) => v && (
                      <div key={k} className="flex justify-between items-center bg-base-100 px-3 py-2.5 rounded-xl border border-base-200">
                        <span className="text-[10px] uppercase font-bold text-base-content/40">{k}</span>
                        <span className="text-xs font-black text-base-content">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {inquiry.uploaded_design_name && (
              <div className="mt-6 pt-6 border-t border-base-200">
                <a href={inquiry.uploaded_design_url || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl border border-blue-200 font-bold text-xs cursor-pointer hover:bg-blue-100 transition-colors">
                  <ImageIcon size={14} /> {inquiry.uploaded_design_name} <Download size={14} />
                </a>
              </div>
            )}
          </SpecCard>

          {/* Aesthetics */}
          <SpecCard title="Aesthetics & Branding" icon={<Palette size={18} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <SubTitle>Color Mapping ({inquiry.color_type || "solid"})</SubTitle>
                {Object.keys(zoneColors).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(zoneColors).map(([zone, hex]) => (
                      <div key={zone} className="flex items-center justify-between bg-base-100 p-2.5 rounded-xl border border-base-200">
                        <span className="text-[10px] font-black uppercase text-base-content/60 ml-1">{zone}</span>
                        <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg shadow-sm border border-base-200">
                          <div className="w-4 h-4 rounded-full border border-base-300" style={{ backgroundColor: hex }} />
                          <span className="font-mono text-[10px] font-bold text-base-content">{hex}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-base-content/40 font-bold">No zone colors provided.</p>}
                {inquiry.custom_pantone && (
                  <div className="mt-3 bg-purple-50 p-3 rounded-xl border border-purple-200">
                    <p className="text-[9px] uppercase font-bold text-purple-400 mb-1">Pantone Target</p>
                    <p className="text-xs font-black text-purple-800">{inquiry.custom_pantone}</p>
                  </div>
                )}
              </div>
              <div>
                <SubTitle>Artwork Placements</SubTitle>
                {artworkPlacements.length > 0 ? (
                  <div className="space-y-3">
                    {artworkPlacements.map((p, i) => (
                      <div key={i} className="bg-base-100 p-3 rounded-xl border border-base-200 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black uppercase">{p.zone}</span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">{p.technique}</span>
                        </div>
                        {p.fileName && (
                          <a href={p.fileUrl || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                            <FileText size={12} /> {p.fileName}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-base-content/40 font-bold">No artwork placements.</p>}
              </div>
            </div>
          </SpecCard>

          {/* Sizing & Packaging */}
          <SpecCard title="Logistics & Sizing" icon={<ClipboardList size={18} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <SubTitle>Size Breakdown</SubTitle>
                {totalQty > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(sizes).filter(([_, v]) => v > 0).map(([sz, qty]) => (
                      <div key={sz} className="px-4 py-2 rounded-xl bg-white border border-base-200 shadow-sm text-center min-w-[70px]">
                        <div className="text-[10px] font-black text-base-content/40 uppercase">{sz}</div>
                        <div className="text-lg font-black text-base-content">{qty}</div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-base-content/40 font-bold">No sizes provided.</p>}
                {inquiry.size_chart_file && (
                  <div className="mt-4">
                    <a href={inquiry.size_chart_url || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] font-mono text-blue-600 bg-blue-50 px-3 py-2 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
                      <FileText size={14} /> Size Chart: {inquiry.size_chart_file}
                    </a>
                  </div>
                )}
                {inquiry.custom_measurements && Object.keys(measurements).length > 0 && (
                  <div className="mt-4">
                    <p className="text-[9px] uppercase font-bold text-base-content/40 mb-2">Custom Measurements</p>
                    <div className="bg-base-100 rounded-xl border border-base-200 overflow-hidden">
                      {Object.entries(measurements).map(([pt, val], i) => val && (
                        <div key={pt} className={`flex justify-between items-center p-2.5 text-xs ${i !== 0 ? "border-t border-base-200" : ""}`}>
                          <span className="font-bold text-base-content/60">{pt}</span>
                          <span className="font-black text-base-content">{val} cm</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <SubTitle>Labeling & Packaging</SubTitle>
                <div className="space-y-3">
                  <InfoRow label="Label Type" value={inquiry.label_type || "Standard"} />
                  {inquiry.label_placement && <InfoRow label="Placement" value={inquiry.label_placement} />}
                  {inquiry.label_artwork_file && (
                    <a href={inquiry.label_artwork_url || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                      <FileText size={12} /> Label File: {inquiry.label_artwork_file}
                    </a>
                  )}
                  {packaging.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {packaging.map(pkg => (
                        <span key={pkg} className="bg-base-100 border border-base-200 px-3 py-1 rounded-lg text-[10px] font-black uppercase text-base-content/70">{pkg}</span>
                      ))}
                    </div>
                  )}
                  {inquiry.hang_tag_file && (
                    <a href={inquiry.hang_tag_url || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                      <FileText size={12} /> Hang Tag: {inquiry.hang_tag_file}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </SpecCard>

          {/* Special Notes */}
          {inquiry.special_notes && (
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
              <div className="flex items-center gap-2 mb-2 text-amber-700">
                <AlertCircle size={16} />
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em]">Special Remarks</h5>
              </div>
              <p className="text-sm font-semibold text-amber-900 leading-relaxed">{inquiry.special_notes}</p>
            </div>
          )}
        </div>

        {/* ── Right Column: Quotation Engine ── */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-base-100 rounded-3xl shadow-sm border border-base-200 overflow-hidden sticky top-24">

            {/* Dark Header */}
            <div className="p-6 border-b border-base-200 flex flex-col sm:flex-row justify-between items-center bg-base-50/50 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border border-base-200 flex items-center justify-center text-[var(--primary)] shadow-sm">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-base-content leading-none">Quotation Engine</h3>
                  <p className="text-[10px] text-base-content/40 mt-1 uppercase tracking-widest font-bold">Pricing & status pipeline</p>
                </div>
              </div>
            </div>

            {/* Big Quote Display */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
              <div className="relative z-10">
                <p className="text-4xl font-black text-white tracking-tighter">
                  ${quotedAmount ? Number(quotedAmount).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00"}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-2">Proposed Value · USD</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Pipeline Stage */}
              <div>
                <label className="text-[10px] font-black text-base-content/50 uppercase tracking-[0.2em] mb-3 block">Pipeline Stage</label>
                <div className="grid grid-cols-2 gap-2">
                  {STATUS_OPTIONS.map(s => {
                    const Icon = s.icon;
                    return (
                      <button key={s.id} onClick={() => setStatus(s.id)}
                        className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-1.5 ${
                          status === s.id
                            ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20"
                            : "bg-base-50 border-base-200 text-base-content/60 hover:bg-base-200"
                        }`}>
                        <Icon size={12} /> {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quote Input */}
              <div>
                <label className="text-[10px] font-black text-base-content/50 uppercase tracking-[0.2em] mb-3 block">Official Quote ($)</label>
                <div className="relative">
                  <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
                  <input type="number" value={quotedAmount} onChange={(e) => setQuotedAmount(e.target.value)}
                    placeholder="Enter amount..."
                    className="input w-full h-14 pl-12 bg-base-50 border-base-200 rounded-2xl font-black text-lg focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all" />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[10px] font-black text-base-content/50 uppercase tracking-[0.2em] mb-3 block">Client / Admin Notes</label>
                <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Notes visible to client regarding quotation..."
                  className="textarea w-full min-h-[120px] bg-base-50 border-base-200 rounded-2xl font-bold text-sm focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all resize-none p-4" />
              </div>

              {/* Save */}
              <button onClick={handleSave} disabled={saving}
                className="btn w-full h-14 bg-[var(--primary)] hover:brightness-110 text-white border-none rounded-2xl shadow-lg shadow-[var(--primary)]/20 text-xs font-black uppercase tracking-[0.2em] gap-2 transition-all">
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Lock & Publish Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Wrapper with Suspense ────────────────────────────────────────────────────

export default function InquiryReviewPage() {
  return (
    <Suspense fallback={<Loader variant="inline" />}>
      <InquiryReviewContent />
    </Suspense>
  );
}

// ─── Shared Sub-Components ────────────────────────────────────────────────────

function MiniStat({ label, value }) {
  return (
    <div className="px-6 py-4 text-center">
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-base-content/40 mb-1">{label}</p>
      <p className="text-sm font-black text-base-content tracking-tight">{value}</p>
    </div>
  );
}

function SpecCard({ title, icon, children }) {
  return (
    <div className="bg-base-100 rounded-3xl shadow-sm border border-base-200 overflow-hidden">
      <div className="p-6 border-b border-base-200 flex items-center gap-3 bg-base-50/50">
        <div className="w-10 h-10 rounded-xl border border-base-200 flex items-center justify-center text-[var(--primary)] shadow-sm">
          {icon}
        </div>
        <h3 className="text-sm font-bold tracking-tight text-base-content">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

function SubTitle({ children }) {
  return <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40 mb-4 border-b border-base-200 pb-2">{children}</h5>;
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-base-content/40">{label}</span>
      <span className="text-sm font-bold text-base-content text-right">{value}</span>
    </div>
  );
}

function NoteBlock({ title, children }) {
  return (
    <div className="mt-3 bg-base-100 p-3 rounded-xl border border-base-200">
      <p className="text-[9px] uppercase font-bold text-base-content/40 mb-1">{title}</p>
      <p className="text-xs font-semibold">{children}</p>
    </div>
  );
}
