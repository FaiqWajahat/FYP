'use client';

import React, { useEffect } from 'react';
import { LayoutGrid, Package, SlidersHorizontal, CheckCircle2, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export const FILTERS = {
  categories: ["All Products", "Hoodies", "Jackets", "Tracksuits", "T-Shirts", "Bottoms"],
  fabrics: ["100% Cotton", "Poly-Cotton Blend", "French Terry", "Nylon / Windbreaker", "Wool/Leather"],
  gsm: ["180-250 (Light)", "280-350 (Mid)", "400+ (Heavyweight)"]
};

// Now strongly completely controlled component!
const SidebarFilter = ({ 
  mobile, 
  onClose, 
  activeCategory, 
  setActiveCategory,
  activeFabrics = [],
  setActiveFabrics = () => {},
  activeGsm = [],
  setActiveGsm = () => {}
}) => {
  const pathname = usePathname();

  // Highlight category based on URL on mount ONLY if not set
  useEffect(() => {
    if (!activeCategory || activeCategory === "All Products") {
      const pathSegment = pathname.split('/').pop();
      if (!pathSegment || pathSegment === 'shop' || pathSegment === 'all') {
        setActiveCategory("All Products");
      } else {
        const formattedTitle = pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1).replace(/-/g, ' ');
        const match = FILTERS.categories.find(c => c.toLowerCase() === formattedTitle.toLowerCase());
        if (match) setActiveCategory(match);
      }
    }
  }, [pathname, activeCategory, setActiveCategory]);

  const toggleArrayItem = (setter, activeArray, item) => {
    if (activeArray.includes(item)) {
      setter(activeArray.filter((v) => v !== item));
    } else {
      setter([...activeArray, item]);
    }
  };

  const handleReset = () => {
    setActiveCategory("All Products");
    setActiveFabrics([]);
    setActiveGsm([]);
  };

  return (
    <div className={`w-full ${mobile ? 'p-6 h-full flex flex-col' : 'w-64 space-y-8 sticky top-32 h-fit hidden lg:block'}`}>
      
      {/* Mobile Header */}
      {mobile && (
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-900">Filters</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>
      )}

      {/* Filter Content */}
      <div className={mobile ? "flex-1 overflow-y-auto" : ""}>
        
        {/* Categories */}
        <div className="mb-8">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
            <LayoutGrid size={16} /> Categories
          </h3>
          <div className="space-y-3">
            {FILTERS.categories.map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <div 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isActive ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400 bg-white'}`}>
                    {isActive && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <span className={`text-sm ${isActive ? 'font-bold text-slate-900' : 'text-slate-600 group-hover:text-blue-600'}`}>
                    {cat}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fabrics */}
        <div className="pt-6 border-t border-slate-100 mb-8">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Package size={16} /> Fabric Type
          </h3>
          <div className="space-y-3">
            {FILTERS.fabrics.map((fabric) => {
              const isActive = activeFabrics.includes(fabric);
              return (
                <div 
                  key={fabric} 
                  onClick={() => toggleArrayItem(setActiveFabrics, activeFabrics, fabric)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isActive ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400 bg-white'}`}>
                    {isActive && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <span className={`text-sm ${isActive ? 'font-bold text-slate-900' : 'text-slate-600 group-hover:text-blue-600'}`}>{fabric}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* GSM */}
        <div className="pt-6 border-t border-slate-100 pb-8">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
            <SlidersHorizontal size={16} /> Weight (GSM)
          </h3>
          <div className="space-y-3">
            {FILTERS.gsm.map((weight) => {
              const isActive = activeGsm.includes(weight);
              return (
                <div 
                  key={weight}
                  onClick={() => toggleArrayItem(setActiveGsm, activeGsm, weight)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isActive ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400 bg-white'}`}>
                    {isActive && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <span className={`text-sm ${isActive ? 'font-bold text-slate-900' : 'text-slate-600 group-hover:text-blue-600'}`}>{weight}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main/Mobile Footer */}
      <div className={`mt-4 pt-6 border-t border-slate-100 flex gap-4 ${mobile ? 'flex-shrink-0' : ''}`}>
        <button onClick={handleReset} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">Reset</button>
        {mobile && (
          <button onClick={onClose} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-lg">Show Results</button>
        )}
      </div>
    </div>
  );
};

export default SidebarFilter;