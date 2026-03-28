"use client";
import React, { useState, useRef } from 'react';
import {
  ArrowLeft, X, Check, Package, Shirt, Palette, Ruler, Tag,
  Send, Info, ImagePlus, Building2, Upload, Sparkles
} from 'lucide-react';

// ─── DATA ─────────────────────────────────────────────────────────────────────

const COLOURS = [
  { name: 'White',       hex: '#FFFFFF', ring: true },
  { name: 'Off White',   hex: '#F5F0E8', ring: true },
  { name: 'Light Grey',  hex: '#D1D5DB' },
  { name: 'Charcoal',    hex: '#4B5563' },
  { name: 'Black',       hex: '#111827' },
  { name: 'Navy',        hex: '#1E3A5F' },
  { name: 'Royal Blue',  hex: '#1D4ED8' },
  { name: 'Sky Blue',    hex: '#38BDF8' },
  { name: 'Teal',        hex: '#0F766E' },
  { name: 'Forest Green',hex: '#15803D' },
  { name: 'Olive',       hex: '#65A30D' },
  { name: 'Burgundy',    hex: '#9F1239' },
  { name: 'Red',         hex: '#DC2626' },
  { name: 'Orange',      hex: '#EA580C' },
  { name: 'Amber',       hex: '#D97706' },
  { name: 'Sand',        hex: '#D4A76A' },
  { name: 'Purple',      hex: '#7C3AED' },
  { name: 'Pink',        hex: '#DB2777' },
  { name: 'Lavender',    hex: '#A78BFA' },
  { name: 'Coral',       hex: '#FB7185' },
];

const FABRICS = [
  { id: 'cotton-220',  label: '100% Cotton',        gsm: '220 GSM' },
  { id: 'cotton-180',  label: 'Cotton Lightweight', gsm: '180 GSM' },
  { id: 'fleece-320',  label: 'Fleece',             gsm: '320 GSM' },
  { id: 'fleece-380',  label: 'Heavy Fleece',       gsm: '380 GSM' },
  { id: 'poly-cotton', label: 'Poly-Cotton 60/40',  gsm: '260 GSM' },
  { id: 'polyester',   label: '100% Polyester',     gsm: '180 GSM' },
  { id: 'french-terry',label: 'French Terry',       gsm: '300 GSM' },
  { id: 'pique',       label: 'Piqué Knit',         gsm: '200 GSM' },
];

const FITS = ['Regular', 'Slim', 'Oversized', 'Relaxed', 'Cropped'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

const PLACEMENTS = [
  { id: 'front-left',   label: 'Front Left Chest' },
  { id: 'front-center', label: 'Front Center' },
  { id: 'back-center',  label: 'Back Center' },
  { id: 'left-sleeve',  label: 'Left Sleeve' },
  { id: 'right-sleeve', label: 'Right Sleeve' },
  { id: 'collar',       label: 'Collar / Nape' },
];

const TECHNIQUES = [
  { id: 'embroidery', label: 'Embroidery' },
  { id: 'dtf',        label: 'DTF Print' },
  { id: 'screen',     label: 'Screen Print' },
  { id: 'sublimation',label: 'Sublimation' },
  { id: 'woven',      label: 'Woven Patch' },
  { id: 'heat',       label: 'Heat Transfer' },
];

const PACKAGING = [
  { id: 'poly-bag',    label: 'Poly Bag' },
  { id: 'branded-box', label: 'Branded Box' },
  { id: 'hanger',      label: 'Hanger Pack' },
  { id: 'kraft-box',   label: 'Kraft Box' },
  { id: 'bulk',        label: 'Bulk / No Pack' },
];

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────

const Label = ({ children, required }) => (
  <p className="text-xs font-bold text-base-content/50 uppercase tracking-widest mb-2.5">
    {children}{required && <span className="text-error ml-0.5 normal-case">*</span>}
  </p>
);

const Swatch = ({ colour, selected, onClick }) => (
  <button
    onClick={() => onClick(colour)}
    title={colour.name}
    style={{ backgroundColor: colour.hex }}
    className={`w-7 h-7 rounded-full flex-shrink-0 transition-all duration-150 focus:outline-none ${
      colour.ring ? 'ring-1 ring-base-300' : ''
    } ${selected
        ? 'ring-[3px] ring-primary ring-offset-2 scale-110 shadow-md'
        : 'hover:scale-110 hover:ring-2 hover:ring-offset-1 hover:ring-base-400'
      }`}
  />
);

const Chip = ({ label, selected, onClick, small }) => (
  <button
    onClick={onClick}
    className={`${small ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5'} font-medium rounded-lg border transition-all ${
      selected
        ? 'border-primary bg-primary text-white shadow-sm'
        : 'border-base-300 text-base-content/60 hover:border-primary/40 hover:bg-base-100'
    }`}
  >
    {label}
  </button>
);

const UploadZone = ({ label, sub, value, onChange, accept }) => {
  const ref = useRef(null);
  return (
    <div>
      <button type="button" onClick={() => ref.current?.click()}
        className={`w-full border-2 border-dashed rounded-xl transition-all group ${
          value ? 'border-primary/40 bg-primary/5 py-3 px-4' : 'border-base-300 hover:border-primary/50 hover:bg-base-50 py-4 px-4'
        }`}>
        {value ? (
          <div className="flex items-center gap-2">
            <Check size={14} className="text-primary flex-shrink-0" />
            <span className="text-sm font-medium text-primary truncate flex-1">{value.name}</span>
            <button type="button" onClick={e => { e.stopPropagation(); onChange(null); }}
              className="text-base-content/30 hover:text-error flex-shrink-0"><X size={13} /></button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-base-content/40 group-hover:text-primary/60 transition-colors">
            <Upload size={20} />
            <p className="text-sm font-semibold">{label}</p>
            <p className="text-xs">{sub}</p>
          </div>
        )}
      </button>
      <input ref={ref} type="file" accept={accept} className="hidden"
        onChange={e => onChange(e.target.files?.[0] || null)} />
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ProductConfigurator({ category, config, setConfig, onBack, onSubmit }) {
  const update = (key, val) => setConfig(p => ({ ...p, [key]: val }));
  const updateSize = (size, qty) =>
    setConfig(p => ({ ...p, sizes: { ...p.sizes, [size]: Math.max(0, parseInt(qty) || 0) } }));

  const togglePlacement = pid => {
    const next = config.logoPlacements.includes(pid)
      ? config.logoPlacements.filter(p => p !== pid)
      : [...config.logoPlacements, pid];
    update('logoPlacements', next);
  };

  const totalPieces = Object.values(config.sizes).reduce((a, b) => a + b, 0);
  const canSubmit = config.baseColor && config.fabric && config.fit && totalPieces >= 1;

  const summaryFields = [
    config.baseColor  && { label: 'Base',     value: config.baseColor.name,  dot: config.baseColor.hex },
    config.ribColor   && { label: 'Rib',      value: config.ribColor.name,   dot: config.ribColor.hex },
    config.fabric     && { label: 'Fabric',   value: FABRICS.find(f => f.id === config.fabric)?.label },
    config.fit        && { label: 'Fit',      value: config.fit },
    config.printTechnique && { label: 'Print', value: TECHNIQUES.find(t => t.id === config.printTechnique)?.label },
    config.packaging  && { label: 'Pack',     value: PACKAGING.find(p => p.id === config.packaging)?.label },
    totalPieces > 0   && { label: 'Total',    value: `${totalPieces.toLocaleString()} pcs`, primary: true },
  ].filter(Boolean);

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-8">

      {/* ── Top bar ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack}
          className="flex items-center gap-2 text-sm text-base-content/50 hover:text-base-content transition-colors font-medium">
          <ArrowLeft size={16} /> Change Category
        </button>
        <div className="flex items-center gap-3 text-sm text-base-content/40">
          <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-base-200">
            <img src={category.configuratorImage} alt={category.name} className="w-full h-full object-cover" />
          </div>
          <span className="font-semibold text-base-content">{category.name}</span>
          <span>—</span>
          <span>Configure your order</span>
        </div>
        {/* Required indicator */}
        <p className="text-xs text-base-content/30"><span className="text-error">*</span> Required</p>
      </div>

      {/* ── Main: Left | Image | Right ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px_1fr] gap-5 items-start">

        {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Colors card */}
          <div className="bg-base-100 border border-base-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Palette size={14} className="text-primary" />
              </div>
              <h3 className="text-sm font-bold text-base-content">Colors & Style</h3>
            </div>

            <div className="space-y-5">
              {/* Base */}
              <div>
                <Label required>Base Colour</Label>
                <div className="flex flex-wrap gap-2">
                  {COLOURS.map(c => (
                    <Swatch key={c.name} colour={c}
                      selected={config.baseColor?.name === c.name}
                      onClick={() => update('baseColor', config.baseColor?.name === c.name ? null : c)}
                    />
                  ))}
                </div>
                {config.baseColor && (
                  <div className="inline-flex items-center gap-2 bg-base-200 rounded-lg px-3 py-1 mt-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: config.baseColor.hex }} />
                    <span className="text-xs font-semibold">{config.baseColor.name}</span>
                    <button onClick={() => update('baseColor', null)} className="text-base-content/30 hover:text-error"><X size={10} /></button>
                  </div>
                )}
              </div>

              {/* Rib */}
              <div>
                <Label>Rib / Cuff Colour</Label>
                <div className="flex flex-wrap gap-2">
                  {COLOURS.map(c => (
                    <Swatch key={c.name} colour={c}
                      selected={config.ribColor?.name === c.name}
                      onClick={() => update('ribColor', config.ribColor?.name === c.name ? null : c)}
                    />
                  ))}
                </div>
                {config.ribColor && (
                  <div className="inline-flex items-center gap-2 bg-base-200 rounded-lg px-3 py-1 mt-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: config.ribColor.hex }} />
                    <span className="text-xs font-semibold">{config.ribColor.name}</span>
                    <button onClick={() => update('ribColor', null)} className="text-base-content/30 hover:text-error"><X size={10} /></button>
                  </div>
                )}
              </div>

              {/* Zipper */}
              {category.hasZipper && (
                <div>
                  <Label>Zipper Style</Label>
                  <div className="flex flex-wrap gap-2">
                    {['No Zipper', 'Full Zip', 'Half Zip', 'Quarter Zip'].map(opt => (
                      <Chip key={opt} label={opt} small
                        selected={config.zipperType === opt}
                        onClick={() => update('zipperType', config.zipperType === opt ? '' : opt)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fabric card */}
          <div className="bg-base-100 border border-base-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shirt size={14} className="text-primary" />
              </div>
              <h3 className="text-sm font-bold text-base-content">Fabric & Fit</h3>
            </div>

            <div className="space-y-5">
              <div>
                <Label required>Fabric Type</Label>
                <div className="space-y-1.5">
                  {FABRICS.map(f => (
                    <button key={f.id}
                      onClick={() => update('fabric', config.fabric === f.id ? '' : f.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
                        config.fabric === f.id
                          ? 'border-primary bg-primary/5 text-primary font-semibold'
                          : 'border-base-200 text-base-content/65 hover:border-base-300 hover:bg-base-50'
                      }`}
                    >
                      <span>{f.label}</span>
                      <span className={`text-xs ${config.fabric === f.id ? 'text-primary/60' : 'text-base-content/30'}`}>{f.gsm}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label required>Fit</Label>
                <div className="flex flex-wrap gap-2">
                  {FITS.map(f => (
                    <Chip key={f} label={f} selected={config.fit === f}
                      onClick={() => update('fit', config.fit === f ? '' : f)} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CENTER: Product Image ───────────────────────────────── */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-4">

          {/* Live image */}
          <div className="relative rounded-2xl overflow-hidden border border-base-200 shadow-md bg-base-200 aspect-[3/4]">
            {/* Colour overlay */}
            {config.baseColor && config.baseColor.hex !== '#FFFFFF' && config.baseColor.hex !== '#F5F0E8' && (
              <div className="absolute inset-0 z-10 pointer-events-none transition-all duration-700"
                style={{ backgroundColor: config.baseColor.hex, mixBlendMode: 'multiply', opacity: 0.38 }} />
            )}
            {/* Rib hint */}
            {config.ribColor && (
              <div className="absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none transition-all duration-500"
                style={{ background: `linear-gradient(to top, ${config.ribColor.hex}99, transparent)` }} />
            )}

            <img src={category.configuratorImage} alt={category.name}
              className="w-full h-full object-cover object-top" />

            {/* Top status pill */}
            {config.logoPlacements.length > 0 && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
                <div className="bg-white/95 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  {config.logoPlacements.length} placement{config.logoPlacements.length > 1 ? 's' : ''} selected
                </div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/50 to-transparent">
              <p className="text-white font-bold text-lg">{category.name}</p>
              <p className="text-white/50 text-xs">Live colour preview</p>
            </div>
          </div>

          {/* Colour dots */}
          {(config.baseColor || config.ribColor) && (
            <div className="bg-base-100 border border-base-200 rounded-xl px-4 py-3 flex items-center gap-4">
              {[
                { c: config.baseColor, l: 'Base', sz: 'w-9 h-9' },
                { c: config.ribColor,  l: 'Rib',  sz: 'w-7 h-7' },
              ].filter(x => x.c).map(({ c, l, sz }) => (
                <div key={l} className="flex flex-col items-center gap-1.5">
                  <div className={`${sz} rounded-full ring-2 ring-offset-1 ring-base-200`}
                    style={{ backgroundColor: c.hex }} />
                  <span className="text-[10px] text-base-content/40 font-medium">{l}</span>
                </div>
              ))}
            </div>
          )}

          {/* Validation hint */}
          {!canSubmit && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-xs text-amber-700 font-medium flex items-start gap-2">
                <Info size={13} className="flex-shrink-0 mt-0.5" />
                <span>{[
                  !config.baseColor && 'Pick a base colour',
                  !config.fabric && 'Choose fabric',
                  !config.fit && 'Choose fit',
                  totalPieces < 1 && 'Add at least 1 piece',
                ].filter(Boolean).join(' · ')}</span>
              </p>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Sizes card */}
          <div className="bg-base-100 border border-base-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Ruler size={14} className="text-primary" />
              </div>
              <h3 className="text-sm font-bold text-base-content">Sizes & Quantity</h3>
            </div>

            <Label required>Size Run</Label>
            <div className="space-y-2">
              {SIZES.map(size => (
                <div key={size}
                  className={`flex items-center gap-3 px-3.5 py-2 rounded-xl border transition-all ${
                    config.sizes[size] > 0 ? 'border-primary/30 bg-primary/5' : 'border-base-200'
                  }`}>
                  <span className="text-sm font-bold text-base-content/40 w-8 flex-shrink-0">{size}</span>
                  <button
                    onClick={() => updateSize(size, (config.sizes[size] || 0) - 1)}
                    className="w-7 h-7 rounded-lg bg-base-200 hover:bg-base-300 text-base-content/60 flex items-center justify-center font-bold transition-colors flex-shrink-0 text-base"
                  >−</button>
                  <span className={`flex-1 text-center text-sm font-bold ${config.sizes[size] > 0 ? 'text-primary' : 'text-base-content/25'}`}>
                    {config.sizes[size] > 0 ? config.sizes[size] : '—'}
                  </span>
                  <button
                    onClick={() => updateSize(size, (config.sizes[size] || 0) + 1)}
                    className="w-7 h-7 rounded-lg bg-base-200 hover:bg-primary/10 hover:text-primary text-base-content/60 flex items-center justify-center font-bold transition-colors flex-shrink-0 text-base"
                  >+</button>
                </div>
              ))}
            </div>

            {totalPieces > 0 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-base-200">
                <span className="text-sm text-base-content/50">Total</span>
                <span className="text-lg font-extrabold text-primary">{totalPieces.toLocaleString()} pcs</span>
              </div>
            )}

            {/* Size chart upload */}
            <div className="mt-4 pt-4 border-t border-base-200">
              <Label>Upload Size Chart (optional)</Label>
              <UploadZone label="Drop your size chart" sub="PDF, Excel, PNG · Max 10MB"
                accept=".pdf,.xls,.xlsx,.png,.jpg"
                value={config.sizeChartFile} onChange={f => update('sizeChartFile', f)} />
            </div>
          </div>

          {/* Branding card */}
          <div className="bg-base-100 border border-base-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Tag size={14} className="text-primary" />
              </div>
              <h3 className="text-sm font-bold text-base-content">Branding</h3>
              <span className="text-xs text-base-content/30 ml-auto">Optional</span>
            </div>

            <div className="space-y-5">
              {/* Logo upload */}
              <div>
                <Label>Logo File</Label>
                <UploadZone label="Upload logo" sub="SVG, PNG, AI, EPS · Vector preferred"
                  accept=".svg,.png,.ai,.pdf,.eps"
                  value={config.logoFile} onChange={f => update('logoFile', f)} />
              </div>

              {/* Technique */}
              <div>
                <Label>Print Technique</Label>
                <div className="flex flex-wrap gap-2">
                  {TECHNIQUES.map(t => (
                    <Chip key={t.id} label={t.label} small
                      selected={config.printTechnique === t.id}
                      onClick={() => update('printTechnique', config.printTechnique === t.id ? '' : t.id)} />
                  ))}
                </div>
              </div>

              {/* Placement */}
              <div>
                <Label>Logo Placement</Label>
                <div className="space-y-1.5">
                  {PLACEMENTS.map(p => {
                    const sel = config.logoPlacements.includes(p.id);
                    return (
                      <button key={p.id} onClick={() => togglePlacement(p.id)}
                        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm transition-all text-left ${
                          sel ? 'border-primary bg-primary/5 text-primary font-semibold' : 'border-base-200 text-base-content/65 hover:border-base-300 hover:bg-base-50'
                        }`}>
                        <div className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${sel ? 'border-primary bg-primary' : 'border-base-300'}`}>
                          {sel && <Check size={9} className="text-white" />}
                        </div>
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Packaging */}
              <div>
                <Label>Packaging</Label>
                <div className="flex flex-wrap gap-2">
                  {PACKAGING.map(p => (
                    <Chip key={p.id} label={p.label} small
                      selected={config.packaging === p.id}
                      onClick={() => update('packaging', config.packaging === p.id ? '' : p.id)} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM: Contact + Summary + Submit ────────────────────── */}
      <div className="mt-6 bg-base-100 border border-base-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Summary strip */}
        {summaryFields.length > 0 && (
          <div className="px-6 py-4 bg-base-200/50 border-b border-base-200 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-base-content/40 flex-shrink-0 flex items-center gap-1.5">
              <Package size={11} /> Summary
            </span>
            {summaryFields.map(({ label, value, dot, primary }) => (
              <div key={label} className="flex items-center gap-1.5">
                {dot && <span className="w-3 h-3 rounded-full ring-1 ring-base-300 flex-shrink-0" style={{ backgroundColor: dot }} />}
                <span className="text-xs text-base-content/40">{label}:</span>
                <span className={`text-xs font-bold ${primary ? 'text-primary' : 'text-base-content'}`}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Notes + submit */}
        <div className="p-6 flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-xs font-semibold text-base-content/50 mb-1.5 block">
              Additional Notes & Special Requirements
            </label>
            <textarea
              value={config.additionalNotes}
              onChange={e => update('additionalNotes', e.target.value)}
              placeholder="Describe any special requirements — stitching details, hardware, embellishments, reference samples, delivery deadline, target pricing, or anything our production team should know…"
              rows={3}
              className="w-full border border-base-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 bg-base-100 placeholder:text-base-content/25 resize-none transition-all"
            />
          </div>
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className={`flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 self-end ${
              canSubmit
                ? 'bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-base-200 text-base-content/30 cursor-not-allowed'
            }`}
          >
            <Send size={15} />
            Send Inquiry
          </button>
        </div>
      </div>
    </div>
  );
}
