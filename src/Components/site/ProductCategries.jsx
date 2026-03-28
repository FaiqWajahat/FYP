'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'hoodies',
    title: 'Premium Hoodies',
    subtitle: 'Fleece, Cotton & Poly-Blends',
    count: '50+ GSM Options',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop', // Hoodie Image
    link: '/shop/hoodies',
    size: 'large' // Spans 2 rows
  },
  {
    id: 'jackets',
    title: 'Varsity & Bomber',
    subtitle: 'Leather Sleeves & Wool Body',
    count: 'Custom Embroidery',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop', // Jacket Image
    link: '/shop/jackets',
    size: 'small'
  },
  {
    id: 'tracksuits',
    title: 'Performance Tracksuits',
    subtitle: 'Trinda, Polyester & Taslan',
    count: 'Sublimation Ready',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020&auto=format&fit=crop', // Tracksuit/Model Image
    link: '/shop/tracksuits',
    size: 'small'
  },
  {
    id: 'tshirts',
    title: 'T-Shirts & Tanks',
    subtitle: '100% Cotton & Jersey',
    count: 'Screen Printing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop', // T-Shirt Image
    link: '/shop/t-shirts',
    size: 'wide' // Spans 2 columns
  }
];

const ProductCategories = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Factory Direct Catalog</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">
              Explore Our Production Lines
            </h2>
          </div>
          <Link href="/shop" className="group flex items-center gap-2 text-slate-600 font-semibold hover:text-blue-600 transition-colors">
            View All Categories 
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
          
          {CATEGORIES.map((cat, index) => (
            <Link 
              key={cat.id} 
              href={cat.link}
              className={`relative group overflow-hidden rounded-2xl shadow-sm ${
                cat.size === 'large' ? 'md:col-span-1 md:row-span-2' : 
                cat.size === 'wide' ? 'md:col-span-2 md:row-span-1' : 
                'md:col-span-1 md:row-span-1'
              }`}
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full"
              >
                {/* Background Image */}
                <img 
                  src={cat.image} 
                  alt={cat.title} 
                  className="w-full h-full object-cover"
                />
                
                {/* Dark Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </motion.div>

              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end items-start text-white">
                
                {/* Floating 'Customizable' Badge on Hover */}
                <div className="absolute top-4 right-4 translate-y-[-10px] opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/30">
                    <Sparkles size={12} className="text-yellow-400" /> Customizable
                  </span>
                </div>

                {/* Text Content */}
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1 block">
                    {cat.count}
                  </span>
                  <h3 className="text-2xl font-bold mb-1 group-hover:text-blue-100 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                    {cat.subtitle}
                  </p>
                </div>

                {/* Arrow Icon */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <div className="bg-white text-slate-900 p-2 rounded-full">
                    <ArrowRight size={20} />
                  </div>
                </div>

              </div>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
};

export default ProductCategories;