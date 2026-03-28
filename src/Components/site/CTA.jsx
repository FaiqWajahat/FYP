'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const CTA = () => {
  return (
    <section className="relative py-24 bg-white overflow-hidden border-y border-slate-100">
      
      {/* --- BACKGROUND SUBTLETY --- */}
      {/* A very faint dot pattern to give texture without noise */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Headline */}
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
            Ready to streamline <br /> Your {' '}
            <span style={{ color: 'var(--primary)' }}>Imports ?</span>
          </h2>

          {/* Subtext */}
          <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Experience the future of sourcing with Factory Flow. 
            Our platform is designed to simplify your import process, 
            giving you more control, transparency, and efficiency from start to finish.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            
            {/* Primary Button */}
            <button 
              className="group flex items-center justify-center gap-2 px-8 py-4 text-white text-base font-bold rounded-lg transition-all hover:-translate-y-1  w-full sm:w-auto"
              style={{ backgroundColor: 'var(--primary)',  }}
            >
              Get Started
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* Secondary Button */}
            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border border-slate-200 text-base font-bold rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all w-full sm:w-auto">
              Customize Your Order
            </button>

          </div>

          {/* Footer Text */}
          <p className="mt-8 text-sm text-slate-400 font-medium">
            No credit card required jsut click on 'Get Started'.
          </p>

        </motion.div>

      </div>
    </section>
  )
}

export default CTA