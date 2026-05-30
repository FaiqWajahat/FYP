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
  presetSizes: ["XS", "SM", "M", "L", "XL", "2XL", "3XL", "4XL"],
  defaultBranding: [
    { id: 'print', name: 'Screen Print', defaultPrice: 1.50 },
    { id: 'embroidery', name: '3D Embroidery', defaultPrice: 3.50 },
    { id: 'dtg', name: 'Direct to Garment', defaultPrice: 2.50 },
    { id: 'patch', name: 'Woven Patch', defaultPrice: 4.00 },
  ],
  industryColors: [
    // Standard/Classic Colors
    { name: "Charcoal Black", hex: "#1c1c1e" },
    { name: "Pure White", hex: "#ffffff" },
    { name: "Off-White", hex: "#f8fafc" },
    { name: "Navy Blue", hex: "#1e3a8a" },
    { name: "Royal Blue", hex: "#1d4ed8" },
    { name: "Carolina Blue", hex: "#7ba1d2" },
    { name: "Heather Grey", hex: "#9ca3af" },
    { name: "Slate Grey", hex: "#475569" },
    { name: "Crimson Red", hex: "#991b1b" },
    { name: "Burgundy", hex: "#800020" },
    { name: "Forest Green", hex: "#166534" },
    { name: "Olive Drab", hex: "#4b5320" },
    { name: "Teal", hex: "#0f766e" },
    { name: "Mustard", hex: "#eab308" },
    { name: "Burnt Orange", hex: "#c2410c" },
    
    // Earthy Tones
    { name: "Sand / Khaki", hex: "#e5e5cb" },
    { name: "Terracotta", hex: "#e2725b" },
    { name: "Sage Green", hex: "#9caf88" },
    { name: "Taupe", hex: "#b3a394" },
    { name: "Chocolate Brown", hex: "#3d2314" },
    { name: "Rust", hex: "#b7410e" },
    
    // Pastel Tones
    { name: "Lavender", hex: "#e9d5ff" },
    { name: "Mint Green", hex: "#a7f3d0" },
    { name: "Peach", hex: "#ffdab9" },
    { name: "Dusty Rose", hex: "#dcae96" },
    { name: "Lilac", hex: "#c8a2c8" },
    { name: "Pale Yellow", hex: "#fef250" },
    { name: "Ice Blue", hex: "#f0f8ff" },
    
    // Jewel Tones
    { name: "Emerald Green", hex: "#50c878" },
    { name: "Sapphire Blue", hex: "#0f52ba" },
    { name: "Ruby Red", hex: "#e0115f" },
    { name: "Plum", hex: "#8e4585" },
    { name: "Amber Gold", hex: "#ffbf00" },
    { name: "Midnight Blue", hex: "#191970" },
    
    // Tech & Metallic Shades
    { name: "Gunmetal", hex: "#2a3439" },
    { name: "Bronze", hex: "#cd7f32" },
    { name: "Champagne Gold", hex: "#f7e7ce" },
    { name: "Rose Gold", hex: "#b76e79" },
    { name: "Platinum Gray", hex: "#e5e4e2" }
  ],
  
  // Future actions to fetch/update these from an API can be added here
  // fetchOptions: async () => { ... }
}));
