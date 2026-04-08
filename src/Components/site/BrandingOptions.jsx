'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Scissors, UploadCloud, Trash2 } from 'lucide-react';

export default function BrandingOptions({
  isCustomizing, setIsCustomizing, brandingFormats,
  selectedFormat, setSelectedFormat,
  uploadedLogos = [], handleLogoUpload, removeLogo, logoInputRef
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-slate-900 text-sm flex items-center gap-2"><Layers size={16}/> Customization</span>
      </div>
      <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
        <button onClick={() => setIsCustomizing(false)} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${!isCustomizing ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-500'}`}>Standard (No Design)</button>
        <button onClick={() => setIsCustomizing(true)} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${isCustomizing ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'}`}>
          <Scissors size={14} /> Add Custom Design
        </button>
      </div>
      
      <AnimatePresence>
        {isCustomizing && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-4">
               <div>
                 <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-bold text-slate-700 uppercase">1. Application Method</p>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">+${selectedFormat.price} Per Design</span>
                 </div>
                 <div className="grid grid-cols-2 gap-2 mb-3">
                    {brandingFormats.map((format) => (
                       <button key={format.id} onClick={() => setSelectedFormat(format)} className={`text-left p-2 rounded border text-xs transition-all ${selectedFormat.id === format.id ? 'border-blue-600 bg-white text-blue-700 font-bold shadow-sm' : 'border-slate-200 bg-white/50 text-slate-600'}`}>{format.name}</button>
                    ))}
                 </div>
                 <p className="text-[10px] text-slate-400 italic">Notice: Each uploaded design is charged separately at the rate shown above.</p>
               </div>
               
               <div className="space-y-3">
                 <p className="text-xs font-bold text-slate-700 uppercase">2. Upload Design File(s)</p>
                 
                 {/* Uploaded Designs List */}
                 {uploadedLogos.length > 0 && (
                   <div className="space-y-2">
                      {uploadedLogos.map((logo, index) => (
                        <div key={logo.id} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-blue-200 animate-in fade-in slide-in-from-left-2 transition-all">
                           <div className="w-10 h-10 bg-slate-100 rounded overflow-hidden flex-shrink-0 border border-slate-100">
                              <img src={logo.src} alt="Uploaded" className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-bold text-slate-900 truncate">Design #{index + 1}</p>
                              <p className="text-[9px] text-green-600 font-bold uppercase tracking-tight">Active on Preview</p>
                           </div>
                           <button onClick={() => removeLogo(logo.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                              <Trash2 size={14} />
                           </button>
                        </div>
                      ))}
                   </div>
                 )}

                 {/* Upload Button */}
                 <div onClick={() => logoInputRef.current.click()} className="border-2 border-dashed border-blue-200 bg-white rounded-lg p-5 text-center hover:bg-blue-50 transition-colors cursor-pointer group">
                    <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                    <div className="inline-flex p-2 bg-blue-50 text-blue-600 rounded-full mb-1 group-hover:scale-110 transition-transform"><UploadCloud size={18} /></div>
                    <p className="text-xs font-bold text-slate-900">{uploadedLogos.length > 0 ? "Add Another Design" : "Upload Design / Logo"}</p>
                    <p className="text-[10px] text-slate-400">PNG, JPG, SVG supported · Charged per design</p>
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}