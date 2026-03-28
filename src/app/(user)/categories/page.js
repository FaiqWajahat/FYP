'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Package, Scissors } from 'lucide-react';

import Breadcrumbs from '@/Components/site/ShopBreadCrumps';
import CategoryCard from '@/Components/site/CategoryCard';
import CustomRequestCta from '@/Components/site/CustomRequestCta';
import { CATEGORIES } from '@/data/mockCategories';

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
    <div className="flex-1 flex flex-col">
      <div className="flex-1 pb-10">
        
        {/* ==========================================
            1. PAGE HEADER
            ========================================== */}
        <div className="container max-w-7xl mx-auto px-4 md:px-8 mb-16 pt-20">
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
            {CATEGORIES.map((category) => {
              const isFeatured = category.featured;

              return (
                <motion.div 
                  key={category.id} 
                  variants={itemVariants}
                  className={isFeatured ? "md:col-span-2 lg:col-span-2" : "col-span-1"}
                >
                  <CategoryCard category={category} isFeatured={isFeatured} />
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* ==========================================
            3. BOTTOM CTA
            ========================================== */}
        <CustomRequestCta />

      </div>
    </div>
  );
}