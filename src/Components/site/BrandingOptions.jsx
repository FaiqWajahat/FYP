'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Scissors, UploadCloud, Trash2 } from 'lucide-react';

export default function BrandingOptions({
  isCustomizing, setIsCustomizing, brandingFormats,
  selectedFormat, setSelectedFormat,
  uploadedLogo, handleLogoUpload, removeLogo, logoInputRef
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-slate-900 text-sm flex items-center gap-2"><Layers size={16}/> Branding Options</span>
      </div>
      <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
        <button onClick={() => setIsCustomizing(false)} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${!isCustomizing ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-500'}`}>Blank (No Logo)</button>
        <button onClick={() => setIsCustomizing(true)} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${isCustomizing ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'}`}>
          <Scissors size={14} /> Add Branding
        </button>
      </div>
      
      <AnimatePresence>
        {isCustomizing && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-4">
               <div>
                 <p className="text-xs font-bold text-slate-700 mb-2 uppercase">1. Select Format (+${selectedFormat.price})</p>
                 <div className="grid grid-cols-2 gap-2 mb-3">
                    {brandingFormats.map((format) => (
                       <button key={format.id} onClick={() => setSelectedFormat(format)} className={`text-left p-2 rounded border text-xs transition-all ${selectedFormat.id === format.id ? 'border-blue-600 bg-white text-blue-700 font-bold shadow-sm' : 'border-slate-200 bg-white/50 text-slate-600'}`}>{format.name}</button>
                    ))}
                 </div>
               </div>
               <div>
                 <p className="text-xs font-bold text-slate-700 mb-2 uppercase">2. Upload Logo File</p>
                 {!uploadedLogo ? (
                   <div onClick={() => logoInputRef.current.click()} className="border-2 border-dashed border-blue-200 bg-white rounded-lg p-6 text-center hover:bg-blue-50 transition-colors cursor-pointer group">
                      <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                      <div className="inline-flex p-2 bg-blue-50 text-blue-600 rounded-full mb-2 group-hover:scale-110 transition-transform"><UploadCloud size={20} /></div>
                      <p className="text-xs font-bold text-slate-900">Click to Upload Logo</p>
                      <p className="text-[10px] text-slate-400">Position it on the visualizer</p>
                   </div>
                 ) : (
                   <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-blue-200">
                      <div className="w-10 h-10 bg-slate-100 rounded overflow-hidden flex-shrink-0"><img src={uploadedLogo} alt="Uploaded" className="w-full h-full object-cover" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">Logo Uploaded</p>
                        <p className="text-[10px] text-green-600 font-medium">Ready for Production</p>
                      </div>
                      <button onClick={removeLogo} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={16} /></button>
                   </div>
                 )}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}