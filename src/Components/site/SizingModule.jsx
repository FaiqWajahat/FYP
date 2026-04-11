'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, Minus, Plus, UploadCloud, FileText, CheckCircle2, Trash2, Table, X } from 'lucide-react';

export default function SizingModule({
  sizingMode, setSizingMode,
  standardSizes, standardQuantities, handleStandardQtyChange,
  customRows, handleAddCustomRow, handleUpdateCustomRow, handleDeleteCustomRow,
  sizeChartFile, handleSizeChartUpload, removeSizeChart, sizeChartInputRef, sizeChartData
}) {
  const [showSizeChartModal, setShowSizeChartModal] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
        <div className="flex gap-4">
           <button onClick={() => setSizingMode('standard')} className={`text-sm font-bold pb-2 border-b-2 transition-all ${sizingMode === 'standard' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'}`}>Standard Sizing</button>
           <button onClick={() => setSizingMode('custom')} className={`text-sm font-bold pb-2 border-b-2 transition-all ${sizingMode === 'custom' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}>Custom Chart</button>
        </div>
        {sizingMode === 'standard' && (
          <button onClick={() => setShowSizeChartModal(true)} className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-blue-600">
            <Ruler size={14} /> View Chart
          </button>
        )}
      </div>

      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 transition-all">
        {sizingMode === 'standard' ? (
          <div className="animate-in fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
               {standardSizes.map((size) => {
                 const qty = standardQuantities[size] || 0;
                 return (
                   <div key={size} className={`bg-white p-2 rounded-lg border transition-all ${qty > 0 ? 'border-slate-400 shadow-sm ring-1 ring-slate-200' : 'border-slate-200'}`}>
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-xs font-bold text-slate-900">{size}</span>
                         {qty > 0 && <span className="text-[10px] font-bold text-blue-600">{qty} pcs</span>}
                      </div>
                      <div className="flex items-center justify-between bg-slate-100 rounded-md">
                         <button onClick={() => handleStandardQtyChange(size, -10)} className="p-1.5 hover:text-red-500 transition-colors"><Minus size={14}/></button>
                         <span className="text-xs font-bold text-slate-700 w-8 text-center">{qty || '-'}</span>
                         <button onClick={() => handleStandardQtyChange(size, 10)} className="p-1.5 hover:text-blue-600 transition-colors"><Plus size={14}/></button>
                      </div>
                   </div>
                 )
               })}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in">
            <div className="mb-6">
                <p className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">1. Upload Your Tech Pack / Size Chart</p>
                {!sizeChartFile ? (
                   <div onClick={() => sizeChartInputRef.current.click()} className="border-2 border-dashed border-slate-300 bg-white rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer group">
                      <input type="file" ref={sizeChartInputRef} onChange={handleSizeChartUpload} accept=".pdf,.csv,.xlsx,.xls,image/*" className="hidden" />
                      <div className="inline-flex p-3 bg-slate-100 text-slate-500 rounded-full mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors"><FileText size={24} /></div>
                      <p className="text-sm font-bold text-slate-900">Click to Upload Measurement File</p>
                      <p className="text-xs text-slate-500 mt-1">Accepts PDF, Excel, CSV, or Image files</p>
                   </div>
                 ) : (
                   <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                      <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle2 size={24} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{sizeChartFile.name}</p>
                        <p className="text-xs text-green-600 font-medium">Chart successfully attached. Will upload on review.</p>
                      </div>
                      <button onClick={removeSizeChart} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors underline">Remove</button>
                   </div>
                 )}
            </div>

            <div className="pt-4 border-t border-slate-200">
                <p className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">2. Specify Quantities</p>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase px-2 mb-2">
                    <span>Size Name (Must match chart)</span><span>Quantity</span>
                </div>
                <div className="space-y-2">
                  {customRows.map((row) => (
                    <div key={row.id} className="flex gap-2 items-center">
                        <input type="text" value={row.name} onChange={(e) => handleUpdateCustomRow(row.id, 'name', e.target.value)} placeholder="e.g. XL-Tall" className="flex-1 text-sm border border-slate-200 rounded-lg p-2.5 font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                          <button onClick={() => handleUpdateCustomRow(row.id, 'qty', Math.max(0, row.qty - 10))} className="p-2.5 hover:bg-slate-50"><Minus size={14}/></button>
                          <span className="w-12 text-center text-sm font-bold">{row.qty}</span>
                          <button onClick={() => handleUpdateCustomRow(row.id, 'qty', row.qty + 10)} className="p-2.5 hover:bg-slate-50"><Plus size={14}/></button>
                        </div>
                        <button onClick={() => handleDeleteCustomRow(row.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>
                <button onClick={handleAddCustomRow} className="text-sm font-bold text-blue-600 flex items-center gap-1 mt-4 hover:underline">
                  <Plus size={16}/> Add Another Size Row
                </button>
            </div>
          </div>
        )}
      </div>

      {/* SIZING MODAL */}
      <AnimatePresence>
        {showSizeChartModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSizeChartModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
             <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden z-10">
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
                   <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2"><Table size={18} /> Factory Size Chart (Inches)</h3>
                   <button onClick={() => setShowSizeChartModal(false)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"><X size={20}/></button>
                </div>
                <div className="p-6">
                   <table className="w-full text-sm text-left">
                     <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                       <tr><th className="px-4 py-3 rounded-l-lg">Size</th><th className="px-4 py-3">Chest</th><th className="px-4 py-3">Length</th><th className="px-4 py-3 rounded-r-lg">Sleeve</th></tr>
                     </thead>
                     <tbody>
                       {sizeChartData.map((row, i) => (
                         <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                           <td className="px-4 py-3 font-bold text-slate-900">{row.size}</td><td className="px-4 py-3 text-slate-600">{row.chest}"</td><td className="px-4 py-3 text-slate-600">{row.length}"</td><td className="px-4 py-3 text-slate-600">{row.sleeve}"</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}