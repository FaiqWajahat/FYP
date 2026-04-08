"use client";
import React from "react";
import { Eye, Calendar, Award, AlertTriangle, HelpCircle } from "lucide-react";

export default function ProductFormSidebar({ form, setField, onDiscard }) {
  const getPrimaryImage = () => {
    if (form.images && form.images.length > 0) return form.images[0];
    return null;
  };

  const getLowestPrice = () => {
     if (!form.pricingTiers || form.pricingTiers.length === 0) return 0;
     const prices = form.pricingTiers.map(t => parseFloat(t.price) || 0).filter(p => p > 0);
     if (prices.length === 0) return 0;
     return Math.min(...prices);
  };

  return (
    <div className="space-y-6 sticky top-28">
      
      {/* Live Preview Card */}
      <div className="rounded-2xl border border-base-content/10 shadow-2xl overflow-hidden relative group bg-neutral text-neutral-content">
        {/* Glow effect matching primary */}
        <div className="absolute -inset-1 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" style={{ backgroundColor: 'var(--primary)' }}></div>
        
        <div className="relative z-10 p-5 border-b border-white/10 flex items-center justify-between backdrop-blur-md bg-neutral/80">
          <div className="flex items-center gap-2">
             <Eye className="w-4 h-4 text-white/50" />
             <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-white/80">Live Preview</h3>
          </div>
          <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase text-white shadow-sm" style={{ backgroundColor: 'var(--primary)' }}>
             Realtime
          </span>
        </div>
        
        <div className="relative aspect-[4/5] bg-white overflow-hidden p-2">
            <div className="w-full h-full bg-base-200 rounded-lg overflow-hidden relative flex flex-col items-center justify-center">
              {getPrimaryImage() ? (
                <img src={getPrimaryImage()} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="text-center p-6 grayscale opacity-50">
                   <div className="w-16 h-16 mx-auto bg-base-300 rounded-full mb-3 flex items-center justify-center">
                      <Eye className="w-6 h-6 text-base-content/40" />
                   </div>
                   <p className="text-[10px] uppercase font-bold tracking-widest text-base-content/50">Awaiting Media</p>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end drop-shadow-md">
                 <span className={`px-2 py-1 rounded bg-white text-[9px] font-black uppercase tracking-widest z-10 ${form.status === 'Active' ? 'text-success' : 'text-base-content/40'}`}>
                    {form.status}
                 </span>
                 {form.isFeatured && (
                    <span className="px-2 py-1 rounded bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest z-10 shadow-sm flex items-center gap-1">
                       <Award className="w-2.5 h-2.5" /> Featured
                    </span>
                 )}
              </div>
            </div>
        </div>
        
        <div className="p-5 backdrop-blur-md bg-neutral/90 relative z-10">
          <div className="flex items-start justify-between gap-3 mb-2">
             <h4 className="font-black text-white text-base leading-tight">
               {form.name || "Untitled Product"}
             </h4>
             <span className="shrink-0 font-bold text-white text-sm" style={{ color: 'var(--primary)', filter: 'brightness(1.5)' }}>
                ${getLowestPrice().toFixed(2)}<span className="text-[10px] text-white/50 font-medium ml-0.5">/unit</span>
             </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
             <span className="px-2 py-1 rounded bg-white/5 text-white/60 text-[9px] font-bold uppercase border border-white/5">{form.category || "No Category"}</span>
             <span className="px-2 py-1 rounded bg-white/5 text-white/60 text-[9px] font-bold uppercase border border-white/5">{form.sku || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Publish Settings */}
      <div className="bg-base-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl border border-base-content/10 overflow-hidden text-base-content">
        <div className="px-5 py-4 border-b border-base-content/10 flex items-center gap-2 bg-base-200/50">
          <Award className="w-4 h-4 text-base-content/50" />
          <h2 className="font-bold text-xs uppercase tracking-widest text-base-content">Publish Settings</h2>
        </div>
        
        <div className="p-5 space-y-5">
           <label className="flex items-start gap-3 cursor-pointer group">
              <div className="mt-0.5">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-base-content/20 transition-colors" 
                    style={{ accentColor: 'var(--primary)' }}
                    checked={form.isFeatured}
                    onChange={(e) => setField("isFeatured", e.target.checked)}
                  />
              </div>
              <div>
                 <span className="block text-xs font-bold text-base-content group-hover:text-[var(--primary)] transition-colors">Mark as Featured Product</span>
                 <span className="block text-[10px] text-base-content/50 mt-0.5 leading-relaxed">Boosts visibility by pinning this to the top of category pages and storefront carousels.</span>
              </div>
           </label>

           <div className="form-control w-full">
              <label className="label py-1 mb-1">
                <span className="label-text text-[9px] uppercase font-black tracking-widest text-base-content/50 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Scheduled Launch
                </span>
              </label>
              <input
                type="date"
                className="w-full px-3 py-2.5 rounded-xl bg-base-200 border border-base-content/10 outline-none text-xs font-bold transition-all duration-300 focus:border-[var(--primary)] focus:bg-base-100 focus:ring-4 text-base-content"
                style={{ '--tw-ring-color': 'color-mix(in srgb, var(--primary) 15%, transparent)' }}
                value={form.releaseDate || ""}
                onChange={(e) => setField("releaseDate", e.target.value)}
              />
           </div>
        </div>
      </div>
      
      {/* Help Block */}
      <div className="bg-base-200/50 rounded-xl p-4 border border-base-content/5 flex gap-3 text-base-content">
         <HelpCircle className="w-4 h-4 text-base-content/40 mt-0.5 shrink-0" />
         <p className="text-[10px] text-base-content/50 font-medium leading-relaxed">
            Need help configuring custom branding matrices? <a href="#" className="font-bold underline hover:text-[var(--primary)] transition-colors">Read the B2B Merchant Guide</a>.
         </p>
      </div>

    </div>
  );
}
