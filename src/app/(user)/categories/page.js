'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Settings, Package, Scissors, Zap } from 'lucide-react';

import Breadcrumbs from '@/Components/ShopBreadCrumps'; // Fixed import name
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

// ==========================================
// MOCK CATEGORY DATA
// ==========================================
const CATEGORIES = [
  {
    id: 'hoodies',
    title: 'Hoodies & Sweatshirts',
    description: 'Heavyweight fleece, french terry, and custom washes. Boxy and oversized fits available.',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop', // Higher res for featured card
    specs: ['400-500 GSM', 'Pre-shrunk', 'Custom Washes'],
    moq: '20 Pcs',
    href: '/shop/hoodies',
    featured: true // Makes this card span wider in the grid
  },
  {
    id: 'tracksuits',
    title: 'Tracksuits & Sets',
    description: 'Performance tech fabrics, nylon shells, and matching fleece sets for lifestyle wear.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    specs: ['Tech Fleece', 'Nylon', 'Cut & Sew'],
    moq: '30 Pcs',
    href: '/shop/tracksuits'
  },
  {
    id: 'tshirts',
    title: 'T-Shirts & Tops',
    description: 'Premium heavyweight cotton blanks, acid washes, and vintage distressed styles.',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
    specs: ['240-300 GSM', '100% Cotton', 'Vintage Wash'],
    moq: '50 Pcs',
    href: '/shop/t-shirts'
  },
  {
    id: 'jackets',
    title: 'Jackets & Outerwear',
    description: 'Varsity jackets, puffers, and windbreakers with premium embroidery and patching options.',
    image: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=800&auto=format&fit=crop',
    specs: ['Wool/Leather', 'Waterproof', 'Quilted'],
    moq: '15 Pcs',
    href: '/shop/jackets'
  },
  {
    id: 'bottoms',
    title: 'Bottoms & Joggers',
    description: 'Cargo pants, flared sweatpants, and denim designed for the modern streetwear silhouette.',
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=800&auto=format&fit=crop',
    specs: ['French Terry', 'Denim', 'Cargo Tech'],
    moq: '30 Pcs',
    href: '/shop/bottoms'
  },
 
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
};

const breadData = [
  { label: 'Catalog', href: '/shop' },
  { label: 'All Categories', href: '/categories' },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
     

      <main className="flex-1 pt-8 pb-10">
        
        {/* ==========================================
            1. PAGE HEADER
            ========================================== */}
        <div className="container max-w-7xl mx-auto px-4 md:px-8 mb-16">
          <div className="mb-6">
            <Breadcrumbs items={breadData} />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
             
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                Manufacturing <br/>
                <span className="text-blue-600">Categories.</span>
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
                Browse our factory-direct catalog. Choose a base silhouette, upload your tech packs, apply custom branding, and order in bulk directly from the production floor.
              </p>
            </div>

            {/* Quick Stats Blocks (Desktop right-aligned) */}
            <div className="flex flex-col gap-3 lg:min-w-[280px]">
               <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="p-2.5 bg-slate-100 rounded-lg text-slate-600"><Package size={20}/></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">150+ Silhouettes</p>
                    <p className="text-xs text-slate-500">Ready to customize</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600"><Scissors size={20}/></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Cut & Sew Studio</p>
                    <p className="text-xs text-slate-500">Full custom patterns</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            2. CATEGORIES BENTO GRID
            ========================================== */}
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {CATEGORIES.map((category, index) => {
              // The featured card spans 2 columns on desktop
              const isFeatured = category.featured;

              return (
                <motion.div 
                  key={category.id} 
                  variants={itemVariants}
                  className={isFeatured ? "md:col-span-2 lg:col-span-2" : "col-span-1"}
                >
                  <Link href={category.href} className="group block h-full">
                    <div className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden h-full flex flex-col hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-blue-300 transition-all duration-500">
                      
                      {/* IMAGE AREA */}
                      <div className={`relative w-full overflow-hidden bg-slate-100 ${isFeatured ? 'h-72 md:h-80' : 'aspect-[4/3]'}`}>
                        <img 
                          src={category.image} 
                          alt={category.title} 
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        
                        {/* Elegant Dark Gradient on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                           <span className="backdrop-blur-md bg-white/90 text-[10px] font-black px-3 py-1.5 rounded-md shadow-sm border border-white/20 text-slate-900 uppercase tracking-wider">
                             MOQ: {category.moq}
                           </span>
                        </div>
                      </div>

                      {/* CONTENT AREA */}
                      <div className="p-6 md:p-8 flex-1 flex flex-col z-10 bg-white relative">
                        <h2 className={`font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors ${isFeatured ? 'text-3xl' : 'text-2xl'}`}>
                          {category.title}
                        </h2>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1 max-w-xl">
                          {category.description}
                        </p>

                        {/* Specs Tags */}
                        <div className="flex flex-wrap gap-2 mb-8">
                          {category.specs.map((spec, i) => (
                            <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-md text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                              {spec}
                            </span>
                          ))}
                        </div>

                        {/* Bottom Action */}
                        <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                           <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Explore Collection</span>
                           <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                           </div>
                        </div>
                      </div>

                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* ==========================================
            3. BOTTOM CTA (Custom Request)
            ========================================== */}
        <div className="container max-w-7xl mx-auto px-4 md:px-8 mt-24">
           <div className="bg-slate-900 rounded-3xl p-8 md:p-14 text-center flex flex-col items-center relative overflow-hidden shadow-2xl">
              
              {/* Abstract BG pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                 <div className="absolute left-0 top-0 h-[400px] w-[400px] bg-blue-500 rounded-full blur-[120px] opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              
              <div className="relative z-10">
                <div className="inline-flex p-3 bg-blue-500/20 text-blue-400 rounded-2xl mb-6">
                   <Zap size={28} />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-5 tracking-tight">Need a completely custom silhouette?</h2>
                <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
                  Can't find what you're looking for in our standard catalog? Upload your own tech pack and measurements. Our factory can cut, sew, and grade exactly to your brand's specifications.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2">
                    Submit Custom Tech Pack <ArrowRight size={20}/>
                  </button>
                  <button className="px-8 py-4 bg-transparent border border-slate-700 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors active:scale-95">
                    Speak to Production Team
                  </button>
                </div>
              </div>
           </div>
        </div>

      </main>

      
    </div>
  );
}