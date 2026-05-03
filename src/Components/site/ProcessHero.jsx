'use client'
import React from 'react'
import { motion } from 'framer-motion'

const ProcessHero = () => {
  return (
    <section className="relative py-20 w-full flex flex-col items-center justify-center overflow-hidden">
      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
            How We Build <br />
            <span style={{ color: 'var(--primary)' }}>Great Apparel.</span>
          </h1>

          {/* Subtext */}
          <div className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-medium">
            From the initial tech pack to the final retail-ready product, Factory Flow operates a seamless, 
            <span className="text-slate-900"> quality-obsessed manufacturing pipeline </span> 
            designed for <span className="text-slate-900">modern brands</span>.
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ProcessHero
