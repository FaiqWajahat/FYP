'use client'
import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from "recharts";
import { TrendingUp } from "lucide-react";

export default function UserSpendChart({ data = [], loading }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-100 p-4 rounded-2xl border border-base-200 shadow-2xl backdrop-blur-md bg-white/90">
          <p className="font-black text-[10px] uppercase tracking-widest text-base-content/40 mb-2">{label}</p>
          <p className="text-primary font-black text-xl">
            ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-[9px] font-bold text-base-content/30 uppercase mt-1">Verified Payments</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
       <div className="w-full h-full bg-base-100 rounded-2xl shadow-sm border border-base-200 p-8 flex flex-col gap-6">
          <div className="h-6 w-32 bg-base-200 rounded-lg animate-pulse" />
          <div className="flex-1 bg-base-200/20 rounded-xl animate-pulse" />
       </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-base-100 rounded-2xl shadow-sm border border-base-200 p-5 lg:p-8">
      
      <div className="flex justify-between items-start mb-10">
        <div>
           <h2 className="text-sm font-black uppercase tracking-widest text-base-content flex items-center gap-2">
             Spend History
           </h2>
           <p className="text-[10px] text-base-content/40 font-bold uppercase tracking-wide mt-1">Investment across manufacturing</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10">
              <TrendingUp size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Data</span>
           </div>
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
         {mounted ? (
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
               <defs>
                 <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                   <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.7} />
                 </linearGradient>
               </defs>
               <XAxis
                 dataKey="name"
                 stroke="currentColor"
                 className="text-base-content/20"
                 tick={{ fontSize: 10, fontWeight: 800, fill: "oklch(var(--bc)/0.4)" }}
                 axisLine={false}
                 tickLine={false}
                 dy={15}
               />
               <YAxis
                 stroke="currentColor"
                 className="text-base-content/20"
                 tick={{ fontSize: 10, fontWeight: 800, fill: "oklch(var(--bc)/0.4)" }}
                 axisLine={false}
                 tickLine={false}
                 tickFormatter={(value) => `$${value >= 1000 ? (value / 1000) + 'k' : value}`}
               />
               <Tooltip 
                 content={<CustomTooltip />} 
                 cursor={{ fill: 'var(--primary)', opacity: 0.05, radius: 12 }} 
               />
               <Bar 
                 dataKey="spend" 
                 fill="url(#barGradient)" 
                 radius={[10, 10, 0, 0]} 
                 maxBarSize={50}
               >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} className="transition-all hover:opacity-80" />
                  ))}
               </Bar>
             </BarChart>
           </ResponsiveContainer>
         ) : (
           <div className="w-full h-full bg-base-200/10 rounded-xl" />
         )}
      </div>
    </div>
  );
}
