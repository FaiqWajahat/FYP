"use client";
import React from 'react';
import { FileText, Download, Scissors, Box, Layers, Link as LinkIcon, Palette } from 'lucide-react';

const SIZES = [
  { label: 'XS', qty: 50,  max: 150 },
  { label: 'S',  qty: 100, max: 150 },
  { label: 'M',  qty: 150, max: 150 },
  { label: 'L',  qty: 100, max: 150 },
  { label: 'XL', qty: 100, max: 150 },
];

const TOTAL_UNITS = SIZES.reduce((s, v) => s + v.qty, 0);

const MATERIALS = [
  { label: 'Main Fabric', value: 'Cotton Blend', swatch: '#e5e7eb' },
  { label: 'Weight',      value: '220 GSM',      swatch: null },
  { label: 'Print Type',  value: 'Sublimation',  swatch: null },
  { label: 'Color Base',  value: 'Arctic White',  swatch: '#f8fafc' },
];

const FILES = [
  { name: 'TechPack_v2.pdf', size: '2.4 MB', color: 'text-red-400', ext: 'PDF' },
  { name: 'Logos_Final.ai',  size: '8.1 MB', color: 'text-orange-400', ext: 'AI' },
  { name: 'Mockup_3D.png',   size: '3.7 MB', color: 'text-blue-400', ext: 'PNG' },
];

export default function OrderFilesAndSpecs() {
  return (
    <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden flex flex-col font-sans">
      {/* Header */}
      <div className="p-5 border-b border-base-200/60 flex justify-between items-center">
        <h3 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2 text-base-content/80">
          <Layers size={15} style={{ color: 'var(--primary)' }} />
          Order Specs
        </h3>
        <span className="text-[10px] font-mono text-base-content/40 uppercase tracking-widest">
          {TOTAL_UNITS} Total Units
        </span>
      </div>

      <div className="p-5 space-y-5 flex-grow">

        {/* Size Breakdown — Bar Chart */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 mb-3 flex items-center gap-1.5">
            <Box size={11} /> Sizing Breakdown
          </h4>
          <div className="space-y-2">
            {SIZES.map((size) => {
              const pct = Math.round((size.qty / size.max) * 100);
              return (
                <div key={size.label} className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-base-content/70 w-6 shrink-0 text-right">{size.label}</span>
                  <div className="flex-1 bg-base-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: 'linear-gradient(90deg, var(--primary), color-mix(in srgb, var(--primary) 60%, #a855f7))',
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-base-content/50 w-10 text-right shrink-0">{size.qty} pcs</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="divider my-1 opacity-40" />

        {/* Material Selection */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 mb-3 flex items-center gap-1.5">
            <Scissors size={11} /> Material Selection
          </h4>
          <div className="space-y-1.5">
            {MATERIALS.map((mat) => (
              <div key={mat.label} className="flex justify-between items-center py-1.5 border-b border-base-200/40 last:border-0">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-base-content/50">{mat.label}</span>
                <div className="flex items-center gap-2">
                  {mat.swatch && (
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-base-300 shadow-sm"
                      style={{ backgroundColor: mat.swatch }}
                    />
                  )}
                  <span className="text-[11px] font-bold text-base-content/80">{mat.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="divider my-1 opacity-40" />

        {/* Attachments */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 mb-3 flex items-center gap-1.5">
            <LinkIcon size={11} /> Attachments
          </h4>
          <div className="space-y-2">
            {FILES.map((file) => (
              <a
                key={file.name}
                href="#"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-base-200/60 hover:bg-base-200/50 group transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0 flex flex-col items-center justify-center w-8 h-8 rounded-lg bg-base-200/60 border border-base-200">
                    <FileText size={12} className={file.color} />
                    <span className={`text-[7px] font-black uppercase ${file.color} leading-none mt-0.5`}>{file.ext}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[11px] text-base-content/80 tracking-wide truncate">{file.name}</p>
                    <p className="text-[9px] text-base-content/40 font-mono mt-0.5 uppercase tracking-widest">{file.size}</p>
                  </div>
                </div>
                <Download size={13} className="text-base-content/25 group-hover:text-[var(--primary)] transition-colors shrink-0 ml-2" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
