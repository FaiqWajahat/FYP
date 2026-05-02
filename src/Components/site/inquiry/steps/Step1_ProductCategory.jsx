'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Check, X, Image as ImageIcon } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../inquiry-data';
import { useInquiryStore } from '@/store/useInquiryStore';

export default function Step1_ProductCategory() {
  const {
    categoryId, setCategoryId,
    uploadedDesignImage, uploadedDesignName, setUploadedDesign, clearUploadedDesign,
  } = useInquiryStore();
  const fileRef = useRef(null);

  const handleDesignUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedDesign(ev.target.result, file.name);
    reader.readAsDataURL(file);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>

      {/* Design Upload */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Upload Your Design</h3>
        <p className="text-sm text-slate-500 mb-4">Have a tech pack, sketch, or reference? Upload it to attach with your inquiry.</p>

        {uploadedDesignImage ? (
          <div className="relative rounded-2xl border-2 border-blue-200 bg-blue-50/50 p-4 flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-white flex items-center justify-center shrink-0">
              <img src={uploadedDesignImage} alt="Your design" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Check size={14} className="text-emerald-500" />
                <span className="text-sm font-semibold text-slate-900">Design Uploaded</span>
              </div>
              <p className="text-xs text-slate-500 truncate">{uploadedDesignName}</p>
              <p className="text-[11px] text-slate-400 mt-1">Visible in the product preview panel ←</p>
            </div>
            <button onClick={clearUploadedDesign}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition-all">
              <X size={13} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-slate-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group">
            <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mb-2 transition-colors">
              <Upload size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">Drop your design file or click to upload</span>
            <span className="text-xs text-slate-400 mt-1">PNG, JPG, PDF, AI, SVG — Max 25MB</span>
            <input ref={fileRef} type="file" accept="image/*,.pdf,.ai,.svg" className="hidden" onChange={handleDesignUpload} />
          </label>
        )}
      </div>

      {/* Category Selection */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Select Product Category <span className="text-red-500">*</span></h3>
        <p className="text-sm text-slate-500 mb-5">Choose the garment type. Your selection will update the product image and open its construction panel.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRODUCT_CATEGORIES.map((cat) => {
            const isSelected = categoryId === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCategoryId(cat.id)}
                className={`relative group flex items-center gap-4 p-3 rounded-2xl text-left transition-all duration-200 border-2 ${isSelected
                    ? 'border-blue-500 bg-blue-50/60 shadow-md shadow-blue-100'
                    : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                  }`}
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>{cat.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{cat.construction.length} specs</span>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{cat.colorZones.length} zones</span>
                  </div>
                </div>

                {/* Check */}
                {isSelected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                    <Check size={14} className="text-white" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
