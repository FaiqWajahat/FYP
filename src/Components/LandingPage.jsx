'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MoveRight, Check } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative w-full bg-white pt-24 pb-20 lg:pt-32 lg:pb-32 font-sans border-b border-slate-100">
      <div className="container max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">
          
          {/* ==============================================================
              LEFT COLUMN: CLEAN COPY & CTA
              ============================================================== */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left pt-8 lg:pt-0"
          >
            {/* Minimalist Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Pixvion Manufacturing
            </div>

            {/* Straightforward, Powerful Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Premium apparel manufacturing. <br className="hidden lg:block" />
              <span className="text-blue-600">Scaled for your brand.</span>
            </h1>

            <p className="text-lg text-slate-500 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Direct-to-factory production. From premium wholesale blanks to full custom cut & sew, we deliver uncompromising quality with zero middlemen.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Link href="/shop" className="w-full sm:w-auto">
                <button className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-base hover:bg-blue-700 transition-colors duration-300 shadow-sm shadow-blue-600/20 active:scale-[0.98]">
                  Explore Catalog
                  <ArrowRight size={18} />
                </button>
              </Link>
              
              <Link href="/custom-production" className="w-full sm:w-auto">
                <button className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-lg font-bold text-base hover:border-slate-300 hover:bg-slate-50 transition-colors duration-300 active:scale-[0.98]">
                  Custom Production
                </button>
              </Link>
            </div>

            {/* Minimalist Trust Metrics */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
               <div className="flex items-center gap-1.5">
                 <Check size={16} className="text-blue-600" /> MOQ 50 Pcs
               </div>
               <div className="flex items-center gap-1.5">
                 <Check size={16} className="text-blue-600" /> 3-4 Week Turnaround
               </div>
               <div className="flex items-center gap-1.5">
                 <Check size={16} className="text-blue-600" /> Global Shipping
               </div>
            </div>
          </motion.div>

          {/* ==============================================================
              RIGHT COLUMN: SINGLE, HIGH-QUALITY IMAGE
              ============================================================== */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex-1 w-full max-w-[600px] lg:max-w-none mx-auto"
          >
            <div className="relative aspect-[4/3] lg:aspect-[4/4] xl:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200">
              {/* Using a clean, professional image of folded premium garments */}
              <img 
                src="https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=1200&auto=format&fit=crop" 
                alt="Pixvion Premium Apparel Manufacturing" 
                className="w-full h-full object-cover object-center"
              />
              
              {/* Very subtle gradient overlay at the bottom so the image doesn't feel completely flat */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;