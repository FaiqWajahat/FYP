'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Package, Truck, CheckCircle, Zap, Globe,
  BarChart3, Star, ChevronRight, Factory, Palette,
  FileSpreadsheet, BadgeCheck, Sparkles, TrendingUp, Shield
} from 'lucide-react';
import { useConfigStore } from '@/store/useConfigStore';

// ─── Animated Counter Hook ─────────────────────────────────────────────────
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ─── Live Order Feed ───────────────────────────────────────────────────────
const LIVE_ORDERS = [
  { id: 'ORD-8821', product: 'Heavyweight Hoodies', units: '1,200 pcs', country: '🇺🇸 USA', status: 'In Production', dot: 'bg-blue-400', pill: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'ORD-8739', product: 'Custom Embroidered Caps', units: '500 pcs', country: '🇦🇺 Australia', status: 'QC Passed', dot: 'bg-emerald-400', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'ORD-8901', product: 'Oversized Tees – 380 GSM', units: '3,000 pcs', country: '🇩🇪 Germany', status: 'Shipped', dot: 'bg-violet-400', pill: 'bg-violet-50 text-violet-700 border-violet-200' },
  { id: 'ORD-8650', product: 'Fleece Joggers Collection', units: '800 pcs', country: '🇨🇦 Canada', status: 'Awaiting Approval', dot: 'bg-amber-400', pill: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'ORD-9011', product: 'DTF Print Crewnecks', units: '2,500 pcs', country: '🇬🇧 UK', status: 'In Production', dot: 'bg-blue-400', pill: 'bg-blue-50 text-blue-700 border-blue-200' },
];

// ─── Features ──────────────────────────────────────────────────────────────
const FEATURES = [
  {
    id: 'techpack',
    label: 'Tech-Pack',
    icon: FileSpreadsheet,
    headline: 'Auto-generate production-ready specs',
    body: 'Define fabric weight, GSM, stitching, and print formats. Our AI builds a verified tech-pack that factory floors accept on day one — no back-and-forth.',
    stat: '98%', statLabel: 'Factory acceptance rate',
    highlights: ['Auto-filled spec sheet', 'GSM & weight selector', 'AI validation engine'],
    color: { bg: 'bg-blue-600', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', bar: 'bg-blue-600' },
  },
  {
    id: 'branding',
    label: 'Branding',
    icon: Palette,
    headline: 'Upload logos, preview on real products',
    body: 'See your brand on garments before a single unit is cut. Choose embroidery, DTF, screen print — all costed in real-time with live margin breakdowns.',
    stat: '3 min', statLabel: 'Avg. preview time',
    highlights: ['Embroidery & DTF options', 'Real-time cost engine', 'Pantone color match'],
    color: { bg: 'bg-violet-600', light: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', bar: 'bg-violet-600' },
  },
  {
    id: 'tracking',
    label: 'Live Track',
    icon: BarChart3,
    headline: 'Real-time order pipeline visibility',
    body: 'From fabric sourcing to final QC scan, track every milestone on a live dashboard. Zero ambiguity, full factory transparency with photo updates.',
    stat: '24/7', statLabel: 'Live production updates',
    highlights: ['Milestone push alerts', 'Photo QC proof', 'ETA calculator'],
    color: { bg: 'bg-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', bar: 'bg-emerald-600' },
  },
  {
    id: 'export',
    label: 'Global Export',
    icon: Globe,
    headline: 'Factory-to-door in 40+ countries',
    body: 'DHL, sea freight, or air cargo — get instant quotes and customs documentation handled end-to-end by our dedicated logistics partners.',
    stat: '40+', statLabel: 'Countries served',
    highlights: ['Instant freight quotes', 'Customs docs included', 'DHL priority option'],
    color: { bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', bar: 'bg-amber-500' },
  },
];

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
  const [activeFeature, setActiveFeature] = useState(0);
  const [liveIdx, setLiveIdx] = useState(0);
  const [statsGo, setStatsGo] = useState(false);
  const statsRef = useRef(null);

  const orders = useCountUp(12400, 2200, statsGo);
  const brands = useCountUp(340, 1800, statsGo);
  const countries = useCountUp(42, 1400, statsGo);
  const satisfaction = useCountUp(98, 1600, statsGo);

  useEffect(() => {
    setMounted(true);
    // Stats count-up: always fires after load
    const t1 = setTimeout(() => setStatsGo(true), 900);
    // Live order cycling
    const t2 = setInterval(() => setLiveIdx(i => (i + 1) % LIVE_ORDERS.length), 3200);
    // Feature tab auto-cycling
    const t3 = setInterval(() => setActiveFeature(i => (i + 1) % FEATURES.length), 5000);
    return () => { clearTimeout(t1); clearInterval(t2); clearInterval(t3); };
  }, []);

  if (!mounted) return <div className="flex-1 min-h-[80vh]" />;

  const feat = FEATURES[activeFeature];
  const c = feat.color;
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

        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.4); }
        }
        .live-dot { animation: live-pulse 1.8s ease-in-out infinite; }
      `}</style>

      <section className="h-root relative w-full pt-20 pb-12 overflow-hidden flex flex-col items-center">
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
                <span className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
            className="w-full max-w-6xl mx-auto overflow-hidden border border-slate-200 bg-white shadow-sm rounded-2xl py-3 mb-12"
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
              NEW SPACIOUS LAYOUT
              ════════════════════════════════════════════════════ */}

          {/* ── Stats Row ── */}
          {/* <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-left"
          >
            {[
              { val: orders, suf: '+', label: 'Units Produced', icon: Package, col: 'text-blue-600', bg: 'bg-blue-50' },
              { val: brands, suf: '', label: 'Active Brands', icon: Star, col: 'text-violet-600', bg: 'bg-violet-50' },
              { val: countries, suf: '+', label: 'Countries Served', icon: Globe, col: 'text-emerald-600', bg: 'bg-emerald-50' },
              { val: satisfaction, suf: '%', label: 'Client Satisfaction', icon: BadgeCheck, col: 'text-amber-600', bg: 'bg-amber-50' },
            ].map(({ val, suf, label, icon: Icon, col, bg }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-default"
              >
                <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon size={20} className={col} />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 leading-none tabular-nums">
                    {val.toLocaleString()}{suf}
                  </p>
                  <p className="text-xs font-semibold text-slate-500 mt-1">{label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div> */}

          {/* ── 2-Column Bento Base ── */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 text-left items-stretch"
          >
            {/* ── LEFT: Feature showcase ── */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex gap-2">
                {FEATURES.map((f, i) => {
                  const FI = f.icon;
                  const fc = f.color;
                  const active = i === activeFeature;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setActiveFeature(i)}
                      title={f.label}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all duration-200 ${active
                        ? `${fc.light} ${fc.text} ${fc.border} shadow-sm`
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                      <FI size={16} />
                      <span className="hidden sm:inline">{f.label}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={feat.id}
                  initial={{ opacity: 0, scale: 0.98, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -16 }}
                  transition={{ duration: 0.35 }}
                  className="flex-1 min-h-[300px] rounded-3xl border border-slate-200 bg-white shadow-lg overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className={`h-1.5 w-full ${c.bg}`} />
                    <div className="p-8 flex flex-col gap-6">
                      <div className="flex items-start gap-5">
                        <div className={`w-14 h-14 ${c.light} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                          {React.createElement(feat.icon, { size: 28, className: c.text })}
                        </div>
                        <div>
                          <p className={`text-[11px] font-black uppercase tracking-widest mb-1.5 ${c.text}`}>{feat.label}</p>
                          <h3 className="text-lg md:text-xl font-extrabold text-slate-900 leading-snug">{feat.headline}</h3>
                        </div>
                      </div>
                      <p className="text-slate-500 font-medium leading-relaxed">{feat.body}</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                        {feat.highlights.map(h => (
                          <li key={h} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <CheckCircle size={16} className={c.text} />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-8 pt-0 mt-auto">
                    <div className={`flex items-center justify-between p-4 rounded-2xl ${c.light} border ${c.border} mb-4`}>
                      <div>
                        <p className={`text-4xl font-black leading-none ${c.text}`}>{feat.stat}</p>
                        <p className="text-xs text-slate-600 font-semibold mt-1">{feat.statLabel}</p>
                      </div>
                      <div className={`h-12 w-12 ${c.bg} rounded-2xl flex items-center justify-center shadow-md`}>
                        <ArrowRight size={20} className="text-white" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {FEATURES.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveFeature(i)}
                          className={`h-2 flex-1 rounded-full transition-all duration-500 ${i === activeFeature ? c.bar : 'bg-slate-100 hover:bg-slate-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── RIGHT: Live orders Feed ── */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="w-full flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 live-dot border border-emerald-200" />
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Live Orders Feed</span>
                </div>
                <span className="text-xs text-slate-400 font-semibold bg-slate-100 px-2 py-1 rounded-md">Auto-updating</span>
              </div>

              <div className="flex flex-col gap-3 min-h-[300px]">
                <div className="relative rounded-3xl border border-slate-200 bg-white shadow-lg overflow-hidden flex-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={liveIdx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.4 }}
                      className="p-6 h-full flex flex-col justify-center gap-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{LIVE_ORDERS[liveIdx].id}</p>
                          <p className="font-extrabold text-slate-900 text-lg mt-1">{LIVE_ORDERS[liveIdx].product}</p>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap shadow-sm ${LIVE_ORDERS[liveIdx].pill}`}>
                          {LIVE_ORDERS[liveIdx].status}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 mt-2 pt-4 border-t border-slate-100">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Volume</span>
                          <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mt-0.5"><Package size={14} className="text-slate-400" />{LIVE_ORDERS[liveIdx].units}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Destination</span>
                          <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mt-0.5"><Truck size={14} className="text-slate-400" />{LIVE_ORDERS[liveIdx].country}</span>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  <div className="h-1 bg-slate-50 absolute bottom-0 inset-x-0">
                    <motion.div
                      className={`h-full ${LIVE_ORDERS[liveIdx].dot}`}
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 3.2, ease: 'linear' }}
                      key={liveIdx}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {LIVE_ORDERS.filter((_, i) => i !== liveIdx).slice(0, 3).map((o, i) => (
                    <motion.div
                      key={o.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-sm transition-all shadow-sm"
                    >
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${o.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{o.product}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{o.units} · {o.country}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${o.pill}`}>{o.status}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

          </motion.div>

          {/* ── How It Works (Horizontal Strip) ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full mt-4 p-6 md:p-8 bg-slate-900 rounded-[2rem] shadow-xl text-left relative overflow-hidden"
          >
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-6 relative z-10 flex items-center gap-2">
              <Zap size={14} /> How Implementation Works
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {[
                { icon: Sparkles, step: '01', title: 'Configure & Brand', label: 'Use our 3D studio to apply your graphics.' },
                { icon: CheckCircle, step: '02', title: 'Tech-Pack AI', label: 'Auto-generate factory schematics & costings.' },
                { icon: Factory, step: '03', title: 'Production Floor', label: 'Your styles hit verified automated looms.' },
                { icon: Truck, step: '04', title: 'Global Delivery', label: 'DDP freight tracking door-to-door.' },
              ].map(({ icon: Icon, step, title, label }, i) => (
                <div key={i} className="flex flex-col gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} />
                    </div>
                    <span className="text-3xl font-black text-white/5">{step}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1.5">{title}</h4>
                    <p className="text-[13px] font-medium text-slate-400 leading-relaxed">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}