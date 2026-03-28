'use client';

import React from 'react';
import { ClipboardCheck, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOrderStore } from '@/store/useOrderStore';

export default function OrderSummary({
  product,
  selectedColor,
  isCustomizing,
  selectedFormat,
  sizingMode,
  standardQuantities,
  customRows,
  totalQuantity,
  activeTier,
  unitPrice,
  totalEstimate,
  studioRef,
  logoProps
}) {
  const router = useRouter();
  const setOrderData = useOrderStore((state) => state.setOrderData);

  const handleReview = () => {
    // Capture the custom branding from the canvas if available
    const previewImage = studioRef?.current?.getPreviewImage();

    // Generate a fresh Order ID on the client
    const newOrderId = `REQ-${Math.floor(Math.random() * 9000) + 1000}-FC`;

    setOrderData({
      orderId: newOrderId,
      product: {
        name: product.name,
        sku: product.sku,
        image: previewImage || product.images[0], // Use canvas preview or fallback to base image
        color: selectedColor.name,
      },
      customization: {
        enabled: isCustomizing,
        format: selectedFormat.name,
        formatPrice: selectedFormat.price,
        logoProps: isCustomizing ? logoProps : null,
      },
      sizing: {
        mode: sizingMode,
        breakdown: sizingMode === 'standard' ? standardQuantities : customRows,
        totalUnits: totalQuantity,
      },
      pricing: {
        unitPrice,
        subtotal: parseFloat(totalEstimate),
      }
    });
    router.push('/review');
  };

  return (
    <div className="space-y-4 pt-6 border-t border-slate-100">
      
      {/* Receipt Breakdown */}
      <div className="flex justify-between items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
         <div>
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Estimated Total</p>
            <div className="text-xs text-slate-500 space-y-0.5">
               <p>Total Units: <span className="font-bold text-slate-900">{totalQuantity}</span></p>
               <p>Base Tier: <span className="font-bold text-slate-900">{activeTier?.label} (${activeTier?.price})</span></p>
               {isCustomizing && <p>Branding: <span className="font-bold text-blue-600">+${selectedFormat?.price}</span></p>}
            </div>
         </div>
         <div className="text-right">
            <p className="text-xs text-slate-400 mb-1">Unit Price: <strong>${unitPrice?.toFixed(2)}</strong></p>
            <p className="text-3xl font-black text-slate-900 tracking-tight leading-none">${totalEstimate}</p>
         </div>
      </div>

      <button 
        onClick={handleReview}
        disabled={totalQuantity === 0}
        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <ClipboardCheck size={20} /> 
        Review Order 
        <span className="text-slate-400 text-sm font-normal hidden sm:inline ml-1">| Next Step</span>
        <ArrowRight size={18} className="ml-1 text-slate-400 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* SECONDARY ACTIONS */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* 2. Chat Support (For clearing doubts) */}
        <button className="py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
          <MessageCircle size={18} className="text-slate-500" /> Live Chat
        </button>
        
        {/* 3. Smart Inquiry (For custom/bulk quote generation) */}
        <button className="py-3 bg-blue-50 border-2 border-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-100 transition-all flex items-center justify-center gap-2 shadow-sm">
          <Sparkles size={18} className="text-blue-500" /> Smart Inquiry
        </button>
        
      </div>
    </div>
  );
}