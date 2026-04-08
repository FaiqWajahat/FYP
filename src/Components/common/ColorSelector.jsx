'use client';

import React from 'react';

export default function ColorSelector({ colors, selectedColor, onColorSelect }) {
  if (!colors || colors.length === 0) return null;
  const safeSelected = selectedColor || colors[0];

  return (
    <div className="mb-8">
      <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 block">Color <span className='text-[var(--primary)] text-xs'>({safeSelected?.name})</span> </label>
      <div className="flex flex-wrap gap-2">
        {colors.map((color, index) => (
          <button 
            key={color.name} 
            onClick={() => onColorSelect(color, index)} 
            className={`w-10 h-10 rounded-full border shadow-sm transition-all ${safeSelected?.name === color.name ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'border-slate-200 hover:scale-105'}`} 
            style={{ backgroundColor: color.hex }} 
            title={color.name} 
          />
        ))}
      </div>
    </div>
  );
}