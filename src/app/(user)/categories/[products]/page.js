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
import Loader from '@/Components/common/Loader';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';

export default function ShopPage({ params }) {
  const unwrappedParams = React.use(params);
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Data State
  const [dbProducts, setDbProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [activeSubCategories, setActiveSubCategories] = useState([]);
  const [activeFabrics, setActiveFabrics] = useState([]);
  const [activeGsm, setActiveGsm] = useState([]);

  // Derive available sub-categories for active category
  const currentSubCategories = activeCategory === "All Products" 
    ? [] 
    : categories.find(c => c.name === activeCategory)?.subcategories || [];

  // Sync state with URL params
  useEffect(() => {
    if (unwrappedParams?.products) {
      if (unwrappedParams.products === 'all') {
        setActiveCategory("All Products");
      } else {
        // Derive category from slug
        const formatted = unwrappedParams.products.charAt(0).toUpperCase() + unwrappedParams.products.slice(1).replace(/-/g, ' ');
        const match = categories.find(c => c.name.toLowerCase() === formatted.toLowerCase());
        if (match) setActiveCategory(match.name);
      }
    }
  }, [unwrappedParams, categories]);

  // Reset sub-categories when main category changes
  useEffect(() => {
    setActiveSubCategories([]);
  }, [activeCategory]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/categories')
        ]);
        
        if (productsRes.data.products) setDbProducts(productsRes.data.products);
        if (categoriesRes.data.categories) setCategories(categoriesRes.data.categories);
        
      } catch (err) {
        console.error("Catalog fetch error:", err);
        toast.error("Failed to load products from factory warehouse.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper for GSM Range Matching
  const matchesGsmRange = (productGsm, filterRanges) => {
    if (!filterRanges || filterRanges.length === 0) return true;
    
    // Convert current gsmWeight to a number
    const gsm = parseInt(productGsm);
    if (isNaN(gsm)) return false;

    return filterRanges.some(range => {
      if (range.includes("400+")) return gsm >= 400;
      if (range.includes("180-250")) return gsm >= 180 && gsm <= 250;
      if (range.includes("280-350")) return gsm >= 280 && gsm <= 350;
      return false;
    });
  };

  // Derive filtered products
  const filteredProducts = dbProducts.filter((product) => {
    // Category match (Case-insensitive)
    const categoryMatch = 
      activeCategory === "All Products" || 
      product.category?.toLowerCase() === activeCategory.toLowerCase();

    // Sub-Category match
    const subCategoryMatch = 
      activeSubCategories.length === 0 || 
      activeSubCategories.some(sub => product.subCategory?.toLowerCase() === sub.toLowerCase());

    // Fabrics match (Robust partial match)
    const fabricMatch = 
      activeFabrics.length === 0 || 
      activeFabrics.some(f => product.fabric?.toLowerCase().includes(f.toLowerCase()));

    // GSM match (Range logic)
    const gsmMatch = matchesGsmRange(product.gsmWeight, activeGsm);

    return categoryMatch && subCategoryMatch && fabricMatch && gsmMatch;
  });

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

  if (loading) return <Loader message="Accessing Factory Catalog..." />;

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
                availableCategories={categories}
                activeSubCategories={activeSubCategories}
                setActiveSubCategories={setActiveSubCategories}
                subCategoryList={currentSubCategories}
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
                    onClick={() => { setActiveFabrics([]); setActiveGsm([]); setActiveCategory("All Products"); setActiveSubCategories([]); }}
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
                availableCategories={categories}
                activeSubCategories={activeSubCategories}
                setActiveSubCategories={setActiveSubCategories}
                subCategoryList={currentSubCategories}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

     
    </>
  );
}