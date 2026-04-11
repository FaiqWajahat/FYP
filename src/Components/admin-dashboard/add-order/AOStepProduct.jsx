"use client";
import React from "react";
import { Package, Tag, Palette, Scissors, Ruler, Plus, Minus, Trash2, FileText, CheckCircle2 } from "lucide-react";

const BRANDING_OPTIONS = [
  { id: "print",      label: "Screen Print",       desc: "High volume" },
  { id: "embroidery", label: "3D Embroidery",       desc: "Premium thread" },
  { id: "dtg",        label: "Direct to Garment",   desc: "Multi-color" },
  { id: "patch",      label: "Woven Patch",         desc: "Sewn-on luxury" },
  { id: "none",       label: "No Branding",         desc: "Blank garment" },
];

const STANDARD_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

export default function AOStepProduct({ form, errors, onChange }) {
  // Standard quantities
  const stdQty = form.standardQuantities || {};
  const setStdQty = (size, delta) => {
    const next = { ...stdQty, [size]: Math.max(0, (stdQty[size] || 0) + delta) };
    if (next[size] === 0) delete next[size];
    onChange("standardQuantities", next);
  };

  // Custom rows
  const customRows = form.customSizeRows || [];
  const addRow = () => onChange("customSizeRows", [...customRows, { id: Date.now(), name: "", qty: 0 }]);
  const updateRow = (id, field, val) =>
    onChange("customSizeRows", customRows.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  const deleteRow = (id) =>
    onChange("customSizeRows", customRows.filter((r) => r.id !== id));

  const sizingMode = form.sizingMode || "standard";

  return (
    <div className="space-y-8">
      {/* Section header */}
      <div className="flex items-center gap-3 pb-4 border-b border-base-200">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
          <Package size={20} />
        </div>
        <div>
          <h3 className="font-black text-base-content text-sm uppercase tracking-widest">Product & Sizing</h3>
          <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">Define the garment and quantity breakdown</p>
        </div>
      </div>

      {/* Product Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Product Name */}
        <div className="form-control gap-1">
          <label className="label py-0">
            <span className="label-text text-[11px] font-black uppercase tracking-widest text-base-content/50 flex items-center gap-1.5">
              <Package size={12} /> Product Name <span className="text-[var(--primary)]">*</span>
            </span>
          </label>
          <input
            type="text"
            value={form.productName || ""}
            onChange={(e) => onChange("productName", e.target.value)}
            placeholder="e.g. Premium Heavyweight Hoodie"
            className={`input input-bordered w-full rounded-xl text-sm h-11 font-medium focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 ${errors.productName ? "input-error" : ""}`}
          />
          {errors.productName && <p className="text-error text-[10px] font-bold">{errors.productName}</p>}
        </div>

        {/* SKU */}
        <div className="form-control gap-1">
          <label className="label py-0">
            <span className="label-text text-[11px] font-black uppercase tracking-widest text-base-content/50 flex items-center gap-1.5">
              <Tag size={12} /> Product SKU <span className="text-[var(--primary)]">*</span>
            </span>
          </label>
          <input
            type="text"
            value={form.productSKU || ""}
            onChange={(e) => onChange("productSKU", e.target.value.toUpperCase())}
            placeholder="e.g. HVY-HOOD-BLK-001"
            className={`input input-bordered w-full rounded-xl text-sm h-11 font-mono font-bold focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 ${errors.productSKU ? "input-error" : ""}`}
          />
          {errors.productSKU && <p className="text-error text-[10px] font-bold">{errors.productSKU}</p>}
        </div>

        {/* Color */}
        <div className="form-control gap-1">
          <label className="label py-0">
            <span className="label-text text-[11px] font-black uppercase tracking-widest text-base-content/50 flex items-center gap-1.5">
              <Palette size={12} /> Color / Colorway
            </span>
          </label>
          <input
            type="text"
            value={form.productColor || ""}
            onChange={(e) => onChange("productColor", e.target.value)}
            placeholder="e.g. Midnight Black, Forest Green"
            className="input input-bordered w-full rounded-xl text-sm h-11 font-medium focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>

        {/* Material */}
        <div className="form-control gap-1">
          <label className="label py-0">
            <span className="label-text text-[11px] font-black uppercase tracking-widest text-base-content/50 flex items-center gap-1.5">
              <Scissors size={12} /> Material / Fabric
            </span>
          </label>
          <input
            type="text"
            value={form.productMaterial || ""}
            onChange={(e) => onChange("productMaterial", e.target.value)}
            placeholder="e.g. 400gsm Cotton Fleece"
            className="input input-bordered w-full rounded-xl text-sm h-11 font-medium focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>
      </div>

      {/* ── Product Image Upload ── */}
      <div className="space-y-3">
        <p className="text-[11px] font-black uppercase tracking-widest text-base-content/50 flex items-center gap-1.5">
          <Package size={12} /> Product Mockup / Image (optional)
        </p>
        {!form.productImageFile ? (
          <label className="flex items-center gap-4 border-2 border-dashed border-base-300 rounded-xl p-5 cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all">
            <div className="w-10 h-10 bg-base-200 rounded-xl flex items-center justify-center shrink-0">
              <Plus size={20} className="text-base-content/40" />
            </div>
            <div>
              <p className="text-sm font-bold text-base-content/70">Upload Product Image</p>
              <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest mt-0.5">JPEG, PNG, WEBP</p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  onChange("productImageFile", file);
                  onChange("productImagePreview", url);
                }
              }}
            />
          </label>
        ) : (
          <div className="flex items-start gap-4 border border-base-200 bg-base-50 rounded-xl p-4">
            <div className="w-20 h-20 bg-white border border-base-200 rounded-lg overflow-hidden shrink-0">
              <img src={form.productImagePreview} alt="Preview" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 mt-1">
              <p className="text-sm font-bold text-base-content tracking-tight">{form.productImageFile.name}</p>
              <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest mb-3">
                {(form.productImageFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                type="button"
                onClick={() => {
                  onChange("productImageFile", null);
                  onChange("productImagePreview", null);
                }}
                className="btn btn-xs h-7 px-3 bg-red-50 text-error hover:bg-error hover:text-white border-none rounded-lg font-black uppercase tracking-widest shadow-sm transition-all"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Branding Selection ── */}
      <div className="space-y-3">
        <p className="text-[11px] font-black uppercase tracking-widest text-base-content/50 flex items-center gap-1.5">
          <Palette size={12} /> Branding Method
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {BRANDING_OPTIONS.map((opt) => {
            const selected = form.brandingMethod === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange("brandingMethod", opt.id)}
                className={`flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all ${
                  selected
                    ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]"
                    : "border-base-200 bg-base-100 text-base-content/60 hover:border-base-300"
                }`}
              >
                <span className="text-[11px] font-black uppercase tracking-tight leading-tight">{opt.label}</span>
                <span className="text-[9px] font-bold text-base-content/40 mt-0.5">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Sizing Mode Toggle ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-black uppercase tracking-widest text-base-content/50 flex items-center gap-1.5">
            <Ruler size={12} /> Size Breakdown <span className="text-[var(--primary)]">*</span>
          </p>
          <div className="flex bg-base-200 rounded-xl p-1 gap-1">
            {["standard", "custom"].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onChange("sizingMode", mode)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  sizingMode === mode
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "text-base-content/50 hover:text-base-content"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {errors.sizing && <p className="text-error text-[10px] font-bold">{errors.sizing}</p>}

        {/* Standard Sizes */}
        {sizingMode === "standard" && (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {STANDARD_SIZES.map((size) => {
              const qty = stdQty[size] || 0;
              return (
                <div
                  key={size}
                  className={`bg-base-100 rounded-xl border-2 p-2.5 transition-all ${
                    qty > 0 ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/10" : "border-base-200"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-black text-base-content uppercase">{size}</span>
                    {qty > 0 && <span className="text-[9px] font-black text-[var(--primary)]">{qty}</span>}
                  </div>
                  <div className="flex items-center justify-between bg-base-200 rounded-lg">
                    <button type="button" onClick={() => setStdQty(size, -10)} className="p-1 hover:text-error transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="text-[11px] font-black text-base-content w-7 text-center">{qty || "—"}</span>
                    <button type="button" onClick={() => setStdQty(size, 10)} className="p-1 hover:text-[var(--primary)] transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Custom Rows */}
        {sizingMode === "custom" && (
          <div className="space-y-3">
            {/* Size chart upload */}
            <div className="form-control gap-1">
              <label className="label py-0">
                <span className="label-text text-[11px] font-black uppercase tracking-widest text-base-content/50 flex items-center gap-1.5">
                  <FileText size={12} /> Size Chart File (optional)
                </span>
              </label>
              {!form.sizeChartFileName ? (
                <label className="flex items-center gap-4 border-2 border-dashed border-base-300 rounded-xl p-4 cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all">
                  <FileText size={20} className="text-base-content/30" />
                  <div>
                    <p className="text-sm font-bold text-base-content/70">Upload Measurement File</p>
                    <p className="text-[10px] text-base-content/40">PDF, Excel, CSV, or Image</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.csv,.xlsx,.xls,image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        onChange("sizeChartFile", file);
                        onChange("sizeChartFileName", file.name);
                      }
                    }}
                  />
                </label>
              ) : (
                <div className="flex items-center gap-3 bg-success/5 border border-success/20 rounded-xl p-3">
                  <CheckCircle2 size={18} className="text-success shrink-0" />
                  <span className="text-sm font-bold text-base-content flex-1 truncate">{form.sizeChartFileName}</span>
                  <button
                    type="button"
                    onClick={() => { onChange("sizeChartFile", null); onChange("sizeChartFileName", ""); }}
                    className="text-[10px] font-black text-base-content/40 hover:text-error transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Custom rows */}
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-base-content/30 px-1">
                <span>Size Label</span>
                <span>Qty (pcs)</span>
              </div>
              {customRows.map((row) => (
                <div key={row.id} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => updateRow(row.id, "name", e.target.value)}
                    placeholder="e.g. XL-Tall"
                    className="input input-bordered input-sm flex-1 rounded-xl font-bold text-sm focus:border-[var(--primary)]"
                  />
                  <div className="flex items-center border border-base-200 rounded-xl bg-base-100 overflow-hidden">
                    <button type="button" onClick={() => updateRow(row.id, "qty", Math.max(0, row.qty - 10))} className="p-2 hover:bg-base-200">
                      <Minus size={12} />
                    </button>
                    <span className="w-12 text-center text-sm font-black">{row.qty}</span>
                    <button type="button" onClick={() => updateRow(row.id, "qty", row.qty + 10)} className="p-2 hover:bg-base-200">
                      <Plus size={12} />
                    </button>
                  </div>
                  <button type="button" onClick={() => deleteRow(row.id)} className="p-2 text-base-content/30 hover:text-error transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addRow}
                className="btn btn-ghost btn-sm gap-1.5 text-[var(--primary)] font-black text-[10px] uppercase tracking-widest hover:bg-[var(--primary)]/5"
              >
                <Plus size={14} /> Add Size Row
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Notes */}
      <div className="form-control gap-1">
        <label className="label py-0">
          <span className="label-text text-[11px] font-black uppercase tracking-widest text-base-content/50">
            Product / Tech Notes (optional)
          </span>
        </label>
        <textarea
          value={form.productNotes || ""}
          onChange={(e) => onChange("productNotes", e.target.value)}
          rows={3}
          placeholder="Garment spec notes, stitching details, label requirements, hang tag instructions..."
          className="textarea textarea-bordered w-full rounded-xl text-sm font-medium resize-none focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
        />
      </div>
    </div>
  );
}
