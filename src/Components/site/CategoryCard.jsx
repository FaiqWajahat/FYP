import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CategoryCard({ category, isFeatured }) {
  return (
    <Link href={category.href} className="group block h-full">
      <div className={`relative bg-white rounded-[24px] border border-slate-100 overflow-hidden h-full flex flex-col hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(0,0,0,0.06)] hover:border-slate-200/80 transition-all duration-500 ${
        isFeatured ? 'md:flex-row md:min-h-[380px]' : ''
      }`}>
        
        {/* IMAGE AREA */}
        <div className={`relative overflow-hidden bg-slate-100 shrink-0 ${
          isFeatured 
            ? 'w-full md:w-[45%] h-64 md:h-auto' 
            : 'w-full aspect-[4/3]'
        }`}>
          <img 
            src={category.image} 
            alt={category.title} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
          />
          {/* Subtle dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-4 left-4 z-10">
            <span className="backdrop-blur-md bg-white/80 text-[10px] font-black px-2.5 py-1.5 rounded-lg border border-white/20 text-slate-800 uppercase tracking-widest shadow-sm">
              MOQ: {category.moq}
            </span>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
          <div>
            {/* Specs Tags (Category specification labels) */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {category.specs.map((spec, i) => (
                <span key={i} className="px-2.5 py-1 bg-slate-50 border border-slate-200/50 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  {spec}
                </span>
              ))}
            </div>

            <h2 className={`font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors tracking-tight d-font ${
              isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'
            }`}>
              {category.title}
            </h2>
            <p className="text-[13px] leading-relaxed text-slate-500 mb-6 font-medium">
              {category.description}
            </p>
          </div>

          {/* Bottom Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 group-hover:text-blue-600 transition-colors">
              Explore Collection
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}
