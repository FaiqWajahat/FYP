'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Sparkles, MessageSquare, AlertCircle, FileSearch } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full bg-slate-950 flex items-center justify-center overflow-hidden px-4 py-12">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-blue-600/20 rounded-full blur-[100px] sm:blur-[150px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-violet-600/10 rounded-full blur-[120px] sm:blur-[180px] pointer-events-none" />
      
      {/* Decorative Grid Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Main Glassmorphic Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-2xl w-full text-center bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
      >
        {/* Error Category Indicator */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-6"
        >
          <AlertCircle size={14} />
          Blueprint Unreachable
        </motion.div>

        {/* Huge Animated 404 Digits */}
        <div className="relative mb-6 select-none">
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="text-8xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400"
          >
            404
          </motion.h1>
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg blur-2xl opacity-10 -z-10" />
        </div>

        {/* Title */}
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug mb-4"
        >
          Pattern Spec Sheet Missing
        </motion.h2>

        {/* Description */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-8 font-medium"
        >
          The page or product configuration you are trying to access has been archived, moved, or never cut from our fabric roll. Let's redirect you to active collections.
        </motion.p>

        {/* Buttons / Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center"
        >
          <Link href="/categories">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/20 transition-all">
              <FileSearch size={16} />
              Browse Collections
            </button>
          </Link>
          
          <Link href="/">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 hover:text-white active:scale-95 text-slate-300 font-bold text-sm rounded-xl border border-slate-700/80 transition-all">
              <Home size={16} />
              Return Home
            </button>
          </Link>
        </motion.div>

        {/* Bottom Helper Links */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500"
        >
          <span className="font-semibold tracking-wider uppercase">Factory Flow Manufacturing Portal</span>
          <Link href="/contact" className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold hover:underline transition-all">
            <MessageSquare size={13} />
            Contact Production Desk
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
