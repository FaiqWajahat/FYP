'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useOrderStore = create(
  persist(
    (set) => ({
      // --- ORDER STATE ---
      orderId: null,      // Generated on client to avoid hydration mismatch
      product: null,       // { name, sku, image, color }
      customization: null, // { enabled, format, formatPrice, logoProps }
      sizing: null,        // { mode, breakdown, totalUnits, size_chart_url }
      pricing: null,       // { unitPrice, subtotal }
      design_assets: [],   // Array of persistent Cloudinary URLs
      sizeChartUrl: null,  // Cloudinary URL of uploaded size chart
      
      // --- PAYMENT STATE ---
      paymentMethod: null,   // { id, name, feePercent, feeFixed }
      paymentDivision: null, // 'full' | 'split'
      
      // --- ACTIONS ---
      setOrderData: (data) => set((state) => ({ ...state, ...data })),
      
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      
      setPaymentDivision: (division) => set({ paymentDivision: division }),
      
      resetOrder: () => set({
        orderId: null,
        product: null,
        customization: null,
        sizing: null,
        pricing: null,
        design_assets: [],
        paymentMethod: null,
        paymentDivision: null,
        sizeChartUrl: null,
      }),
    }),
    {
      name: 'factory-flow-storage', // unique name for localStorage
    }
  )
);
