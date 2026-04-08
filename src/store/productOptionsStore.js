import { create } from 'zustand';

export const useProductOptionsStore = create((set) => ({
  fabricOptions: [
    "100% Cotton",
    "Poly-Cotton Blend",
    "French Terry",
    "Fleece",
    "Nylon / Windbreaker",
    "Wool/Leather"
  ],
  gsmWeightCategories: [
    "180-250 (Light)",
    "280-350 (Mid)",
    "400+ (Heavyweight)"
  ],
  presetSizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
  defaultBranding: [
    { id: 'print', name: 'Screen Print', defaultPrice: 1.50 },
    { id: 'embroidery', name: '3D Embroidery', defaultPrice: 3.50 },
    { id: 'dtg', name: 'Direct to Garment', defaultPrice: 2.50 },
    { id: 'patch', name: 'Woven Patch', defaultPrice: 4.00 },
  ],
  industryColors: [
    { name: "Charcoal Black", hex: "#1c1c1e" },
    { name: "Navy Blue", hex: "#1e3a8a" },
    { name: "Heather Grey", hex: "#9ca3af" },
    { name: "Crimson Red", hex: "#991b1b" },
    { name: "Forest Green", hex: "#166534" },
    { name: "Off-White", hex: "#f8fafc" },
    { name: "Royal Blue", hex: "#1d4ed8" },
    { name: "Sand", hex: "#e5e5cb" },
    { name: "Burgundy", hex: "#800020" },
    { name: "Mustard", hex: "#eab308" },
    { name: "Olive Drab", hex: "#4b5320" },
    { name: "Teal", hex: "#0f766e" },
    { name: "Burnt Orange", hex: "#c2410c" },
    { name: "Lavender", hex: "#e9d5ff" },
    { name: "Mint Green", hex: "#a7f3d0" },
    { name: "Carolina Blue", hex: "#7ba1d2" },
    { name: "Peach", hex: "#ffdab9" },
    { name: "Mocha", hex: "#7851a9" }, 
    { name: "Slate", hex: "#475569" },
    { name: "Pure White", hex: "#ffffff" }
  ],
  
  // Future actions to fetch/update these from an API can be added here
  // fetchOptions: async () => { ... }
}));
