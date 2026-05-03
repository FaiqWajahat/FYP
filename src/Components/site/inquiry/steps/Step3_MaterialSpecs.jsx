'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Info, AlertCircle } from 'lucide-react';
import { FABRIC_OPTIONS, PRODUCT_CATEGORIES } from '../inquiry-data';
import { useInquiryStore } from '@/store/useInquiryStore';

export default function Step3_MaterialSpecs() {
  const { categoryId, fabricId, setFabricId, gsm, setGsm, customFabricNotes, setCustomFabricNotes } = useInquiryStore();
  const category = PRODUCT_CATEGORIES.find((c) => c.id === categoryId);
  const selectedFabric = FABRIC_OPTIONS.find((f) => f.id === fabricId);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>

      <h3 className="text-lg font-bold text-slate-900 mb-1">Fabric & Material <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-[10px] font-bold text-red-600 uppercase tracking-wide">Required</span></h3>
      <p className="text-sm text-slate-500 mb-6">Select the fabric type, weight, and finish for your {category?.name || 'garment'}.</p>

      {/* Fabric Type */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Fabric Type <span className="inline-flex items-center ml-1 px-1.5 py-0.5 rounded-md bg-red-50 text-[9px] font-bold text-red-500 uppercase">Required</span></label>
        {!fabricId && (
          <div className="mb-3 p-3 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-2">
            <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">Please select a fabric type to proceed. This is a required field for your inquiry.</p>
          </div>
        )}
        <div className="space-y-2">
          {FABRIC_OPTIONS.map((fab) => {
            const isSelected = fabricId === fab.id;
            return (
              <button
                key={fab.id}
                onClick={() => {
                  setFabricId(fab.id);
                  if (fab.gsm.length > 0) setGsm(fab.gsm[Math.floor(fab.gsm.length / 2)]);
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <p className={`text-sm font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>{fab.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Finish: {fab.finish}</p>
                </div>
                <div className="flex items-center gap-2">
                  {fab.gsm.length > 0 && (
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                      {fab.gsm[0]}–{fab.gsm[fab.gsm.length - 1]} GSM
                    </span>
                  )}
                  {isSelected && <Check size={16} className="text-blue-500" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* GSM Selection */}
      {selectedFabric && selectedFabric.gsm.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Fabric Weight (GSM)
            <span className="ml-2 text-xs font-normal text-slate-400">Grams per Square Meter</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {selectedFabric.gsm.map((g) => {
              const isSelected = gsm === g;
              return (
                <button
                  key={g}
                  onClick={() => setGsm(g)}
                  className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                    isSelected
                      ? 'border-blue-500 bg-blue-600 text-white shadow-sm'
                      : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
          <div className="mt-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-2">
            <Info size={14} className="text-blue-400 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-600">
              {gsm <= 200 ? 'Lightweight — breathable, ideal for summer & activewear.' :
               gsm <= 300 ? 'Mid-weight — versatile, year-round comfort.' :
               gsm <= 400 ? 'Heavyweight — warm, premium feel, great for hoodies & jackets.' :
               'Ultra-heavy — maximum warmth & structure, luxury streetwear.'}
            </p>
          </div>
        </div>
      )}

      {/* Custom Fabric Notes */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Custom Fabric Notes <span className="text-xs font-normal text-slate-400">(Optional)</span></label>
        <p className="text-xs text-slate-400 mb-2">Specify any custom fabric requirements, blends, or certifications needed.</p>
        <textarea
          rows={3}
          value={customFabricNotes}
          onChange={(e) => setCustomFabricNotes(e.target.value)}
          placeholder="E.g., Need OEKO-TEX certified fabric, 50/50 cotton-poly blend, or specific supplier reference..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300 resize-none"
        />
      </div>
    </motion.div>
  );
}
