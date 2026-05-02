"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { 
  Upload, ImageIcon, Loader2, Link2, FileText, Tag, 
  Hash, AlignLeft, CheckCircle, ChevronLeft, AlertCircle,
  RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CustomDropdown from "@/Components/common/CustomDropdown";

const MOCKUP_TYPES = [
  "Digital Tech Pack",
  "Fabric Texture",
  "3D Render",
  "Physical Sample Photo",
  "Packaging Design",
  "Embroidery Layout",
  "Color Blocking",
  "Other",
];

const STATUS_OPTIONS = [
  { value: "pending",  label: "Pending Review" },
  { value: "approved", label: "Approved (Locked)" },
];

export default function AddMockupForm() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  const [preview, setPreview]   = useState(null);
  const [file, setFile]         = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    order_id: "",
    title:    "Design Mockup",
    type:     "Digital Tech Pack",
    version:  "v1.0",
    notes:    "",
    status:   "pending",
  });

  // Transform orders into CustomDropdown format
  const orderOptions = useMemo(() => {
    return orders.map((o) => ({
      value: o.id,
      label: `Order #ORD-${1000 + (o.display_id || 0)}`,
      subLabel: `${o.product_name || o.sku} · ${o.profiles?.full_name || "N/A"}`
    }));
  }, [orders]);

  // Fetch orders for the dropdown
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        if (data.success) setOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const handleFile = (f) => {
    if (!f || !f.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { toast.error("Please select an image to upload."); return; }
    if (!form.order_id) { toast.error("Please link this mockup to an order."); return; }

    setUploading(true);
    try {
      const selectedOrder = orders.find((o) => o.id === form.order_id);
      const userId = selectedOrder?.user_id || null;

      const fd = new FormData();
      fd.append("file", file);
      fd.append("order_id", form.order_id);
      fd.append("user_id", userId || "");
      fd.append("title", form.title);
      fd.append("type", form.type);
      fd.append("version", form.version);
      fd.append("notes", form.notes);
      fd.append("status", form.status);
      fd.append("uploaded_by", "admin");

      const res = await fetch("/api/admin/mockups", { method: "POST", body: fd });
      const data = await res.json();

      if (!data.success) throw new Error(data.error || "Upload failed");

      toast.success("Mockup uploaded successfully!");
      router.push("/admin/Mockups");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Failed to upload mockup.");
    } finally {
      setUploading(false);
    }
  };

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/Mockups" 
          className="btn btn-ghost btn-sm gap-2 rounded-xl text-base-content/50 hover:text-base-content transition-all hover:bg-base-200"
        >
          <ChevronLeft size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Gallery</span>
        </Link>

        <div className="flex gap-3">
          <Link href="/admin/Mockups" className="btn btn-ghost btn-sm rounded-xl uppercase font-black text-[10px] tracking-widest">
            Cancel
          </Link>
          <button 
            onClick={handleSubmit}
            disabled={uploading || !file}
            className="btn bg-[var(--primary)] text-white border-none shadow-lg shadow-[var(--primary)]/20 rounded-xl hover:brightness-110 h-10 px-6 gap-2 disabled:opacity-50"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            <span className="text-[10px] font-black uppercase tracking-widest">Save Mockup</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── Left Column: Image Upload ── */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-base-100 rounded-2xl shadow-sm border border-base-200">
            <div className="px-6 py-4 border-b border-base-200 bg-base-50/50 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                  <ImageIcon size={18} />
                </div>
                <h3 className="font-black text-sm uppercase tracking-tight">Design Media</h3>
              </div>
            </div>

            <div className="p-6">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group
                  ${dragging ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-base-200 hover:border-[var(--primary)]/50 hover:bg-base-50"}`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />

                {preview ? (
                  <div className="relative aspect-video w-full bg-base-200/20">
                    <img src={preview} alt="preview" className="w-full h-full object-contain p-4" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
                      <span className="bg-white rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-base-content shadow-xl flex items-center gap-2">
                        <RefreshCw size={14} className="text-[var(--primary)]" /> Replace Image
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="w-16 h-16 rounded-[2rem] bg-base-200 group-hover:bg-[var(--primary)]/10 flex items-center justify-center text-base-content/20 group-hover:text-[var(--primary)] transition-all">
                      <Upload size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-base-content tracking-tight">Drop mockup here or click to browse</p>
                      <p className="text-[10px] font-bold text-base-content/30 mt-1 uppercase tracking-widest leading-none">PNG, JPG, WEBP · Max 20MB</p>
                    </div>
                  </div>
                )}
              </div>
              {!preview && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                  <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase tracking-tight">
                    Premium Visuals: Make sure your mockup has a clean background (transparent or solid) for a professional client experience.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="bg-base-100 rounded-2xl shadow-sm border border-base-200">
             <div className="px-6 py-4 border-b border-base-200 bg-base-50/50 flex items-center gap-3 rounded-t-2xl">
                <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                  <AlignLeft size={18} />
                </div>
                <h3 className="font-black text-sm uppercase tracking-tight">Designer Instructions</h3>
              </div>
              <div className="p-6">
                <textarea
                  rows={6}
                  value={form.notes}
                  onChange={(e) => setField("notes", e.target.value)}
                  placeholder="Elaborate on the design choices, fabric specifications, or specific adjustments made in this version..."
                  className="textarea textarea-bordered w-full rounded-2xl bg-base-50 border-base-200 focus:border-[var(--primary)] text-sm resize-none p-4 placeholder:italic"
                />
              </div>
          </section>
        </div>

        {/* ── Right Column: Configuration ── */}
        <div className="space-y-6">
          
          {/* Order Linking */}
          <section className="bg-base-100 rounded-2xl shadow-sm border border-base-200">
            <div className="px-6 py-4 border-b border-base-200 bg-base-50/50 flex items-center gap-3 rounded-t-2xl">
              <Link2 size={18} className="text-[var(--primary)]" />
              <h3 className="font-black text-[11px] uppercase tracking-widest">Connect to Order</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-2">Select Project <span className="text-error">*</span></label>
                <CustomDropdown
                  options={orderOptions}
                  value={form.order_id}
                  onChange={(val) => setField("order_id", val)}
                  disabled={loadingOrders}
                  placeholder={loadingOrders ? "Fetching orders..." : "Select an order"}
                />
              </div>
            </div>
          </section>

          {/* Details */}
          <section className="bg-base-100 rounded-2xl shadow-sm border border-base-200">
            <div className="px-6 py-4 border-b border-base-200 bg-base-50/50 flex items-center gap-3 rounded-t-2xl">
              <Tag size={18} className="text-[var(--primary)]" />
              <h3 className="font-black text-[11px] uppercase tracking-widest">Design Metadata</h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="label text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-2">Mockup Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  className="input input-bordered w-full rounded-xl bg-base-200/50 border-base-content/10 text-sm font-bold focus:border-[var(--primary)] h-12"
                />
              </div>

              <div>
                <label className="label text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-2">Category / Type</label>
                <CustomDropdown
                  options={MOCKUP_TYPES}
                  value={form.type}
                  onChange={(val) => setField("type", val)}
                />
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="label text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-2">Version</label>
                  <input
                    type="text"
                    value={form.version}
                    onChange={(e) => setField("version", e.target.value)}
                    className="input input-bordered w-full rounded-xl bg-base-200/50 border-base-content/10 text-sm font-bold focus:border-[var(--primary)] h-12"
                  />
                </div>
                <div>
                  <label className="label text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-2">Initial Status</label>
                  <CustomDropdown
                    options={STATUS_OPTIONS}
                    value={form.status}
                    onChange={(val) => setField("status", val)}
                  />
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
