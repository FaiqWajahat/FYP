'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Upload, X, Tag, Package } from 'lucide-react';
import { LABEL_TYPES, LABEL_PLACEMENTS, PACKAGING_OPTIONS } from '../inquiry-data';
import { useInquiryStore } from '@/store/useInquiryStore';

export default function Step6_BrandingPackaging() {
  const {
    labelType, setLabelType,
    labelPlacement, setLabelPlacement,
    labelArtworkFile, setLabelArtworkFile,
    packaging, togglePackaging,
    hangTagFile, setHangTagFile,
  } = useInquiryStore();

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>

      {/* ── LABELS ── */}
      <h3 className="text-lg font-bold text-slate-900 mb-1">
        <Tag size={16} className="inline mr-1.5 text-blue-500" />
        Labels & Branding
      </h3>
      <p className="text-sm text-slate-500 mb-5">Customize your garment labels and brand identity elements.</p>

      {/* Label Type */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Label Type</label>
        <div className="space-y-2">
          {LABEL_TYPES.map((lt) => {
            const isSelected = labelType === lt.id;
            return (
              <button key={lt.id} onClick={() => setLabelType(lt.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left transition-all border ${
                  isSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'
                }`}>
                <div>
                  <p className={`text-sm font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>{lt.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{lt.desc}</p>
                </div>
                {isSelected && <Check size={16} className="text-blue-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Label Placement */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Label Placement</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {LABEL_PLACEMENTS.map((lp) => {
            const isSelected = labelPlacement === lp;
            return (
              <button key={lp} onClick={() => setLabelPlacement(lp)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'
                }`}>
                {lp}
                {isSelected && <Check size={12} className="inline ml-1.5 text-blue-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Label Artwork Upload */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Label Artwork</label>
        {labelArtworkFile ? (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <Check size={14} className="text-emerald-500 shrink-0" />
            <span className="text-sm text-emerald-700 truncate flex-1">{labelArtworkFile}</span>
            <button onClick={() => setLabelArtworkFile(null)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
          </div>
        ) : (
          <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-slate-200 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all group">
            <Upload size={16} className="text-slate-400 group-hover:text-blue-500 shrink-0" />
            <span className="text-sm text-slate-500">Upload label design (AI, SVG, PDF, PNG)</span>
            <input type="file" accept=".ai,.svg,.pdf,image/*" className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => setLabelArtworkFile(file.name, ev.target.result);
                reader.readAsDataURL(file);
              }} />
          </label>
        )}
      </div>

      {/* ── PACKAGING ── */}
      <div className="border-t border-slate-100 pt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          <Package size={16} className="inline mr-1.5 text-blue-500" />
          Packaging Options
        </h3>
        <p className="text-sm text-slate-500 mb-5">Select all packaging requirements. Multiple options can be combined.</p>

        <div className="space-y-2">
          {PACKAGING_OPTIONS.map((pkg) => {
            const isSelected = packaging.includes(pkg.id);
            return (
              <button key={pkg.id} onClick={() => togglePackaging(pkg.id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all border ${
                  isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-white hover:border-slate-200'
                }`}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                  isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-300'
                }`}>
                  {isSelected && <Check size={12} className="text-white" />}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>{pkg.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{pkg.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Hang Tag Upload */}
        {packaging.includes('hang-tag') && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
            <label className="block text-xs font-semibold text-slate-500 mb-2">Hang Tag Artwork</label>
            {hangTagFile ? (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <Check size={13} className="text-emerald-500" />
                <span className="text-xs text-emerald-700 truncate flex-1">{hangTagFile}</span>
                <button onClick={() => setHangTagFile(null)} className="text-slate-400 hover:text-red-500"><X size={12} /></button>
              </div>
            ) : (
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-dashed border-slate-200 cursor-pointer hover:border-blue-300 transition-all group">
                <Upload size={14} className="text-slate-400 group-hover:text-blue-500" />
                <span className="text-xs text-slate-500">Upload hang tag design</span>
                <input type="file" accept="image/*,.pdf,.ai,.svg" className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => setHangTagFile(file.name, ev.target.result);
                    reader.readAsDataURL(file);
                  }} />
              </label>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
