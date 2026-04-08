'use client';

import React from 'react';

export default function ProductHeader({ product, activeTier }) {
  return (
    <div className="mb-6 border-b border-slate-100 pb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100 uppercase tracking-wider">{product.subCategory || product.category}</span>
        <span className="text-[10px] font-bold text-slate-400 font-mono">SKU: {product.sku}</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-black text-[var(--secondary)] tracking-tight mb-2 leading-tight">{product.name}</h1>
      
      {/* Product Tags */}
      {product.tags && product.tags.trim().length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {product.tags.split(/[,\s]+/).filter(Boolean).map((tag, i) => (
            <span key={i} className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 transition-colors hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 cursor-default">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-slate-500 text-sm leading-relaxed mb-4">{product.description}</p>
      
      <div className="grid grid-cols-4 gap-2 mt-6">
        {product.pricingTiers.map((tier, i) => {
          const isActive = tier.label === activeTier.label;
          return (
            <div key={i} className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-default ${isActive ? 'bg-[var(--secondary)] text-white border-[var(--secondary)] shadow-md transform scale-105 z-10' : 'bg-white border-slate-200 text-slate-400 opacity-70'}`}>
              <span className={`text-[10px] font-bold uppercase ${isActive ? 'text-[var(--primary)]' : 'text-slate-400'}`}>{tier.label}</span>
              <span className="text-lg font-black">${tier.price}</span>
              <span className='text-xs text-slate-400'>{tier.range}</span>
            </div>
          )
        })}
      </div>
    </div>
  );
}