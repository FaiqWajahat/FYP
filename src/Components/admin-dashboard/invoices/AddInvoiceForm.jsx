"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { 
  FileText, Upload, Trash2, CheckCircle, AlertCircle, 
  User, DollarSign, Calendar as CalendarIcon, FileUp, X, ChevronRight,
  Info, ArrowLeft
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import CustomDropdown from "@/Components/common/CustomDropdown";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/Components/common/Loader";

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
  { value: "deposit_30", label: "30% Deposit (Upfront)" },
  { value: "midpoint_40", label: "40% Midpoint (Production)" },
  { value: "final_30", label: "30% Final Payment (Pre-ship)" },
  { value: "full", label: "100% Full Payment" },
];

export default function AddInvoiceForm({ onSave }) {
  const fileRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const searchParams = useSearchParams();
  const prefillOrderId = searchParams.get("orderId");
  const prefillType = searchParams.get("type"); // 'deposit', 'final', 'full'

  const [formData, setFormData] = useState({
    userId: "",
    orderId: "", // This will now store the raw UUID
    displayOrderId: "", // This is for display (ORD-1001)
    orderName: "",
    amount: "",
    currency: "USD",
    milestoneType: prefillType || "full",
    issuedDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    notes: "",
    pdfFile: null,
  });

  // Fetch Orders and Users for Dropdowns via API
  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, ordersRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/orders")
        ]);
        
        const userData = await usersRes.json();
        const orderData = await ordersRes.json();
        
        if (userData.success) {
          setUsers(userData.users.map(u => ({
            value: u.id,
            label: u.full_name || "Unknown User",
            subLabel: u.email
          })));
        }

        if (orderData.success && orderData.orders) {
          setOrders(orderData.orders.map(o => ({
            value: o.id,
            label: `ORD-${1000 + (o.display_id || 0)} - ${o.product_name}`,
            subLabel: `Client: ${o.profiles?.full_name || 'Guest'} | Total: $${o.total_amount}`,
            // Attach raw data for auto-population
            rawData: o
          })));
        }
      } catch (err) {
        console.error("Fetch Data Error:", err);
        toast.error("Failed to load system data");
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, []);

  // Handle auto-prefill if orderId is in URL
  useEffect(() => {
    if (orders.length > 0 && prefillOrderId) {
      handleOrderSelect(prefillOrderId);
    }
  }, [orders, prefillOrderId]);

  const calculateAmount = (totalAmount, type) => {
    if (!totalAmount) return "";
    const num = parseFloat(totalAmount);
    if (isNaN(num)) return "";
    
    if (type === 'deposit_30' || type === 'final_30') return (num * 0.3).toFixed(2);
    if (type === 'midpoint_40') return (num * 0.4).toFixed(2);
    if (type === 'deposit' || type === 'final') return (num * 0.5).toFixed(2);
    return num.toFixed(2); // 'full' or unknown
  };

  const handleOrderSelect = (orderId) => {
    const selectedOrder = orders.find(o => o.value === orderId);
    if (selectedOrder) {
      const { rawData } = selectedOrder;
      setFormData(prev => ({
        ...prev,
        orderId: rawData.id,
        displayOrderId: `ORD-${1000 + rawData.display_id}`,
        userId: rawData.user_id || prev.userId,
        amount: calculateAmount(rawData.total_amount, prev.milestoneType),
        orderName: rawData.product_name
      }));
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => {
      const updates = { [name]: value };
      
      // Auto-recalculate amount if milestone changes AND we have an order
      if (name === 'milestoneType' && prev.orderId) {
        const selectedOrder = orders.find(o => o.value === prev.orderId);
        if (selectedOrder && selectedOrder.rawData.total_amount) {
           updates.amount = calculateAmount(selectedOrder.rawData.total_amount, value);
        }
      }
      
      return { ...prev, ...updates };
    });
  };

  const isFormValid = formData.userId && formData.orderId && formData.amount && formData.dueDate;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setSubmitting(true);
    try {
      let pdfUrl = "";
      
      // Real Cloudinary Upload for PDFs
      if (formData.pdfFile) {
        const uploadToast = toast.loading("Syncing PDF to Cloudinary...");
        const formDataUpload = new FormData();
        formDataUpload.append("file", formData.pdfFile);
        formDataUpload.append("folder", "invoices"); // Keep logically separated
        
        const resUpload = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload
        });
        
        const dUpload = await resUpload.json();
        toast.dismiss(uploadToast);
        
        if (dUpload.success) {
          pdfUrl = dUpload.url;
        } else {
          throw new Error("PDF synchronization failed");
        }
      }

      await onSave({
        ...formData,
        pdfUrl
      });
    } catch (err) {
      toast.error(err.message || "Failed to create invoice");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-base-100 rounded-3xl border border-base-200">
        <Loader variant="inline" message="Connecting to Order Core..." />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* ─── Left Column: Main Details ─── */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Client & Order Section */}
        <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm">
          <div className="px-6 py-4 border-b border-base-200 bg-base-50/50 flex items-center gap-2">
            <User size={16} className="text-[var(--primary)]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/70">Source Order & Client</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-2 block">
                  Select Order <span className="text-error">*</span>
                </label>
                <CustomDropdown
                  options={orders}
                  value={formData.orderId}
                  onChange={handleOrderSelect}
                  placeholder="Link to an order..."
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-2 block">
                  Select Client <span className="text-error">*</span>
                </label>
                <CustomDropdown
                  options={users}
                  value={formData.userId}
                  onChange={(val) => handleChange("userId", val)}
                  placeholder="Assign a client..."
                />
              </div>
            </div>

            <div className="pt-4 border-t border-base-200/50">
               <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-2 block">
                  Reference / Description
                </label>
                <input
                  type="text"
                  value={formData.orderName}
                  onChange={(e) => handleChange("orderName", e.target.value)}
                  placeholder="e.g. Custom Hoodies - 500pcs"
                  className="w-full bg-base-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
                />
            </div>
          </div>
        </div>

        {/* Financial Details Section */}
        <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm">
          <div className="px-6 py-4 border-b border-base-200 bg-base-50/50 flex items-center gap-2">
            <DollarSign size={16} className="text-[var(--primary)]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/70">Financial Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-2 block">
                  Amount <span className="text-error">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-base-content/40 text-sm font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    placeholder="0.00"
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
            
            <div className="mt-6 pt-4 border-t border-base-200/60">
                <p className="text-[10px] text-base-content/30 italic flex items-center gap-1.5">
                   <Info size={12} /> The amount should correspond to the specific milestone being billed.
                </p>
            </div>
          </div>
        </div>

        {/* Dates Section */}
        <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm">
          <div className="px-6 py-4 border-b border-base-200 bg-base-50/50 flex items-center gap-2">
            <CalendarIcon size={16} className="text-[var(--primary)]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/70">Timeline</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-2 block">Issue Date</label>
              <input
                type="date"
                value={formData.issuedDate}
                onChange={(e) => handleChange("issuedDate", e.target.value)}
                className="w-full bg-base-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-2 block">
                Due Date <span className="text-error">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                className="w-full bg-base-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right Column: Sidebar / Attachments ─── */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Upload Section */}
        <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm">
          <div className="px-6 py-4 border-b border-base-200 bg-base-50/50 flex items-center gap-2">
            <FileUp size={16} className="text-[var(--primary)]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/70">Invoice PDF</h3>
          </div>
          <div className="p-6">
            <div 
              onClick={() => fileRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl transition-all cursor-pointer group flex flex-col items-center justify-center py-10 px-4 text-center
                ${formData.pdfFile ? "border-[var(--primary)]/40 bg-[var(--primary)]/5" : "border-base-300 hover:border-[var(--primary)]/50 hover:bg-base-50"}
              `}
            >
              {formData.pdfFile ? (
                <div className="space-y-3">
                  <div className="w-14 h-14 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center mx-auto">
                    <FileText className="text-[var(--primary)]" size={24} />
                  </div>
                  <div className="px-2">
                    <p className="text-sm font-bold text-base-content truncate max-w-[200px]">{formData.pdfFile.name}</p>
                    <p className="text-[10px] text-base-content/40 uppercase font-bold">{(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); handleChange("pdfFile", null); }}
                    className="btn btn-ghost btn-xs text-error hover:bg-red-50"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-base-200 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload size={20} className="text-base-content/40 group-hover:text-[var(--primary)]" />
                  </div>
                  <p className="text-sm font-bold text-base-content/70">Pick a PDF file</p>
                  <p className="text-[10px] text-base-content/30 mt-1 uppercase tracking-widest font-bold">Max size 20MB</p>
                </>
              )}
              <input 
                ref={fileRef}
                type="file" 
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleChange("pdfFile", e.target.files?.[0] || null)}
              />
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm">
          <div className="px-6 py-4 border-b border-base-200 bg-base-50/50 flex items-center gap-2">
            <FileText size={16} className="text-[var(--primary)]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/70">Internal Notes</h3>
          </div>
          <div className="p-6">
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Private notes or payment instructions..."
              className="w-full bg-base-200 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all min-h-[120px] resize-none"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!isFormValid || submitting}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest transition-all shadow-xl
              ${isFormValid && !submitting 
                ? "bg-[var(--primary)] text-white hover:brightness-110 hover:-translate-y-1 shadow-[var(--primary)]/20" 
                : "bg-base-300 text-base-content/30 cursor-not-allowed shadow-none"
              }
            `}
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Confirm & Create Invoice
                <ChevronRight size={18} />
              </>
            )}
          </button>
          {!isFormValid && (
            <p className="text-[10px] text-error font-bold text-center mt-3 uppercase tracking-wider flex items-center justify-center gap-1">
              <AlertCircle size={10} /> Please complete required fields
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
