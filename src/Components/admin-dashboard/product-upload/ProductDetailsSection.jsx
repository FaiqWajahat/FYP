"use client";
import React, { useState, useRef, useEffect } from "react";
import { FileText, Palette, Maximize, Hash, X, Plus, Table, Paintbrush, ChevronDown, Sparkles } from "lucide-react";
import { useProductOptionsStore } from "@/store/productOptionsStore";
import { toast } from "react-hot-toast";

export default function ProductDetailsSection({ form, setField, errors }) {
  const [newTag, setNewTag] = useState("");
  const [customColorName, setCustomColorName] = useState("");
  const [customColorHex, setCustomColorHex] = useState("#1e3a8a");
  const [customSizeName, setCustomSizeName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDescription = async () => {
    if (!form.name?.trim()) {
      toast.error("Please fill in the Product Name in Step 1 first!");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: form.name,
          category: form.category,
          subCategory: form.subCategory,
          fabric: form.fabric,
          gsm: form.gsm,
          colors: form.colors ? form.colors.split(",").map(c => c.split(":")[0]).join(", ") : ""
        })
      });
      const data = await res.json();
      if (data.success) {
        setField("description", data.text);
        toast.success("Description generated successfully!");
      } else {
        toast.error(data.error || "Failed to generate description");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during description generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const presetSizes = useProductOptionsStore(state => state.presetSizes);
  const DEFAULT_BRANDING = useProductOptionsStore(state => state.defaultBranding);
  const INDUSTRY_COLORS = useProductOptionsStore(state => state.industryColors);

  // Colors Logic
  const toggleColor = (colorObj) => {
    let current = form.colors ? form.colors.split(",") : [];
    const colorStr = `${colorObj.name}:${colorObj.hex}`;
    
    // Check if color exists
    const existsIndex = current.findIndex(c => c.split(":")[1] === colorObj.hex);
    
    if (existsIndex > -1) {
      // Remove it
      current.splice(existsIndex, 1);
    } else {
      // Add it
      current.push(colorStr);
    }
    
    setField("colors", current.filter(Boolean).join(","));
  };

  const handleAddCustomColor = () => {
    if (!customColorName.trim()) return;
    const name = customColorName.trim();
    const hex = customColorHex;
    
    // Check if color exists (by hex or name)
    const current = form.colors ? form.colors.split(",") : [];
    const exists = current.some(c => {
      const [n, h] = c.split(":");
      return h === hex || n.toLowerCase() === name.toLowerCase();
    });
    
    if (!exists) {
      const colorStr = `${name}:${hex}`;
      setField("colors", [...current, colorStr].filter(Boolean).join(","));
      setCustomColorName("");
    }
  };

  // Branding Logic
  const toggleBrandingOption = (optionId, defaultPrice) => {
    const options = form.brandingOptions || [];
    const exists = options.find((o) => o.id === optionId);
    
    if (exists) {
       setField("brandingOptions", options.filter((o) => o.id !== optionId));
    } else {
       setField("brandingOptions", [...options, { id: optionId, price: defaultPrice }]);
    }
  };

  const updateBrandingPrice = (optionId, price) => {
    const options = form.brandingOptions || [];
    setField("brandingOptions", options.map(o => o.id === optionId ? { ...o, price: parseFloat(price) || 0 } : o));
  };


  // Sizing & Tag Logic
  const getTypicalMeasurements = (size) => {
    const measurements = {
      // Alpha Standard
      "XS": { chest: "36", length: "27", sleeve: "7.5" },
      "S": { chest: "38", length: "28", sleeve: "8.0" },
      "SM": { chest: "38", length: "28", sleeve: "8.0" },
      "M": { chest: "40", length: "29", sleeve: "8.5" },
      "L": { chest: "42", length: "30", sleeve: "9.0" },
      "XL": { chest: "44", length: "31", sleeve: "9.5" },
      "2XL": { chest: "46", length: "32", sleeve: "10.0" },
      "3XL": { chest: "48", length: "33", sleeve: "10.5" },
      "4XL": { chest: "50", length: "34", sleeve: "11.0" },
      // Numeric Waist
      "28": { chest: "--", length: "30", sleeve: "--" },
      "30": { chest: "--", length: "30", sleeve: "--" },
      "32": { chest: "--", length: "32", sleeve: "--" },
      "34": { chest: "--", length: "32", sleeve: "--" },
      "36": { chest: "--", length: "32", sleeve: "--" },
      "38": { chest: "--", length: "34", sleeve: "--" },
      "40": { chest: "--", length: "34", sleeve: "--" },
      // Kids Wear
      "2Y": { chest: "21", length: "15", sleeve: "12" },
      "4Y": { chest: "23", length: "17", sleeve: "14" },
      "6Y": { chest: "25", length: "19", sleeve: "16" },
      "8Y": { chest: "27", length: "21", sleeve: "18" },
      "10Y": { chest: "29", length: "23", sleeve: "20" },
      "12Y": { chest: "31", length: "25", sleeve: "22" },
      // Footwear
      "7": { chest: "--", length: "9.6", sleeve: "--" },
      "8": { chest: "--", length: "10.0", sleeve: "--" },
      "9": { chest: "--", length: "10.3", sleeve: "--" },
      "10": { chest: "--", length: "10.6", sleeve: "--" },
      "11": { chest: "--", length: "11.0", sleeve: "--" },
      "12": { chest: "--", length: "11.3", sleeve: "--" }
    };
    return measurements[size] || { chest: "", length: "", sleeve: "" };
  };

  const togglePresetSize = (size) => {
    const currentSizes = form.sizes ? form.sizes.split(" ") : [];
    const currentChart = form.sizeChart || [];
    
    if (currentSizes.includes(size)) {
      // Remove size and its corresponding chart row
      setField("sizes", currentSizes.filter(s => s !== size).join(" ").trim());
      setField("sizeChart", currentChart.filter(row => row.size !== size));
    } else {
      // Add size and new chart row securely mapped to this size
      setField("sizes", [...currentSizes, size].join(" ").trim());
      const typical = getTypicalMeasurements(size);
      setField("sizeChart", [...currentChart, { size: size, ...typical }]);
    }
  };

  const applySizePreset = (sizesArray) => {
    setField("sizes", sizesArray.join(" "));
    
    // Build size chart and preserve existing measurements if size matches
    const currentChart = form.sizeChart || [];
    const newChart = sizesArray.map(sz => {
      const existingRow = currentChart.find(row => row.size === sz);
      if (existingRow) return existingRow;
      const typical = getTypicalMeasurements(sz);
      return { size: sz, ...typical };
    });
    setField("sizeChart", newChart);
  };

  const handleAddCustomSize = () => {
    if (!customSizeName.trim()) return;
    const size = customSizeName.trim().replace(/\s+/g, "-");
    const currentSizes = form.sizes ? form.sizes.split(" ") : [];
    const currentChart = form.sizeChart || [];
    
    if (!currentSizes.includes(size)) {
      setField("sizes", [...currentSizes, size].join(" ").trim());
      const typical = getTypicalMeasurements(size);
      setField("sizeChart", [...currentChart, { size: size, ...typical }]);
      setCustomSizeName("");
    }
  };

  const addItem = (field, value, hook) => {
    if (!value.trim()) return;
    const current = form[field] ? form[field].split(" ") : [];
    if (!current.includes(value.trim())) {
      setField(field, [...current, value.trim()].join(" ").trim());
      hook("");
    }
  };

  const removeItem = (field, value) => {
    const current = form[field].split(" ").filter((v) => v !== value);
    setField(field, current.join(" "));
  };

  // Size Chart Handlers
  const addSizeChartRow = () => {
    const current = form.sizeChart || [];
    setField("sizeChart", [...current, { size: "M", chest: "", length: "", sleeve: "" }]);
  };

  const removeSizeChartRow = (idx) => {
    const current = form.sizeChart.filter((_, i) => i !== idx);
    setField("sizeChart", current);
  };

  const updateSizeChartRow = (idx, field, val) => {
    const current = [...form.sizeChart];
    const oldSize = current[idx].size;
    const sanitizedVal = field === "size" ? val.replace(/\s+/g, "-") : val;
    current[idx][field] = sanitizedVal;
    setField("sizeChart", current);
    
    if (field === "size") {
      const currentSizes = form.sizes ? form.sizes.split(" ") : [];
      const updatedSizes = currentSizes.map(s => s === oldSize ? sanitizedVal : s);
      setField("sizes", updatedSizes.join(" ").trim());
    }
  };



  return (
    <section className="bg-base-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl rounded-xl border border-base-content/10 transition-all duration-300">
      <div className="px-6 py-4 border-b border-base-content/10 flex items-center justify-between sm:rounded-t-2xl rounded-t-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 4%, transparent)' }}>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <h2 className="font-bold text-sm uppercase tracking-[0.1em] text-base-content">Product Specifications</h2>
        </div>
        <div className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-base-200 text-base-content/60">Step 3</div>
      </div>

      <div className="p-6 md:p-8 space-y-10">
        {/* Description */}
        <div className="form-control w-full group">
          <label className="label py-1 mb-1">
            <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50 group-focus-within:text-base-content transition-colors flex justify-between items-center w-full">
               <span>Full Product Description</span>
               <div className="flex items-center gap-3">
                 <button
                   type="button"
                   onClick={handleGenerateDescription}
                   disabled={isGenerating}
                   className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                     isGenerating 
                       ? "bg-base-300 text-base-content/40 cursor-not-allowed" 
                       : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow active:scale-95"
                   }`}
                   title="Instantly draft B2B search-optimized description using Gemini AI"
                 >
                   {isGenerating ? (
                     <>
                       <span className="w-2.5 h-2.5 rounded-full border-2 border-slate-300 border-t-transparent animate-spin"></span>
                       <span>Drafting...</span>
                     </>
                   ) : (
                     <>
                       <Sparkles className="w-2.5 h-2.5" />
                       <span>Auto-Draft</span>
                     </>
                   )}
                 </button>
                 <span className="text-base-content/40 font-medium tracking-normal normal-case">{form.description?.length || 0}/1000 characters</span>
               </div>
            </span>
          </label>
          <textarea
            className="w-full px-4 py-3 rounded-xl bg-base-200 border border-base-content/10 outline-none text-sm font-semibold transition-all duration-300 focus:border-[var(--primary)] focus:bg-base-100 focus:ring-4 h-32 leading-relaxed resize-y text-base-content"
            style={{ '--tw-ring-color': 'color-mix(in srgb, var(--primary) 15%, transparent)' }}
            placeholder="Outline materials, fit, care instructions, and manufacturing details..."
            value={form.description || ""}
            onChange={(e) => setField("description", e.target.value)}
          ></textarea>
        </div>

        <div className="pt-8 border-t border-base-content/10 text-base-content space-y-6">
           {/* Color Swatches - Professional Select UI */}
            <div className="space-y-4 w-full">
                <div className="flex items-center gap-2 mb-2">
                    <Palette className="w-4 h-4 text-base-content/40" />
                    <h3 className="font-bold text-[11px] uppercase tracking-widest text-base-content/50">Available Colors <span className="text-error">*</span></h3>
                </div>
                {errors.colors && <p className="text-error text-[10px] font-bold mt-1.5 px-1">{errors.colors}</p>}
                
                <div className="flex flex-wrap gap-3">
                    {(form.colors ? form.colors.split(",") : []).filter(Boolean).map((colorStr, i) => {
                        const [name, hex] = colorStr.split(":");
                        return (
                          <div key={i} className="flex items-center gap-2 bg-base-200 py-1.5 pl-2 pr-3 rounded-full border border-base-content/10 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                             <div 
                                className="w-5 h-5 rounded-full border border-base-content/20 shadow-inner shrink-0"
                                style={{ backgroundColor: hex || name }}
                             ></div>
                             <span className="text-xs font-bold text-base-content">{name}</span>
                             <span className="text-[10px] text-base-content/40 font-mono uppercase tracking-tighter shrink-0">{hex}</span>
                              <button
                                type="button"
                                onClick={() => toggleColor({ name, hex })}
                                className="ml-1 p-0.5 rounded-full text-base-content/40 hover:bg-error hover:text-white transition-colors"
                             >
                                <X className="w-3.5 h-3.5" />
                             </button>
                          </div>
                      );
                    })}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-base-content/10">
                    <p className="w-full text-[10px] uppercase font-bold text-base-content/40 mb-1">Available Manufacturing Colors:</p>
                    {INDUSTRY_COLORS.map((color, idx) => {
                        const isSelected = (form.colors || "").includes(color.hex);
                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => toggleColor(color)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                                    isSelected ? "border-[var(--primary)] text-base-content shadow-sm scale-105" : "border-base-content/10 text-base-content/60 hover:bg-base-200 opacity-60 hover:opacity-100"
                                }`}
                                style={isSelected ? { backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)' } : {}}
                            >   
                                <span className={`w-3 h-3 rounded-full shadow-inner ${isSelected ? "ring-2 ring-offset-1 ring-[var(--primary)]" : "border border-base-content/20"}`} style={{ backgroundColor: color.hex }}></span>
                                <span className="truncate">{color.name}</span>
                                <span className="text-[9px] font-mono opacity-40 shrink-0">{color.hex}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Custom Color Shade Creator */}
                <div className="pt-4 border-t border-base-content/10 w-full">
                   <p className="w-full text-[10px] uppercase font-bold text-base-content/40 mb-2">Create Custom Color Shade:</p>
                   <div className="flex flex-wrap items-end gap-4 bg-base-200/40 p-4 rounded-xl border border-base-content/10 max-w-xl animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex flex-col gap-1.5 grow min-w-[180px]">
                         <span className="text-[9px] uppercase tracking-wider font-semibold text-base-content/50">Shade Name</span>
                         <input 
                           type="text" 
                           placeholder="e.g., Space Gray, Sage Green" 
                           className="px-3 py-1.5 rounded-lg border border-base-content/10 bg-base-100 outline-none text-xs font-semibold text-base-content focus:border-[var(--primary)]"
                           value={customColorName}
                           onChange={(e) => setCustomColorName(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomColor())}
                         />
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                         <span className="text-[9px] uppercase tracking-wider font-semibold text-base-content/50">Color Shade</span>
                         <div className="flex items-center gap-2">
                           <input 
                             type="color" 
                             className="w-8 h-8 rounded-lg cursor-pointer border border-base-content/20 bg-transparent shrink-0"
                             value={customColorHex}
                             onChange={(e) => setCustomColorHex(e.target.value)}
                           />
                           <span className="text-xs font-mono font-bold uppercase text-base-content/75">{customColorHex}</span>
                         </div>
                      </div>
                      <button 
                        type="button"
                        onClick={handleAddCustomColor}
                        className="btn btn-xs bg-[var(--primary)] text-white hover:brightness-110 border-transparent rounded-lg px-3 py-2 h-auto min-h-0 text-[10px] font-bold shrink-0 self-end mb-[2px]"
                      >
                        + Add Custom Shade
                      </button>
                   </div>
                </div>
                </div>
            </div>
        </div>

        {/* Branding Options */}
        <div className="pt-8 border-t border-base-content/10 text-base-content">
            <div className="space-y-4 w-full max-w-4xl">
                <div className="flex items-center gap-2 mb-2">
                    <Paintbrush className="w-4 h-4 text-base-content/40" />
                    <h3 className="font-bold text-[11px] uppercase tracking-widest text-base-content/50">Custom Branding Options</h3>
                </div>
                <div className="space-y-3">
                   {DEFAULT_BRANDING.map(branding => {
                       const activeItem = (form.brandingOptions || []).find(o => o.id === branding.id);
                       const isActive = !!activeItem;

                       return (
                           <div key={branding.id} 
                                className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${isActive ? 'bg-base-100 shadow-sm ring-1' : 'bg-base-200 border-base-content/10 grayscale-[0.5] opacity-80 hover:opacity-100 hover:grayscale-0 cursor-pointer'}`}
                                style={isActive ? { borderColor: 'color-mix(in srgb, var(--primary) 30%, transparent)', ringColor: 'color-mix(in srgb, var(--primary) 30%, transparent)' } : {}}
                            >
                              <label className="flex items-center gap-3 cursor-pointer grow">
                                  <input 
                                     type="checkbox" 
                                     className="w-4 h-4 rounded border-base-content/20 transition-colors" 
                                     style={{ accentColor: 'var(--primary)' }}
                                     checked={isActive}
                                     onChange={() => toggleBrandingOption(branding.id, branding.defaultPrice)}
                                  />
                                  <span className={`text-sm font-bold transition-colors ${isActive ? 'text-base-content' : 'text-base-content/60'}`} style={isActive ? { color: 'var(--primary)' } : {}}>{branding.name}</span>
                              </label>
                              
                              {isActive && (
                                  <div className="relative w-28 shrink-0">
                                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs" style={{ color: 'var(--primary)' }}>+ $</span>
                                      <input 
                                        type="number" 
                                        step="0.10"
                                        className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-base-content/20 bg-base-100 outline-none text-xs font-black focus:bg-base-100 transition-colors text-base-content"
                                        style={{ color: 'var(--primary)' }}
                                        value={activeItem.price}
                                        onChange={(e) => updateBrandingPrice(branding.id, e.target.value)}
                                        onClick={(e) => e.target.select()}
                                      />
                                  </div>
                              )}
                           </div>
                       );
                   })}
                </div>
            </div>
        </div>

        {/* Sizing Logic */}
        <div className="space-y-6 pt-8 border-t border-base-content/10 text-base-content">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
               <Maximize className="w-4 h-4 text-base-content/40" />
               <h3 className="font-bold text-[11px] uppercase tracking-widest text-base-content/50">Available Sizes <span className="text-error">*</span></h3>
            </div>
            {errors.sizes && <p className="text-error text-[10px] font-bold mt-1.5 px-1">{errors.sizes}</p>}
          </div>

          {/* Size Preset Auto-generator & Custom Add */}
          <div className="p-4 rounded-2xl border border-base-content/10 bg-base-200/30 space-y-4 animate-in fade-in duration-300">
            <div>
              <p className="text-[10px] text-base-content/50 uppercase font-black tracking-widest mb-2">⚡ Auto-Generate Size Presets:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applySizePreset(["XS", "SM", "M", "L", "XL", "2XL"])}
                  className="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-base-content/10 bg-base-100 hover:bg-base-200 text-base-content transition-colors"
                >
                  Standard Alpha (XS - 2XL)
                </button>
                <button
                  type="button"
                  onClick={() => applySizePreset(["XS", "SM", "M", "L", "XL", "2XL", "3XL", "4XL"])}
                  className="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-base-content/10 bg-base-100 hover:bg-base-200 text-base-content transition-colors"
                >
                  Extended Alpha (XS - 4XL)
                </button>
                <button
                  type="button"
                  onClick={() => applySizePreset(["28", "30", "32", "34", "36", "38", "40"])}
                  className="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-base-content/10 bg-base-100 hover:bg-base-200 text-base-content transition-colors"
                >
                  Waist / Numeric (28 - 40)
                </button>
                <button
                  type="button"
                  onClick={() => applySizePreset(["2Y", "4Y", "6Y", "8Y", "10Y", "12Y"])}
                  className="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-base-content/10 bg-base-100 hover:bg-base-200 text-base-content transition-colors"
                >
                  Kids Wear (2Y - 12Y)
                </button>
                <button
                  type="button"
                  onClick={() => applySizePreset(["7", "8", "9", "10", "11", "12"])}
                  className="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-base-content/10 bg-base-100 hover:bg-base-200 text-base-content transition-colors"
                >
                  Footwear (7 - 12)
                </button>
              </div>
            </div>
            
            <div className="pt-3 border-t border-base-content/5 flex flex-wrap items-center gap-3">
              <div className="flex flex-col gap-1 grow max-w-xs">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-base-content/50">Add Individual Custom Size</span>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g., One Size, 5XL, 32L" 
                    className="px-3 py-1.5 rounded-lg border border-base-content/10 bg-base-100 outline-none text-xs font-semibold text-base-content focus:border-[var(--primary)] grow"
                    value={customSizeName}
                    onChange={(e) => setCustomSizeName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSize())}
                  />
                  <button 
                    type="button"
                    onClick={handleAddCustomSize}
                    className="btn btn-xs bg-[var(--primary)] text-white hover:brightness-110 border-transparent rounded-lg px-3 py-2 h-auto min-h-0 text-[10px] font-bold"
                  >
                    Add Size
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-[10px] text-base-content/40 uppercase font-bold tracking-widest">Select supported variations:</p>
            <div className="flex flex-wrap gap-3">
              {presetSizes.map(size => {
                const active = (form.sizes || "").split(" ").includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => togglePresetSize(size)}
                    className={`h-10 px-6 rounded-xl border text-xs font-bold transition-all duration-200 ${
                      active 
                        ? "text-white shadow-md shadow-[var(--primary)]/20 scale-105" 
                        : "bg-base-100 border-base-content/10 text-base-content/70 hover:border-base-content/30 hover:bg-base-200"
                    }`}
                    style={active ? { backgroundColor: 'var(--primary)', borderColor: 'var(--primary)' } : {}}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* New Size Chart Builder! */}
          <div className="pt-6 mt-4 border-t border-base-content/5">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                   <Table className="w-3.5 h-3.5 text-[var(--primary)]" />
                   <span className="text-[10px] uppercase font-black tracking-widest text-base-content/60">Measurement Chart (Inches)</span>
                </div>
                <div className="text-[9px] font-black uppercase text-base-content/40 bg-base-200 px-2.5 py-1 rounded-md">
                   Auto-Generated from Selected Sizes
                </div>
             </div>
             
             {form.sizeChart?.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-base-content/10 shadow-sm bg-base-100">
                   <table className="table table-xs w-full">
                      <thead className="bg-base-200 text-[9px] uppercase tracking-widest">
                         <tr>
                            <th>Size</th>
                            <th>Chest</th>
                            <th>Length</th>
                            <th>Sleeve</th>
                            <th className="text-right">Actions</th>
                         </tr>
                      </thead>
                       <tbody className="bg-base-100">
                         {form.sizeChart.map((row, idx) => (
                            <tr key={idx} className="border-b border-base-content/5 hover:bg-base-200/20 transition-colors">
                               <td>
                                 <input 
                                   type="text" 
                                   value={row.size} 
                                   onChange={(e) => updateSizeChartRow(idx, "size", e.target.value)} 
                                   className="w-full bg-transparent outline-none font-bold text-xs border-b border-dashed border-base-content/20 focus:border-[var(--primary)] text-base-content px-1" 
                                 />
                               </td>
                               <td><input type="text" value={row.chest} onChange={(e) => updateSizeChartRow(idx, "chest", e.target.value)} className="w-full bg-transparent outline-none text-xs text-base-content" placeholder="--" /></td>
                               <td><input type="text" value={row.length} onChange={(e) => updateSizeChartRow(idx, "length", e.target.value)} className="w-full bg-transparent outline-none text-xs text-base-content" placeholder="--" /></td>
                               <td><input type="text" value={row.sleeve} onChange={(e) => updateSizeChartRow(idx, "sleeve", e.target.value)} className="w-full bg-transparent outline-none text-xs text-base-content" placeholder="--" /></td>
                               <td className="text-right">
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                       const sizeToRemove = row.size;
                                       const currentSizes = form.sizes ? form.sizes.split(" ") : [];
                                       setField("sizes", currentSizes.filter(s => s !== sizeToRemove).join(" ").trim());
                                       setField("sizeChart", form.sizeChart.filter((_, i) => i !== idx));
                                    }}
                                    className="p-1 hover:text-error transition-colors rounded-full"
                                    title="Delete Size"
                                  >
                                     <X className="w-3.5 h-3.5 text-base-content/40 hover:text-error" />
                                  </button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             ) : (
                <div className="p-4 rounded-xl border border-dashed border-base-content/10 bg-base-200/50 text-center">
                   <p className="text-[10px] font-bold text-base-content/40 italic">No measurements defined. Chart modal will be empty.</p>
                </div>
             )}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-4 pt-8 border-t border-base-content/10 text-base-content">
           <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-base-content/40" />
              <h3 className="font-bold text-[11px] uppercase tracking-widest text-base-content/50">Discovery Tags</h3>
           </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {(form.tags ? form.tags.split(" ") : []).map((tag, i) => (
              <div key={i} className="flex items-center gap-1.5 py-1.5 pl-3 pr-2 rounded-lg border font-bold text-[10px] tracking-wide" style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)', borderColor: 'color-mix(in srgb, var(--primary) 20%, transparent)', color: 'var(--primary)' }}>
                {tag.toUpperCase()}
                <button type="button" onClick={() => removeItem("tags", tag)} className="p-0.5 rounded-full hover:bg-[var(--primary)] hover:text-white transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex w-full max-w-sm">
            <input
              type="text"
              placeholder="e.g. SUMMER, PREMIUM, COTTON"
              className="w-full px-4 py-2 rounded-l-xl bg-base-200 border border-r-0 border-base-content/10 outline-none text-sm font-semibold transition-colors focus:bg-base-100 text-base-content"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem("tags", newTag, setNewTag))}
            />
            <button 
              type="button" 
              onClick={() => addItem("tags", newTag, setNewTag)}
              className="px-6 rounded-r-xl font-bold text-xs text-base-content/80 transition-colors bg-base-300 border border-base-content/20 hover:bg-base-300/80"
            >
              TAG
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="border rounded-xl p-4 flex gap-4 items-start bg-base-200 border-base-content/10">
          <div className="p-2 rounded-lg shrink-0 bg-base-100 border border-base-content/5 shadow-sm">
            <Table className="w-4 h-4 text-base-content/40" />
          </div>
          <div className="space-y-1">
            <p className="text-[11px] text-base-content/60 font-medium leading-relaxed">
               Tagging your product with specific B2B discovery terms improves internal dashboard search results. Branding options directly sync with the 3D studio configurator during the user's purchase workflow.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
