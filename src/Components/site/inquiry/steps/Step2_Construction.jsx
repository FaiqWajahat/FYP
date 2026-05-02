'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../inquiry-data';
import { useInquiryStore } from '@/store/useInquiryStore';

export default function Step2_Construction() {
  const { categoryId, construction, setConstruction, uploadedDesignImage } = useInquiryStore();
  const category = PRODUCT_CATEGORIES.find((c) => c.id === categoryId);

  if (!category) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">No Product Selected</h3>
        <p className="text-sm text-slate-500">Please go back and select a product category first.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>

      {/* Header with product preview */}
      <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/50 border border-slate-100">
        <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
          <img src={uploadedDesignImage || category.image} alt={category.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{category.name} — Construction Details</h3>
          <p className="text-sm text-slate-500">Specify every construction detail for your {category.name.toLowerCase()}.</p>
        </div>
      </div>

      {/* Construction Options */}
      <div className="space-y-5">
        {category.construction.map((spec, index) => {
          const selected = construction[spec.id] || '';
          return (
            <motion.div
              key={spec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-blue-100 text-blue-600 text-[10px] font-bold mr-2">
                  {index + 1}
                </span>
                {spec.label}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {spec.options.map((opt) => {
                  const isSelected = selected === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setConstruction(spec.id, opt)}
                      className={`relative px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all border ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                          : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                      {isSelected && (
                        <Check size={13} className="absolute top-2 right-2 text-blue-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
