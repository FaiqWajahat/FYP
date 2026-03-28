'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Box } from 'lucide-react';
import LoginForm from '@/Components/auth/LoginForm';
import { useConfigStore } from '@/store/useConfigStore';

export default function LoginPage() {
  const { projectName } = useConfigStore();

  return (
    <div className="flex w-full min-h-screen">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col pt-8 pb-12 px-6 sm:px-12 bg-white relative z-10">
        
        {/* Simple Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft size={16} /> Back to site
          </Link>
          <div className="text-xl font-black tracking-tighter text-slate-900">{projectName}</div>
        </div>

        {/* Form Container Container */}
        <div className="flex-1 flex items-center justify-center mt-12 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full"
          >
            <LoginForm />
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
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, delay: 0.2 }}
           className="relative z-10 max-w-lg text-slate-900"
        >
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
             <Box size={32} className="text-blue-600" />
          </div>
          <h1 className="text-5xl font-black leading-tight tracking-tight mb-6">
            The Digital Engine for <br />
            <span className="text-blue-600">Modern Supply Chains.</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed mb-12">
            Log in to manage your tech packs, track production live, and seamlessly connect with global manufacturing partners.
          </p>
          
          {/* Testimonial / Social Proof */}
          <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm relative overflow-hidden group hover:border-blue-200 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Box size={80} className="text-blue-600" />
            </div>
            <div className="flex text-blue-500 mb-4 text-xs tracking-widest font-black uppercase">★★★★★ Excellent</div>
            <p className="text-sm font-semibold text-slate-600 leading-relaxed italic relative z-10">
              "{projectName} completely revolutionized how we handle our FW25 collection. We cut prototype times by 40% while maintaining absolute quality control."
            </p>
            <div className="mt-6 flex items-center gap-4 border-t border-slate-50 pt-6">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs">SJ</div>
              <div>
                <p className="text-xs font-black text-slate-900">Sarah Jenkins</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Head of Production · Modus Collective</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
