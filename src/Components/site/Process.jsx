'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  PenTool, 
  FileText, 
  Settings, 
  Truck, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const STEPS = [
  {
    number: '01',
    title: 'Submit Spec Sheet',
    description: 'Provide your design sketches, material requirements, and target quantity using our smart inquiry form.',
    icon: PenTool,
  },
  {
    number: '02',
    title: 'Review Instant Quote',
    description: 'Get a precise, itemized wholesale price estimate calculated automatically based on raw materials.',
    icon: FileText,
  },
  {
    number: '03',
    title: 'Track Live Production',
    description: 'Monitor your order stages (Cutting, Stitching, and Quality Control) directly from the factory floor.',
    icon: Settings,
  },
  {
    number: '04',
    title: 'Receive Global Delivery',
    description: 'Your quality-certified bulk order is packed and shipped directly from Sialkot to your doorstep.',
    icon: Truck,
  }
];

const Process = () => {
  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute right-0 top-20 w-96 h-96 bg-slate-900 rounded-full blur-3xl" />
        <div className="absolute left-0 bottom-20 w-72 h-72 bg-blue-600 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-6xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">
            How it works
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 mb-4">
            From Concept to Doorstep
          </h2>
          <p className="text-slate-500 font-medium text-base md:text-lg leading-relaxed">
            We have simplified B2B apparel sourcing. Our streamlined platform manages your order from design specifications to final dispatch.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[1px] bg-slate-200/80 -z-10" />

          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-5 text-left"
              >
                {/* Number & Icon Row */}
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Icon size={16} />
                  </div>
                  <span className="text-4xl font-black text-slate-100 font-mono tracking-tight leading-none select-none">
                    {step.number}
                  </span>
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}

        </div>

        {/* Action Button */}
        <div className="mt-16 text-center">
          <Link href="/smart-inquiry">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold text-base shadow-sm transition-colors cursor-pointer"
            >
              Start Your Inquiry <ArrowRight size={16} />
            </motion.button>
          </Link>
          <p className="mt-3 text-sm text-slate-400 flex items-center justify-center gap-1.5 font-medium">
            <CheckCircle2 size={13} className="text-emerald-500" />
            No setup fees or credit card required
          </p>
        </div>

      </div>
    </section>
  );
};

export default Process;