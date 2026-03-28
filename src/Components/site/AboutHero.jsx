'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

const AboutHero = () => {
  return (
    <section className="relative py-10 w-full flex flex-col items-center justify-center overflow-hidden ">




      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >


          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Reinventing how the <br />
            <span style={{ color: 'var(--primary)' }}>world sources.</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-medium">
              Factory Flow is the first digital ecosystem for <strong>custom bulk apparel</strong>.
              We streamline the entire export lifecycle—integrating
              <span className="text-slate-900"> AI-driven customization</span>,
              <span className="text-slate-900"> live production tracking</span>, and
              <span className="text-slate-900"> secure milestone payments</span> into one seamless platform.
            </p>
          </p>
        </motion.div>

      </div>



    </section>
  )
}

export default AboutHero