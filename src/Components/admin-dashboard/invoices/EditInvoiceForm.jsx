"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  FileText, Upload, Trash2, CheckCircle, AlertCircle, 
  User, DollarSign, Calendar as CalendarIcon, FileUp, X, ChevronRight,
  Info, ArrowLeft
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import CustomDropdown from "@/Components/common/CustomDropdown";
import { toast } from "react-hot-toast";
import Loader from "@/Components/common/Loader";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CURRENCIES = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "AED", label: "AED - UAE Dirham" },
  { value: "PKR", label: "PKR - Pakistani Rupee" },
];

const MILESTONES = [
  { value: "deposit", label: "50% Deposit" },
  { value: "final", label: "50% Final Payment" },
  { value: "full", label: "100% Full Payment" },
];

const STATUS_OPTIONS = [
  { value: "unpaid", label: "Unpaid / Pending" },
  { value: "paid", label: "Mark as Paid" },
  { value: "overdue", label: "Overdue" },
];

export default function EditInvoiceForm({ invoiceId }) {
  const router = useRouter();
  const fileRef = useRef(null);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    id: "",
    userId: "",
    orderId: "",
    displayOrderId: "",
    orderName: "",
    amount: "",
    currency: "USD",
    milestoneType: "full",
    status: "unpaid",
    due_date: "",
    notes: "",
    pdfUrl: "",
    pdfFile: null,
  });

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const res = await fetch(`/api/admin/invoices?id=${invoiceId}`);
        const data = await res.json();
        
        if (data.success && data.invoice) {
          const inv = data.invoice;
          setFormData({
            id: inv.id,
            userId: inv.user_id,
            orderId: inv.order_id,
            displayOrderId: inv.orders ? `ORD-${1000 + inv.orders.display_id}` : "N/A",
            orderName: inv.orders?.product_name || "Custom Order",
            amount: inv.amount,
            currency: inv.currency,
            milestoneType: inv.milestone_type || "full",
            status: inv.status,
            due_date: inv.due_date ? inv.due_date.split("T")[0] : "",
            notes: inv.notes,
            pdfUrl: inv.pdf_url,
            pdfFile: null
          });
        } else throw new Error(data.error || "Failed to load invoice");
      } catch (err) {
        toast.error(err.message);
        router.push("/Dashboard/Invoices");
      } finally {
        setLoadingData(false);
      }
    }
    fetchInvoice();
  }, [invoiceId]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let finalPdfUrl = formData.pdfUrl;
      
      // Handle PDF upload if new file selected
      if (formData.pdfFile) {
        const uploadToast = toast.loading("Uploading new PDF...");
        const formDataUpload = new FormData();
        formDataUpload.append("file", formData.pdfFile);
        formDataUpload.append("folder", "invoices");
        
        const resUpload = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload
        });
        const dUpload = await resUpload.json();
        toast.dismiss(uploadToast);
        
        if (dUpload.success) finalPdfUrl = dUpload.url;
        else throw new Error("PDF upload failed");
      }

      const response = await fetch("/api/admin/invoices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: formData.id,
          amount: formData.amount,
          currency: formData.currency,
          status: formData.status,
          milestoneType: formData.milestoneType,
          notes: formData.notes,
          pdfUrl: finalPdfUrl,
          dueDate: formData.due_date
        })
      });

      const resData = await response.json();
      if (!resData.success) throw new Error(resData.error);

      toast.success("Invoice updated successfully!");
      router.push("/Dashboard/Invoices");
    } catch (err) {
      toast.error(err.message || "Failed to update invoice");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-base-100 rounded-3xl border border-base-200">
        <Loader variant="inline" message="Loading invoice history..." />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
      
      {/* ─── Left Column: Main Details ─── */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Read-Only Info Section */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Invoice ID</p>
              <p className="font-mono font-black text-slate-900">INV-{formData.id.slice(0, 8)}</p>
           </div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Source Order</p>
              <p className="font-bold text-slate-900">{formData.displayOrderId}</p>
           </div>
           <div className="col-span-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Product</p>
              <p className="text-sm font-semibold text-slate-700 truncate">{formData.orderName}</p>
           </div>
        </div>

        {/* Financial Details Section */}
        <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm">
          <div className="px-6 py-4 border-b border-base-200 bg-base-50/50 flex items-center gap-2">
            <DollarSign size={16} className="text-[var(--primary)]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/70">Modify Financials</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-2 block">Amount</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-base-content/40 text-sm font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    className="w-full bg-base-200 border-none rounded-xl pl-8 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-2 block">Currency</label>
                <CustomDropdown
                  options={CURRENCIES}
                  value={formData.currency}
                  onChange={(val) => handleChange("currency", val)}
                />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-2 block">Payment Type</label>
                <CustomDropdown
                  options={MILESTONES}
                  value={formData.milestoneType}
                  onChange={(val) => handleChange("milestoneType", val)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status & Timeline Section */}
        <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm">
          <div className="px-6 py-4 border-b border-base-200 bg-base-50/50 flex items-center gap-2">
            <CheckCircle size={16} className="text-[var(--primary)]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/70">Status & Deadline</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-2 block">Invoice Status</label>
              <CustomDropdown
                options={STATUS_OPTIONS}
                value={formData.status}
                onChange={(val) => handleChange("status", val)}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-2 block">Due Date</label>
              <input
                type="date"
                required
                value={formData.due_date}
                onChange={(e) => handleChange("due_date", e.target.value)}
                className="w-full bg-base-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right Column: Sidebar ─── */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* PDF Management */}
        <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm">
          <div className="px-6 py-4 border-b border-base-200 bg-base-50/50 flex items-center gap-2">
            <FileUp size={16} className="text-[var(--primary)]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/70">Document Sync</h3>
          </div>
          <div className="p-6">
            <div 
              onClick={() => fileRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl transition-all cursor-pointer group flex flex-col items-center justify-center py-8 px-4 text-center
                ${formData.pdfFile ? "border-[var(--primary)]/40 bg-[var(--primary)]/5" : "border-base-300 hover:border-[var(--primary)]/50 hover:bg-base-50"}
              `}
            >
              {formData.pdfFile ? (
                <div className="space-y-2">
                  <FileText className="text-[var(--primary)] mx-auto" size={20} />
                  <p className="text-xs font-bold text-base-content truncate max-w-[150px]">{formData.pdfFile.name}</p>
                  <button type="button" onClick={(e) => { e.stopPropagation(); handleChange("pdfFile", null); }} className="text-[10px] text-error font-bold uppercase">Replace</button>
                </div>
              ) : formData.pdfUrl ? (
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto">
                     <CheckCircle size={16} className="text-emerald-600" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">PDF currently linked</p>
                  <button type="button" className="text-[10px] text-blue-600 font-bold uppercase">Upload New Version</button>
                </div>
              ) : (
                <>
                  <Upload size={20} className="text-base-content/40 mb-2" />
                  <p className="text-xs font-bold text-base-content/70">Update PDF</p>
                </>
              )}
              <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={(e) => handleChange("pdfFile", e.target.files?.[0] || null)} />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-base-200 bg-base-50/50 flex items-center gap-2">
            <FileText size={16} className="text-[var(--primary)]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/70">Internal Notes</h3>
          </div>
          <div className="p-6">
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Private notes..."
              className="w-full bg-base-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all min-h-[100px] resize-none"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest transition-all shadow-xl bg-[var(--primary)] text-white hover:brightness-110 hover:-translate-y-1 shadow-[var(--primary)]/20 disabled:opacity-50`}
          >
            {submitting ? "Applying Changes..." : "Save Invoice Changes"}
            <ChevronRight size={18} />
          </button>
          
          <Link 
            href="/Dashboard/Invoices"
            className="w-full py-3 mt-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-all"
          >
            <ArrowLeft size={14} /> Discard & Exit
          </Link>
        </div>
      </div>
    </form>
  );
}
