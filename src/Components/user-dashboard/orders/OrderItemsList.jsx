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
export default function OrderItemsList({ order }) {
  if (!order) return null;

  const product = {
    name: order.product_name || order.product?.name || 'Custom Garment',
    sku: order.sku || order.product?.sku || 'N/A',
    image: order.mockup_url || order.product?.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=200&auto=format&fit=crop',
    color: order.customization_data?.colorName || order.customization?.colorName || order.customization?.color || 'Base Color',
    fabric: order.customization_data?.fabricName || order.customization?.fabricName || 'Custom Blend',
  };

  const customization = {
    enabled: !!(order.customization_data?.print_method || order.customization?.branding_format || order.pricing?.brandingAddon > 0),
    format: order.customization_data?.print_method || order.customization?.branding_format || 'Standard Branding',
    formatPrice: order.pricing?.brandingAddon || 0,
  };

  let totalUnits = 0;
  let sizesEntries = [];
  if (order.sizing) {
    if (Array.isArray(order.sizing)) {
      totalUnits = order.sizing.reduce((a, b) => a + (Number(b?.qty) || Number(b) || 0), 0);
      sizesEntries = order.sizing.map(s => [s?.size || s?.label || 'Size', Number(s?.qty) || Number(s) || 0]);
    } else {
      const breakdown = order.sizing.breakdown || order.sizing;
      sizesEntries = Object.entries(breakdown).map(([key, val]) => {
        const qty = typeof val === 'object' ? (val.qty || 0) : val;
        return [key, Number(qty) || 0];
      });
      totalUnits = sizesEntries.reduce((a, b) => a + b[1], 0);
    }
  } else {
    totalUnits = order.pricing?.totalUnits || 0;
    sizesEntries = [['Units', totalUnits]];
  }

  const pricing = {
    tierLabel: order.pricing?.tierLabel || 'Volume',
    baseUnitPrice: order.pricing?.unitPrice || 0,
    subtotal: order.pricing?.subtotal || order.total_amount || 0,
  };

  return (
    <div className="bg-base-100 rounded-3xl shadow-sm border border-base-200 overflow-hidden font-sans">
      {/* Header */}
      <div className="p-6 border-b border-base-200 flex justify-between items-center bg-base-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl border border-base-200 flex items-center justify-center text-[var(--primary)] shadow-sm">
            <Package size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-base-content leading-none">Order Specification</h3>
            <p className="text-[10px] text-base-content/40 mt-1 uppercase tracking-widest font-bold">Product Breakdown & Sizing</p>
          </div>
        </div>
        <div className="px-4 py-1.5 rounded-xl bg-base-200 text-base-content/60 text-[10px] font-black uppercase tracking-widest border border-base-300">
          {totalUnits.toLocaleString()} Total Units
        </div>
      </div>

      <div className="p-8">
        <div className="flex flex-col xl:flex-row gap-10">
          {/* Product Section */}
          <div className="flex-1 flex flex-col sm:flex-row gap-6">
            <div className="w-32 h-40 rounded-2xl overflow-hidden bg-base-200 border border-base-200/60 shadow-inner group shrink-0">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="flex-1 min-w-0 py-2">
              <p className="text-xl font-bold text-base-content tracking-tight">{product.name}</p>
              <p className="text-[11px] font-mono text-base-content/30 mt-1 uppercase tracking-widest">Reference SKU: {product.sku}</p>

              <div className="flex flex-wrap gap-2 mt-6">
                <div className="flex items-center gap-2 px-3 py-1.5  border border-base-200 rounded-xl shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                  <span className="text-[10px] font-bold text-base-content/60 uppercase tracking-tight">Color: {product.color}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5  border border-base-200 rounded-xl shadow-sm">
                  <div className="w-2 h-2 rounded-full border border-base-300 bg-base-50" />
                  <span className="text-[10px] font-bold text-base-content/60 uppercase tracking-tight">{product.fabric}</span>
                </div>
                {customization.enabled && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-xl shadow-sm">
                    <Brush size={12} className="text-[var(--primary)]" />
                    <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-tight">{customization.format}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sizing & Pricing Summary */}
          <div className="w-full xl:w-[400px] space-y-8">
            {/* Size Breakdown */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 mb-4">Dimension Distribution</p>
              <div className="flex flex-wrap gap-2">
                {sizesEntries.map(([size, qty]) => (
                  <div key={size} className="flex items-center  border border-base-200 rounded-2xl overflow-hidden shadow-sm hover:border-[var(--primary)]/30 transition-colors">
                    <span className="pl-4 pr-3 py-2 text-[10px] font-black text-base-content/40 uppercase border-r border-base-100">{size}</span>
                    <span className="pl-3 pr-4 py-2 text-xs font-black text-base-content">{qty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-base-50 border border-base-200 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold text-base-content/40 uppercase tracking-[0.1em]">
                <span>Item Logistics</span>
                <span className="text-[var(--primary)]">{pricing.tierLabel} Tier</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-base-content/60">
                  <span>Base Production</span>
                  <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(pricing.baseUnitPrice)} × {totalUnits}</span>
                </div>
                {customization.enabled && (
                  <div className="flex justify-between text-xs font-bold text-base-content/60">
                    <span>{customization.format} Add-on</span>
                    <span>+ {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(customization.formatPrice)} × {totalUnits}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-base-200 flex justify-between items-end">
                <p className="text-[10px] font-black text-base-content/30 uppercase tracking-widest leading-none mb-1">Subtotal (Garments)</p>
                <p className="text-2xl font-black text-base-content tracking-tighter shadow-sm">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(pricing.subtotal)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
