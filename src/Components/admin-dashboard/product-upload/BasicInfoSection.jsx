import React, { useState, useEffect } from "react";
import { Tag, Layers, Info, Weight } from "lucide-react";
import axios from "axios";
import CustomDropdown from "@/Components/common/CustomDropdown";
import { useProductOptionsStore } from "@/store/productOptionsStore";

export default function BasicInfoSection({ form, setField, errors }) {
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await axios.get("/api/categories");
        setDbCategories(data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const selectedCat = dbCategories.find((c) => c.name === form.category);
  const subOptions = selectedCat?.subcategories || [];

  const fabricOptions = useProductOptionsStore(state => state.fabricOptions);
  const gsmWeightCategories = useProductOptionsStore(state => state.gsmWeightCategories);

  return (
    <section className="bg-base-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl rounded-xl border border-base-content/10 transition-all duration-300">
      <div className="px-6 py-4 border-b border-base-content/10 flex items-center justify-between sm:rounded-t-2xl rounded-t-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 4%, transparent)' }}>
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <h2 className="font-bold text-sm uppercase tracking-[0.1em] text-base-content">Basic Information</h2>
        </div>
        <div className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-base-200 text-base-content/60">Step 1</div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Core Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 text-base-content">
          <div className="form-control w-full group">
            <label className="label py-1 mb-1">
              <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50 group-focus-within:text-base-content transition-colors">
                Product Name <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. Heavyweight Cotton Hoodie"
              className={`w-full px-4 py-3 rounded-xl bg-base-200 border text-base-content outline-none text-sm font-semibold transition-all duration-300 ${
                errors.name ? "border-error focus:border-error focus:bg-base-100 focus:ring-4 focus:ring-error/10" : "border-base-content/10 focus:border-[var(--primary)] focus:bg-base-100 focus:ring-4"
              }`}
              style={errors.name ? {} : { '--tw-ring-color': 'color-mix(in srgb, var(--primary) 15%, transparent)' }}
              value={form.name || ""}
              onChange={(e) => setField("name", e.target.value)}
            />
            {errors.name && <p className="text-error text-[10px] font-bold mt-1.5 px-1">{errors.name}</p>}
          </div>

          <div className="form-control w-full group">
            <label className="label py-1 mb-1">
              <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50 group-focus-within:text-base-content transition-colors flex items-center justify-between w-full">
                <span>SKU / Model <span className="text-error">*</span></span>
                <span className="text-base-content/40 font-medium tracking-normal normal-case">(Auto-generated)</span>
              </span>
            </label>
            <div className="flex w-full relative">
              <input
                type="text"
                placeholder="PROD-XXXX"
                className={`w-full pl-4 pr-24 py-3 rounded-xl bg-base-200 border outline-none text-sm font-bold text-base-content transition-all duration-300 ${
                  errors.sku ? "border-error focus:border-error focus:ring-4 focus:ring-error/10" : "border-base-content/10 focus:border-[var(--primary)] focus:bg-base-100 focus:ring-4"
                }`}
                style={errors.sku ? {} : { '--tw-ring-color': 'color-mix(in srgb, var(--primary) 15%, transparent)' }}
                value={form.sku || ""}
                onChange={(e) => setField("sku", e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setField("sku", `PROD-${Math.floor(1000 + Math.random() * 9000)}`)}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg font-bold text-xs text-white transition-transform active:scale-95 hover:brightness-110"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                Generate
              </button>
            </div>
            {errors.sku && <p className="text-error text-[10px] font-bold mt-1.5 px-1">{errors.sku}</p>}
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 text-base-content">
          <div className="form-control w-full group">
             <label className="label py-1 mb-1">
              <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50 group-focus-within:text-base-content transition-colors flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Category <span className="text-error">*</span>
              </span>
            </label>
            <CustomDropdown
              value={form.category}
              placeholder="Select Category"
              options={dbCategories.map(cat => ({ label: cat.name, value: cat.name }))}
              onChange={(val) => {
                setField("category", val);
                setField("subCategory", "");
              }}
              className={errors.category ? "ring-error/10 border-error" : ""}
            />
          </div>

          <div className="form-control w-full group">
            <label className="label py-1 mb-1">
              <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50 group-focus-within:text-base-content transition-colors">
                Sub Category <span className="text-error">*</span>
              </span>
            </label>
            <CustomDropdown
              disabled={!form.category || loading}
              value={form.subCategory}
              placeholder={loading ? "Loading..." : "Select Sub-Category"}
              options={selectedCat?.subcategories || []}
              onChange={(val) => setField("subCategory", val)}
            />
          </div>
        </div>

        {/* Factory Specs Section */}
        <div className="pt-6 border-t border-base-content/10 text-base-content">
            <div className="flex items-center gap-2 mb-6">
                <Weight className="w-4 h-4 text-base-content/40" />
                <h3 className="font-bold text-[11px] uppercase tracking-widest text-base-content/40">Manufacturing Specifications</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="form-control w-full group">
                    <label className="label py-1 mb-1">
                        <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50 group-focus-within:text-base-content transition-colors">Fabric Type</span>
                    </label>
                    <CustomDropdown
                        value={form.fabric}
                        placeholder="Select Fabric"
                        options={fabricOptions}
                        onChange={(val) => setField("fabric", val)}
                    />
                </div>

                <div className="form-control w-full group">
                    <label className="label py-1 mb-1">
                        <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50 group-focus-within:text-base-content transition-colors">Weight Class</span>
                    </label>
                    <CustomDropdown
                        value={form.gsmWeight}
                        placeholder="Select Class"
                        options={gsmWeightCategories}
                        onChange={(val) => setField("gsmWeight", val)}
                    />
                </div>

                 <div className="form-control w-full group">
                    <label className="label py-1 mb-1">
                        <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50 group-focus-within:text-base-content transition-colors">Specific GSM</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. 350 GSM"
                        className="w-full px-4 py-2.5 rounded-xl bg-base-200 border border-base-content/10 outline-none text-sm font-semibold transition-all duration-300 focus:border-[var(--primary)] focus:bg-base-100 focus:ring-4 text-base-content"
                        style={{ '--tw-ring-color': 'color-mix(in srgb, var(--primary) 15%, transparent)' }}
                        value={form.gsm || ""}
                        onChange={(e) => setField("gsm", e.target.value)}
                    />
                </div>
            </div>
        </div>

        {/* Status & Visibility */}
        <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-base-content/10 text-base-content">
            <label className="relative inline-flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={form.status === "Active"} 
                onChange={(e) => setField("status", e.target.checked ? "Active" : "Inactive")}
              />
              <div 
                className="w-11 h-6 bg-base-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-base-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner"
                style={form.status === "Active" ? { backgroundColor: 'var(--primary)' } : {}}
              ></div>
              <span className="ml-3 text-[11px] font-black uppercase tracking-widest text-base-content/80">Active Status</span>
            </label>
          <div className="flex items-center gap-2 text-[11px] text-base-content/60 font-medium bg-base-200 px-3 py-1.5 rounded-lg border border-base-content/10">
            <Info className="w-3.5 h-3.5 opacity-70" />
            Active products are visible unconditionally to storefront visitors.
          </div>
        </div>

      </div>
    </section>
  );
}
