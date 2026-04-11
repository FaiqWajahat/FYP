"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  User, Package, DollarSign, CheckCircle2,
  ChevronLeft, ChevronRight, Send, ShoppingCart,
} from "lucide-react";

import AOStepIndicator from "./AOStepIndicator";
import AOStepCustomer  from "./AOStepCustomer";
import AOStepProduct   from "./AOStepProduct";
import AOStepPricing   from "./AOStepPricing";
import AOStepReview    from "./AOStepReview";

// ─── Wizard steps config ────────────────────────────────────────────────────
const STEPS = [
  { label: "Customer",  icon: User },
  { label: "Product",   icon: Package },
  { label: "Pricing",   icon: DollarSign },
  { label: "Review",    icon: CheckCircle2 },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const INITIAL_FORM = {
  // Step 1 – Customer
  customerName: "", customerEmail: "", customerPhone: "",
  companyName: "", country: "", customerNotes: "",
  // Step 2 – Product
  productName: "", productSKU: "", productColor: "", productMaterial: "",
  brandingMethod: "none", sizingMode: "standard",
  standardQuantities: {}, customSizeRows: [],
  sizeChartFile: null, sizeChartFileName: "",
  productNotes: "",
  // Step 3 – Pricing
  unitPrice: "", overrideTotal: "", currency: "USD",
  paymentMethod: "wire", paymentDivision: "split",
  status: "payment pending", estimatedDelivery: "",
};

function validateStep(step, form) {
  const errs = {};

  if (step === 0) {
    if (!form.customerName?.trim())  errs.customerName  = "Full name is required.";
    if (!form.customerEmail?.trim()) errs.customerEmail = "Email is required.";
  }

  if (step === 1) {
    if (!form.productName?.trim()) errs.productName = "Product name is required.";
    if (!form.productSKU?.trim())  errs.productSKU  = "SKU is required.";
    const totalQty =
      form.sizingMode === "standard"
        ? Object.values(form.standardQuantities || {}).reduce((a, b) => a + b, 0)
        : (form.customSizeRows || []).reduce((a, r) => a + (parseInt(r.qty) || 0), 0);
    if (totalQty === 0) errs.sizing = "Please add at least one size quantity.";
  }

  if (step === 2) {
    if (!form.unitPrice || parseFloat(form.unitPrice) <= 0)
      errs.unitPrice = "Enter a valid unit price.";
  }

  return errs;
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function AddOrderPage() {
  const router = useRouter();
  const [step, setStep]         = useState(0);
  const [form, setForm]         = useState(INITIAL_FORM);
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  const onChange = (name, value) =>
    setForm((f) => ({ ...f, [name]: value }));

  const goNext = () => {
    const errs = validateStep(step, form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error("Please fix the highlighted fields before continuing.");
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    const t = toast.loading("Creating order…");

    try {
      // 1. Upload size chart to Cloudinary if provided
      let sizeChartUrl = null;
      if (form.sizingMode === "custom" && form.sizeChartFile) {
        toast.loading("Uploading size chart…", { id: t });
        const base64 = await new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onloadend = () => res(reader.result);
          reader.onerror = rej;
          reader.readAsDataURL(form.sizeChartFile);
        });
        const scRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: base64, folder: "size-charts" }),
        });
        const scData = await scRes.json();
        if (scData.success) sizeChartUrl = scData.url;
      }

      // 1b. Upload product image to Cloudinary if provided
      let productImageUrl = null;
      if (form.productImageFile) {
        toast.loading("Uploading product image…", { id: t });
        const base64 = await new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onloadend = () => res(reader.result);
          reader.onerror = rej;
          reader.readAsDataURL(form.productImageFile);
        });
        const imgRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: base64, folder: "order-mockups" }),
        });
        const imgData = await imgRes.json();
        if (imgData.success) productImageUrl = imgData.url;
      }

      // 2. Build sizing JSONB
      const totalQty =
        form.sizingMode === "standard"
          ? Object.values(form.standardQuantities || {}).reduce((a, b) => a + b, 0)
          : (form.customSizeRows || []).reduce((a, r) => a + (parseInt(r.qty) || 0), 0);

      const sizing = {
        mode: form.sizingMode,
        breakdown: form.sizingMode === "standard" ? form.standardQuantities : form.customSizeRows,
        totalUnits: totalQty,
        ...(sizeChartUrl && { size_chart_url: sizeChartUrl }),
      };

      // 3. Build customization JSONB
      const customization = {
        enabled: form.brandingMethod && form.brandingMethod !== "none",
        format: form.brandingMethod || "none",
        notes: form.productNotes || "",
      };

      // 4. Calculate total amount
      const unitPrice = parseFloat(form.unitPrice || 0);
      const totalAmount = form.overrideTotal
        ? parseFloat(form.overrideTotal)
        : totalQty * unitPrice;

      // 5. POST to admin orders API
      toast.loading("Saving order to database…", { id: t });
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: null, // admin-created, no user link
          product: {
            name: form.productName,
            sku:  form.productSKU,
            image: productImageUrl,
            color: form.productColor,
          },
          customization,
          sizing,
          pricing: { unitPrice, subtotal: totalAmount },
          paymentMethod: form.paymentMethod,
          paymentDivision: form.paymentDivision,
          status: form.status,
          currency: form.currency,
          estimatedDelivery: form.estimatedDelivery || null,
          // Pass extra meta not in standard body
          customerMeta: {
            name: form.customerName,
            email: form.customerEmail,
            phone: form.customerPhone,
            company: form.companyName,
            country: form.country,
            notes: form.customerNotes,
          },
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Unknown error");

      toast.success(`Order ${data.displayId || "created"} successfully!`, { id: t });
      router.push("/Dashboard/Orders/All");
    } catch (err) {
      console.error("Add Order Error:", err);
      toast.error(`Failed: ${err.message}`, { id: t });
      setSubmitting(false);
    }
  };

  const stepProps = { form, errors, onChange };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">

      {/* ── Page Header ── */}
      <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden">
        <div className="bg-[var(--primary)] px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center">
              <ShoppingCart size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-lg uppercase tracking-widest leading-none">
                New Factory Order
              </h1>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mt-1">
                Admin · Manual Order Creation
              </p>
            </div>
          </div>

          {/* Progress text */}
          <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
            <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Step</span>
            <span className="text-white font-black text-xl leading-none">{step + 1}</span>
            <span className="text-white/40 text-[10px] font-black">/ {STEPS.length}</span>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="px-8 py-6 bg-base-50/50 border-b border-base-200">
          <AOStepIndicator steps={STEPS} currentStep={step} />
        </div>
      </div>

      {/* ── Form Card ── */}
      <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm p-8">
        {step === 0 && <AOStepCustomer {...stepProps} />}
        {step === 1 && <AOStepProduct  {...stepProps} />}
        {step === 2 && <AOStepPricing  {...stepProps} />}
        {step === 3 && <AOStepReview     form={form} />}
      </div>

      {/* ── Navigation Footer ── */}
      <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm px-8 py-5 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={step === 0 ? () => router.back() : goBack}
          className="btn btn-ghost gap-2 rounded-xl font-black text-[10px] uppercase tracking-widest text-base-content/50 hover:text-base-content hover:bg-base-200"
        >
          <ChevronLeft size={16} />
          {step === 0 ? "Cancel" : "Back"}
        </button>

        <div className="flex items-center gap-2">
          {/* Step dots */}
          <div className="hidden sm:flex items-center gap-1.5 mr-4">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === step ? "w-6 h-2 bg-[var(--primary)]" : i < step ? "w-2 h-2 bg-[var(--primary)]/40" : "w-2 h-2 bg-base-300"
                }`}
              />
            ))}
          </div>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="btn bg-[var(--primary)] text-white border-none rounded-xl gap-2 font-black text-[10px] uppercase tracking-widest hover:brightness-110 shadow-sm shadow-[var(--primary)]/30 active:scale-95 transition-all"
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="btn bg-[var(--primary)] text-white border-none rounded-xl gap-2 font-black text-[10px] uppercase tracking-widest hover:brightness-110 shadow-sm shadow-[var(--primary)]/30 active:scale-95 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <><span className="loading loading-spinner loading-xs" /> Creating…</>
              ) : (
                <><Send size={14} /> Create Order</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
