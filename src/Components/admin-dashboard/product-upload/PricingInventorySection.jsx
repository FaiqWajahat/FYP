"use client";
import React from "react";
import { DollarSign, Package, AlertCircle, TrendingUp, X, Plus } from "lucide-react";

export default function PricingInventorySection({ form, setField, errors }) {
  // Helpers
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const predefinedTiers = [
    { label: "Sample / MOQ", quantity: "1", range: "1-19", price: "", desc: "" },
    { label: "Low Volume", quantity: "20", range: "20-49", price: "", desc: "" },
    { label: "Mid Volume", quantity: "50", range: "50-199", price: "", desc: "" },
    { label: "High Volume", quantity: "200", range: "200+", price: "", desc: "" }
  ];

  const addTier = () => {
    const currentCount = (form.pricingTiers || []).length;
    if (currentCount >= 4) return;
    
    // Auto-populate with predefined tier data if available, else fallback
    const nextTier = predefinedTiers[currentCount] || { label: "Elite Volume", quantity: "", range: "", price: "", desc: "" };
    const newTiers = [...(form.pricingTiers || []), nextTier];
    setField("pricingTiers", newTiers);
  };

  const removeTier = (index) => {
    const newTiers = form.pricingTiers.filter((_, i) => i !== index);
    setField("pricingTiers", newTiers);
  };

  const updateTier = (index, field, value) => {
    const newTiers = [...form.pricingTiers];
    newTiers[index][field] = value;
    
    // Auto-generate range text based on quantity (optional logic improvement)
    if (field === "quantity" && index > 0) {
      const prevQty = parseInt(newTiers[index - 1].quantity) || 1;
      const currentQty = parseInt(value) || 0;
      if (currentQty > prevQty) {
         newTiers[index - 1].range = `${prevQty}-${currentQty - 1}`;
         newTiers[index].range = `${currentQty}+`;
      }
    }
    
    setField("pricingTiers", newTiers);
  };

  return (
    <section className="bg-base-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl rounded-xl border border-base-content/10 overflow-hidden transition-all duration-300">
      <div className="px-6 py-4 border-b border-base-content/10 flex items-center justify-between" style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 4%, transparent)' }}>
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <h2 className="font-bold text-sm uppercase tracking-[0.1em] text-base-content">Tiered Wholesale Pricing</h2>
        </div>
        <div className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-base-200 text-base-content/60">Step 2</div>
      </div>

      <div className="p-6 md:p-8 space-y-10 text-base-content">
        
        {/* Tier Builder */}
        <div className="space-y-4">
             <div className="flex items-center justify-between">
                <div>
                   <h3 className="font-bold text-[11px] uppercase tracking-widest text-base-content/50 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-base-content/40" /> Pricing Tiers <span className="text-error">*</span>
                   </h3>
                   <p className="text-[10px] text-base-content/40 mt-1 font-medium">Define volume breaks. The storefront automatically displays the correct price based on cart quantity.</p>
                </div>
                <button 
                  type="button" 
                  onClick={addTier}
                  disabled={(form.pricingTiers || []).length >= 4}
                  className="px-4 py-2 border-2 border-dashed border-base-content/10 rounded-xl text-[10px] font-black tracking-wider text-base-content/40 hover:text-[var(--primary)] hover:border-[var(--primary)] hover:bg-base-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-base-content/40 disabled:hover:border-base-content/10 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> {(form.pricingTiers || []).length >= 4 ? "MAX TIERS (4) REACHED" : "ADD BREAK"}
                </button>
             </div>

             <div className="space-y-3">
                 {form.pricingTiers?.map((tier, index) => (
                    <div key={index} className="flex gap-3 items-start relative group animate-in slide-in-from-top-2 duration-300">
                       {/* Line connector for visual hierarchy (skip first) */}
                       {index > 0 && (
                          <div className="absolute -top-3 left-6 w-0.5 h-3 bg-base-200"></div>
                       )}
                       
                       <div className="w-12 h-12 shrink-0 rounded-xl bg-base-200 border border-base-content/10 flex flex-col items-center justify-center relative z-10 transition-colors group-focus-within:border-[var(--primary)] group-focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_15%,transparent)]">
                           <span className="text-[9px] font-black text-base-content/40 uppercase tracking-widest leading-none mb-0.5">Tier</span>
                           <span className="text-sm font-black text-base-content leading-none">{index + 1}</span>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-base-100 border border-base-content/10 rounded-2xl p-2 grow transition-colors duration-300 group-focus-within:border-[var(--primary)] group-focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_10%,transparent)]">
                          
                          <div className="px-2 py-1">
                             <label className="text-[9px] font-black text-base-content/40 uppercase tracking-widest block mb-1">Status Label</label>
                             <input 
                               type="text" 
                               value={tier.label}
                               onChange={(e) => updateTier(index, "label", e.target.value)}
                               className="w-full bg-transparent border-b border-base-content/10 focus:border-[var(--primary)] outline-none text-xs font-bold py-1 text-base-content transition-colors"
                               placeholder="e.g. Sample, MOQ"
                             />
                          </div>

                          <div className="px-2 py-1">
                             <label className="text-[9px] font-black text-base-content/40 uppercase tracking-widest block mb-1">Min. Units (Qty)</label>
                             <input 
                               type="number" 
                               value={tier.quantity}
                               onChange={(e) => updateTier(index, "quantity", e.target.value)}
                               className="w-full bg-transparent border-b border-base-content/10 focus:border-[var(--primary)] outline-none text-xs font-bold py-1 text-base-content transition-colors"
                               placeholder="1"
                               min="1"
                             />
                          </div>

                          <div className="px-2 py-1 relative">
                             <label className="text-[9px] font-black text-base-content/40 uppercase tracking-widest block mb-1">Unit Price ($)</label>
                             <span className="absolute left-2 bottom-1.5 text-xs font-bold text-base-content/40">$</span>
                             <input 
                               type="number" 
                               step="0.01"
                               value={tier.price}
                               onChange={(e) => updateTier(index, "price", e.target.value)}
                               className={`w-full bg-transparent border-b outline-none text-xs font-black py-1 pl-3 transition-colors ${!tier.price && errors.pricingTiers ? 'border-error text-error' : 'border-base-content/10 focus:border-[var(--primary)] text-base-content'}`}
                               style={tier.price ? { color: 'var(--primary)' } : {}}
                               placeholder="0.00"
                             />
                          </div>

                          <div className="px-2 py-1 flex items-end gap-2">
                             <div className="grow">
                                <label className="text-[9px] font-black text-base-content/40 uppercase tracking-widest block mb-1">Display Range</label>
                                <input 
                                  type="text" 
                                  value={tier.range}
                                  onChange={(e) => updateTier(index, "range", e.target.value)}
                                  className="w-full bg-transparent border-b border-base-content/10 focus:border-[var(--primary)] outline-none text-xs font-bold py-1 text-base-content transition-colors"
                                  placeholder="e.g. 1-20"
                                />
                             </div>
                             {index > 0 && (
                                <button 
                                  type="button" 
                                  onClick={() => removeTier(index)}
                                  className="h-7 w-7 shrink-0 rounded-lg bg-base-200 text-base-content/40 hover:bg-error hover:text-white flex items-center justify-center transition-colors mb-1"
                                >
                                   <X className="w-3.5 h-3.5" />
                                </button>
                             )}
                          </div>
                       </div>
                    </div>
                 ))}
             </div>
             {errors.pricingTiers && <p className="text-error text-xs font-bold mt-2 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> {errors.pricingTiers}</p>}
        </div>

        {/* Global Inventory Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-base-content/10">
            <div className="form-control w-full group">
              <label className="label py-1 mb-1">
                <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50 group-focus-within:text-base-content transition-colors flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" /> Total Stock <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="number"
                placeholder="Total units available"
                min="0"
                className={`w-full px-4 py-3 rounded-xl bg-base-200 border text-base-content outline-none text-sm font-semibold transition-all duration-300 ${
                  errors.quantity ? "border-error focus:border-error focus:bg-base-100 focus:ring-4 focus:ring-error/10" : "border-base-content/10 focus:border-[var(--primary)] focus:bg-base-100 focus:ring-4"
                }`}
                style={errors.quantity ? {} : { '--tw-ring-color': 'color-mix(in srgb, var(--primary) 15%, transparent)' }}
                value={form.quantity || ""}
                onChange={(e) => setField("quantity", e.target.value)}
              />
              {errors.quantity && <p className="text-error text-[10px] font-bold mt-1.5 px-1">{errors.quantity}</p>}
            </div>

            <div className="form-control w-full group">
              <label className="label py-1 mb-1">
                <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50 group-focus-within:text-base-content transition-colors">
                  Stock Alert Level
                </span>
              </label>
              <div className="px-4 py-3 rounded-xl bg-base-200 border border-base-content/10 italic text-[11px] text-base-content/40 font-medium leading-relaxed">
                  Low stock alerts are automatically triggered when quantity drops below 5 units.
              </div>
            </div>
        </div>

        {/* Info Banner */}
        <div className="bg-base-200 rounded-xl p-4 flex gap-3 items-start border border-base-content/10">
           <AlertCircle className="w-4 h-4 text-base-content/40 shrink-0 mt-0.5" />
           <p className="text-[11px] text-base-content/60 font-medium leading-relaxed">
              When a buyer adds products to their cart, the system automatically checks the aggregate quantity and applies the exact price break defined in the tiers above. The lowest tier (Tier 1) also acts as your sample price if you offer single sample sales.
           </p>
        </div>

      </div>
    </section>
  );
}
