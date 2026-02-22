'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  PenTool, 
  Heart, 
  Star, 
  Eye,
  Check
} from 'lucide-react';

const PRODUCTS = [
  {
    id: 1,
    name: 'Varsity Bomber Jacket',
    category: 'Outerwear',
    price: 18.50,
    retail: 45.00,
    moq: 10,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop",
    colors: ['bg-red-600', 'bg-blue-600', 'bg-black'],
    tag: 'Best Seller'
  },
  {
    id: 2,
    name: 'Heavyweight Fleece Hoodie',
    category: 'Hoodies',
    price: 12.00,
    retail: 35.00,
    moq: 25,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop',
    colors: ['bg-slate-800', 'bg-gray-400', 'bg-emerald-600'],
    tag: 'New Arrival'
  },
  {
    id: 3,
    name: 'Performance Poly Tracksuit',
    category: 'Sportswear',
    price: 22.00,
    retail: 60.00,
    moq: 15,
    rating: 4.7,
    image: 'https://plus.unsplash.com/premium_photo-1689371957831-40f044457743?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8VHJhY2tzdWl0fGVufDB8fDB8fHww',
    colors: ['bg-blue-500', 'bg-black'],
    tag: null
  },
  {
    id: 4,
    name: 'Oversized Cotton Tee',
    category: 'T-Shirts',
    price: 6.50,
    retail: 20.00,
    moq: 50,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1974&auto=format&fit=crop',
    colors: ['bg-black', 'bg-white', 'bg-orange-500'],
    tag: 'Trending'
  }
];

const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">
              Fresh off the Line
            </h2>
            <p className="mt-2 text-slate-500">
              Ready-made stock. Buy samples or customize these base models.
            </p>
          </div>
          <Link href="/shop" className="hidden md:block font-bold text-blue-600 hover:text-blue-700 hover:underline">
            View Full Catalog
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/shop" className="btn btn-outline w-full py-3 rounded-xl border-slate-300 font-bold">
            View Full Catalog
          </Link>
        </div>

      </div>
    </section>
  );
};

// --- Single Product Card Component ---
const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col"
    >
      
      {/* 1. Image Area */}
      <div className="relative aspect-[4/5] bg-slate-100 rounded-t-2xl overflow-hidden">
        
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.tag && (
            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
              {product.tag}
            </span>
          )}
          <span className="bg-white/90 backdrop-blur text-slate-700 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-200">
            MOQ: {product.moq}
          </span>
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur rounded-full text-slate-400 hover:text-red-500 hover:bg-white transition-colors">
          <Heart size={18} />
        </button>

        {/* Image */}
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />

        {/* Quick Actions Overlay (Shows on Hover) */}
        <div className={`absolute inset-x-0 bottom-0 p-4 bg-white/90 backdrop-blur border-t border-slate-100 transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
           <div className="flex gap-2">
             <button className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-slate-800">
               <ShoppingCart size={14} /> Add Sample
             </button>
             <button className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-2.5 rounded-lg text-xs font-bold hover:bg-blue-200">
               <Eye size={14} /> Quick View
             </button>
           </div>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* Category & Rating */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-slate-500 font-medium">{product.category}</span>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-slate-700">{product.rating}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Price Box */}
        <div className="flex items-end gap-2 mb-4">
          <span className="text-lg font-black text-blue-600">${product.price.toFixed(2)}</span>
          <span className="text-xs text-slate-400 line-through mb-1">${product.retail.toFixed(2)}</span>
        </div>

        {/* Color Dots */}
        <div className="flex items-center gap-1 mb-4">
          {product.colors.map((color, idx) => (
             <div key={idx} className={`w-3 h-3 rounded-full border border-slate-200 ${color}`}></div>
          ))}
          <span className="text-xs text-slate-400 ml-1">+2</span>
        </div>

        {/* 3. The "Smart Inquiry" Button (USP) */}
        <Link href={`/smart-inquiry?product=${product.id}`} className="mt-auto">
          <button className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-300 py-2.5 rounded-xl text-slate-600 text-sm font-bold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all group/btn">
            <PenTool size={16} />
            <span className="group-hover/btn:hidden">Customize This Design</span>
            <span className="hidden group-hover/btn:inline">Start Inquiry</span>
          </button>
        </Link>

      </div>
    </motion.div>
  );
};

export default FeaturedProducts;