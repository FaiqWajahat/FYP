"use client";
import React, { useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon, X, AlertCircle } from "lucide-react";

export default function MediaUploadSection({ form, setField, errors }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Drag & Drop Handlers
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files) => {
    const validImages = files.filter(f => f.type.startsWith('image/'));
    const imageUrls = validImages.map((file) => URL.createObjectURL(file));
    setField("images", [...(form.images || []), ...imageUrls]);
  };

  const removeImage = (idx) => {
    const newImages = form.images.filter((_, i) => i !== idx);
    setField("images", newImages);
  };

  return (
    <section className="bg-base-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl rounded-xl border border-base-content/10 transition-all duration-300">
      <div className="px-6 py-4 border-b border-base-content/10 flex items-center justify-between sm:rounded-t-2xl rounded-t-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 4%, transparent)' }}>
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <h2 className="font-bold text-sm uppercase tracking-[0.1em] text-base-content">Product Media <span className="text-error">*</span></h2>
        </div>
        <div className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-base-200 text-base-content/60">Step 4</div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        
        {/* Dropzone */}
        <div
          className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-12 px-6 transition-all duration-300 group cursor-pointer ${
            isDragging 
              ? "bg-base-100 border-[var(--primary)] scale-[1.01] shadow-lg shadow-[var(--primary)]/10" 
              : "bg-base-200 border-base-content/10 hover:border-base-content/30 hover:bg-base-100"
          }`}
          style={isDragging ? {} : {}}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${isDragging ? "bg-[var(--primary)] text-white scale-110 shadow-lg" : "bg-base-100 shadow-sm text-base-content/40 group-hover:scale-110 group-hover:text-[var(--primary)] group-hover:shadow-md"}`}>
             <UploadCloud className="w-8 h-8" />
          </div>
          
          <h3 className="text-sm font-black text-base-content mb-1">
            {isDragging ? "Drop images here..." : "Click or drag images to upload"}
          </h3>
          <p className="text-[11px] text-base-content/40 font-medium uppercase tracking-widest text-center max-w-xs">
            SVG, PNG, JPG or GIF (max. 800x400px, 5MB per file)
          </p>
        </div>
        {errors.images && <p className="text-error text-xs font-bold mt-2 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> {errors.images}</p>}

        {/* Index Mapping Info Banner */}
        <div className="border rounded-xl p-4 flex gap-4 items-start bg-blue-50/50 border-blue-100">
          <div className="p-2 rounded-lg shrink-0 bg-blue-100/50 border border-blue-200/50 shadow-sm text-blue-600">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-widest">Image-to-Color Synchronization</h4>
            <p className="text-[11px] text-blue-800/70 font-medium leading-relaxed">
               To automatically link images to colors on the storefront, please upload your images in the exact same order as you added your colors in Step 3. (e.g., 1st color matches 1st image).
            </p>
          </div>
        </div>

        {/* Gallery */}
        {form.images?.length > 0 && (
          <div className="pt-6 border-t border-base-content/10">
            <h3 className="font-bold text-[11px] uppercase tracking-widest text-base-content/50 mb-4">Gallery Preview ({form.images.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {form.images.map((src, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-base-content/10 group bg-white">
                  <img src={src} alt="Upload Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(idx);
                        }}
                        className="bg-white/90 hover:bg-error hover:text-white p-2 rounded-full text-error transition-all scale-75 group-hover:scale-100 shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                  </div>
                  
                  {/* Primary Badge */}
                  {idx === 0 && (
                     <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-black uppercase text-white shadow-sm leading-tight" style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 90%, black)' }}>
                        Main
                     </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
