'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight, Package, CheckCircle, Zap, Globe,
  BarChart3, BadgeCheck, TrendingUp, Shield, Palette,
  ShoppingBag, Image as ImageIcon, Search,
  Clock, Sparkles, Truck, Star, ArrowUpRight,
  ChevronRight, BrainCircuit,
} from 'lucide-react';
import { useConfigStore } from '@/store/useConfigStore';

/* ─── Ticker data ─── */
const TICKER = [
  { icon: Shield, text: 'Escrow Protected' },
  { icon: Globe, text: '40+ Countries' },
  { icon: Zap, text: '21-Day Turnaround' },
  { icon: BadgeCheck, text: 'ISO Certified' },
  { icon: Package, text: 'Custom Packaging' },
  { icon: Palette, text: 'Branding Studio' },
  { icon: BarChart3, text: 'Live Tracking' },
  { icon: TrendingUp, text: 'Factory Direct Pricing' },
];

/* ─── Social proof avatars (Unsplash) ─── */
const AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face',
];

/* ─── Pipeline orders ─── */
const PIPELINE = [
  { id: 'ORD-8821', product: 'Heavyweight Hoodies', qty: '1,200 pcs', stage: 'Stitching', prog: 65, stc: 'text-blue-600',    stb: 'bg-blue-50',    bar: 'bg-blue-500'    },
  { id: 'ORD-8901', product: 'Oversized Tees 380gsm', qty: '3,000 pcs', stage: 'QC Passed',  prog: 92, stc: 'text-emerald-600', stb: 'bg-emerald-50', bar: 'bg-emerald-500' },
  { id: 'ORD-8650', product: 'Fleece Joggers',   qty: '800 pcs',  stage: 'Cutting',   prog: 34, stc: 'text-amber-600',  stb: 'bg-amber-50',   bar: 'bg-amber-500'   },
];

const TEMPLATES = {
  hoodie: {
    name: 'Oversized Hoodie',
    img: '/quote-hoodie.jpg',
    specs: { qty: '1,200 pcs', fabric: '380 GSM Cotton Fleece', fit: 'Oversized Fit', code: 'PRD-HD90' },
    annotations: [
      { text: '3D Puff Embroidery', top: '25%', left: '15%', align: 'left' },
      { text: 'Double-needle flatlock seams', top: '75%', left: '70%', align: 'right' },
      { text: 'Satin-weave custom brand label', top: '10%', left: '48%', align: 'center' }
    ]
  },
  jacket: {
    name: 'Varsity Jacket',
    img: '/quote-varistyjacket.png',
    specs: { qty: '500 pcs', fabric: 'Premium Wool & Leather', fit: 'Classic Fit', code: 'PRD-VJ44' },
    annotations: [
      { text: 'Chenille patch applique', top: '35%', left: '20%', align: 'left' },
      { text: 'Ribbed cuffs & hem', top: '80%', left: '72%', align: 'right' },
      { text: 'Genuine cowhide sleeves', top: '50%', left: '80%', align: 'right' }
    ]
  },
  tshirt: {
    name: 'Heavyweight Tee',
    img: '/quote-tshirt.jpg',
    specs: { qty: '2,500 pcs', fabric: '240 GSM Carded Cotton', fit: 'Boxy Drop-Shoulder', code: 'PRD-TS12' },
    annotations: [
      { text: 'Screenprint graphic (Water-based)', top: '40%', left: '15%', align: 'left' },
      { text: 'Tight rib collar (1.2-inch)', top: '12%', left: '50%', align: 'center' },
      { text: 'Heavyweight loop knit fabric', top: '72%', left: '68%', align: 'right' }
    ]
  },
  joggers: {
    name: 'Fleece Joggers',
    img: '/quote-joggers.webp',
    specs: { qty: '1,000 pcs', fabric: '320 GSM French Terry', fit: 'Tapered Cuffed', code: 'PRD-JG88' },
    annotations: [
      { text: 'Metal tip drawstrings', top: '10%', left: '35%', align: 'left' },
      { text: 'Concealed zipper pocket', top: '40%', left: '80%', align: 'right' },
      { text: 'Elasticated cuffs', top: '88%', left: '60%', align: 'center' }
    ]
  }
};

export default function HeroSection() {
  const { projectName } = useConfigStore();
  const [selectedTemplate, setSelectedTemplate] = useState('hoodie');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .h-root { font-family: 'DM Sans', sans-serif; }
        .h-font  { font-family: 'Sora', sans-serif; }

        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .ticker-track { animation: ticker 32s linear infinite; }
        .ticker-track:hover { animation-play-state: paused; }

        @keyframes float-a { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-7px); } }
        @keyframes float-b { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-5px); } }
        .badge-float-a { animation: float-a 5s ease-in-out infinite; }
        .badge-float-b { animation: float-b 6s ease-in-out infinite 1.5s; }

        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(2);  opacity: 0;   }
        }
        .live-dot::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: #10b981;
          animation: pulse-ring 2s ease-out infinite;
        }

        @keyframes shimmer-text {
          0%   { background-position: 0% 50%;   }
          100% { background-position: 200% 50%; }
        }
        .gradient-text {
          background: linear-gradient(90deg, #1d4ed8, #4f46e5, #0284c7, #1d4ed8);
          background-size: 200% auto;
          animation: shimmer-text 5s linear infinite;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <section className="h-root relative w-full bg-white overflow-hidden">

        {/* ───── Background ───── */}
        <div className="absolute inset-0 pointer-events-none select-none bg-slate-50">
          {/* Top radial halo */}
          <div
            className="absolute top-0 inset-x-0 h-[65vh]"
           
          />
          {/* Dot grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
              backgroundSize: '32px 32px',
              opacity: 0.5,
            }}
          />
          {/* Bottom fade-out */}
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* ───── Above-the-fold ───── */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-14 flex flex-col items-center text-center">

          {/* ── 1. Badge ── */}
          
          {/* ── 2. Headline ── */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="h-font font-extrabold tracking-tight leading-[1.1] mb-6 max-w-7xl"
            style={{ fontSize: 'clamp(50px, 6vw,65px)' }}
          >
            <span className="text-slate-900">Manufacture Custom Clothing,</span>
            <br />
            <span className="text-blue-700">Direct from the Source.</span>
          </motion.h1>

          {/* ── 3. Subheading ── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-slate-500 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed font-medium mb-8"
          >
            The all-in-one B2B apparel platform. Partner with our AI Assistant, secure payments with escrow,
            
            {' '}and track bulk production in real-time from the factory floor to your doorstep.
          </motion.p>

          {/* ── 4. Social proof ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-10"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2.5">
                {AVATARS.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-md"
                    alt=""
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-600">
                  <strong className="text-slate-900">500+</strong> brands trust us
                </span>
              </div>
            </div>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
              <div className="relative w-2 h-2 flex items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-emerald-500 live-dot" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 relative z-10" />
              </div>
              Factory lines operational
            </div>
          </motion.div>

          {/* ── 5. CTAs ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.44 }}
            className="flex flex-col sm:flex-row items-center gap-3 mb-16"
          >
            <Link href="/categories">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 16px 40px rgba(15,23,42,0.25)' }}
                whileTap={{ scale: 0.98 }}
                className="h-font px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[15px] flex items-center gap-2.5 shadow-lg shadow-slate-900/20 transition-all group"
              >
                Start Your Order
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </Link>

            <Link href="/smart-inquiry">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="h-font px-8 py-4 bg-white border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-slate-800 rounded-2xl font-bold text-[15px] flex items-center gap-2.5 transition-all"
              >
                <Sparkles size={15} className="text-blue-500" />
                Get a Free Quote
              </motion.button>
            </Link>
          </motion.div>

          {/* ── 6. Trust Ticker ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-sm py-3 mb-14"
          >
            <div className="ticker-track flex w-max select-none">
              {[...TICKER, ...TICKER].map(({ icon: Icon, text }, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-7 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors whitespace-nowrap cursor-default"
                >
                  <Icon size={13} className="opacity-60" />
                  {text}
                  <span className="ml-7 opacity-20">·</span>
                </span>
              ))}
            </div>
          </motion.div>

          {/* ── 7. Hero Visual ── */}
          <motion.div
            initial={{ opacity: 0, y: 56 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[1140px] relative"
          >
            {/* Ambient glow */}
            <div
              className="absolute -inset-8 -z-10 rounded-[48px] opacity-60"
              style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(59,130,246,0.12), rgba(99,102,241,0.08), transparent 70%)' }}
            />

          

            {/* Dashboard chrome */}
            <div className="rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/10 overflow-hidden">

              {/* Browser bar */}
              <div className="h-11 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="h-6 w-60 bg-white border border-slate-200 rounded-lg flex items-center px-3 gap-2">
                    <Search size={10} className="text-slate-300" />
                    <span className="text-[10px] text-slate-300 font-medium">
                      studio.{projectName?.toLowerCase() || 'factoryflow'}.com/workspace
                    </span>
                  </div>
                </div>
                <div className="w-14" />
              </div>

              {/* Workspace Studio grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200/80">
                
                {/* 1. Left Sidebar: Garment Templates (3 cols) */}
                <div className="md:col-span-3 p-4 bg-slate-50/50 flex flex-col gap-4 text-left">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 mb-2">Design Templates</h4>
                    <div className="flex flex-col gap-1.5">
                      {Object.keys(TEMPLATES).map((key) => {
                        const active = selectedTemplate === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setSelectedTemplate(key)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                              active
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/15'
                                : 'bg-white hover:bg-slate-100 border border-slate-200/60 text-slate-700'
                            }`}
                          >
                            <span>{TEMPLATES[key].name}</span>
                            <ChevronRight size={12} className={active ? 'text-white' : 'text-slate-400'} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-2 pt-4 border-t border-slate-200/80">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 mb-2">AI Copilot Mockup</h4>
                    <div className="bg-white border border-slate-200 rounded-xl p-2.5 flex flex-col gap-2">
                      <div className="flex gap-1.5 items-center">
                        <BrainCircuit size={12} className="text-indigo-500 shrink-0" />
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">AI Fabric Assist</span>
                      </div>
                      <div className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg leading-relaxed font-semibold italic border border-slate-100">
                        "vintage acid wash texture, drop-shoulder seams, high-density print..."
                      </div>
                      <button className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[9px] font-bold flex items-center justify-center gap-1 cursor-pointer">
                        <Sparkles size={10} className="text-amber-400" /> Refine Design
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Center Canvas: Bounding Box & Annotation Tooltips (5 cols) */}
                <div className="md:col-span-5 p-6 bg-slate-100/30 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
                  {/* Blueprint dot grid background */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #cbd5e1 1.2px, transparent 1.2px)',
                      backgroundSize: '16px 16px',
                    }}
                  />

                  {/* Canvas border indicator */}
                  <div className="absolute top-3 left-3 text-[9px] font-bold text-slate-400 tracking-wider font-mono">
                    CANVAS (1:1 MOCK)
                  </div>
                  
                  {/* Bounding box wrapper */}
                  <div className="w-[270px] h-[310px] relative rounded-xl border border-dashed border-blue-400/50 flex items-center justify-center bg-white p-2 shadow-lg shadow-slate-100/50 group select-none">
                    <img
                      key={selectedTemplate}
                      src={TEMPLATES[selectedTemplate].img}
                      alt={TEMPLATES[selectedTemplate].name}
                      className="max-w-full max-h-full object-contain rounded-lg animate-fade-in"
                    />

                    {/* Interactive Tooltip annotations */}
                    {TEMPLATES[selectedTemplate].annotations.map((ann, idx) => (
                      <div
                        key={idx}
                        className="absolute z-10 flex flex-col items-center"
                        style={{ top: ann.top, left: ann.left }}
                      >
                        {/* Dot indicator */}
                        <div className="relative flex items-center justify-center">
                          <span className="absolute w-4 h-4 rounded-full bg-blue-500/30 animate-ping" />
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-white shadow-md relative z-10" />
                        </div>
                        
                        {/* Card box showing annotation */}
                        <div
                          className={`absolute mt-3 bg-slate-900 text-white text-[9px] font-black tracking-wide py-1 px-2 rounded-lg shadow-xl flex items-center gap-1 border border-slate-700/60 whitespace-nowrap z-20 ${
                            ann.align === 'left' ? '-translate-x-12' : ann.align === 'right' ? 'translate-x-12' : '-translate-x-1/2'
                          }`}
                        >
                          <CheckCircle size={9} className="text-emerald-400" />
                          {ann.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Active code label */}
                  <div className="mt-4 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-500 font-mono text-[9px] font-bold rounded-full">
                    SPEC_FILE: {TEMPLATES[selectedTemplate].specs.code}.JSON
                  </div>
                </div>

                {/* 3. Right Sidebar: Specifications & Live Tracking (4 cols) */}
                <div className="md:col-span-4 p-5 bg-white flex flex-col gap-4 text-left justify-between">
                  <div className="flex flex-col gap-3.5">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 mb-1.5">Selected Spec Sheet</h4>
                      <p className="h-font font-black text-sm text-slate-900 leading-none mb-2">{TEMPLATES[selectedTemplate].name}</p>
                      
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-2">
                          <p className="text-[8px] font-bold text-slate-400 uppercase">Est. Run MOQ</p>
                          <p className="text-xs font-black text-slate-800 mt-0.5">{TEMPLATES[selectedTemplate].specs.qty}</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-2">
                          <p className="text-[8px] font-bold text-slate-400 uppercase">Fit Profile</p>
                          <p className="text-xs font-black text-slate-800 mt-0.5">{TEMPLATES[selectedTemplate].specs.fit}</p>
                        </div>
                        <div className="col-span-2 bg-slate-50 border border-slate-100 rounded-lg p-2">
                          <p className="text-[8px] font-bold text-slate-400 uppercase">Fabric Selection</p>
                          <p className="text-xs font-black text-slate-800 mt-0.5">{TEMPLATES[selectedTemplate].specs.fabric}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Escrow Security</span>
                        <span className="flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                          <Shield size={9} /> Funded
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-500 leading-normal">
                        Funds held secure by platform escrow. Only released to manufacturer when custom QC passes.
                      </div>
                    </div>
                  </div>

                  {/* Miniature live factory floor feed */}
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sialkot Factory Floor</span>
                      <div className="flex items-center gap-1">
                        
                        
                      </div>
                    </div>
                    
                    <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-[16/7] border border-slate-800 shadow-inner flex items-center justify-center">
                      {/* Grid overlays */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:12px_12px] opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                      
                      {/* Thread stitching path visual or text */}
                      <div className="flex flex-col items-center justify-center relative z-20 text-center px-4">
                        <Zap size={15} className="text-yellow-400 animate-bounce mb-1" />
                        <span className="text-[10px] font-black text-slate-200 uppercase tracking-wider font-mono">
                          {selectedTemplate === 'hoodie' && 'STITCHING LINE #04'}
                          {selectedTemplate === 'jacket' && 'CHENILLE EMBROIDERY'}
                          {selectedTemplate === 'tshirt' && 'SILKSCREEN PRINTING'}
                          {selectedTemplate === 'joggers' && 'QC INSPECTION RUN'}
                        </span>
                        <span className="text-[8px] text-slate-400 font-mono mt-0.5">SPEED: 420 SPM · TEMP: 24°C</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Shadow bloom */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-12 bg-slate-900/6 blur-2xl rounded-full -z-10" />
          </motion.div>

        </div>
      </section>
    </>
  );
}