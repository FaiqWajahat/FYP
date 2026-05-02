'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Upload, X, FileText, Ruler } from 'lucide-react';
import { useInquiryStore } from '@/store/useInquiryStore';

export default function Step5_SizingMeasurements() {
  const {
    sizes, updateSize,
    sizeChartFile, setSizeChartFile,
    customMeasurements, setCustomMeasurements,
    measurements, updateMeasurement,
    gradingNotes, setGradingNotes,
  } = useInquiryStore();

  const totalQty = Object.values(sizes).reduce((a, b) => a + b, 0);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>

      <h3 className="text-lg font-bold text-slate-900 mb-1">Sizing & Measurements</h3>
      <p className="text-sm text-slate-500 mb-6">Set your size run quantities and provide custom measurements if needed.</p>

      {/* Size Run */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          <Ruler size={14} className="inline mr-1.5 text-blue-500" />
          Size Run (Quantity per Size) <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {Object.keys(sizes).map((sz) => (
            <div key={sz} className="text-center">
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">{sz}</label>
              <input
                type="number"
                min="0"
                value={sizes[sz]}
                onChange={(e) => updateSize(sz, e.target.value)}
                className="w-full px-2 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-center text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
              />
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/50 border border-slate-100 flex items-center justify-between">
          <span className="text-sm text-slate-600">Total Quantity</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-slate-800">
              {totalQty}
            </span>
            <span className="text-xs text-slate-400">pcs</span>
          </div>
        </div>
      </div>

      {/* Size Chart Upload */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Custom Size Chart</label>
        <p className="text-xs text-slate-400 mb-2">Upload your own size chart if you have specific measurements.</p>
        {sizeChartFile ? (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <FileText size={14} className="text-emerald-500 shrink-0" />
            <span className="text-sm text-emerald-700 truncate flex-1">{sizeChartFile}</span>
            <button onClick={() => setSizeChartFile(null)} className="text-slate-400 hover:text-red-500 transition-colors">
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-slate-200 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all group">
            <Upload size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
            <div>
              <p className="text-sm text-slate-600 group-hover:text-blue-600 font-medium transition-colors">Upload size chart</p>
              <p className="text-xs text-slate-400">CSV, Excel, PDF, or Image</p>
            </div>
            <input type="file" accept=".csv,.xlsx,.xls,.pdf,image/*" className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => setSizeChartFile(file.name, ev.target.result);
                reader.readAsDataURL(file);
              }} />
          </label>
        )}
      </div>

      {/* Custom Measurements Toggle */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-700">Custom Body Measurements</label>
          <button
            onClick={() => setCustomMeasurements(!customMeasurements)}
            className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${
              customMeasurements ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {customMeasurements ? 'Enabled' : 'Enable'}
          </button>
        </div>

        {customMeasurements && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
            {Object.entries(measurements).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 w-24 capitalize shrink-0">{key}</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={value}
                  onChange={(e) => updateMeasurement(key, e.target.value)}
                  placeholder="0"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:border-blue-400 transition-all"
                />
                <span className="text-xs text-slate-400 w-12 shrink-0">inches</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Grading Notes */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Grading & Size Notes</label>
        <textarea
          rows={2}
          value={gradingNotes}
          onChange={(e) => setGradingNotes(e.target.value)}
          placeholder="E.g., Grade 1.5 inch between sizes, European fit, length +2 inch from standard..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:border-blue-400 transition-all placeholder:text-slate-300 resize-none"
        />
      </div>
    </motion.div>
  );
}
