'use client'
import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { PenTool, FileCheck, CreditCard, Factory, ArrowRight, Sparkles } from 'lucide-react'

const services = [
  {
    step: '01',
    title: 'Customization',
    subtitle: 'Smart Tech-Pack Builder',
    description:
      'Use our AI-assisted builder to customize your apparel. Select fabrics, upload design sketches, and define measurements. The system automatically converts your inputs into a professional, industry-standard Tech Pack.',
    icon: PenTool,
    gradient: 'from-indigo-500 to-blue-600',
    glow: 'rgba(99,102,241,0.35)',
    tag: 'Step 1',
    accent: '#6366f1',
  },
  {
    step: '02',
    title: 'Design Finalization',
    subtitle: 'Digital Negotiation & Samples',
    description:
      'Receive quotes from verified factories. Negotiate price and lead time digitally. Request a physical sample — your design is only finalized when you personally approve the sample photos or physical shipment.',
    icon: FileCheck,
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'rgba(59,130,246,0.35)',
    tag: 'Step 2',
    accent: '#3b82f6',
  },
  {
    step: '03',
    title: 'Milestone Payments',
    subtitle: '30 · 40 · 30 Escrow Model',
    description:
      'Your funds stay protected. Pay 30% upfront to begin material sourcing, release 40% at the stitching phase, and unlock the final 30% only after goods pass Quality Control and are cleared for dispatch.',
    icon: CreditCard,
    gradient: 'from-teal-500 to-emerald-500',
    glow: 'rgba(20,184,166,0.35)',
    tag: 'Step 3',
    accent: '#14b8a6',
  },
  {
    step: '04',
    title: 'Live Production',
    subtitle: 'Real-Time Tracking Dashboard',
    description:
      'Monitor your order as it moves through every phase of the factory floor — Cutting, Stitching, QC, and Packing. Get photo evidence at each milestone, eliminating the need for constant follow-ups.',
    icon: Factory,
    gradient: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.35)',
    tag: 'Step 4',
    accent: '#8b5cf6',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.13 },
  }),
}

export default function ServicesSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.6], ['0%', '100%'])

  return (
    <section
      ref={ref}
      className="relative py-28 overflow-hidden bg-slate-950"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .srv-root { font-family: 'DM Sans', sans-serif; }
        .srv-font { font-family: 'Sora', sans-serif; }
        @keyframes srv-pulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        .srv-dot { animation: srv-pulse 3s ease-in-out infinite; }
      `}</style>

      {/* ── Background texture ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="srv-root relative max-w-7xl mx-auto px-6">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
            <Sparkles size={13} className="text-blue-400" />
            <span className="text-[11px] font-black uppercase tracking-widest text-blue-300">
              How It Works
            </span>
          </div>

          <h2 className="srv-font text-4xl md:text-5xl lg:text-[56px] font-extrabold text-white leading-[1.08] tracking-tight mb-5">
            From Concept to{' '}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Doorstep
            </span>
          </h2>

          <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-medium">
            A transparent, digitized workflow giving you complete control — from first sketch to final shipment.
          </p>

          {/* Animated divider */}
          <div className="relative mt-8 h-px max-w-xs mx-auto bg-white/5 overflow-hidden rounded-full">
            <motion.div
              style={{ width: lineWidth }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
            />
          </div>
        </motion.div>

        {/* ── Step connector bar (desktop) ── */}
        <div className="hidden lg:flex items-center justify-center gap-0 mb-10 max-w-5xl mx-auto">
          {services.map((s, i) => (
            <React.Fragment key={i}>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.4 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${s.accent}cc, ${s.accent})` }}
                >
                  <s.icon size={15} className="text-white" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.tag}</span>
              </motion.div>

              {i < services.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35 + i * 0.12, duration: 0.5, ease: 'easeOut' }}
                  className="flex-1 h-px bg-gradient-to-r from-white/10 to-white/5 origin-left mx-2"
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
              className="relative group rounded-3xl border border-white/8 bg-white/[0.04] backdrop-blur-sm overflow-hidden cursor-default"
              style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.06)' }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                style={{ background: `radial-gradient(ellipse at top left, ${service.glow} 0%, transparent 65%)` }}
              />

              {/* Watermark step number */}
              <span
                className="srv-font absolute -bottom-4 -right-2 text-[96px] font-black leading-none select-none pointer-events-none opacity-[0.045] text-white"
              >
                {service.step}
              </span>

              {/* Card content */}
              <div className="relative z-10 p-7 flex flex-col gap-5 h-full">

                {/* Top row: icon + step tag */}
                <div className="flex items-start justify-between">
                  {/* Icon badge */}
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    style={{ boxShadow: `0 8px 24px ${service.glow}` }}
                  >
                    <service.icon size={20} className="text-white" />
                  </div>

                  {/* Step tag */}
                  <span
                    className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border"
                    style={{
                      color: service.accent,
                      borderColor: `${service.accent}40`,
                      backgroundColor: `${service.accent}12`,
                    }}
                  >
                    {service.tag}
                  </span>
                </div>

                {/* Title block */}
                <div>
                  <h3 className="srv-font text-xl font-extrabold text-white mb-1 group-hover:text-blue-300 transition-colors duration-300 leading-tight">
                    {service.title}
                  </h3>
                  <p
                    className="text-[11px] font-black uppercase tracking-widest"
                    style={{ color: service.accent }}
                  >
                    {service.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed font-medium flex-1">
                  {service.description}
                </p>

                {/* Bottom accent line */}
                <div
                  className="h-px w-0 group-hover:w-full transition-all duration-500 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${service.accent}, transparent)` }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom CTA strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <p className="text-slate-400 text-sm font-medium">
            Ready to start your first order?
          </p>
          <a
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/25 hover:shadow-blue-500/35 transition-all group"
          >
            Browse Products
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>

      </div>
    </section>
  )
}