"use client";
import React, { useState } from 'react';
import { ArrowRight, Sparkles, Star, Search, MessageSquare } from 'lucide-react';

export default function CategorySelector({ categories, onSelect }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [search, setSearch] = useState('');
  const [customProduct, setCustomProduct] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4">
          <Sparkles size={12} />
          Smart Inquiry Wizard
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-base-content tracking-tight mb-3">
          What would you like to manufacture?
        </h1>
        <p className="text-base-content/50 text-sm max-w-lg mx-auto leading-relaxed mb-6">
          Select a garment or product category to start configuring your custom order. We'll guide you through every detail.
        </p>

        {/* Search */}
        <div className="relative max-w-sm mx-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-base-300 rounded-xl bg-base-100 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-base-content/30"
          />
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filtered.map((category) => {
          const isHovered = hoveredId === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onSelect(category)}
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative rounded-2xl overflow-hidden border-2 border-base-200 hover:border-primary/60 bg-base-100 shadow-sm hover:shadow-xl transition-all duration-300 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {/* Badge */}
              {category.badge && (
                <div className="absolute top-3 left-3 z-20">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    category.badge === 'Most Popular'
                      ? 'bg-primary text-white'
                      : category.badge === 'Trending'
                      ? 'bg-rose-500 text-white'
                      : 'bg-warning text-warning-content'
                  }`}>
                    {category.badge === 'Most Popular' && <Star size={7} />}
                    {category.badge}
                  </span>
                </div>
              )}

              {/* Image */}
              <div className="relative h-36 overflow-hidden bg-base-200">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-300" />
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="bg-white/90 backdrop-blur-sm text-primary font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    Select <ArrowRight size={11} />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="font-bold text-base-content text-xs mb-1 group-hover:text-primary transition-colors leading-snug">
                  {category.name}
                </h3>
                <p className="text-[10px] text-base-content/45 leading-snug line-clamp-2">
                  {category.description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
          );
        })}

        {/* Custom Product Card */}
        <button
          onClick={() => setShowCustomInput(true)}
          className="group relative rounded-2xl overflow-hidden border-2 border-dashed border-base-300 hover:border-primary/50 bg-base-100/50 hover:bg-primary/5 shadow-sm hover:shadow-xl transition-all duration-300 text-left cursor-pointer focus:outline-none min-h-[180px] flex flex-col items-center justify-center gap-2 p-4"
        >
          <div className="w-10 h-10 rounded-full bg-base-200 group-hover:bg-primary/10 flex items-center justify-center transition-all">
            <MessageSquare size={18} className="text-base-content/30 group-hover:text-primary transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-base-content/50 group-hover:text-primary transition-colors">Other Product</p>
            <p className="text-[10px] text-base-content/30 mt-0.5">Tell us what you need</p>
          </div>
        </button>
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-base-content/30 text-sm">No categories found for "{search}"</p>
          <button onClick={() => setSearch('')} className="text-primary text-xs underline mt-2">Clear search</button>
        </div>
      )}

      {/* Custom product input */}
      {showCustomInput && (
        <div className="mt-8 max-w-lg mx-auto bg-base-100 border border-base-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-base-content mb-3 flex items-center gap-2">
            <MessageSquare size={14} className="text-primary" />
            Describe Your Custom Product
          </h3>
          <textarea
            value={customProduct}
            onChange={(e) => setCustomProduct(e.target.value)}
            placeholder="Describe the product you want to manufacture — type, style, materials, intended use, etc."
            rows={3}
            className="w-full border border-base-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 bg-base-100 transition-all placeholder:text-base-content/25 resize-none"
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setShowCustomInput(false)}
              className="btn btn-ghost btn-xs"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (customProduct.trim()) {
                  onSelect({
                    id: 'custom',
                    name: 'Custom Product',
                    description: customProduct,
                    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80',
                    configuratorImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
                    badge: null,
                    hasZipper: false,
                    hasHood: false,
                    isCustom: true,
                  });
                }
              }}
              disabled={!customProduct.trim()}
              className="btn btn-primary btn-xs gap-1.5"
            >
              Continue <ArrowRight size={11} />
            </button>
          </div>
        </div>
      )}

      {/* Footer note */}
      <div className="mt-8 text-center">
        <p className="text-xs text-base-content/30">
          {filtered.length} product categories available · All orders include free digital mockup
        </p>
      </div>
    </div>
  );
}
