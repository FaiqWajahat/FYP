'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe, Users, Shirt, Trophy, TrendingUp, ArrowUpRight, CheckCircle } from 'lucide-react';

/* ─── Data ─── */
const STATS = [
  {
    value: 50000,
    suffix: '+',
    label: 'Monthly Capacity',
    subtext: 'Pieces produced per month',
    icon: Shirt,
    gradient: 'from-blue-500 to-indigo-600',
    glow: 'rgba(99,102,241,0.3)',
    accent: '#6366f1',
  },
  {
    value: 30,
    suffix: '+',
    label: 'Countries Reached',
    subtext: 'Global export network',
    icon: Globe,
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16,185,129,0.3)',
    accent: '#10b981',
  },
  {
    value: 200,
    suffix: '+',
    label: 'Happy Clients',
    subtext: 'Brands & wholesalers worldwide',
    icon: Users,
    gradient: 'from-amber-500 to-orange-500',
    glow: 'rgba(245,158,11,0.3)',
    accent: '#f59e0b',
  },
  {
    value: 15,
    suffix: ' Yrs',
    label: 'Industry Experience',
    subtext: 'Manufacturing excellence in Sialkot',
    icon: Trophy,
    gradient: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.3)',
    accent: '#8b5cf6',
  },
];

/* ─── Count-up hook ─── */
function useCountUp(target, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
}

/* ─── Single stat card ─── */
function StatCard({ stat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const count = useCountUp(stat.value, 1600, inView);
  const Icon = stat.icon;

  const displayValue =
    stat.value >= 1000
      ? (count / 1000).toFixed(count >= stat.value ? 0 : 1) + 'k'
      : count;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="relative group rounded-3xl border border-white/8 bg-white/[0.04] backdrop-blur-sm overflow-hidden cursor-default"
      style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.05)' }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
        style={{ background: `radial-gradient(ellipse at top left, ${stat.glow} 0%, transparent 65%)` }}
      />

      {/* Top accent bar */}
      <div
        className={`absolute top-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-500 rounded-t-3xl bg-gradient-to-r ${stat.gradient}`}
      />

      <div className="relative z-10 p-7 flex flex-col gap-4">
        {/* Icon */}
        <div
          className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
          style={{ boxShadow: `0 6px 20px ${stat.glow}` }}
        >
          <Icon size={19} className="text-white" />
        </div>

        {/* Number */}
        <div className="flex items-end gap-1">
          <span
            className="font-extrabold text-5xl text-white leading-none tracking-tight"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            {displayValue}
          </span>
          <span
            className="font-black text-2xl mb-0.5"
            style={{ color: stat.accent, fontFamily: "'Sora', sans-serif" }}
          >
            {stat.suffix}
          </span>
        </div>

        {/* Label + subtext */}
        <div>
          <p className="text-white font-bold text-[15px] leading-snug">{stat.label}</p>
          <p className="text-slate-500 text-[12px] font-medium mt-1">{stat.subtext}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main section ─── */
export default function StatsSection() {
  return (
    <section className="relative py-28 bg-slate-950 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .st-root { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="st-root relative max-w-7xl mx-auto px-6">

        {/* ── Split Layout: Headline left, cards right ── */}
        <div className="flex flex-col lg:flex-row gap-16 items-start">

          {/* Left: Sticky headline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-32 lg:w-[380px] shrink-0 flex flex-col gap-6"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 w-fit">
              <TrendingUp size={13} className="text-blue-400" />
              <span className="text-[11px] font-black uppercase tracking-widest text-blue-300">
                By The Numbers
              </span>
            </div>

            {/* Headline */}
            <h2
              className="text-4xl md:text-5xl font-extrabold text-white leading-[1.1] tracking-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Industrial Scale.{' '}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Proven Results.
              </span>
            </h2>

            <p className="text-slate-400 text-base leading-relaxed font-medium max-w-sm">
              Over a decade of B2B manufacturing excellence — delivering premium apparel at scale to brands across 30+ countries.
            </p>

            {/* Trust bullets */}
            <div className="flex flex-col gap-3 mt-2">
              {[
                'ISO-certified quality control',
                'Escrow-protected payments',
                '21-day average turnaround',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <CheckCircle size={15} className="text-emerald-400 shrink-0" />
                  <span className="text-slate-300 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors group mt-2 w-fit"
            >
              Our Story
              <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </motion.div>

          {/* Right: 2×2 stat cards */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {STATS.map((stat, i) => (
              <StatCard key={i} stat={stat} index={i} />
            ))}

            {/* Wide bottom banner card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="sm:col-span-2 rounded-3xl border border-white/8 bg-gradient-to-r from-blue-600/15 to-indigo-600/10 p-6 flex flex-col sm:flex-row items-center gap-5 backdrop-blur-sm"
              style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-slate-300 text-sm font-medium">
                  Factory Lines: <strong className="text-white">Currently Operational</strong>
                </span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10" />
              <div className="flex items-center gap-2 flex-1 justify-center">
                <TrendingUp size={15} className="text-blue-400" />
                <span className="text-slate-300 text-sm font-medium">
                  Avg. Turnaround: <strong className="text-white">12–21 Days</strong>
                </span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10" />
              <div className="flex items-center gap-2 flex-1 justify-end">
                <Globe size={15} className="text-emerald-400" />
                <span className="text-slate-300 text-sm font-medium">
                  Shipping to <strong className="text-white">30+ Countries</strong>
                </span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}