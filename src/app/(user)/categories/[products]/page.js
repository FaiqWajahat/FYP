'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// === COMPONENT IMPORTS ===
// Make sure these files exist in your /src/Components/ folder!
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer'; 
import ChatWidget from '@/Components/ChatWidget';
import CategoryHero from '@/Components/CategoryHero';
import SidebarFilter from '@/Components/SidebarFilter';
import ProductsToolbar from '@/Components/ProductsToolbar';
import ProductCard from '@/Components/ProductCard';
import Breadcrumbs from '@/Components/ShopBreadCrumps';

// === DUMMY DATA ===
const PRODUCTS = [
  { id: 1, name: "Heavyweight Cotton Fleece Hoodie", category: "Hoodies", gsm: "400 GSM", moq: "20 Pcs", price: 18.50, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop", status: "In Stock", colors: ["black", "navy", "grey", "olive"] },
  { id: 2, name: "Performance Tech Tracksuit", category: "Tracksuits", gsm: "280 GSM", moq: "30 Pcs", price: 24.00, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop", status: "Low Stock", colors: ["black", "blue"] },
  { id: 3, name: "Varsity Letterman Jacket", category: "Jackets", gsm: "Wool/Leather", moq: "10 Pcs", price: 45.00, image: "https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=600&auto=format&fit=crop", status: "Made to Order", colors: ["red", "black", "green"] },
  { id: 4, name: "Oversized Streetwear Tee", category: "T-Shirts", gsm: "240 GSM", moq: "50 Pcs", price: 8.50, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop", status: "In Stock", colors: ["white", "black", "beige", "charcoal"] },
  { id: 5, name: "Waterproof Windbreaker", category: "Jackets", gsm: "Nylon Shell", moq: "25 Pcs", price: 22.00, image: "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=600&auto=format&fit=crop", status: "In Stock", colors: ["black", "yellow", "orange"] },
  { id: 6, name: "French Terry Joggers", category: "Bottoms", gsm: "350 GSM", moq: "30 Pcs", price: 16.00, image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=600&auto=format&fit=crop", status: "Made to Order", colors: ["grey", "black"] }
];

export default function ShopPage() {
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Dynamic Header Title
  const getCategoryTitle = () => {
    const segments = pathname.split('/');
    const lastSegment = segments.pop();
    if (!lastSegment || lastSegment === 'shop') return "Factory Inventory";
    return lastSegment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const breadcrumbLinks = [
    { label: 'Catalog', href: '/shop' },
    { label: getCategoryTitle(), href: pathname },
  ];

  return (
    <>
     
      
      {/* pt-20 ensures Navbar doesn't overlap content */}
      <main className="min-h-screen  pt-6 pb-8">
        
        {/* HEADER SECTION */}
        <div className="container max-w-7xl mx-auto px-4 md:px-8 mb-8">
           <Breadcrumbs items={breadcrumbLinks} />
           <div className="">
              <CategoryHero 
                title={getCategoryTitle()} 
                description="Browse our ready-to-deliver products. Order directly from the factory floor, customize fabrics, and add your branding." 
                stats={{ count: PRODUCTS.length, priceStart: 8.50, fabric: "All Specs" }}
              />
           </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
            
            {/* DESKTOP SIDEBAR (Sticky) */}
            <aside className="hidden lg:block w-64 flex-shrink-0 h-full sticky top-32">
              <SidebarFilter mobile={false} />
            </aside>

            {/* PRODUCT AREA */}
            <div className="flex-1 min-w-0">
              <ProductsToolbar 
                totalProducts={PRODUCTS.length}
                viewMode={viewMode}
                setViewMode={setViewMode}
                onFilterClick={() => setIsMobileFilterOpen(true)}
                isFilterActive={isMobileFilterOpen}
              />

              <div className={`grid gap-6 lg:gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {PRODUCTS.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More */}
              <div className="mt-20 flex justify-center pb-12">
                <button className="group flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:border-slate-900 hover:text-slate-900 hover:shadow-lg transition-all active:scale-95">
                  Load More Products 
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE FILTER DRAWER */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[10000] lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl z-[10001] lg:hidden overflow-y-auto"
            >
              <SidebarFilter mobile={true} onClose={() => setIsMobileFilterOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

     
    </>
  );
}