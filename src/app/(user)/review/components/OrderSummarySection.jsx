'use client';

import React from 'react';
import { Package } from 'lucide-react';

export default function OrderSummarySection({ orderData }) {
  if (!orderData || !orderData.product) return null;

  const { product, customization, sizing, pricing } = orderData;

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Package size={20} /></div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Your Order</h2>
          <p className="text-xs text-slate-500 mt-0.5">Review your configured order below.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-24 h-28 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="font-bold text-slate-900 leading-snug text-base">{product.name}</p>
          <p className="text-xs text-slate-500 font-mono mt-1">SKU: {product.sku}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded">
              Color: {product.color}
            </span>
            {customization.enabled && (
              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded border border-blue-100">
                {customization.format}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Branding & Logo Details */}
      {customization.enabled && (
        <div className="mt-5 pt-5 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Branding Pipeline</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-[10px] font-black text-blue-600 uppercase">
                {customization.format.slice(0, 3)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{customization.format}</p>
                <p className="text-[10px] text-slate-500">Premium Manufacturing</p>
              </div>
            </div>
            
            <div className="flex -space-x-2 overflow-hidden items-center">
              {(customization.logoProps || []).map((logo, idx) => (
                <div key={idx} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-slate-100 border border-slate-200 overflow-hidden">
                   <img src={logo.src} alt="logo" className="w-full h-full object-contain" />
                </div>
              ))}
              {(customization.logoProps || []).length > 0 && (
                <span className="pl-4 text-[10px] font-bold text-slate-400">
                  + {(customization.logoProps || []).length} Branding Assets
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Size Breakdown */}
      <div className="mt-5 pt-5 border-t border-slate-100">
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Size Breakdown ({sizing.mode})</p>
          <p className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
            {sizing.totalUnits} Units
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizing.mode === 'standard' ? (
            Object.entries(sizing.breakdown).map(([size, qty]) => (
              <div key={size} className="flex items-center border border-slate-200 rounded-md overflow-hidden text-xs shadow-sm">
                <span className="px-2.5 py-1.5 bg-slate-50 font-bold text-slate-700 border-r border-slate-200">{size}</span>
                <span className="px-2.5 py-1.5 bg-white font-black text-slate-900">{qty}</span>
              </div>
            ))
          ) : (
            sizing.breakdown.map((item) => (
              <div key={item.id} className="flex items-center border border-slate-200 rounded-md overflow-hidden text-xs shadow-sm">
                <span className="px-2.5 py-1.5 bg-slate-50 font-bold text-slate-700 border-r border-slate-200">{item.name}</span>
                <span className="px-2.5 py-1.5 bg-white font-black text-slate-900">{item.qty}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="mt-5 pt-5 border-t border-slate-100 space-y-2.5">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Production ({sizing.totalUnits} units × ${pricing.unitPrice})</span>
          <span className="font-semibold">${pricing.subtotal.toFixed(2)}</span>
        </div>
      </div>
    </section>
  );
}
