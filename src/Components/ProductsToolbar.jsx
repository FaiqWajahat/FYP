'use client';

import React from 'react';
import { Search, Filter, LayoutGrid, List, ChevronDown } from 'lucide-react';

const ProductsToolbar = ({ 
  totalProducts, 
  viewMode, 
  setViewMode, 
  onFilterClick, 
  isFilterActive 
}) => {
  return (
    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm mb-6   transition-all">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        
        {/* Count */}
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-slate-800">Products</h2>
          <span className="h-4 w-px bg-slate-300"></span>
          <p className="text-sm text-slate-500">
            <span className="font-bold text-slate-900">{totalProducts}</span> items found
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative group flex-1 sm:flex-none">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1 sm:flex-none">
               <select className="w-full appearance-none pl-3 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none">
                 <option>Recommended</option>
                 <option>Price: Low to High</option>
                 <option>Price: High to Low</option>
               </select>
               <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="hidden sm:flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}><LayoutGrid size={18} /></button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}><List size={18} /></button>
            </div>

            <button 
              onClick={onFilterClick}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-bold lg:hidden ${isFilterActive ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-700'}`}
            >
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsToolbar;