'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Zap, Layers, ArrowUpRight, X, Check } from 'lucide-react'
import SectionHeading from '@/Components/common/SectionHeading'

const MissionSection = () => {
  return (
    <section className="py-24 px-6 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        
       <SectionHeading 
        first={'Why'}
        second={'Factory Flow ?'}
        paragraph={"We identified the three critical 'fail points' in traditional export manufacturing and engineered a digital solution for each."}
       />

        {/* --- THE BENTO GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 h-auto md:h-[600px]">
          
          {/* CARD 1: THE MAIN "CONTROL" CARD (Spans 2 Rows on Mobile, 1 Col on Desktop) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-1 md:row-span-2 bg-white rounded-[2rem] p-8 lg:p-10 shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-xl transition-all duration-500"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Layers size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">The Fragmentation Gap</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 opacity-60">
                   <X size={18} className="text-red-500 shrink-0 mt-1" />
                   <p className="text-sm text-slate-500">Orders scattered across WhatsApp, Email, and Excel.</p>
                </div>
                <div className="w-px h-8 bg-slate-200 ml-2.5 my-1"></div>
                <div className="flex items-start gap-3">
                   <Check size={18} className="text-green-500 shrink-0 mt-1" />
                   <p className="text-sm font-bold text-slate-900">Unified Dashboard for Docs, Chats & Tracking.</p>
                </div>
              </div>
            </div>
            
            {/* Visual Decor */}
            <div className="mt-8 h-32 w-full bg-slate-50 rounded-xl border border-slate-100 overflow-hidden relative">
               <div className="absolute top-4 left-4 right-4 h-full bg-white rounded-t-lg shadow-sm border border-slate-100 p-3">
                  <div className="flex gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full mb-2"></div>
                  <div className="w-2/3 h-2 bg-slate-100 rounded-full"></div>
               </div>
            </div>
          </motion.div>

          {/* CARD 2: TRUST (Wide Card) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2 bg-slate-900 rounded-[2rem] p-8 lg:p-10 shadow-lg flex flex-col md:flex-row items-start md:items-center gap-8 relative overflow-hidden group"
          >
            {/* Hover Gradient Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            
            <div className="relative z-10 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-500/30">
                <ShieldCheck size={14} /> Solved: The Trust Deficit
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">Milestone-Based Escrow</h3>
              <p className="text-slate-400 leading-relaxed">
                We replaced "blind advance payments" with a secure 30-40-30 release model. Funds are held safely until specific production milestones (Cutting, Stitching, QC) are verified visually.
              </p>
            </div>

            {/* Visual Metric */}
            <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 min-w-[200px] text-center">
               <div className="text-4xl font-black text-white mb-1">0%</div>
               <div className="text-xs text-indigo-200 font-bold uppercase tracking-wider">Payment Risk</div>
            </div>
          </motion.div>

          {/* CARD 3: SPEED (Small) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-1 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 group hover:border-indigo-100 transition-colors"
          >
             <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center mb-6">
                <Zap size={24} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Inquiries</h3>
             <p className="text-sm text-slate-500 leading-relaxed">
               AI-Assisted Tech Packs reduce "clarification emails" by 70%.
             </p>
          </motion.div>

          {/* CARD 4: VISIBILITY (Small) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-1 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-[2rem] p-8 shadow-lg text-white group hover:shadow-indigo-200 transition-shadow"
          >
             <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6 backdrop-blur-sm">
                <ArrowUpRight size={24} className="text-white" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Live Tracking</h3>
             <p className="text-sm text-indigo-100 leading-relaxed">
               Real-time updates from the factory floor. No more guessing.
             </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default MissionSection