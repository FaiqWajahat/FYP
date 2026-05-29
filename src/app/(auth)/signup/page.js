'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Box, Cpu, Factory } from 'lucide-react';
import SignupForm from '@/Components/auth/SignupForm';
import { useConfigStore } from '@/store/useConfigStore';

function FeatureShowcase() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 2;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-5 w-full">
      {/* AI Spec Parser Card */}
      <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.02)] hover:border-blue-200 transition-all duration-300 relative overflow-hidden group">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-sm">
            <Cpu size={16} className="text-blue-600" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900">AI Tech Pack Parser</h4>
            <p className="text-[10px] font-bold text-slate-400">Automatic Spec Sheet Extraction</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-600">sketch_v2_techpack.png</span>
            <span className="font-bold text-blue-600 text-[10px] bg-blue-50 px-2 py-0.5 rounded">PNG · 4.2 MB</span>
          </div>

          <div className="w-full bg-slate-200/50 rounded-full h-1.5 overflow-hidden">
            <motion.div 
              className="bg-blue-600 h-full rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
            <span>{progress < 100 ? "Analyzing stitch dimensions..." : "Analysis Complete!"}</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      {/* Sourcing Matcher Card */}
      <div className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.02)] hover:border-blue-200 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-sm">
              <Factory size={16} className="text-indigo-600" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900">Smart Factory Matcher</h4>
              <p className="text-[10px] font-bold text-slate-400">Ethical Partner Selection</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            2 Matches
          </span>
        </div>

        <div className="space-y-3">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="flex items-center justify-between p-3 bg-slate-50/60 border border-slate-100 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-slate-200/50 flex items-center justify-center text-[10px] font-bold text-slate-600">VN</div>
              <div>
                <p className="text-xs font-black text-slate-800">Vina Garment Corp</p>
                <p className="text-[9px] text-slate-400 font-bold">Ho Chi Minh City · GOTS Certified</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-blue-600">98% Match</p>
              <p className="text-[9px] text-slate-400 font-bold">4.9 ★</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="flex items-center justify-between p-3 bg-slate-50/60 border border-slate-100 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-slate-200/50 flex items-center justify-center text-[10px] font-bold text-slate-600">PT</div>
              <div>
                <p className="text-xs font-black text-slate-800">Porto Fine Knits</p>
                <p className="text-[9px] text-slate-400 font-bold">Portugal · OEKO-TEX Standard</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-indigo-500">94% Match</p>
              <p className="text-[9px] text-slate-400 font-bold">4.8 ★</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const { projectName } = useConfigStore();

  return (
    <div className="flex w-full min-h-screen bg-white">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col pt-8 pb-8 px-6 sm:px-12 bg-white relative z-10 overflow-y-auto">
        
        {/* Simple Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-wider">
            <ArrowLeft size={14} /> Back to site
          </Link>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Box size={12} className="text-white" />
            </div>
            <div className="text-sm font-black tracking-tight text-slate-900 uppercase">{projectName}</div>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center my-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full"
          >
            <SignupForm />
          </motion.div>
        </div>

        {/* Simple Footer */}
        <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          © {new Date().getFullYear()} {projectName}. Digital Ecosystem.
        </div>
      </div>

      {/* Right Column - Brand Graphics */}
      <div className="hidden lg:flex w-1/2 bg-slate-50 relative overflow-hidden items-center justify-center p-12 border-l border-slate-100">
        {/* Shifting radial gradient lights */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
        
        {/* Glowing floating blobs */}
        <motion.div 
          animate={{ 
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" 
        />
        <motion.div 
          animate={{ 
            x: [0, -30, 30, 0],
            y: [0, 40, -30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" 
        />
        
        <motion.div 
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.1 }}
           className="relative z-10 w-full max-w-lg text-slate-900"
        >
          {/* Header */}
          <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-8 shadow-[0_4px_10px_rgba(0,0,0,0.02)]">
             <Box size={22} className="text-blue-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-[1.1] tracking-tight mb-5">
            Start Scaling Your <br />
            <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Manufacturing Today.</span>
          </h1>
          <p className="text-base text-slate-500 font-semibold leading-relaxed mb-8">
            Create an account to digitize your tech packs, access ethical factories, and completely automate your quality control workflow.
          </p>
          
          {/* Animated Features Showcase */}
          <FeatureShowcase />
        </motion.div>
      </div>
    </div>
  );
}
