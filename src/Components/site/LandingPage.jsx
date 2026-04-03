'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Package, CheckCircle, Zap, Globe,
  BarChart3, BadgeCheck, TrendingUp, Shield, Palette,
  LayoutDashboard, ShoppingBag, Receipt, Image as ImageIcon, Bell, Search, Clock
} from 'lucide-react';
import { useConfigStore } from '@/store/useConfigStore';

// ─── Trust Ticker ──────────────────────────────────────────────────────────
const TICKER = [
  { icon: Shield, text: 'Escrow Protected' },
  { icon: Globe, text: '40+ Countries' },
  { icon: Zap, text: '21-Day Turnaround' },
  { icon: BadgeCheck, text: 'ISO Quality' },
  { icon: Package, text: 'Custom Packaging' },
  { icon: Palette, text: 'Branding Studio' },
  { icon: BarChart3, text: 'Live Tracking' },
  { icon: TrendingUp, text: 'Factory Direct Pricing' },
];

export default function HeroSection() {
  const { projectName } = useConfigStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="flex-1 min-h-[80vh]" />;

  const headlineWords = 'The Operating System for Modern Apparel.'.split(' ');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .h-root { font-family: 'DM Sans', sans-serif; }
        .d-font  { font-family: 'Sora', sans-serif; }

        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-inner { animation: ticker 28s linear infinite; }
        .ticker-inner:hover { animation-play-state: paused; }
      `}</style>

      <section className="h-root relative w-full pt-20 pb-20 overflow-hidden flex flex-col items-center bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center w-full">


          {/* ── Headline ── */}
          <h1 className="d-font text-[44px] md:text-[56px] lg:text-[72px] font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-6 max-w-5xl mx-auto flex flex-wrap justify-center gap-x-3 md:gap-x-4">
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={word === 'Modern' || word === 'Apparel.' ? 'text-blue-600' : ''}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* ── Sub-heading ── */}
          <motion.p
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed mb-10 font-medium"
          >
            {projectName} is the first verified B2B ecosystem bridging premium global brands and automated factory floors.
          </motion.p>

          {/* ── CTAs ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-16"
          >
            <Link href="/categories">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden px-9 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center gap-3 shadow-[0_10px_36px_-10px_rgba(15,23,42,0.45)] group"
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-3">
                  Start Your Order <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </Link>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-800 rounded-2xl font-bold text-sm hover:border-blue-300 hover:bg-blue-50/40 transition-all shadow-sm"
              >
                Request a Quote
              </motion.button>
            </Link>
          </motion.div>

          {/* ── Trust Ticker ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="w-full max-w-6xl mx-auto overflow-hidden border border-slate-200 bg-white shadow-sm rounded-2xl py-3 mb-10"
          >
            <div className="ticker-inner flex w-max select-none">
              {[...TICKER, ...TICKER].map(({ icon: Icon, text }, i) => (
                <span key={i} className="inline-flex items-center gap-2 px-8 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors whitespace-nowrap cursor-default">
                  <Icon size={14} className="opacity-60" />
                  {text}
                  <span className="ml-8 opacity-20">|</span>
                </span>
              ))}
            </div>
          </motion.div>

          {/* ════════════════════════════════════════════════════
              DASHBOARD PREVIEW SECTION
              ════════════════════════════════════════════════════ */}

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl mx-auto rounded-3xl border-4 border-slate-200/50 bg-slate-100/50 p-2 shadow-2xl relative"
          >
            {/* Soft backdrop glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-2xl -z-10 rounded-3xl" />

            <div className="w-full rounded-2xl overflow-hidden bg-white shadow-lg flex flex-col border border-slate-200">
              
              {/* Mock OS Header */}
              <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-amber-400 hover:bg-amber-500 transition-colors shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400 hover:bg-emerald-500 transition-colors shadow-sm" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="h-7 w-72 bg-white border border-slate-200 rounded-md flex items-center px-3 justify-center shadow-inner">
                    <Search size={14} className="text-slate-300 mr-2" />
                    <div className="h-2 w-32 bg-slate-100 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Mock App Body */}
              <div className="flex flex-col md:flex-row h-[560px]">
                
                {/* Sidebar */}
                <div className="hidden md:flex w-60 bg-slate-50 border-r border-slate-200 p-5 flex-col gap-2">
                  <div className="mb-6 px-3">
                    <span className="font-extrabold text-xl tracking-tight text-slate-800 d-font">{projectName}.</span>
                  </div>
                  {[
                    { icon: LayoutDashboard, label: 'Dashboard', active: true },
                    { icon: ShoppingBag, label: 'Production Pipeline' },
                    { icon: ImageIcon, label: 'Mockup Studio' },
                    { icon: Receipt, label: 'Invoices & Billing' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold cursor-default transition-all ${
                        item.active ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                      }`}
                    >
                      <item.icon size={18} className={item.active ? 'opacity-100' : 'opacity-60'} />
                      {item.label}
                    </motion.div>
                  ))}

                  <div className="mt-auto px-3 py-4 border-t border-slate-200">
                     <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                         <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">US</div>
                       </div>
                       <div className="flex flex-col text-left">
                         <span className="text-xs font-bold text-slate-800">Supply Studio</span>
                         <span className="text-[10px] font-semibold text-slate-500">Premium Plan</span>
                       </div>
                     </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white p-6 md:p-8 flex flex-col gap-8 overflow-hidden text-left relative">
                  
                  {/* Subtle background decoration */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-[80px] pointer-events-none" />

                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
                    <div>
                      <motion.h2 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }} className="text-2xl pt-2 font-black text-slate-900 d-font">
                        Welcome back, Studio.
                      </motion.h2>
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="text-sm font-medium text-slate-500 mt-1">
                        Here's what's happening with your production lines today.
                      </motion.p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3">
                      <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors">
                        <Bell size={18} />
                      </button>
                      <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-shadow">
                        New Order
                      </button>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 z-10">
                    {[
                      { val: '12', label: 'Active Lines', col: 'text-blue-600', bg: 'bg-blue-50' },
                      { val: '4', label: 'Pending Mockups', col: 'text-amber-600', bg: 'bg-amber-50' },
                      { val: '$42k', label: 'Paid Invoices', col: 'text-emerald-600', bg: 'bg-emerald-50' },
                    ].map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4 + (i * 0.1) }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all bg-white"
                      >
                        <p className={`text-3xl font-black ${s.col} tracking-tight`}>{s.val}</p>
                        <p className="text-[11px] font-bold text-slate-500 mt-2 uppercase tracking-widest">{s.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Active Productions Table */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.7 }}
                    className="flex-1 rounded-2xl border border-slate-100 shadow-sm bg-white overflow-hidden flex flex-col z-10"
                  >
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <h3 className="font-extrabold text-slate-800 text-sm">Recent Productions</h3>
                      <button className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg">View All</button>
                    </div>
                    <div className="p-2 flex flex-col gap-1 overflow-y-auto">
                      {[
                        { id: 'ORD-8821', title: 'Heavyweight Hoodies', items: '1,200 units', status: 'In Production', stBg: 'bg-blue-50', stText: 'text-blue-600', icon: Package },
                        { id: 'ORD-8901', title: 'Oversized Tees (380 GSM)', items: '3,000 units', status: 'QC Passed', stBg: 'bg-emerald-50', stText: 'text-emerald-600', icon: CheckCircle },
                        { id: 'ORD-8650', title: 'Fleece Joggers Collection', items: '800 units', status: 'Payment Review', stBg: 'bg-amber-50', stText: 'text-amber-600', icon: Clock },
                      ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between p-3 px-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-default">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${row.stBg} shadow-inner`}>
                              <row.icon size={18} className={row.stText} />
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-800 text-sm">{row.title}</p>
                              <p className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">{row.id} <span className="mx-1 text-slate-300">•</span> {row.items}</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-black ${row.stBg} ${row.stText} shadow-sm border border-white/50 uppercase tracking-wide`}>
                            {row.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
}