'use client';

import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100/80 overflow-hidden flex flex-col h-full animate-pulse">
      {/* 1. IMAGE AREA SKELETON */}
      <div className="relative aspect-[3/4] bg-slate-200 overflow-hidden">
        {/* Shimmer effect placeholder */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
      </div>

      {/* 2. DETAILS AREA SKELETON */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category/Fabric placeholder */}
          <div className="h-3 bg-slate-100 rounded w-1/2 mb-2"></div>
          
          {/* Title placeholder */}
          <div className="h-4 bg-slate-250 rounded-md w-3/4"></div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100/60 flex items-end justify-between">
          {/* Price Block */}
          <div className="space-y-1.5">
            <div className="h-2 bg-slate-100 rounded w-8"></div>
            <div className="h-6 bg-slate-200 rounded-md w-16"></div>
          </div>
          
          {/* Right Details Stack */}
          <div className="flex flex-col items-end gap-2">
            {/* MOQ placeholder */}
            <div className="h-4 bg-slate-100 rounded w-12 border border-slate-200/50"></div>
            
            {/* Color Dots */}
            <div className="flex -space-x-1.5">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-200 shadow-sm"></div>
              ))}
            </div>
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
