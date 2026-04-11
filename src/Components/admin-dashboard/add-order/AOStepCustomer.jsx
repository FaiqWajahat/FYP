"use client";
import React from "react";
import { User, Mail, Phone, Building2, Globe } from "lucide-react";

export default function AOStepCustomer({ form, errors, onChange }) {
  const field = (name, label, type = "text", icon, placeholder, required = false) => (
    <div className="form-control gap-1">
      <label className="label py-0">
        <span className="label-text text-[11px] font-black uppercase tracking-widest text-base-content/50 flex items-center gap-1.5">
          {icon}
          {label}
          {required && <span className="text-[var(--primary)]">*</span>}
        </span>
      </label>
      <input
        type={type}
        value={form[name] || ""}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={`input input-bordered w-full rounded-xl text-sm h-11 font-medium transition-all focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 ${
          errors[name] ? "input-error border-error" : ""
        }`}
      />
      {errors[name] && (
        <p className="text-error text-[10px] font-bold mt-0.5">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-3 pb-4 border-b border-base-200">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
          <User size={20} />
        </div>
        <div>
          <h3 className="font-black text-base-content text-sm uppercase tracking-widest">Customer Information</h3>
          <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">Who is placing this order?</p>
        </div>
      </div>

      {/* Search hint */}
      <div className="alert bg-[var(--primary)]/5 border border-[var(--primary)]/15 rounded-xl py-3">
        <User size={14} className="text-[var(--primary)] shrink-0" />
        <span className="text-[11px] font-bold text-base-content/60">
          Fill in the customer details manually or search from existing registered users in your database.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {field("customerName", "Full Name", "text", <User size={12} />, "e.g. John Smith", true)}
        {field("customerEmail", "Email Address", "email", <Mail size={12} />, "john@company.com", true)}
        {field("customerPhone", "Phone Number", "tel", <Phone size={12} />, "+1 (555) 000-0000")}
        {field("companyName", "Company / Brand", "text", <Building2 size={12} />, "Acme Corp.")}
        {field("country", "Country", "text", <Globe size={12} />, "United States")}
      </div>

      {/* Notes for this customer */}
      <div className="form-control gap-1">
        <label className="label py-0">
          <span className="label-text text-[11px] font-black uppercase tracking-widest text-base-content/50">
            Customer Notes (optional)
          </span>
        </label>
        <textarea
          value={form.customerNotes || ""}
          onChange={(e) => onChange("customerNotes", e.target.value)}
          rows={3}
          placeholder="Any B2B account notes, sourcing preferences, or communication history..."
          className="textarea textarea-bordered w-full rounded-xl text-sm font-medium resize-none focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
        />
      </div>
    </div>
  );
}
