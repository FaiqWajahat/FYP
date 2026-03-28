'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Layers, 
  PenTool, 
  Box,
  Factory,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const ShopHero = () => {
  return (
    <section className="relative w-full bg-white  overflow-hidden pt-10 pb-10 ">
      
      {/* 1. Industrial Background (Subtle Tech Grid) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      </div>

      <div className="container flex flex-col items-center  z-10 mx-auto px-4 md:px-8">
        
        {/* System Status / Breadcrumbs */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 text-[10px] md:text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-6"
        >
         <span className="text-slate-900">Factory Flow</span>
          <span className="text-slate-300">/</span>
          <span className="text-blue-600">All Products</span>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-end justify-between">
          
          {/* Value Proposition */}
          <div className="flex-1 max-w-3xl">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl text-center md:text-6xl font-black text-slate-900 tracking-tighter mb-6 ">
                All <span className="text-[var(--primary)]">Products.</span>
              </h1>
              
              <div className=" mb-8">
                <p className="text-lg text-slate-600 text-center leading-relaxed max-w-xl mb-4">
                  Direct access to our ready to ship products. 
                  Browse premium apparel ready for immediate shipment or private labeling.
                </p>
                
                {/* THE 3 BUYING MODES */}
                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                  <ModeBadge 
                    icon={<Package size={16} className="text-blue-600"/>} 
                    title="Buy Samples" 
                    sub="Test quality first"
                  />
                  <ModeBadge 
                    icon={<Layers size={16} className="text-purple-600"/>} 
                    title="Bulk Order" 
                    sub="Wholesale pricing"
                  />
                  <ModeBadge 
                    icon={<PenTool size={16} className="text-orange-600"/>} 
                    title="Customize" 
                    sub="Add your branding"
                  />
                </div>
              </div>
            </motion.div>
          </div>

        

        </div>
      </div>
    </section>
  );
};

// Sub-component for the "3 Ways to Buy" badges
const ModeBadge = ({ icon, title, sub }) => (
  <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all cursor-default">
    <div className="bg-white p-1 rounded-md shadow-sm border border-slate-100">
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-slate-900 leading-none">{title}</p>
      <p className="text-[8px] text-slate-500 font-medium mt-1">{sub}</p>
    </div>
  </div>
);

export default ShopHero;