'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// === COMPONENT IMPORTS ===
// Make sure these files exist in your /src/Components/ folder!

import CategoryHero from '@/Components/site/CategoryHero';
import SidebarFilter, { FILTERS } from '@/Components/site/SidebarFilter';
import ProductsToolbar from '@/Components/common/ProductsToolbar';
import ProductCard from '@/Components/site/ProductCard';
import Breadcrumbs from '@/Components/site/ShopBreadCrumps';
import { PRODUCTS } from '@/data/mockProducts';

export default function ShopPage() {
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Filter States
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [activeFabrics, setActiveFabrics] = useState([]);
  const [activeGsm, setActiveGsm] = useState([]);

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

  // Derive filtered products
  const filteredProducts = PRODUCTS.filter((product) => {
    // Category match
    const categoryMatch = 
      activeCategory === "All Products" || 
      product.category.toLowerCase() === activeCategory.toLowerCase();

    // Fabrics match (if any specified)
    const fabricMatch = 
      activeFabrics.length === 0 || 
      activeFabrics.includes(product.fabric);

    // GSM match (if any specified)
    const gsmMatch = 
      activeGsm.length === 0 || 
      activeGsm.includes(product.gsmWeight);

    return categoryMatch && fabricMatch && gsmMatch;
  });

  return (
    <>
     
      
      {/* pt-20 ensures Navbar doesn't overlap content */}
      <div className="flex-1 pb-8 pt-20">
        
        {/* HEADER SECTION */}
        <div className="container max-w-7xl mx-auto px-4 md:px-8 mb-8">
           <Breadcrumbs items={breadcrumbLinks} />
           <div className="">
              <CategoryHero 
                title={getCategoryTitle()} 
                description="Browse our ready-to-deliver products. Order directly from the factory floor, customize fabrics, and add your branding." 
                stats={{ count: filteredProducts.length, priceStart: 8.50, fabric: activeFabrics.length ? activeFabrics[0] : "All Specs" }}
              />
           </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
            
            {/* DESKTOP SIDEBAR (Sticky) */}
            <aside className="hidden lg:block w-64 flex-shrink-0 h-full sticky top-32">
              <SidebarFilter 
                mobile={false} 
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                activeFabrics={activeFabrics}
                setActiveFabrics={setActiveFabrics}
                activeGsm={activeGsm}
                setActiveGsm={setActiveGsm}
              />
            </aside>

            {/* PRODUCT AREA */}
            <div className="flex-1 min-w-0">
              <ProductsToolbar 
                totalProducts={filteredProducts.length}
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
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-24 bg-slate-50 border border-slate-100 rounded-2xl">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No Products Found</h3>
                  <p className="text-slate-500">Try adjusting your fabric or weight filters.</p>
                  <button 
                    className="mt-6 px-6 py-2 bg-slate-900 text-white font-bold rounded-lg text-sm transition-transform active:scale-95"
                    onClick={() => { setActiveFabrics([]); setActiveGsm([]); setActiveCategory("All Products"); }}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

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
      </div>

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
              <SidebarFilter 
                mobile={true} 
                onClose={() => setIsMobileFilterOpen(false)} 
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                activeFabrics={activeFabrics}
                setActiveFabrics={setActiveFabrics}
                activeGsm={activeGsm}
                setActiveGsm={setActiveGsm}  
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

     
    </>
  );
}