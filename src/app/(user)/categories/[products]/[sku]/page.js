'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';

import Breadcrumbs from '@/Components/site/ShopBreadCrumps'; 
import { useOrderStore } from '@/store/useOrderStore';

// IMPORT OUR NEW SEPARATED COMPONENTS
import ProductStudio from '@/Components/site/ProductStudio';
import ProductHeader from '@/Components/site/ProductHeader';
import BrandingOptions from '@/Components/site/BrandingOptions';
import ColorSelector from '@/Components/common/ColorSelector';
import SizingModule from '@/Components/site/SizingModule';
import OrderSummary from '@/Components/common/OrderSummary';

// --- CONSTANTS & MOCK DATA ---
const BRANDING_FORMATS = [
  { id: 'print', name: 'Screen Print', price: 1.50, desc: 'Best for high volume.' },
  { id: 'embroidery', name: '3D Embroidery', price: 3.50, desc: 'Premium raised thread.' },
  { id: 'dtg', name: 'Direct to Garment', price: 2.50, desc: 'Complex multi-color details.' },
  { id: 'patch', name: 'Woven Patch', price: 4.00, desc: 'Sewn-on luxury branding.' },
];

const PRODUCT = {
  id: 1,
  name: "Heavyweight Cotton Fleece Hoodie",
  sku: "FCT-HOOD-400",
  rating: 4.8,
  reviews: 124,
  description: "Premium 400 GSM heavyweight cotton fleece. Designed for streetwear brands requiring structure, durability, and a luxury hand-feel.",
  pricingTiers: [
    { label: "Sample", quantity: 1, range: "1-20", price: 45.00, desc: "Quality Check" },
    { label: "MOQ", quantity: 20, range: "21-50", price: 22.00, desc: "Small Batch" },
    { label: "Standard", quantity: 50, range: "51-100", price: 18.50, desc: "Production Run" },
    { label: "Volume", quantity: 500, range: "501+", price: 15.00, desc: "Factory Direct" },
  ],
  colors: [
    { name: "White", hex: "#ffffff" },
    { name: "Navy", hex: "#1e3a8a" },
    { name: "Grey", hex: "#a1a1aa" },
    { name: "Olive", hex: "#3f4d36" }
  ],
  standardSizes: ["XS", "S", "M", "L", "XL", "2XL"],
  images: [
    "https://plus.unsplash.com/premium_photo-1690034979146-59a98168f27e?q=80&w=387&auto=format&fit=crop",
    "https://plus.unsplash.com/premium_photo-1690034979146-59a98168f27e?q=80&w=387&auto=format&fit=crop",
  ],
  sizeChart: [
    { size: "XS", chest: 20, length: 26, sleeve: 24 },
    { size: "S", chest: 21, length: 27, sleeve: 25 },
    { size: "M", chest: 22, length: 28, sleeve: 26 },
    { size: "L", chest: 23, length: 29, sleeve: 27 },
    { size: "XL", chest: 24, length: 30, sleeve: 28 },
    { size: "2XL", chest: 25, length: 31, sleeve: 29 },
  ]
};

export default function ProductDetailPage() {
  
  // 1. Branding State
  const [selectedColor, setSelectedColor] = useState(PRODUCT.colors[0]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(BRANDING_FORMATS[0]);
  
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const [selectedLogoId, selectLogoId] = useState(null); 
  const [logoProps, setLogoProps] = useState({ x: 100, y: 150, width: 100, height: 100, rotation: 0 });
  const logoInputRef = useRef(null);

  // 2. Sizing State
  const [sizingMode, setSizingMode] = useState('standard'); 
  const [standardQuantities, setStandardQuantities] = useState({ "M": 20 }); 
  const [customRows, setCustomRows] = useState([{ id: 1, name: "Custom Size 1", qty: 20 }]); 
  const [uploadedSizeChart, setUploadedSizeChart] = useState(null);
  const sizeChartInputRef = useRef(null);
  const studioRef = useRef(null);

  // 3. Hydrate from Store (Go Back and Make Changes)
  const orderData = useOrderStore();
  
  useEffect(() => {
    // If the store already has this product configured, restore it
    if (orderData.product && orderData.product.sku === PRODUCT.sku) {
      const { product, customization, sizing } = orderData;
      
      // Restore color
      const savedColor = PRODUCT.colors.find(c => c.name === product.color);
      if (savedColor) setSelectedColor(savedColor);
      
      // Restore customization
      setIsCustomizing(customization.enabled);
      const savedFormat = BRANDING_FORMATS.find(f => f.name === customization.format);
      if (savedFormat) setSelectedFormat(savedFormat);
      
      // Restore sizing
      setSizingMode(sizing.mode);
      if (sizing.mode === 'standard') {
        setStandardQuantities(sizing.breakdown);
      } else {
        setCustomRows(sizing.breakdown);
      }
    }
  }, []); // Run once on mount

  // 4. Central Calculations
  const totalQuantity = useMemo(() => {
    if (sizingMode === 'standard') {
      return Object.values(standardQuantities).reduce((a, b) => a + b, 0);
    } else {
      return customRows.reduce((a, row) => a + (parseInt(row.qty) || 0), 0);
    }
  }, [sizingMode, standardQuantities, customRows]);

  const activeTier = useMemo(() => {
    return PRODUCT.pricingTiers.reduce((prev, curr) => {
      return totalQuantity >= curr.quantity ? curr : prev;
    }, PRODUCT.pricingTiers[0]);
  }, [totalQuantity]);

  const unitPrice = useMemo(() => {
    let base = activeTier.price;
    if (isCustomizing) base += selectedFormat.price;
    return base;
  }, [activeTier, isCustomizing, selectedFormat]);

  const totalEstimate = (totalQuantity * unitPrice).toFixed(2);

  // 4. Shared Handlers
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedLogo(reader.result);
        selectLogoId('logo1');
      };
      reader.readAsDataURL(file);
    }
  };
  const removeLogo = () => {
    setUploadedLogo(null);
    selectLogoId(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const handleStandardQtyChange = (size, delta) => {
    setStandardQuantities(prev => {
      const current = prev[size] || 0;
      const newVal = Math.max(0, current + delta);
      const newObj = { ...prev, [size]: newVal };
      if (newVal === 0) delete newObj[size];
      return newObj;
    });
  };

  const handleSizeChartUpload = (e) => {
    const file = e.target.files[0];
    if (file) setUploadedSizeChart(file.name);
  };
  const removeSizeChart = () => {
      setUploadedSizeChart(null);
      if(sizeChartInputRef.current) sizeChartInputRef.current.value = "";
  };

  return (
    <>
      
      <main className="min-h-screen  pt-20 pb-20">
        <div className="container max-w-7xl mx-auto px-4 md:px-8 mb-6">
           <Breadcrumbs items={[
             { label: 'Catalog', href: '/' },
             { label: 'Hoodies', href: '/hoodies' },
             { label: PRODUCT.name, href: '#' }
           ]} />
        </div>

        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            <ProductStudio 
              ref={studioRef}
              images={PRODUCT.images}
              productTitle={PRODUCT.name}
              isCustomizing={isCustomizing}
              selectedFormat={selectedFormat}
              uploadedLogo={uploadedLogo}
              selectedLogoId={selectedLogoId}
              selectLogoId={selectLogoId}
              logoProps={logoProps}
              setLogoProps={setLogoProps}
            />

            {/* RIGHT: CONFIGURATOR */}
            <div className="w-full lg:w-[55%]">
              
              <ProductHeader product={PRODUCT} activeTier={activeTier} />

              <BrandingOptions 
                isCustomizing={isCustomizing}
                setIsCustomizing={setIsCustomizing}
                brandingFormats={BRANDING_FORMATS}
                selectedFormat={selectedFormat}
                setSelectedFormat={setSelectedFormat}
                uploadedLogo={uploadedLogo}
                handleLogoUpload={handleLogoUpload}
                removeLogo={removeLogo}
                logoInputRef={logoInputRef}
              />

              <ColorSelector 
                colors={PRODUCT.colors}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
              />

              <SizingModule 
                sizingMode={sizingMode}
                setSizingMode={setSizingMode}
                standardSizes={PRODUCT.standardSizes}
                standardQuantities={standardQuantities}
                handleStandardQtyChange={handleStandardQtyChange}
                customRows={customRows}
                handleAddCustomRow={() => setCustomRows([...customRows, { id: Date.now(), name: "New Size", qty: 0 }])}
                handleUpdateCustomRow={(id, field, val) => setCustomRows(rows => rows.map(r => r.id === id ? { ...r, [field]: val } : r))}
                handleDeleteCustomRow={(id) => setCustomRows(rows => rows.filter(r => r.id !== id))}
                uploadedSizeChart={uploadedSizeChart}
                handleSizeChartUpload={handleSizeChartUpload}
                removeSizeChart={removeSizeChart}
                sizeChartInputRef={sizeChartInputRef}
                sizeChartData={PRODUCT.sizeChart}
              />

              <OrderSummary 
                product={PRODUCT}
                selectedColor={selectedColor}
                isCustomizing={isCustomizing}
                selectedFormat={selectedFormat}
                sizingMode={sizingMode}
                standardQuantities={standardQuantities}
                customRows={customRows}
                totalQuantity={totalQuantity}
                activeTier={activeTier}
                unitPrice={unitPrice}
                totalEstimate={totalEstimate}
                studioRef={studioRef}
                logoProps={logoProps}
              />

            </div>
          </div>
        </div>
      </main>
    
    </>
  );
}