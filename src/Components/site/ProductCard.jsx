'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, ShoppingBag, ArrowRight, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/AuthContext';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const router = useRouter();
  const { user } = useAuth();
  const categoryParam = product.category ? product.category.toLowerCase().replace(/\s+/g, '-') : 'all';
  const skuParam = product.sku || 'default-sku';
  const productUrl = `/categories/${categoryParam}/${skuParam}`;

  const handleCustomizeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Authenticating: Please log in to enter the Digital Visualizer.");
      router.push(`/login?returnTo=${encodeURIComponent(productUrl)}`);
      return;
    }
    const imageUrl = product.images?.[0] || '';
    const query = new URLSearchParams({
      category: product.category || 'Apparel',
      subCategory: product.subCategory || '',
      imageUrl: imageUrl,
      productName: product.name || 'Custom Product'
    }).toString();
    
    router.push(`/smart-inquiry?${query}`);
  };

  // Helper to parse product colors
  const colorsList = Array.isArray(product.colors)
    ? product.colors.map(colorObj => typeof colorObj === 'string' ? colorObj : (colorObj.hex || 'transparent'))
    : (product.colors || "").split(",").map(cStr => {
        const trimmed = cStr.trim();
        return trimmed.includes(":") ? trimmed.split(":")[1] : trimmed;
      }).filter(Boolean);

  const colorsToShow = colorsList.slice(0, 3);
  const hasMoreColors = colorsList.length > 3;
  const moreColorsCount = colorsList.length - 3;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative bg-white rounded-[24px] border border-slate-100/80 overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_32px_60px_rgba(15,23,42,0.08)] hover:border-slate-200/60 transition-all duration-500 flex flex-col h-full"
    >
      <Link href={productUrl} className="flex flex-col h-full w-full">
        {/* IMAGE AREA */}
        <div className="relative aspect-[3/4] overflow-hidden bg-white p-4 transition-all duration-500 border-b border-slate-100/50">
          
          {/* Main Image */}
          <img 
            src={product.images?.[0] || 'https://placehold.co/600x800?text=No+Image'} 
            alt={product.name} 
            className="w-full h-full object-contain transition-transform duration-750 ease-out group-hover:scale-104" 
          />
          
          {/* GSM Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="backdrop-blur-md bg-white/80 text-[10px] font-black px-2.5 py-1.5 rounded-lg border border-slate-200/50 shadow-sm text-slate-800 flex items-center gap-1.5 uppercase tracking-widest">
              <Layers size={10} className="text-blue-600"/> {product.gsm || product.gsmWeight || '300'} GSM
            </span>
          </div>

          {/* Hover Action Drawer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
            <div className="backdrop-blur-md bg-white/70 border border-white/40 p-2.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex flex-col gap-2">
              <button 
                onClick={handleCustomizeClick}
                className="w-full py-2.5 bg-slate-950 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-blue-600 transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 duration-200"
              >
                <Sparkles size={13} className="text-amber-400 fill-amber-400 animate-pulse" /> Customize Blank
              </button>
            </div>
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Category & Fabric Info */}
            <div className="mb-1.5">
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                {product.category || 'Apparel'} {product.fabric ? `• ${product.fabric}` : ''}
              </p>
            </div>
            
            {/* Product Name */}
            <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-1 d-font mb-2">
              {product.name}
            </h3>
          </div>
          
          <div className="pt-4 border-t border-slate-100/60 flex items-end justify-between mt-auto">
            {/* Price Block */}
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Wholesale Price</p>
              <div className="flex items-baseline">
                <span className="text-xl font-black text-slate-900 leading-none">
                  ${(Number(product.pricingTiers?.[0]?.price) || Number(product.price) || 12.50).toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 font-medium ml-0.5">/unit</span>
              </div>
            </div>
            
            {/* Right details: MOQ and color circles */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/50">
                MOQ: {product.moq || '50 Pcs'}
              </span>
              
              {/* Color circles */}
              <div className="flex -space-x-1.5 items-center">
                {colorsToShow.map((hex, i) => {
                  const cleanHex = hex.startsWith('#') ? hex : `#${hex}`;
                  return (
                    <div 
                      key={i} 
                      className="w-5 h-5 rounded-full border-2 border-white shadow-sm transition-transform hover:scale-125 hover:z-10 relative"
                      style={{ backgroundColor: cleanHex }}
                      title={cleanHex}
                    >
                      {cleanHex.toLowerCase() === '#ffffff' && (
                        <div className="absolute inset-0 rounded-full border border-slate-200"></div>
                      )}
                    </div>
                  );
                })}
                {hasMoreColors && (
                  <div className="w-5 h-5 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[8px] font-bold text-slate-500 shadow-sm z-0">
                    +{moreColorsCount}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;