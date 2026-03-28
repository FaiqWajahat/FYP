import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CategoryCard({ category, isFeatured }) {
  return (
    <Link href={category.href} className="group block h-full">
      <div className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden h-full flex flex-col hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-blue-300 transition-all duration-500">
        
        {/* IMAGE AREA */}
        <div className={`relative w-full overflow-hidden bg-slate-100 ${isFeatured ? 'h-72 md:h-80' : 'aspect-[4/3]'}`}>
          <img 
            src={category.image} 
            alt={category.title} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          
          {/* Elegant Dark Gradient on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <span className="backdrop-blur-md bg-white/90 text-[10px] font-black px-3 py-1.5 rounded-md shadow-sm border border-white/20 text-slate-900 uppercase tracking-wider">
                MOQ: {category.moq}
              </span>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="p-6 md:p-8 flex-1 flex flex-col z-10 bg-white relative">
          <h2 className={`font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors ${isFeatured ? 'text-3xl' : 'text-2xl'}`}>
            {category.title}
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1 max-w-xl">
            {category.description}
          </p>

          {/* Specs Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {category.specs.map((spec, i) => (
              <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-md text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                {spec}
              </span>
            ))}
          </div>

          {/* Bottom Action */}
          <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
              <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Explore Collection</span>
              <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
          </div>
        </div>

      </div>
    </Link>
  );
}
