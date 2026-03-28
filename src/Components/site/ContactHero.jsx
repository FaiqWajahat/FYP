'use client'
import React from 'react'
import { motion } from 'framer-motion'

const ContactHero = () => {
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
            Let’s start your <br />
            <span style={{ color: 'var(--primary)' }}>production run.</span>
          </h1>

          {/* Subtext */}
          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-medium">
            Have questions about the platform? Whether you need a demo of our <strong>AI Tech-Pack builder</strong>, help with <strong>Factory Verification</strong>, or assistance with <strong>Escrow payments</strong>, our team is ready to guide you.
          </p>

        </motion.div>

      </div>

    </section>
  )
}

export default ContactHero