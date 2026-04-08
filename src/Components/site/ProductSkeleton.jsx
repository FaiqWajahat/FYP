'use client';

import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-full animate-pulse">
      {/* 1. IMAGE AREA SKELETON */}
      <div className="relative aspect-[4/5] bg-slate-200 overflow-hidden">
        {/* Shimmer effect placeholder */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
      </div>

      {/* 2. DETAILS AREA SKELETON */}
      <div className="p-5 flex-1 flex flex-col border-t border-slate-100 space-y-4">
        
        {/* Title & MOQ row */}
        <div className="flex justify-between items-start gap-4">
          <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
          <div className="h-5 bg-slate-100 rounded border border-slate-200 w-12 shrink-0"></div>
        </div>

        {/* Categories/rating placeholder */}
        <div className="h-3 bg-slate-100 rounded w-1/4"></div>

        <div className="mt-auto pt-4 border-t border-slate-50 flex items-end justify-between">
          {/* Price Block */}
          <div className="space-y-2">
            <div className="h-2 bg-slate-100 rounded w-8"></div>
            <div className="h-6 bg-slate-200 rounded-md w-16"></div>
          </div>
          
          {/* Color Dots */}
          <div className="flex -space-x-2">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 shadow-sm"></div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default ProductSkeleton;
