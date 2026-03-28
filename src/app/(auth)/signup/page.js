'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap } from 'lucide-react';
import SignupForm from '@/Components/auth/SignupForm';
import { useConfigStore } from '@/store/useConfigStore';

export default function SignupPage() {
  const { projectName } = useConfigStore();

  return (
    <div className="flex w-full min-h-screen">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col pt-8 pb-12 px-6 sm:px-12 bg-white relative z-10 overflow-y-auto">
        
        {/* Simple Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft size={16} /> Back to site
          </Link>
          <div className="text-xl font-black tracking-tighter text-slate-900">{projectName}</div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center mt-12 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full"
          >
            <SignupForm />
          </motion.div>
        </div>

        {/* Simple Footer */}
        <div className="text-center text-xs font-semibold text-slate-400">
          © {new Date().getFullYear()} {projectName}. All rights reserved.
        </div>
      </div>

      {/* Right Column - Brand Image/Graphic */}
      <div className="hidden lg:flex w-1/2 bg-slate-50 relative overflow-hidden items-center justify-center p-12 border-l border-slate-100">
        {/* Background Accents */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, delay: 0.2 }}
           className="relative z-10 max-w-lg text-slate-900"
        >
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
             <Zap size={32} className="text-blue-600" />
          </div>
          <h1 className="text-5xl font-black leading-[1.1] tracking-tight mb-6">
            Start Scaling Your <br />
            <span className="text-blue-600">Manufacturing Today.</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed mb-12">
            Create an account to digitize your tech packs, access ethical factories, and completely automate your quality control workflow.
          </p>
          
          {/* Feature Highlight List */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
               <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 shadow-sm">1</div>
               <div>
                 <h4 className="font-bold text-slate-900 mb-1">Instant Tech Packs</h4>
                 <p className="text-sm text-slate-500 font-medium">Generate production-ready specs in seconds using AI.</p>
               </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
               <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 shadow-sm">2</div>
               <div>
                 <h4 className="font-bold text-slate-900 mb-1">Live Tracking</h4>
                 <p className="text-sm text-slate-500 font-medium">Complete real-time visibility from cutting to shipping.</p>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
