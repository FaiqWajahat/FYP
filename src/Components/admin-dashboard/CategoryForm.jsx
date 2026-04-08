"use client";
import React, { useState, useEffect, useRef } from "react";
import { Layers, List, FolderPlus, Save, X, Info, UploadCloud, ImageIcon, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function CategoryForm({ editCategory, onSave, onCancel }) {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    subcategories: "",
    status: "Active",
    description: "",
    imageUrl: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (editCategory) {
      setForm({
        name: editCategory.name || "",
        subcategories: Array.isArray(editCategory.subcategories) ? editCategory.subcategories.join(", ") : "",
        status: editCategory.status || "Active",
        description: editCategory.description || "",
        imageUrl: editCategory.image_url || ""
      });
      setImagePreview(editCategory.image_url || null);
    } else {
      setForm({ name: "", subcategories: "", status: "Active", description: "", imageUrl: "" });
      setImagePreview(null);
    }
  }, [editCategory]);

  const setField = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setField("imageUrl", url); // Store blob URL temporarily
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrors({ name: "Category name is required" });
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = form.imageUrl;

      // 1. Upload Image to Cloudinary if it's a new local file (blob)
      if (form.imageUrl && form.imageUrl.startsWith("blob:")) {
        const response = await fetch(form.imageUrl);
        const blob = await response.blob();
        
        const formData = new FormData();
        formData.append("file", blob, `category-${Date.now()}.jpg`);
        
        const uploadRes = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        
        if (uploadRes.data.success) {
          finalImageUrl = uploadRes.data.url;
        }
      }

      // 2. Prepare payload
      const payload = {
        ...form,
        imageUrl: finalImageUrl,
        subcategories: form.subcategories.split(",").map(s => s.trim()).filter(Boolean)
      };

      if (editCategory) {
        await axios.put(`/api/categories/${editCategory.id}`, payload);
        toast.success("Category updated!");
      } else {
        await axios.post("/api/categories", payload);
        toast.success("Category created!");
      }
      onSave?.();
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-100 rounded-2xl border border-base-content/10 shadow-sm overflow-hidden min-h-[600px] flex flex-col md:flex-row">
      {/* Left Column: Form Info */}
      <div className="flex-1 p-6 md:p-8 space-y-8 border-b md:border-b-0 md:border-r border-base-content/10">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg uppercase tracking-widest flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
               {editCategory ? <Save className="w-5 h-5 text-[var(--primary)]" /> : <FolderPlus className="w-5 h-5 text-[var(--primary)]" />}
            </div>
            {editCategory ? "Edit Category" : "Add New Category"}
          </h3>
          {onCancel && (
            <button onClick={onCancel} className="btn btn-ghost btn-sm btn-circle opacity-50 hover:opacity-100">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="form-control w-full group">
            <label className="label py-1 mb-1">
              <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50 group-focus-within:text-base-content transition-colors">
                Category Name <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. Premium Hoodies"
              className={`w-full px-5 py-4 rounded-xl bg-base-200 border text-base-content outline-none text-sm font-semibold transition-all duration-300 ${
                errors.name ? "border-error focus:ring-error/10" : "border-base-content/10 focus:border-[var(--primary)] focus:bg-base-100 focus:ring-4"
              }`}
              style={{ '--tw-ring-color': 'color-mix(in srgb, var(--primary) 15%, transparent)' }}
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
            />
            {errors.name && <p className="text-error text-[10px] font-bold mt-1.5 px-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="form-control w-full group">
            <label className="label py-1 mb-1">
              <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50 group-focus-within:text-base-content transition-colors">
                Description
              </span>
            </label>
            <textarea
              placeholder="Tell buyers what this category is about..."
              rows={3}
              className="w-full px-5 py-4 rounded-xl bg-base-200 border border-base-content/10 text-base-content outline-none text-sm font-medium transition-all duration-300 focus:border-[var(--primary)] focus:bg-base-100 focus:ring-4"
              style={{ '--tw-ring-color': 'color-mix(in srgb, var(--primary) 15%, transparent)' }}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
            />
          </div>

          {/* Subcategories */}
          <div className="form-control w-full group">
            <label className="label py-1 mb-1">
              <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50 group-focus-within:text-base-content transition-colors">
                Subcategories (Comma Separated)
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. Oversized, Zip-ups, Pullovers"
              className="w-full px-5 py-4 rounded-xl bg-base-200 border border-base-content/10 text-base-content outline-none text-sm font-semibold transition-all duration-300 focus:border-[var(--primary)] focus:bg-base-100 focus:ring-4"
              style={{ '--tw-ring-color': 'color-mix(in srgb, var(--primary) 15%, transparent)' }}
              value={form.subcategories}
              onChange={(e) => setField("subcategories", e.target.value)}
            />
          </div>

          {/* Status */}
          <div className="form-control w-full group">
              <label className="label py-1 mb-1">
                  <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50">Status</span>
              </label>
              <div className="flex items-center gap-4 bg-base-200 p-1 rounded-xl border border-base-content/10">
                  <button 
                      type="button"
                      onClick={() => setField("status", "Active")}
                      className={`flex-1 py-3 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${form.status === "Active" ? "bg-white text-[var(--primary)] shadow-sm border border-base-content/5" : "text-base-content/40 hover:text-base-content/60"}`}
                  >
                      Active
                  </button>
                  <button 
                      type="button"
                      onClick={() => setField("status", "Inactive")}
                      className={`flex-1 py-3 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${form.status === "Inactive" ? "bg-white text-error shadow-sm border border-base-content/5" : "text-base-content/40 hover:text-base-content/60"}`}
                  >
                      Inactive
                  </button>
              </div>
          </div>
        </form>
      </div>

      {/* Right Column: Media */}
      <div className="w-full md:w-[320px] lg:w-[400px] p-6 md:p-8 bg-base-200/30 flex flex-col gap-6">
        <label className="label py-1 mb-1">
            <span className="label-text text-[10px] uppercase font-black tracking-widest text-base-content/50">Category Thumbnail</span>
        </label>
        
        <div 
          onClick={() => fileInputRef.current.click()}
          className={`aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-500 overflow-hidden group relative ${
            imagePreview ? "border-solid border-[var(--primary)] shadow-xl shadow-[var(--primary)]/5 bg-base-100" : "border-base-content/10 hover:border-[var(--primary)]/50 hover:bg-base-100"
          }`}
        >
          {imagePreview ? (
            <>
              <img src={imagePreview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Preview" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-[var(--primary)] shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <UploadCloud className="w-6 h-6" />
                 </div>
              </div>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setImagePreview(null);
                  setField("imageUrl", "");
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-error text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center text-base-content/20 group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                <ImageIcon className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-black uppercase tracking-widest text-base-content/80">Upload Image</p>
                <p className="text-[9px] font-medium text-base-content/40 mt-1 uppercase">Click to browse</p>
              </div>
            </>
          )}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
        </div>

        <div className="mt-auto pt-6 border-t border-base-content/10">
           <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full btn bg-[var(--primary)] text-white border-none hover:brightness-110 h-14 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] gap-3 shadow-xl shadow-[var(--primary)]/30 disabled:opacity-50"
            >
                {loading ? <span className="loading loading-spinner"></span> : (editCategory ? <Save className="w-5 h-5" /> : <FolderPlus className="w-5 h-5" />)}
                {editCategory ? "Update Category" : "Publish Category"}
            </button>
        </div>
      </div>
    </div>
  );
}

