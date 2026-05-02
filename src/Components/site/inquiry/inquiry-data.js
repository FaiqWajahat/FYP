// ─── PRODUCT CATEGORIES ──────────────────────────────────────────────────────
export const PRODUCT_CATEGORIES = [
  {
    id: 'hoodie',
    name: 'Hoodie',
    description: 'Heavyweight Fleece Pullover / Zip-Up',
    image: '/quote-hoodie.jpg',
    defaultFabric: 'fleece',
    defaultGsm: 380,
    construction: [
      { id: 'hoodStyle', label: 'Hood Style', options: ['Pullover Hood', 'Full Zip Hood', 'Quarter Zip', 'Half Zip', 'Funnel Neck Hood'] },
      { id: 'hoodLining', label: 'Hood Lining', options: ['Self Fabric', 'Contrast Color', 'Sherpa Lined', 'Mesh Lined', 'None'] },
      { id: 'drawstring', label: 'Drawstring Type', options: ['Flat Cotton', 'Round Cotton', 'Shoelace Style', 'Metal Tip', 'No Drawstring'] },
      { id: 'pocket', label: 'Pocket Style', options: ['Kangaroo Pocket', 'Split Pockets', 'Side Seam Pockets', 'Zippered Pockets', 'No Pocket'] },
      { id: 'cuffStyle', label: 'Cuff Style', options: ['1x1 Rib Knit', '2x2 Rib Knit', 'Lycra Rib', 'Raw Edge', 'Thumbhole Cuff'] },
      { id: 'cuffWidth', label: 'Cuff Rib Width', options: ['2 inch', '2.5 inch', '3 inch', '3.5 inch', '4 inch'] },
      { id: 'hemStyle', label: 'Hem Style', options: ['1x1 Rib Band', '2x2 Rib Band', 'Lycra Rib Band', 'Raw Hem', 'Elastic Hem', 'Drawstring Hem'] },
      { id: 'hemWidth', label: 'Hem Rib Width', options: ['2 inch', '2.5 inch', '3 inch', '4 inch', '5 inch'] },
      { id: 'sleeveStyle', label: 'Sleeve Style', options: ['Set-In Sleeve', 'Raglan Sleeve', 'Drop Shoulder', 'Saddle Shoulder'] },
      { id: 'neckRib', label: 'Neck Rib', options: ['Matching Rib', 'Contrast Rib', 'Binding Tape', 'Raw Neck'] },
    ],
    colorZones: ['Body', 'Sleeves', 'Hood Outer', 'Hood Inner', 'Cuff Rib', 'Hem Rib', 'Drawstring', 'Zipper'],
  },
  {
    id: 'tshirt',
    name: 'T-Shirt',
    description: 'Premium Cotton / Blend Tee',
    image: '/quote-tshirt.jpg',
    defaultFabric: 'cotton-100',
    defaultGsm: 220,
    construction: [
      { id: 'neckStyle', label: 'Neck Style', options: ['Crew Neck', 'V-Neck', 'Scoop Neck', 'Henley', 'Mock Neck', 'Raw Neck'] },
      { id: 'neckFinish', label: 'Neck Finish', options: ['Rib Collar', 'Binding Tape', 'Self Fabric Fold', 'Raw Edge', 'Cover Stitch'] },
      { id: 'sleeveLength', label: 'Sleeve Length', options: ['Short Sleeve', '3/4 Sleeve', 'Long Sleeve', 'Sleeveless', 'Cap Sleeve', 'Rolled Sleeve'] },
      { id: 'sleeveCuff', label: 'Sleeve Cuff', options: ['Hemmed', 'Rib Cuff', 'Raw Edge', 'Folded Cuff'] },
      { id: 'hemStyle', label: 'Hem Style', options: ['Straight Hem', 'Curved Hem', 'Raw Hem', 'Split Hem', 'Drop Tail'] },
      { id: 'fit', label: 'Fit', options: ['Regular', 'Slim Fit', 'Oversized', 'Boxy', 'Relaxed', 'Muscle Fit'] },
      { id: 'pocket', label: 'Chest Pocket', options: ['No Pocket', 'Patch Pocket', 'Welt Pocket'] },
      { id: 'sideSeam', label: 'Side Seam', options: ['Standard Seam', 'Tubular (No Side Seam)', 'Side Vent'] },
    ],
    colorZones: ['Body', 'Sleeves', 'Neck Rib', 'Pocket'],
  },
  {
    id: 'varsity',
    name: 'Varsity Jacket',
    description: 'Wool Body & Leather / Satin Sleeves',
    image: '/quote-varistyjacket.png',
    defaultFabric: 'wool-blend',
    defaultGsm: 400,
    construction: [
      { id: 'bodyFabric', label: 'Body Material', options: ['Melton Wool', 'Poly-Wool Blend', 'Cotton Fleece', 'Nylon'] },
      { id: 'sleeveFabric', label: 'Sleeve Material', options: ['Genuine Leather', 'PU Leather (Faux)', 'Satin', 'Same as Body', 'Nylon'] },
      { id: 'closure', label: 'Closure Type', options: ['Snap Buttons', 'Full Zip', 'Snap + Zip Combo', 'Toggle Buttons'] },
      { id: 'snapStyle', label: 'Snap/Button Style', options: ['Metal Snaps', 'Covered Snaps', 'Horn Buttons', 'Custom Logo Snaps'] },
      { id: 'collar', label: 'Collar Style', options: ['Rib Knit Collar', 'Stand-Up Collar', 'Hooded', 'Shirt Collar'] },
      { id: 'lining', label: 'Lining', options: ['Quilted Lining', 'Satin Lining', 'Fleece Lining', 'Mesh Lining', 'No Lining'] },
      { id: 'pocket', label: 'Pocket Style', options: ['Welt Pockets', 'Patch Pockets', 'Hand Warmer Pockets', 'Inside Pockets'] },
      { id: 'striping', label: 'Rib Striping', options: ['Single Stripe', 'Double Stripe', 'Triple Stripe', 'No Stripe', 'Custom Pattern'] },
      { id: 'cuffRib', label: 'Cuff Rib', options: ['1x1 Rib', '2x2 Rib', 'Striped Rib', 'Elastic Cuff'] },
      { id: 'hemRib', label: 'Hem Band', options: ['1x1 Rib', '2x2 Rib', 'Striped Rib', 'Elastic Band'] },
    ],
    colorZones: ['Body', 'Sleeves', 'Collar Rib', 'Cuff Rib', 'Hem Rib', 'Rib Stripes', 'Snap Buttons', 'Lining'],
  },
  {
    id: 'polo',
    name: 'Polo Shirt',
    description: 'Premium Pique / Jersey Polo',
    image: '/quote-poloshirt.png',
    defaultFabric: 'pique-cotton',
    defaultGsm: 220,
    construction: [
      { id: 'collarStyle', label: 'Collar Style', options: ['Classic Polo Collar', 'Mandarin Collar', 'Button-Down Collar', 'Johnny Collar', 'Tipped Collar'] },
      { id: 'placket', label: 'Placket Style', options: ['2-Button Placket', '3-Button Placket', 'Hidden Placket', 'Zip Placket', 'No Placket (Johnny)'] },
      { id: 'buttonStyle', label: 'Button Type', options: ['Plastic Buttons', 'Pearl Buttons', 'Metal Buttons', 'Rubber Buttons', 'Custom Logo Buttons'] },
      { id: 'sleeveStyle', label: 'Sleeve Style', options: ['Short Sleeve', 'Long Sleeve', '3/4 Sleeve'] },
      { id: 'sleeveTip', label: 'Sleeve Tip', options: ['Plain Hem', 'Tipped Stripe', 'Rib Cuff', 'Contrast Trim'] },
      { id: 'sideVent', label: 'Side Vent', options: ['No Vent', 'Side Slits', 'Reinforced Gusset'] },
      { id: 'hemStyle', label: 'Hem Style', options: ['Straight Hem', 'Tennis Tail', 'Curved Hem'] },
      { id: 'pocket', label: 'Chest Pocket', options: ['No Pocket', 'Patch Pocket', 'Welt Pocket'] },
    ],
    colorZones: ['Body', 'Sleeves', 'Collar', 'Collar Tip', 'Placket', 'Sleeve Tip', 'Pocket'],
  },
  {
    id: 'joggers',
    name: 'Joggers / Sweatpants',
    description: 'Premium Fleece / Terry Bottoms',
    image: '/quote-joggers.webp',
    defaultFabric: 'fleece',
    defaultGsm: 350,
    construction: [
      { id: 'waistband', label: 'Waistband', options: ['Elastic Covered', 'Ribbed Waistband', 'Flat Front / Elastic Back', 'Drawstring Only'] },
      { id: 'drawstring', label: 'Drawstring', options: ['Flat Cotton', 'Round Cord', 'Metal Tips', 'Rubber Tips', 'Hidden Inside', 'No Drawstring'] },
      { id: 'pockets', label: 'Front Pockets', options: ['Side Seam Pockets', 'Slant Pockets', 'Zippered Pockets', 'Welt Pockets', 'No Front Pockets'] },
      { id: 'backPockets', label: 'Back Pockets', options: ['One Right Pocket', 'Two Pockets', 'Zippered Back Pocket', 'Flap Pocket', 'No Back Pocket'] },
      { id: 'legFit', label: 'Leg Fit', options: ['Slim Tapered', 'Regular Straight', 'Relaxed Fit', 'Baggy/Oversized', 'Flared'] },
      { id: 'ankleFinish', label: 'Ankle Finish', options: ['Elastic Cuff', 'Ribbed Cuff', 'Open Hem', 'Zipper Ankle', 'Bungee Toggle'] }
    ],
    colorZones: ['Body', 'Waistband', 'Ankle Cuffs', 'Drawstring', 'Pocket Lining'],
  },
  // {
  //   id: 'crewneck',
  //   name: 'Crewneck Sweatshirt',
  //   description: 'Classic Pullover Sweatshirt',
  //   image: 'https://images.unsplash.com/photo-1578587018452-892bace94f12?auto=format&fit=crop&q=80&w=800',
  //   defaultFabric: 'french-terry',
  //   defaultGsm: 320,
  //   construction: [
  //     { id: 'neckStyle', label: 'Neck Style', options: ['Standard Crew', 'V-Notch Crew', 'Mock Neck', 'Raw Edge Neck'] },
  //     { id: 'neckRib', label: 'Neck Rib', options: ['1x1 Rib', '2x2 Rib', 'Contrast Color Rib', 'Self Fabric'] },
  //     { id: 'sleeveStyle', label: 'Sleeve Style', options: ['Set-In Sleeve', 'Raglan Sleeve', 'Drop Shoulder'] },
  //     { id: 'cuffStyle', label: 'Cuff Style', options: ['1x1 Rib Knit', '2x2 Rib Knit', 'Raw Edge'] },
  //     { id: 'hemStyle', label: 'Hem Style', options: ['1x1 Rib Band', '2x2 Rib Band', 'Raw Hem', 'Split Hem'] },
  //     { id: 'sidePanel', label: 'Side Panel', options: ['No Side Panel', 'Ribbed Side Panels (Gusset)', 'Contrast Side Panel'] }
  //   ],
  //   colorZones: ['Body', 'Sleeves', 'Neck Rib', 'Cuff Rib', 'Hem Rib', 'Side Panels'],
  // },
  {
    id: 'shorts',
    name: 'Athletic / Mesh Shorts',
    description: 'Performance or Lifestyle Shorts',
    image: '/quote-short.jpg',
    defaultFabric: 'poly-cotton',
    defaultGsm: 200,
    construction: [
      { id: 'shortStyle', label: 'Short Style', options: ['Basketball Mesh', 'Fleece Sweatshorts', 'Nylon Swim/Track', 'Cotton Chino'] },
      { id: 'waistband', label: 'Waistband', options: ['Thick Elastic', 'Standard Elastic', 'Foldover Waistband'] },
      { id: 'drawstring', label: 'Drawstring Type', options: ['Extra Long Round Cord', 'Flat Cotton', 'Inside Drawstring', 'Metal Tips'] },
      { id: 'pockets', label: 'Pockets', options: ['Standard Side Pockets', 'Zipper Pockets', 'Deep Mesh Lined', 'No Pockets'] },
      { id: 'inseam', label: 'Inseam Length', options: ['5 inch (Short)', '7 inch (Standard)', '9 inch (Long)', 'Below Knee'] },
      { id: 'hemFinish', label: 'Hem Finish', options: ['Folded Hem', 'Raw Edge', 'Contrast Binding', 'Side Slits'] }
    ],
    colorZones: ['Body', 'Waistband', 'Drawstring', 'Binding/Trim'],
  },
  // {
  //   id: 'trackjacket',
  //   name: 'Track / Windbreaker Jacket',
  //   description: 'Lightweight Outerwear Zip-Up',
  //   image: 'https://images.unsplash.com/photo-1544640103-60d703774cd8?auto=format&fit=crop&q=80&w=800',
  //   defaultFabric: 'nylon',
  //   defaultGsm: 150,
  //   construction: [
  //     { id: 'jacketStyle', label: 'Jacket Style', options: ['Full Zip Track Jacket', 'Half Zip Pullover', 'Anorak (Quarter Zip)', 'Coach Jacket'] },
  //     { id: 'collarStyle', label: 'Collar Style', options: ['Stand-Up Collar', 'Fold-Down Collar', 'Hooded', 'Packable Hood'] },
  //     { id: 'lining', label: 'Lining', options: ['Mesh Lining', 'Cotton Jersey Lining', 'Fleece Lined', 'Unlined'] },
  //     { id: 'cuffStyle', label: 'Cuff Finish', options: ['Elastic Cuffs', 'Velcro Straps', 'Ribbed Cuffs', 'Snap Buttons'] },
  //     { id: 'hemStyle', label: 'Hem Finish', options: ['Elastic with Bungee', 'Ribbed Hem', 'Drawstring', 'Straight Hem'] },
  //     { id: 'pockets', label: 'Pockets', options: ['Welt Pockets', 'Zipper Pockets', 'Kangaroo Pouch (Anorak)', 'Snap Flap Pockets'] }
  //   ],
  //   colorZones: ['Body Upper', 'Body Lower', 'Sleeves', 'Collar/Hood', 'Zipper Tape', 'Lining'],
  // }
];

// ─── FABRIC OPTIONS ──────────────────────────────────────────────────────────
export const FABRIC_OPTIONS = [
  { id: 'cotton-100', name: '100% Combed Cotton', gsm: [160, 180, 200, 220, 260, 300], finish: 'Bio-Washed / Silicon Washed' },
  { id: 'cotton-organic', name: '100% Organic Cotton (GOTS)', gsm: [180, 200, 220, 260], finish: 'Enzyme Washed' },
  { id: 'poly-cotton', name: 'Poly-Cotton Blend 60/40', gsm: [200, 240, 280, 320], finish: 'Anti-Pilling' },
  { id: 'tri-blend', name: 'Tri-Blend (Cotton/Poly/Rayon)', gsm: [160, 180, 200], finish: 'Super Soft' },
  { id: 'fleece', name: 'Premium Fleece', gsm: [280, 320, 380, 420, 500], finish: 'Brushed / French Terry Inside' },
  { id: 'french-terry', name: 'French Terry', gsm: [280, 300, 350, 400], finish: 'Loop Back / Carbon Finish' },
  { id: 'pique-cotton', name: 'Pique Cotton', gsm: [180, 200, 220, 240], finish: 'Mercerized' },
  { id: 'wool-blend', name: 'Melton Wool Blend', gsm: [380, 400, 450, 500], finish: 'Brushed' },
  { id: 'nylon', name: 'Nylon / Taslan', gsm: [120, 150, 180], finish: 'Water Resistant' },
  { id: 'custom', name: 'Custom Fabric (Specify Below)', gsm: [], finish: 'As per your specification' },
];

// ─── BRANDING TECHNIQUES ─────────────────────────────────────────────────────
export const BRANDING_TECHNIQUES = [
  { id: 'screen', name: 'Screen Print', desc: 'Bold ink, ideal for large graphics & bulk' },
  { id: 'embroidery', name: 'Embroidery', desc: 'Dense stitch, luxury feel, logos & text' },
  { id: 'dtf', name: 'DTF Print', desc: 'Soft hand feel, photographic full-color' },
  { id: 'dtg', name: 'DTG Print', desc: 'Direct-to-garment, no minimum, soft' },
  { id: 'chenille', name: 'Chenille Patch', desc: 'Towel-like raised texture, retro style' },
  { id: 'puff', name: 'Puff Print', desc: '3D raised foam ink effect' },
  { id: 'silicone', name: '3D Silicone', desc: 'Rubberized premium high-build' },
  { id: 'sublimation', name: 'Sublimation', desc: 'All-over print, works on polyester' },
  { id: 'heat-transfer', name: 'Heat Transfer (Vinyl)', desc: 'Cut vinyl, small runs, sharp edges' },
  { id: 'woven-patch', name: 'Woven Patch', desc: 'Sewn-on woven label/patch' },
  { id: 'applique', name: 'Appliqué', desc: 'Fabric cut-out stitched onto garment' },
  { id: 'none', name: 'No Branding', desc: 'Blank garment, no decoration' },
];

// ─── PLACEMENT ZONES ─────────────────────────────────────────────────────────
export const PLACEMENT_ZONES = [
  'Left Chest', 'Right Chest', 'Center Chest', 'Full Front',
  'Upper Back', 'Full Back', 'Left Sleeve', 'Right Sleeve',
  'Hood (Front)', 'Hood (Back)', 'Hem Area', 'Collar Area',
  'Inside Neck', 'Left Pocket', 'Right Pocket',
];

// ─── LABEL OPTIONS ───────────────────────────────────────────────────────────
export const LABEL_TYPES = [
  { id: 'woven', name: 'Woven Label', desc: 'Premium threads woven into fabric, most durable' },
  { id: 'printed-satin', name: 'Printed Satin Label', desc: 'Smooth satin with printed branding' },
  { id: 'printed-cotton', name: 'Printed Cotton Label', desc: 'Soft cotton canvas, screen printed' },
  { id: 'heat-transfer', name: 'Heat Transfer Label', desc: 'Tagless, printed directly inside garment' },
  { id: 'leather-patch', name: 'Leather Patch', desc: 'Debossed or printed leather branding' },
  { id: 'rubber-patch', name: 'Rubber/PVC Patch', desc: '3D molded rubber branding' },
  { id: 'none', name: 'No Label / Blank', desc: 'Plain garment, no branding labels' },
];

export const LABEL_PLACEMENTS = ['Center Back Neck', 'Side Seam', 'Hem Label', 'Sleeve Label', 'Inside Pocket'];

// ─── PACKAGING OPTIONS ───────────────────────────────────────────────────────
export const PACKAGING_OPTIONS = [
  { id: 'polybag', name: 'Individual Poly Bag', desc: 'Standard clear polybag per piece' },
  { id: 'branded-polybag', name: 'Branded Poly Bag', desc: 'Custom printed polybag with your logo' },
  { id: 'tissue-wrap', name: 'Tissue Paper Wrap', desc: 'Tissue paper wrapping inside polybag' },
  { id: 'box', name: 'Individual Box', desc: 'Cardboard box per piece' },
  { id: 'branded-box', name: 'Branded Box', desc: 'Custom printed premium box' },
  { id: 'hang-tag', name: 'Custom Hang Tag', desc: 'Printed hang tag attached with string' },
  { id: 'sticker-seal', name: 'Brand Sticker Seal', desc: 'Logo sticker sealing the polybag' },
  { id: 'care-label', name: 'Custom Care Label', desc: 'Washing instructions with your branding' },
  { id: 'none', name: 'Bulk Pack Only', desc: 'No individual packaging, bulk cartons only' },
];

// ─── DELIVERY TIMELINES ──────────────────────────────────────────────────────
export const TIMELINES = [
  { id: 'sample-only', label: 'Sample Only', desc: '7–10 business days', badge: null },
  { id: 'standard', label: 'Standard Production', desc: '25–35 business days', badge: null },
  { id: 'rush', label: 'Rush Order', desc: '15–20 business days', badge: '+15% fee' },
  { id: 'express', label: 'Express', desc: '10–14 business days', badge: '+25% fee' },
];

// ─── INCOTERMS ───────────────────────────────────────────────────────────────
export const INCOTERMS = [
  { id: 'fob', name: 'FOB', desc: 'Free On Board — you pay shipping from port' },
  { id: 'cif', name: 'CIF', desc: 'Cost, Insurance & Freight — we ship to your port' },
  { id: 'dap', name: 'DAP', desc: 'Delivered At Place — door-to-door delivery' },
  { id: 'exw', name: 'EXW', desc: 'Ex Works — pickup from factory' },
];

// ─── COLOUR PALETTE ──────────────────────────────────────────────────────────
export const COLOUR_PALETTE = [
  // ── Whites & Neutrals ──
  { name: 'Pure White',      hex: '#FFFFFF', group: 'neutral' },
  { name: 'Snow White',      hex: '#FFFAFA', group: 'neutral' },
  { name: 'Off White',       hex: '#F5F0E8', group: 'neutral' },
  { name: 'Ivory',           hex: '#FFFFF0', group: 'neutral' },
  { name: 'Pearl',           hex: '#EAE5DC', group: 'neutral' },
  { name: 'Cream',           hex: '#FFFDD0', group: 'neutral' },

  // ── Greys ──
  { name: 'Light Grey',      hex: '#D1D5DB', group: 'grey' },
  { name: 'Heather Grey',    hex: '#B0ABA3', group: 'grey' },
  { name: 'Silver',          hex: '#9CA3AF', group: 'grey' },
  { name: 'Slate Grey',      hex: '#6B7280', group: 'grey' },
  { name: 'Storm Grey',      hex: '#4B5563', group: 'grey' },
  { name: 'Charcoal',        hex: '#374151', group: 'grey' },
  { name: 'Graphite',        hex: '#1F2937', group: 'grey' },
  { name: 'Jet Black',       hex: '#111111', group: 'grey' },
  { name: 'Deep Black',      hex: '#030712', group: 'grey' },

  // ── Blues ──
  { name: 'Ice Blue',        hex: '#DBEAFE', group: 'blue' },
  { name: 'Baby Blue',       hex: '#BFDBFE', group: 'blue' },
  { name: 'Powder Blue',     hex: '#93C5FD', group: 'blue' },
  { name: 'Sky Blue',        hex: '#60A5FA', group: 'blue' },
  { name: 'Classic Blue',    hex: '#3B82F6', group: 'blue' },
  { name: 'Royal Blue',      hex: '#2563EB', group: 'blue' },
  { name: 'Cobalt',          hex: '#1D4ED8', group: 'blue' },
  { name: 'Navy Blue',       hex: '#1E3A8A', group: 'blue' },
  { name: 'Midnight Navy',   hex: '#0F172A', group: 'blue' },

  // ── Teals & Cyans ──
  { name: 'Aqua',            hex: '#A5F3FC', group: 'teal' },
  { name: 'Turquoise',       hex: '#2DD4BF', group: 'teal' },
  { name: 'Teal',            hex: '#0D9488', group: 'teal' },
  { name: 'Deep Teal',       hex: '#115E59', group: 'teal' },

  // ── Greens ──
  { name: 'Mint',            hex: '#A7F3D0', group: 'green' },
  { name: 'Sage',            hex: '#86EFAC', group: 'green' },
  { name: 'Emerald',         hex: '#10B981', group: 'green' },
  { name: 'Kelly Green',     hex: '#16A34A', group: 'green' },
  { name: 'Forest Green',    hex: '#166534', group: 'green' },
  { name: 'Hunter Green',    hex: '#14532D', group: 'green' },
  { name: 'Olive',           hex: '#4D7C0F', group: 'green' },
  { name: 'Army Green',      hex: '#365314', group: 'green' },
  { name: 'Khaki',           hex: '#A3A38A', group: 'green' },

  // ── Reds ──
  { name: 'Coral',           hex: '#FCA5A5', group: 'red' },
  { name: 'Tomato Red',      hex: '#EF4444', group: 'red' },
  { name: 'Crimson',         hex: '#DC2626', group: 'red' },
  { name: 'Scarlet',         hex: '#B91C1C', group: 'red' },
  { name: 'Burgundy',        hex: '#7F1D1D', group: 'red' },
  { name: 'Maroon',          hex: '#4C0519', group: 'red' },
  { name: 'Wine',            hex: '#881337', group: 'red' },

  // ── Pinks ──
  { name: 'Blush',           hex: '#FBCFE8', group: 'pink' },
  { name: 'Baby Pink',       hex: '#F9A8D4', group: 'pink' },
  { name: 'Rose',            hex: '#F472B6', group: 'pink' },
  { name: 'Hot Pink',        hex: '#EC4899', group: 'pink' },
  { name: 'Fuchsia',         hex: '#D946EF', group: 'pink' },
  { name: 'Dusty Rose',      hex: '#BE185D', group: 'pink' },

  // ── Yellows ──
  { name: 'Light Yellow',    hex: '#FEF9C3', group: 'yellow' },
  { name: 'Lemon',           hex: '#FEF08A', group: 'yellow' },
  { name: 'Canary',          hex: '#FDE047', group: 'yellow' },
  { name: 'Gold',            hex: '#EAB308', group: 'yellow' },
  { name: 'Mustard',         hex: '#CA8A04', group: 'yellow' },
  { name: 'Dark Mustard',    hex: '#A16207', group: 'yellow' },

  // ── Oranges ──
  { name: 'Peach',           hex: '#FDBA74', group: 'orange' },
  { name: 'Tangerine',       hex: '#F97316', group: 'orange' },
  { name: 'Burnt Orange',    hex: '#EA580C', group: 'orange' },
  { name: 'Terracotta',      hex: '#C2410C', group: 'orange' },
  { name: 'Rust',            hex: '#9A3412', group: 'orange' },

  // ── Purples ──
  { name: 'Lilac',           hex: '#E9D5FF', group: 'purple' },
  { name: 'Lavender',        hex: '#DDD6FE', group: 'purple' },
  { name: 'Orchid',          hex: '#C084FC', group: 'purple' },
  { name: 'Violet',          hex: '#8B5CF6', group: 'purple' },
  { name: 'Purple',          hex: '#7C3AED', group: 'purple' },
  { name: 'Royal Purple',    hex: '#6D28D9', group: 'purple' },
  { name: 'Deep Purple',     hex: '#4C1D95', group: 'purple' },
  { name: 'Plum',            hex: '#581C87', group: 'purple' },

  // ── Browns & Earth ──
  { name: 'Sand',            hex: '#D4A574', group: 'brown' },
  { name: 'Camel',           hex: '#B45309', group: 'brown' },
  { name: 'Tan',             hex: '#92400E', group: 'brown' },
  { name: 'Saddle Brown',    hex: '#78350F', group: 'brown' },
  { name: 'Chocolate',       hex: '#431407', group: 'brown' },
  { name: 'Espresso',        hex: '#292524', group: 'brown' },
];

// ─── STEP DEFINITIONS ────────────────────────────────────────────────────────
export const INQUIRY_STEPS = [
  { id: 1, label: 'Product', shortLabel: 'Product' },
  { id: 2, label: 'Construction', shortLabel: 'Build' },
  { id: 3, label: 'Material', shortLabel: 'Material' },
  { id: 4, label: 'Color & Art', shortLabel: 'Color' },
  { id: 5, label: 'Sizing', shortLabel: 'Sizing' },
  { id: 6, label: 'Branding', shortLabel: 'Brand' },
  { id: 7, label: 'Delivery', shortLabel: 'Ship' },
  { id: 8, label: 'Review', shortLabel: 'Review' },
];
