import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';

export default function CustomRequestCta() {
  return (
    <div className="container max-w-7xl mx-auto px-4 md:px-8 mt-24">
      <div className="bg-slate-900 rounded-3xl p-8 md:p-14 text-center flex flex-col items-center relative overflow-hidden shadow-2xl">
          
        {/* Abstract BG pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute left-0 top-0 h-[400px] w-[400px] bg-blue-500 rounded-full blur-[120px] opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex p-3 bg-blue-500/20 text-blue-400 rounded-2xl mb-6">
              <Zap size={28} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-5 tracking-tight">Need a completely custom silhouette?</h2>
          <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
            Can't find what you're looking for in our standard catalog? Upload your own tech pack and measurements. Our factory can cut, sew, and grade exactly to your brand's specifications.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2">
              Submit Custom Tech Pack <ArrowRight size={20}/>
            </button>
            <button className="px-8 py-4 bg-transparent border border-slate-700 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors active:scale-95">
              Speak to Production Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
