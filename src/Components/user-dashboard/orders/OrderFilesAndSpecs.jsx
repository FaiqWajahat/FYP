"use client";
import React from 'react';
import { FileText, Download, Scissors, Box, Layers, Link as LinkIcon } from 'lucide-react';

export default function OrderFilesAndSpecs() {
  return (
    <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden h-full flex flex-col font-sans">
      <div className="p-5 border-b border-base-200/60 bg-base-100/30 flex justify-between items-center">
        <h3 className="text-sm font-semibold tracking-wider uppercase flex items-center gap-2 text-base-content/80">
           <Layers size={16} style={{ color: 'var(--primary)' }} /> Order Specs
        </h3>
      </div>
      
      <div className="p-5 flex-grow space-y-5">
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-base-content/50 mb-3 flex items-center gap-1.5">
             <Box size={12} /> Sizing Breakdown
          </h4>
          <div className="grid grid-cols-5 gap-1.5 text-center bg-base-200/50 p-1.5 rounded-lg border border-base-200/60">
            {['XS', 'S', 'M', 'L', 'XL'].map((size, index) => (
               <div key={size} className="flex flex-col p-1.5 bg-base-100 rounded-md shadow-sm border border-base-200/40">
                 <span className="font-bold text-xs">{size}</span>
                 <span className="text-[10px] text-base-content/50 font-mono mt-0.5">{[50, 100, 150, 100, 100][index]}</span>
               </div>
            ))}
          </div>
          <p className="text-right text-[10px] mt-1.5 text-base-content/50 font-mono pr-1 uppercase tracking-widest">Total Units: 500</p>
        </div>

        <div className="divider my-1 opacity-50"></div>
        
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-base-content/50 mb-3 flex items-center gap-1.5">
             <Scissors size={12} /> Material Selection
          </h4>
          <div className="space-y-2">
             <div className="flex justify-between items-center py-2 border-b border-base-200/60 last:border-0">
                 <span className="font-semibold text-xs text-base-content/60 uppercase tracking-wide">Main Fabric</span>
                 <span className="font-bold text-xs text-base-content/90">Cotton</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-base-200/60 last:border-0">
                 <span className="font-semibold text-xs text-base-content/60 uppercase tracking-wide">Weight</span>
                 <span className="font-bold text-xs text-base-content/90">220 GSM</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-base-200/60 last:border-0">
                 <span className="font-semibold text-xs text-base-content/60 uppercase tracking-wide">Print</span>
                 <span className="font-bold text-xs text-base-content/90">Sublimation</span>
             </div>
          </div>
        </div>

        <div className="divider my-1 opacity-50"></div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-base-content/50 mb-3 flex items-center gap-1.5">
             <LinkIcon size={12} /> Attachments
          </h4>
          <div className="space-y-2 relative">
             <a href="#" className="flex justify-between items-center px-3 py-2.5 rounded-lg border border-base-200/60 hover:bg-base-200/50 group transition-colors">
                 <div className="flex items-center gap-3">
                    <FileText size={14} style={{ color: 'var(--primary)' }} />
                    <div>
                       <p className="font-bold text-[11px] text-base-content/80 tracking-wide">TechPack_v2.pdf</p>
                       <p className="text-[9px] text-base-content/40 font-mono mt-0.5 uppercase tracking-widest">2.4 MB</p>
                    </div>
                 </div>
                 <Download size={12} className="text-base-content/30 group-hover:text-primary transition-colors" />
             </a>
             <a href="#" className="flex justify-between items-center px-3 py-2.5 rounded-lg border border-base-200/60 hover:bg-base-200/50 group transition-colors">
                 <div className="flex items-center gap-3">
                    <FileText size={14} className="text-info" />
                    <div>
                       <p className="font-bold text-[11px] text-base-content/80 tracking-wide">Logos.ai</p>
                       <p className="text-[9px] text-base-content/40 font-mono mt-0.5 uppercase tracking-widest">8.1 MB</p>
                    </div>
                 </div>
                 <Download size={12} className="text-base-content/30 group-hover:text-primary transition-colors" />
             </a>
          </div>
        </div>
      </div>
    </div>
  );
}
