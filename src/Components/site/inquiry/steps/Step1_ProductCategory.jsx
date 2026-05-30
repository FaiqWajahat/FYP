'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Check, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../inquiry-data';
import { useInquiryStore } from '@/store/useInquiryStore';

export default function Step1_ProductCategory() {
  const {
    categoryId, setCategoryId,
    uploadedDesignImage, uploadedDesignName, setUploadedDesign, clearUploadedDesign,
  } = useInquiryStore();
  const fileRef = useRef(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState("");
  const [analysisError, setAnalysisError] = useState("");

  const handleDesignUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedDesign(ev.target.result, file.name);
      setAnalysisResult("");
      setAnalysisError("");
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeDesign = async () => {
    if (!uploadedDesignImage) return;
    setIsAnalyzing(true);
    setAnalysisError("");
    setAnalysisResult("");
    try {
      const res = await fetch("/api/ai/analyze-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: uploadedDesignImage })
      });
      const data = await res.json();
      if (data.success) {
        setAnalysisResult(data.text);
      } else {
        setAnalysisError(data.error || "Failed to analyze design");
      }
    } catch (err) {
      console.error(err);
      setAnalysisError("An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>

      {/* Design Upload */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Upload Your Design</h3>
        <p className="text-sm text-slate-500 mb-4">Have a tech pack, sketch, or reference? Upload it to attach with your inquiry.</p>

        {uploadedDesignImage ? (
          <div>
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
              <button onClick={() => {
                clearUploadedDesign();
                setAnalysisResult("");
                setAnalysisError("");
              }}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition-all">
                <X size={13} />
              </button>
            </div>

            {/* Analysis Action Button */}
            {!analysisResult && !isAnalyzing && !analysisError && (
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleAnalyzeDesign}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-blue-100 hover:shadow-lg transition-all active:scale-95 duration-150"
                >
                  <Sparkles size={13} />
                  Analyze Design with AI
                </button>
              </div>
            )}

            {/* Scanning State */}
            {isAnalyzing && (
              <div className="mt-4 p-5 rounded-2xl border border-blue-100 bg-blue-50/20 flex flex-col items-center justify-center gap-3 text-center">
                <div className="flex items-center gap-2 text-blue-600">
                  <span className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></span>
                  <span className="text-xs font-black uppercase tracking-wider">AI Pre-Production Assessment...</span>
                </div>
                <p className="text-[11px] text-slate-500 max-w-sm leading-normal">
                  Gemini is evaluating design line work, estimated print complexity, contrast limits, and fabric compatibility.
                </p>
              </div>
            )}

            {/* Error State */}
            {analysisError && (
              <div className="mt-4 p-4 rounded-xl border border-red-100 bg-red-50 text-red-700 text-xs font-bold flex items-center justify-between">
                <span>⚠️ {analysisError}</span>
                <button 
                  type="button" 
                  onClick={handleAnalyzeDesign} 
                  className="underline text-blue-600 hover:text-blue-800 uppercase text-[10px] font-black tracking-wider"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Analysis Report */}
            {analysisResult && (
              <div className="mt-4 p-5 rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-4 animate-in fade-in slide-in-from-top-3 duration-300">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-800">AI Pre-Production Report</span>
                  </div>
                  <button 
                    type="button"
                    onClick={handleAnalyzeDesign}
                    className="text-[10px] text-blue-600 font-black uppercase tracking-wider hover:text-blue-800 transition-colors"
                  >
                    Re-Analyze
                  </button>
                </div>
                
                <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                  {analysisResult.split("\n").map((line, idx) => {
                    const cleanLine = line.trim();
                    if (!cleanLine) return null;
                    
                    if (cleanLine.startsWith("###") || cleanLine.startsWith("##")) {
                      return <h4 key={idx} className="font-bold text-slate-900 mt-4 first:mt-0 text-[13px]">{cleanLine.replace(/^#+\s*/, "")}</h4>;
                    }
                    if (cleanLine.startsWith("1.") || cleanLine.startsWith("2.") || cleanLine.startsWith("3.") || cleanLine.startsWith("4.")) {
                      return <h4 key={idx} className="font-bold text-slate-900 mt-4 first:mt-0 text-[13px]">{cleanLine}</h4>;
                    }
                    if (cleanLine.startsWith("**") && cleanLine.endsWith("**")) {
                      return <p key={idx} className="font-bold text-slate-800 mt-2">{cleanLine.replace(/\*\*/g, "")}</p>;
                    }
                    
                    const parts = cleanLine.split("**");
                    if (parts.length > 1) {
                      return (
                        <p key={idx} className="text-slate-600">
                          {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-slate-900 font-bold">{p}</strong> : p)}
                        </p>
                      );
                    }
                    return <p key={idx}>{cleanLine}</p>;
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <label htmlFor="design-file-input" className="flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-slate-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group">
            <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mb-2 transition-colors">
              <Upload size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">Drop your design file or click to upload</span>
            <span className="text-xs text-slate-400 mt-1">PNG, JPG, PDF, AI, SVG — Max 25MB</span>
            <input id="design-file-input" ref={fileRef} type="file" accept="image/*,.pdf,.ai,.svg" className="hidden" onChange={handleDesignUpload} />
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
