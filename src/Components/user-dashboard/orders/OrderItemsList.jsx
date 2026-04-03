"use client";
import React from 'react';
import { Package, Brush } from 'lucide-react';

/**
 * OrderItemsList
 * 
 * In this project's model, an order is ONE product configured with:
 *  - A product (name, SKU, image, color)
 *  - A sizing breakdown (standard sizes with quantities, or custom sizes)
 *  - Optional branding customization (format + addon price)
 *  - A pricing tier based on total volume
 */
const MOCK_ORDER = {
  product: {
    name: 'Heavyweight Cotton Fleece Hoodie',
    sku: 'FCT-HOOD-400',
    image: 'https://plus.unsplash.com/premium_photo-1690034979146-59a98168f27e?q=80&w=387&auto=format&fit=crop',
    color: 'Navy',
    fabric: '400 GSM Cotton Fleece',
    description: 'Premium heavyweight hoodie. Factory direct.',
  },
  customization: {
    enabled: true,
    format: 'Screen Print',
    formatPrice: 1.50,
  },
  sizing: {
    mode: 'standard',
    totalUnits: 500,
    breakdown: { 'XS': 50, 'S': 75, 'M': 150, 'L': 150, 'XL': 50, '2XL': 25 },
  },
  pricing: {
    tierLabel: 'Volume',
    tierRange: '501+',
    baseUnitPrice: 15.00,
    brandingAddon: 1.50,
    unitPrice: 16.50,
    subtotal: 8250.00,
  },
};

export default function OrderItemsList({ order = MOCK_ORDER }) {
  const { product, customization, sizing, pricing } = order;
  const sizes = sizing.mode === 'standard'
    ? Object.entries(sizing.breakdown)
    : sizing.breakdown.map(row => [row.name, row.qty]);

  return (
    <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden font-sans">
      {/* Header */}
      <div className="p-5 border-b border-base-200/60 flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-base-content/80">
          <Package size={15} style={{ color: 'var(--primary)' }} />
          Order Details
        </h3>
        <span className="text-[10px] font-mono text-base-content/40 uppercase tracking-widest">
          {sizing.totalUnits.toLocaleString()} Total Units
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Product Row */}
        <div className="flex gap-4">
          <div className="w-20 h-24 rounded-xl overflow-hidden bg-base-200 border border-base-200/60 shrink-0">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-base-content leading-snug">{product.name}</p>
            <p className="text-[11px] font-mono text-base-content/40 mt-0.5">SKU: {product.sku}</p>
            <div className="flex flex-wrap gap-2 mt-2.5">
              <span className="px-2.5 py-1 bg-base-200/60 text-base-content/70 text-[10px] font-bold uppercase rounded-md border border-base-200">
                Color: {product.color}
              </span>
              <span className="px-2.5 py-1 bg-base-200/60 text-base-content/70 text-[10px] font-bold uppercase rounded-md border border-base-200">
                {product.fabric}
              </span>
              {customization.enabled && (
                <span className="px-2.5 py-1 bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[10px] font-bold uppercase rounded-md border"
                  style={{ color: 'var(--primary)', borderColor: 'color-mix(in srgb, var(--primary) 25%, transparent)' }}>
                  <Brush size={10} className="inline mr-1" />
                  {customization.format}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Size Breakdown */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 mb-2.5">
            Size Breakdown ({sizing.mode === 'standard' ? 'Standard Sizes' : 'Custom Sizes'})
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map(([size, qty]) => (
              <div key={size} className="flex items-center border border-base-200/80 rounded-lg overflow-hidden text-xs shadow-sm">
                <span className="px-2.5 py-1.5 bg-base-200/60 font-bold text-base-content/70 border-r border-base-200/80">{size}</span>
                <span className="px-2.5 py-1.5 bg-base-100 font-black text-base-content">{qty}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] font-mono text-base-content/40 mt-2">
            Total: {sizing.totalUnits.toLocaleString()} units
          </p>
        </div>

        {/* Pricing Breakdown */}
        <div className="border-t border-base-200/50 pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-base-content/60">
            <span className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-base-200/60 rounded text-[10px] font-bold uppercase text-base-content/50">
                {pricing.tierLabel} Tier
              </span>
              {sizing.totalUnits.toLocaleString()} units × ${pricing.baseUnitPrice.toFixed(2)}
            </span>
            <span className="font-semibold text-base-content">${(sizing.totalUnits * pricing.baseUnitPrice).toFixed(2)}</span>
          </div>
          {customization.enabled && (
            <div className="flex justify-between text-base-content/60">
              <span>{customization.format} branding × {sizing.totalUnits.toLocaleString()} units</span>
              <span className="font-semibold text-base-content">+${(sizing.totalUnits * customization.formatPrice).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-base-200/50 font-bold text-sm text-base-content">
            <span>Production Subtotal</span>
            <span style={{ color: 'var(--primary)' }}>${pricing.subtotal.toFixed(2)}</span>
          </div>
          <p className="text-[10px] text-base-content/35 italic">
            Shipping calculated separately after production completion.
          </p>
        </div>
      </div>
    </div>
  );
}
