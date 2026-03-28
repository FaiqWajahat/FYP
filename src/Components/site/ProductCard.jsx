'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, ShoppingBag, ArrowRight, Layers } from 'lucide-react';

const ProductCard = ({ product }) => {
  const categoryParam = product.category ? product.category.toLowerCase() : 'all';
  const skuParam = product.sku || 'default-sku';
  const productUrl = `/categories/${categoryParam}/${skuParam}`;

  // Helper to determine status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'in stock': return 'text-green-700 bg-green-50 border-green-200';
      case 'low stock': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'made to order': return 'text-blue-700 bg-blue-50 border-blue-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-blue-200 transition-all duration-300 flex flex-col h-full"
    >
      <Link href={productUrl} className="flex flex-col h-full w-full">
      {/* ==============================
          1. IMAGE & OVERLAYS
          ============================== */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
        
        {/* Main Image */}
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
        />
        
        {/* Top Badges (Tech Specs) */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          <span className="backdrop-blur-md bg-white/90 text-[10px] font-mono font-bold px-2 py-1 rounded-md border border-slate-200/50 shadow-sm text-slate-700 flex items-center gap-1.5">
            <Layers size={10} className="text-blue-500"/> {product.gsm}
          </span>
        </div>

        

        {/* Hover Overlay Actions */}
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-4">
          
          <button className="w-full max-w-[200px] py-3 bg-white text-slate-900 rounded-lg font-bold text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors shadow-xl flex items-center justify-center gap-2 translate-y-4 group-hover:translate-y-0 duration-300">
            <Sparkles size={16} /> Customize Design
          </button>
          
          <button className="w-full max-w-[200px] py-3 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-black transition-colors shadow-xl flex items-center justify-center gap-2 translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
            <ShoppingBag size={16} /> View Details
          </button>

        </div>
      </div>

      {/* ==============================
          2. DETAILS SECTION
          ============================== */}
      <div className="p-5 flex-1 flex flex-col border-t border-slate-100">
        
        {/* Title & MOQ */}
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <span className="flex-shrink-0 text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
            MOQ: {product.moq}
          </span>
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-end justify-between">
          
          {/* Price Block */}
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Wholesale</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-slate-900">${product.price.toFixed(2)}</span>
              <span className="text-xs text-slate-400 font-medium">/ unit</span>
            </div>
          </div>
          
          {/* Color Swatches */}
          <div className="flex -space-x-2">
            {product.colors.map((color, i) => (
              <div 
                key={i} 
                className={`w-6 h-6 rounded-full border-2 border-white shadow-sm transition-transform hover:scale-110 hover:z-10 relative group/color`}
                style={{ backgroundColor: color }}
              >
                {/* Handle White Colors visibility */}
                {color.toLowerCase() === 'white' && (
                  <div className="absolute inset-0 rounded-full border border-slate-200"></div>
                )}
              </div>
            ))}
            {/* "More Colors" Indicator */}
            <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[8px] font-bold text-slate-500 shadow-sm z-0">
              +
            </div>
          </div>
        </div>
      </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;