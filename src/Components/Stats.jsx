'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Users, 
  Shirt, 
  Trophy, 
  TrendingUp 
} from 'lucide-react';

const STATS = [
  {
    id: 1,
    label: 'Monthly Capacity',
    value: '50,000+',
    subtext: 'Pieces / Month',
    icon: <Shirt size={24} className="text-blue-400" />,
  },
  {
    id: 2,
    label: 'Global Reach',
    value: '30+',
    subtext: 'Countries Exported',
    icon: <Globe size={24} className="text-green-400" />,
  },
  {
    id: 3,
    label: 'Happy Clients',
    value: '200+',
    subtext: 'Brands & Wholesalers',
    icon: <Users size={24} className="text-yellow-400" />,
  },
  {
    id: 4,
    label: 'Industry Experience',
    value: '15',
    subtext: 'Years in Sialkot',
    icon: <Trophy size={24} className="text-purple-400" />,
  }
];

const Stats = () => {
  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden">
      
      {/* Background World Map / Pattern (Optional) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {/* Simple dotted grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-900 via-transparent to-slate-900"></div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header (Optional) */}
        <div className="text-center mb-16">
          <span className="text-blue-500 font-bold tracking-widest uppercase text-xs">
            Industrial Scale
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-2">
            Built for High-Volume Production
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors group"
            >
              {/* Icon Top Right */}
              <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                {stat.icon}
              </div>

              {/* Number Value */}
              <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                {stat.value}
              </div>

              {/* Label */}
              <h3 className="text-lg font-bold text-slate-200 mb-1">
                {stat.label}
              </h3>

              {/* Subtext */}
              <p className="text-sm text-slate-400 font-medium">
                {stat.subtext}
              </p>

              {/* Bottom Line Accent */}
              <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl ${
                index === 0 ? 'bg-blue-500' :
                index === 1 ? 'bg-green-500' :
                index === 2 ? 'bg-yellow-500' :
                'bg-purple-500'
              }`}></div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-6 text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Factory Lines: <strong>Operational</strong></span>
          </div>
          <div className="hidden md:block w-1 h-1 rounded-full bg-slate-700"></div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-500" />
            <span>Avg. Production Time: <strong>12 Days</strong></span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Stats;