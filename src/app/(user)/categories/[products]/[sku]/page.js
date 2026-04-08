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

import { notFound, useParams } from 'next/navigation';
import Loader from '@/Components/common/Loader';

// --- CONSTANTS ---
const BRANDING_FORMATS = [
  { id: 'print', name: 'Screen Print', price: 1.50, desc: 'Best for high volume.' },
  { id: 'embroidery', name: '3D Embroidery', price: 3.50, desc: 'Premium raised thread.' },
  { id: 'dtg', name: 'Direct to Garment', price: 2.50, desc: 'Complex multi-color details.' },
  { id: 'patch', name: 'Woven Patch', price: 4.00, desc: 'Sewn-on luxury branding.' },
];

export default function ProductDetailPage() {
  const params = useParams();
  const rawSku = params?.sku || '';
  
  // Database Product State
  const [dbProduct, setDbProduct] = useState(null);
  const [loadingDb, setLoadingDb] = useState(true);

  // 1. Branding State
  const [selectedColor, setSelectedColor] = useState(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(BRANDING_FORMATS[0]);
  const [activeImage, setActiveImage] = useState(0);
  
  // Multiple Logo Support
  const [uploadedLogos, setUploadedLogos] = useState([]);
  const [selectedLogoId, selectLogoId] = useState(null); 
  const logoInputRef = useRef(null);

  // Sync Handlers
  const handleColorSelect = (color, index) => {
    setSelectedColor(color);
    if (dbProduct && dbProduct.images && index < dbProduct.images.length) {
      setActiveImage(index);
    }
  };

  const handleImageSelect = (index) => {
    setActiveImage(index);
    if (dbProduct && dbProduct.colors && index < dbProduct.colors.length) {
      setSelectedColor(dbProduct.colors[index]);
    }
  };

  // 2. Sizing State
  const [sizingMode, setSizingMode] = useState('standard'); 
  const [standardQuantities, setStandardQuantities] = useState({ "M": 20 }); 
  const [customRows, setCustomRows] = useState([{ id: 1, name: "Custom Size 1", qty: 20 }]); 
  const [uploadedSizeChart, setUploadedSizeChart] = useState(null);
  const sizeChartInputRef = useRef(null);
  const studioRef = useRef(null);

  // 3. Hydrate from Store / Database
  const orderData = useOrderStore();
  
  useEffect(() => {
    async function fetchProduct() {
      try {
        if (!rawSku) return;
        const res = await fetch(`/api/products?sku=${encodeURIComponent(rawSku)}`);
        if (!res.ok) { setLoadingDb(false); return; }
        const data = await res.json();
        
        if (data.product) {
          const product = data.product;
          
          // 1. Map dynamic branding formats based on database enabled options
          const dbBranding = product.brandingOptions || [];
          const availableBranding = BRANDING_FORMATS.map(base => {
            const match = dbBranding.find(o => o.id === base.id);
            if (match) {
              return { 
                ...base, 
                price: parseFloat(match.price) || base.price,
                enabled: true 
              };
            }
            return { ...base, enabled: false };
          }).filter(b => b.enabled);

          // 2. Normalize colors (String to Array)
          const normalizedColors = product.colors ? product.colors.split(",").map(c => {
             const [name, hex] = c.split(":");
             return { name, hex: hex || "#f8fafc" }; // Fallback to off-white
          }) : [{ name: "Standard", hex: "#f8fafc" }];

          // 3. Normalize sizes
          const normalizedSizes = product.sizes ? product.sizes.split(" ") : ["S", "M", "L", "XL", "2XL"];

          setDbProduct({
            ...product,
            colors: normalizedColors,
            standardSizes: normalizedSizes,
            availableBranding: availableBranding.length > 0 ? availableBranding : BRANDING_FORMATS.slice(0, 2) // Fallback if none set
          });

          setSelectedColor(normalizedColors[0]);
          if (availableBranding.length > 0) {
            setSelectedFormat(availableBranding[0]);
          } else {
             setSelectedFormat(BRANDING_FORMATS[0]);
          }
        }
      } catch (err) {
        console.error("Fetch product error:", err);
      } finally {
        setLoadingDb(false);
      }
    }
    fetchProduct();
  }, [rawSku]);

  useEffect(() => {
    // If the store already has this product configured, restore it
    if (dbProduct && orderData.product && orderData.product.sku === dbProduct.sku) {
      const { product, customization, sizing } = orderData;
      
      // Restore color
      const savedColor = dbProduct.colors.find(c => c.name === product.color);
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
  }, [dbProduct, orderData]);

  // 4. Central Calculations
  const totalQuantity = useMemo(() => {
    if (sizingMode === 'standard') {
      return Object.values(standardQuantities).reduce((a, b) => a + b, 0);
    } else {
      return customRows.reduce((a, row) => a + (parseInt(row.qty) || 0), 0);
    }
  }, [sizingMode, standardQuantities, customRows]);

  const activeTier = useMemo(() => {
    if (!dbProduct || !dbProduct.pricingTiers) return { price: 0 };
    return dbProduct.pricingTiers.reduce((prev, curr) => {
      return totalQuantity >= curr.quantity ? curr : prev;
    }, dbProduct.pricingTiers[0]);
  }, [totalQuantity, dbProduct]);

  const unitPrice = useMemo(() => {
    let base = parseFloat(activeTier.price) || 0;
    if (isCustomizing && uploadedLogos.length > 0) {
      base += (parseFloat(selectedFormat.price) || 0) * uploadedLogos.length;
    }
    return base;
  }, [activeTier, isCustomizing, selectedFormat, uploadedLogos.length]);

  const totalEstimate = (totalQuantity * unitPrice).toFixed(2);

  // 4. Shared Handlers
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const id = `logo-${Date.now()}`;
        setUploadedLogos(prev => [...prev, {
          id,
          src: reader.result,
          x: 100, y: 150, width: 100, height: 100, rotation: 0
        }]);
        selectLogoId(id);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = (id) => {
    setUploadedLogos(prev => prev.filter(l => l.id !== id));
    if (selectedLogoId === id) selectLogoId(null);
  };

  const updateLogoProps = (id, props) => {
    setUploadedLogos(prev => prev.map(l => l.id === id ? { ...l, ...props } : l));
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

  if (loadingDb) return <Loader message="Locating Database Product..." />;
  if (!dbProduct) return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col items-center">
       <h1 className="text-4xl font-black mb-4">404 Product Not Found</h1>
       <p className="text-base-content/60">Could not locate SKU: {rawSku}</p>
    </div>
  );

  return (
    <>
      
      <main className="min-h-screen  pt-20 pb-20">
        <div className="container max-w-7xl mx-auto px-4 md:px-8 mb-6">
           <Breadcrumbs items={[
             { label: 'Catalog', href: '/' },
             { label: dbProduct.category || 'Apparel', href: '#' },
             { label: dbProduct.name, href: '#' }
           ]} />
        </div>

        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            <ProductStudio 
              ref={studioRef}
              images={dbProduct.images && dbProduct.images.length > 0 ? dbProduct.images : ["https://via.placeholder.com/600"]}
              product={dbProduct}
              isCustomizing={isCustomizing}
              selectedFormat={selectedFormat}
              uploadedLogos={uploadedLogos}
              selectedLogoId={selectedLogoId}
              selectLogoId={selectLogoId}
              onLogoChange={updateLogoProps}
              activeImage={activeImage}
              onImageSelect={handleImageSelect}
            />

            {/* RIGHT: CONFIGURATOR */}
            <div className="w-full lg:w-[55%]">
              
              <ProductHeader product={dbProduct} activeTier={activeTier} />

              <BrandingOptions 
                isCustomizing={isCustomizing}
                setIsCustomizing={setIsCustomizing}
                brandingFormats={dbProduct.availableBranding}
                selectedFormat={selectedFormat}
                setSelectedFormat={setSelectedFormat}
                uploadedLogos={uploadedLogos}
                handleLogoUpload={handleLogoUpload}
                removeLogo={removeLogo}
                logoInputRef={logoInputRef}
              />

              <ColorSelector 
                colors={dbProduct.colors}
                selectedColor={selectedColor}
                onColorSelect={handleColorSelect}
              />

              <SizingModule 
                sizingMode={sizingMode}
                setSizingMode={setSizingMode}
                standardSizes={dbProduct.standardSizes}
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
                sizeChartData={dbProduct.sizeChart || []}
              />

              <OrderSummary 
                product={dbProduct}
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
                uploadedLogosCount={uploadedLogos.length}
              />

            </div>
          </div>
        </div>
      </main>
    
    </>
  );
}