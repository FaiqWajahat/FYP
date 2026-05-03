'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight, Package, CheckCircle, Zap, Globe,
  BarChart3, BadgeCheck, TrendingUp, Shield, Palette,
  LayoutDashboard, ShoppingBag, Receipt, Image as ImageIcon,
  Bell, Search, Clock, Sparkles, Users, Truck, Activity,
  ChevronRight, Star, ArrowUpRight
} from 'lucide-react';
import { useConfigStore } from '@/store/useConfigStore';

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

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="flex-1 min-h-[80vh]" />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .h-root { font-family: 'DM Sans', sans-serif; }
        .d-font  { font-family: 'Sora', sans-serif; }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .ticker-inner { animation: ticker 28s linear infinite; }
        .ticker-inner:hover { animation-play-state: paused; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .float-slow { animation: float 6s ease-in-out infinite; }
        .float-med  { animation: float 5s ease-in-out infinite 1s; }
        @keyframes pulse-ring { 0% { transform: scale(0.9); opacity: 1; } 100% { transform: scale(1.6); opacity: 0; } }
        .pulse-ring { animation: pulse-ring 2.5s cubic-bezier(0.4,0,0.6,1) infinite; }
      `}</style>

      <section className="h-root relative w-full pt-16 pb-24 overflow-hidden flex flex-col items-center bg-gradient-to-b from-slate-50 via-white to-slate-50/50">

        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-[10%] w-72 h-72 bg-blue-400/8 rounded-full blur-[100px]" />
          <div className="absolute top-40 right-[10%] w-80 h-80 bg-purple-400/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center w-full">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600">
                <Sparkles size={10} className="text-white" />
              </span>
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-widest">
                B2B Manufacturing Platform
              </span>
            </div> */}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="d-font text-[42px] md:text-[56px] lg:text-[72px] font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-6 max-w-5xl"
          >
            The Operating System{' '}
            <br className="hidden sm:block" />
            for <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Modern Apparel</span>.
          </motion.h1>

          {/* Sub-heading */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed mb-10 font-medium"
          >
            {projectName} is the first verified B2B ecosystem bridging premium global brands and automated factory floors.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-14"
          >
            <Link href="/categories">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm flex items-center gap-3  shadow-blue-600/25 hover:shadow-blue-600/35 transition-all group"
              >
                Start Your Order
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/smart-inquiry">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-800 rounded-2xl font-bold text-sm hover:border-blue-300 hover:bg-blue-50/40 transition-all shadow-sm flex items-center gap-2"
              >
                <Sparkles size={14} className="text-blue-500" />
                Get a Free Quote
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust Ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="w-full max-w-5xl mx-auto overflow-hidden border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-sm rounded-2xl py-3 mb-14"
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

          {/* ═══ DASHBOARD PREVIEW ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[1100px] mx-auto relative"
          >
            {/* Glow effects */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/15 via-purple-500/10 to-cyan-400/10 blur-3xl -z-10 rounded-[40px]" />
            <div className="absolute -inset-1 bg-gradient-to-b from-blue-500/10 to-purple-500/5 rounded-3xl -z-10" />

            {/* Browser chrome */}
            <div className="rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/10 overflow-hidden">
              {/* Title bar */}
              <div className="h-11 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="h-6 w-64 bg-white border border-slate-200 rounded-lg flex items-center px-3 gap-2">
                    <Search size={11} className="text-slate-300" />
                    <span className="text-[10px] text-slate-300 font-medium">app.{projectName?.toLowerCase() || 'platform'}.com/dashboard</span>
                  </div>
                </div>
                <div className="w-[52px]" />
              </div>

              {/* App body */}
              <div className="flex h-[520px] md:h-[560px]">

                {/* ── Sidebar ── */}
                <div className="hidden md:flex w-56 bg-slate-900 flex-col text-left">
                  {/* Sidebar header */}
                  <div className="px-5 py-5 border-b border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                        <Package size={14} className="text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-[13px] leading-none">{projectName}</p>
                        <p className="text-slate-500 text-[9px] font-semibold mt-0.5 uppercase tracking-widest">Manufacturing</p>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar nav */}
                  <div className="flex-1 px-3 py-4 flex flex-col gap-0.5">
                    {[
                      { icon: LayoutDashboard, label: 'Dashboard', active: true },
                      { icon: ShoppingBag, label: 'Orders' },
                      { icon: ImageIcon, label: 'Mockup Studio' },
                      { icon: Receipt, label: 'Invoices' },
                      { icon: Users, label: 'Clients' },
                      { icon: Truck, label: 'Shipments' },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-semibold cursor-default transition-all ${item.active
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                          }`}
                      >
                        <item.icon size={15} className={item.active ? 'text-blue-200' : 'opacity-50'} />
                        {item.label}
                      </div>
                    ))}
                  </div>

                  {/* Sidebar footer */}
                  <div className="px-4 py-4 border-t border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-[10px] shadow">
                        JD
                      </div>
                      <div>
                        <p className="text-white font-bold text-[11px] leading-none">James Dixon</p>
                        <p className="text-slate-500 text-[9px] font-medium mt-0.5">Premium Plan</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Main content ── */}
                <div className="flex-1 bg-slate-50/50 flex flex-col overflow-hidden">
                  {/* Top bar */}
                  <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
                    <div>
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="text-lg font-black text-slate-900 d-font leading-none">
                        Welcome back, James
                      </motion.p>
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="text-[11px] font-medium text-slate-400 mt-1">
                        Here's your production overview for today.
                      </motion.p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <button className="relative w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                        <Bell size={15} />
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-600 border-2 border-white" />
                      </button>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold shadow-sm flex items-center gap-1.5">
                        <ArrowUpRight size={12} /> New Order
                      </button>
                    </div>
                  </div>

                  {/* Content area */}
                  <div className="flex-1 p-5 overflow-hidden flex flex-col gap-4">
                    {/* Stats row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { val: '24', label: 'Active Orders', delta: '+3', col: 'text-blue-600', bg: 'bg-blue-50', icon: ShoppingBag, deltaCol: 'text-blue-500' },
                        { val: '8', label: 'Pending Mockups', delta: '+2', col: 'text-amber-600', bg: 'bg-amber-50', icon: ImageIcon, deltaCol: 'text-amber-500' },
                        { val: '$84k', label: 'Revenue MTD', delta: '+12%', col: 'text-emerald-600', bg: 'bg-emerald-50', icon: TrendingUp, deltaCol: 'text-emerald-500' },
                        { val: '99%', label: 'Quality Score', delta: '→', col: 'text-purple-600', bg: 'bg-purple-50', icon: Star, deltaCol: 'text-purple-500' },
                      ].map((s, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.3 + i * 0.08 }}
                          className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-md transition-shadow group cursor-default"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center ${s.col} group-hover:scale-110 transition-transform`}>
                              <s.icon size={14} />
                            </div>
                            <span className={`text-[9px] font-bold ${s.deltaCol} bg-slate-50 px-1.5 py-0.5 rounded-md`}>{s.delta}</span>
                          </div>
                          <p className={`text-xl font-black ${s.col} tracking-tight leading-none`}>{s.val}</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">{s.label}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Bottom row: Orders table + Activity */}
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 min-h-0">
                      {/* Orders table */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6 }}
                        className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col"
                      >
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                          <h3 className="font-black text-[13px] text-slate-800">Production Pipeline</h3>
                          <button className="text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1">
                            View All <ChevronRight size={10} />
                          </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-1.5 flex flex-col gap-0.5">
                          {[
                            { id: 'ORD-8821', title: 'Heavyweight Hoodies', qty: '1,200 pcs', status: 'In Production', prog: 65, stBg: 'bg-blue-50', stText: 'text-blue-600', progBar: 'bg-blue-500', icon: Package },
                            { id: 'ORD-8901', title: 'Oversized Tees (380 GSM)', qty: '3,000 pcs', status: 'QC Passed', prog: 92, stBg: 'bg-emerald-50', stText: 'text-emerald-600', progBar: 'bg-emerald-500', icon: CheckCircle },
                            { id: 'ORD-8650', title: 'Fleece Joggers Collection', qty: '800 pcs', status: 'Cutting', prog: 34, stBg: 'bg-amber-50', stText: 'text-amber-600', progBar: 'bg-amber-500', icon: Clock },
                            { id: 'ORD-8712', title: 'Varsity Jackets Premium', qty: '500 pcs', status: 'Dispatched', prog: 100, stBg: 'bg-purple-50', stText: 'text-purple-600', progBar: 'bg-purple-500', icon: Truck },
                          ].map((row, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all cursor-default group">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${row.stBg} shrink-0 group-hover:scale-105 transition-transform`}>
                                  <row.icon size={15} className={row.stText} />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-[12px] text-slate-800 truncate">{row.title}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{row.id}</span>
                                    <span className="text-[9px] text-slate-300">•</span>
                                    <span className="text-[9px] font-semibold text-slate-400">{row.qty}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                {/* Mini progress bar */}
                                <div className="hidden sm:flex items-center gap-2 w-20">
                                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${row.progBar} transition-all`} style={{ width: `${row.prog}%` }} />
                                  </div>
                                  <span className="text-[9px] font-bold text-slate-400 w-7 text-right">{row.prog}%</span>
                                </div>
                                <div className={`px-2 py-1 rounded-lg text-[9px] font-black ${row.stBg} ${row.stText} uppercase tracking-wide hidden sm:block`}>
                                  {row.status}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Activity feed */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.75 }}
                        className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col"
                      >
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                          <h3 className="font-black text-[13px] text-slate-800">Activity</h3>
                          <Activity size={13} className="text-slate-300" />
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                          {[
                            { text: 'Invoice #INV-421 paid', time: '2m ago', accent: 'bg-emerald-400' },
                            { text: 'Mockup V2 approved', time: '18m ago', accent: 'bg-blue-400' },
                            { text: 'New order from Nike EU', time: '1h ago', accent: 'bg-purple-400' },
                            { text: 'Shipment dispatched', time: '3h ago', accent: 'bg-amber-400' },
                            { text: 'QC report uploaded', time: '5h ago', accent: 'bg-cyan-400' },
                          ].map((item, i) => (
                            <div key={i} className="flex items-start gap-2.5 py-1.5">
                              <div className="relative mt-1.5 shrink-0">
                                <div className={`w-2 h-2 rounded-full ${item.accent}`} />
                                {i < 4 && <div className="absolute top-2.5 left-[3px] w-px h-6 bg-slate-100" />}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[11px] font-semibold text-slate-700 leading-snug">{item.text}</p>
                                <p className="text-[9px] font-medium text-slate-400 mt-0.5">{item.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
}