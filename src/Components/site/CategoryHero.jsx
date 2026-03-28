'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Zap, Package } from 'lucide-react';

const CategoryHero = ({ 
  title, 
  description, 
  stats = { count: 0, priceStart: 0, fabric: "Standard" } 
}) => {
  return (
    <div className="relative w-full   overflow-hidden p-4 md:p-3 mb-20">
      
  

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:items-end justify-between">
        
        {/* Left: Text Content */}
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
          

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
              {title}. <span className="text-blue-600">Ready to Ship.</span>
            </h1>
            
            <p className="mt-4 text-lg text-slate-500 leading-relaxed max-w-xl">
              {description}
            </p>
          </motion.div>
        </div>

        {/* Right: Quick Stats Row */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-wrap gap-3"
        >
           <StatBadge icon={<Package size={16}/>} label={`${stats.count} Items`} />
           <StatBadge icon={<Zap size={16}/>} label={`From $${stats.priceStart || '0'}`} />
           <StatBadge icon={<Layers size={16}/>} label={stats.fabric || 'All Specs'} />
        </motion.div>

      </div>
    </div>
  );
};

// Helper for the pill badges
const StatBadge = ({ icon, label }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-bold text-slate-700">
    <span className="text-blue-500">{icon}</span>
    {label}
  </div>
);

export default CategoryHero;