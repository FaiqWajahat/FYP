"use client";
import React from 'react';
import { Shirt, Ruler, Palette, FileText, Download } from 'lucide-react';
import Image from 'next/image';

const fmt = (n, c = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency: c }).format(n);

export default function OrderSpecViewer({ order }) {
  if (!order) return null;

  const customization = order.customization_data || {};
  const sizingData = order.sizing_data || {};
  const sizingBreakdown = sizingData.breakdown || sizingData;
  const logos = customization.logoProps || [];

  return (
    <div className="space-y-6 flex flex-col items-center">
      {/* 1. Main Specs Card */}
      <div className="w-full bg-base-100 rounded-xl border border-base-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-base-200/50 border-b border-base-200 flex justify-between items-center">
          <h3 className="text-xs font-black uppercase tracking-widest text-base-content/60 flex items-center gap-2">
            <Shirt size={14} /> Batch Technical Specifications
          </h3>
          <span className="text-[10px] font-mono font-bold bg-base-300 px-2 py-0.5 rounded text-base-content/50 uppercase">
            {order.sku}
          </span>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Customization Details */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Customization</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-base-200 pb-2">
                   <span className="text-xs font-medium text-base-content/60">Base Color</span>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold">{customization.color || 'Default'}</span>
                      <div className="w-4 h-4 rounded-full border border-base-300" style={{ backgroundColor: customization.colorHex || '#eee' }}></div>
                   </div>
                </div>
                <div className="flex items-center justify-between border-b border-base-200 pb-2">
                   <span className="text-xs font-medium text-base-content/60">Logo Slots</span>
                   <span className="text-xs font-black">{logos.length} Locations</span>
                </div>
              </div>
            </div>

            {/* Sizing Distribution */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Sizing Batch</h4>
              <div className="grid grid-cols-3 gap-2">
                 {Object.entries(sizingBreakdown).map(([size, qty]) => {
                   if (typeof qty === 'object') return null;
                   return (
                     <div key={size} className="bg-base-200/50 rounded-lg p-2 text-center border border-base-300">
                        <p className="text-[9px] font-black text-base-content/40 uppercase">{size}</p>
                        <p className="text-xs font-black text-base-content">{qty}</p>
                     </div>
                   );
                 })}
                 {Object.keys(sizingBreakdown).length === 0 && (
                   <div className="col-span-3 py-4 text-center text-[10px] text-base-content/30 italic">No sizing data provided</div>
                 )}
              </div>
            </div>

            {/* Assets */}
            <div className="space-y-4">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Technical Assets</h4>
               <div className="flex flex-col gap-2">
                  <a 
                    href={order.tech_pack_url || '#'} 
                    target="_blank" 
                    className={`btn btn-sm btn-outline rounded-lg flex items-center justify-start gap-4 px-4 ${!order.tech_pack_url && 'btn-disabled opacity-50'}`}
                  >
                    <FileText size={16} />
                    <div className="text-left">
                       <p className="text-[9px] font-black uppercase tracking-tight leading-none">Download</p>
                       <p className="text-[10px]">Technical Pack</p>
                    </div>
                  </a>
                  <a 
                    href={order.mockup_url || '#'} 
                    target="_blank" 
                    className={`btn btn-sm btn-outline rounded-lg flex items-center justify-start gap-4 px-4 ${!order.mockup_url && 'btn-disabled opacity-50'}`}
                  >
                    <Download size={16} />
                    <div className="text-left">
                       <p className="text-[9px] font-black uppercase tracking-tight leading-none">Download</p>
                       <p className="text-[10px]">Physical Mockup</p>
                    </div>
                  </a>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Logo Assets Gallery */}
      {logos.length > 0 && (
        <div className="w-full bg-base-100 rounded-xl border border-base-200 shadow-sm overflow-hidden">
           <div className="p-4 bg-base-200/50 border-b border-base-200">
             <h3 className="text-xs font-black uppercase tracking-widest text-base-content/60">Logo Placements & Files</h3>
           </div>
           <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {logos.map((logo, idx) => (
                <div key={idx} className="bg-base-200/30 rounded-xl border border-base-200 p-4 space-y-4">
                   <div className="aspect-square relative rounded-lg overflow-hidden bg-white border border-base-300">
                      <Image src={logo.src} alt={`Logo ${idx}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-contain p-2" />
                   </div>
                   <div>
                      <h5 className="text-[11px] font-black uppercase tracking-wider text-base-content/80 mb-1">{logo.label || `Logo ${idx + 1}`}</h5>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-medium text-base-content/50">{formatLocation(logo.location)}</span>
                         <a href={logo.src} target="_blank" className="text-[10px] text-primary font-bold hover:underline">Source</a>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}

function formatLocation(loc) {
  if (!loc) return "N/A";
  return loc.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase());
}
