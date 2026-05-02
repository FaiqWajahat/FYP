'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Trash2, Upload, X, Palette, ChevronDown } from 'lucide-react';
import { PRODUCT_CATEGORIES, COLOUR_PALETTE, BRANDING_TECHNIQUES, PLACEMENT_ZONES } from '../inquiry-data';
import { useInquiryStore } from '@/store/useInquiryStore';

const COLOR_GROUP_LABELS = {
  neutral: 'Whites', grey: 'Greys', blue: 'Blues', teal: 'Teals',
  green: 'Greens', red: 'Reds', pink: 'Pinks', yellow: 'Yellows',
  orange: 'Oranges', purple: 'Purples', brown: 'Browns',
};

function ZoneColorPicker({ zone, color, onChange }) {
  const [open, setOpen] = useState(false);
  const groups = [...new Set(COLOUR_PALETTE.map((c) => c.group))];

  const activeColor = color || '#111111';
  const colorObj = COLOUR_PALETTE.find(c => c.hex.toLowerCase() === activeColor.toLowerCase());
  const colorName = colorObj ? colorObj.name : 'Custom';

  return (
    <div className="rounded-xl border border-slate-100 bg-white overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 hover:bg-slate-50 transition-colors"
      >
        <span className="text-sm text-slate-700 font-medium">{zone}</span>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: activeColor }} />
          <span className="text-xs font-medium text-slate-700">
            {colorName} <span className="font-mono text-slate-400 text-[10px]">({activeColor.toUpperCase()})</span>
          </span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Expandable swatch palette */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1 border-t border-slate-50 space-y-2">
              {groups.map((group) => {
                const cols = COLOUR_PALETTE.filter((c) => c.group === group);
                return (
                  <div key={group}>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{COLOR_GROUP_LABELS[group] || group}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {cols.map((c) => (
                        <button
                          key={c.hex}
                          onClick={() => { onChange(c.hex); setOpen(false); }}
                          title={c.name}
                          className={`w-6 h-6 rounded-full transition-all hover:scale-110 ${
                            color === c.hex ? 'ring-2 ring-blue-500 ring-offset-1 scale-110' : ''
                          }`}
                          style={{
                            backgroundColor: c.hex,
                            border: ['#FFFFFF','#FFFAFA','#FFFFF0','#FFFDD0','#F5F0E8','#EAE5DC'].includes(c.hex)
                              ? '1px solid #e2e8f0' : 'none',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
              {/* Custom color picker */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-50">
                <input type="color" value={color || '#111111'}
                  onChange={(e) => { onChange(e.target.value); setOpen(false); }}
                  className="w-7 h-7 rounded-md cursor-pointer border border-slate-200 bg-transparent" />
                <span className="text-[10px] text-slate-400">Custom HEX / PMS</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ArtworkPlacementCard({ placement, index, onUpdate, onRemove }) {
  const fileRef = useRef(null);
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onUpdate({ fileName: file.name, fileData: ev.target.result });
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 rounded-xl border border-slate-200 bg-white space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-800">Placement #{index + 1}</span>
        <button onClick={onRemove} className="text-slate-400 hover:text-red-500 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>

      {/* Zone */}
      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1 block">Print Zone</label>
        <select
          value={placement.zone || ''}
          onChange={(e) => onUpdate({ zone: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 bg-white outline-none focus:border-blue-400"
        >
          <option value="">Select zone...</option>
          {PLACEMENT_ZONES.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
      </div>

      {/* Technique */}
      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1 block">Branding Technique</label>
        <select
          value={placement.technique || ''}
          onChange={(e) => onUpdate({ technique: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 bg-white outline-none focus:border-blue-400"
        >
          <option value="">Select technique...</option>
          {BRANDING_TECHNIQUES.map((t) => (
            <option key={t.id} value={t.id}>{t.name} — {t.desc}</option>
          ))}
        </select>
      </div>

      {/* File */}
      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1 block">Artwork File</label>
        {placement.fileName ? (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200">
            <Check size={13} className="text-emerald-500" />
            <span className="text-xs text-emerald-700 truncate flex-1">{placement.fileName}</span>
            <button onClick={() => onUpdate({ fileName: null })} className="text-slate-400 hover:text-red-500"><X size={12} /></button>
          </div>
        ) : (
          <label className="flex items-center gap-2 p-2.5 rounded-lg border border-dashed border-slate-200 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all">
            <Upload size={14} className="text-slate-400" />
            <span className="text-xs text-slate-500">Upload artwork file</span>
            <input ref={fileRef} type="file" accept="image/*,.svg,.ai,.pdf,.eps" className="hidden" onChange={handleFile} />
          </label>
        )}
      </div>

      {/* Notes */}
      <input
        type="text"
        value={placement.notes || ''}
        onChange={(e) => onUpdate({ notes: e.target.value })}
        placeholder="Placement notes (size, position, etc.)"
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 outline-none focus:border-blue-400 placeholder:text-slate-300"
      />
    </motion.div>
  );
}

export default function Step4_ColorArtwork() {
  const {
    categoryId, colorType, setColorType,
    zoneColors, setZoneColor, customPantone, setCustomPantone,
    artworkPlacements, addArtworkPlacement, removeArtworkPlacement, updateArtworkPlacement,
    artworkNotes, setArtworkNotes,
  } = useInquiryStore();

  const category = PRODUCT_CATEGORIES.find((c) => c.id === categoryId);
  const zones = category?.colorZones || ['Body'];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>

      {/* Color Type */}
      <h3 className="text-lg font-bold text-slate-900 mb-1">Color Specification</h3>
      <p className="text-sm text-slate-500 mb-4">Specify how colors should be applied across the garment zones.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {[
          { id: 'solid', label: 'Solid Color', desc: 'Same color everywhere' },
          { id: 'two-tone', label: 'Two-Tone', desc: 'Body & sleeves differ' },
          { id: 'multi-zone', label: 'Multi-Zone', desc: 'Each zone custom' },
          { id: 'sublimation', label: 'All-Over Print', desc: 'Full sublimation' },
        ].map((ct) => (
          <button
            key={ct.id}
            onClick={() => setColorType(ct.id)}
            className={`p-3 rounded-xl text-left transition-all border ${
              colorType === ct.id
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            <p className={`text-sm font-semibold ${colorType === ct.id ? 'text-blue-700' : 'text-slate-700'}`}>{ct.label}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{ct.desc}</p>
          </button>
        ))}
      </div>

      {/* Zone Colors */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          <Palette size={14} className="inline mr-1.5 text-blue-500" />
          Color Zones — {category?.name || 'Garment'}
        </label>
        <div className="space-y-2">
          {(colorType === 'solid' ? zones.slice(0, 1) :
            colorType === 'two-tone' ? zones.slice(0, 2) :
            zones
          ).map((zone) => (
            <ZoneColorPicker
              key={zone}
              zone={zone}
              color={zoneColors[zone] || '#111111'}
              onChange={(hex) => setZoneColor(zone, hex)}
            />
          ))}
        </div>
      </div>

      {/* Pantone */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Pantone / Custom Color Reference</label>
        <input
          type="text"
          value={customPantone}
          onChange={(e) => setCustomPantone(e.target.value)}
          placeholder="E.g., Pantone 19-4052 TCX (Classic Blue), or custom HEX codes..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
        />
      </div>

      {/* ─── ARTWORK PLACEMENTS ──────────────────────────── */}
      <div className="border-t border-slate-100 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Artwork & Print Placements</h3>
            <p className="text-sm text-slate-500">Add each print location with its technique and artwork file.</p>
          </div>
          <button
            onClick={() => addArtworkPlacement({ zone: '', technique: '', fileName: null, notes: '' })}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
          >
            <Plus size={13} /> Add Placement
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {artworkPlacements.map((p, i) => (
              <ArtworkPlacementCard
                key={i}
                index={i}
                placement={p}
                onUpdate={(data) => updateArtworkPlacement(i, data)}
                onRemove={() => removeArtworkPlacement(i)}
              />
            ))}
          </AnimatePresence>
          {artworkPlacements.length === 0 && (
            <div className="py-10 text-center rounded-xl border-2 border-dashed border-slate-100">
              <p className="text-sm text-slate-400">No placements added yet. Click "Add Placement" above.</p>
            </div>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-500 mb-1">General Artwork Notes</label>
          <textarea
            rows={2}
            value={artworkNotes}
            onChange={(e) => setArtworkNotes(e.target.value)}
            placeholder="Any additional notes about artwork, color matching, or print quality expectations..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:border-blue-400 transition-all placeholder:text-slate-300 resize-none"
          />
        </div>
      </div>
    </motion.div>
  );
}
