'use client'
import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const last6MonthsData = [
  { name: "Apr", spend: 0 },
  { name: "May", spend: 400 },
  { name: "Jun", spend: 1200 },
  { name: "Jul", spend: 3200 },
  { name: "Aug", spend: 2800 },
  { name: "Sep", spend: 5400 },
];

const yearlyData = [
  { name: "2021", spend: 12000 },
  { name: "2022", spend: 9500 },
  { name: "2023", spend: 24000 },
  { name: "2024", spend: 18000 },
  { name: "2025", spend: 32000 },
  { name: "2026", spend: 45000 },
];

export default function UserSpendChart() {
  const [view, setView] = useState("months");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = view === "months" ? last6MonthsData : yearlyData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-100 p-3 rounded-lg border border-base-200 shadow-xl">
          <p className="font-bold text-sm mb-1">{label}</p>
          <p className="text-primary font-bold">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col bg-base-100 rounded-xl shadow-sm border border-base-200 p-5 lg:p-6 transition-colors duration-300">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
           <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
             Spend History
           </h2>
           <p className="text-xs text-base-content/60 font-mono mt-1">Tracking your B2B manufacturing volume</p>
        </div>
        
        <div className="flex bg-base-200/50 p-1 rounded-lg">
          <button
            onClick={() => setView("months")}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
              view === "months" ? "bg-base-100 shadow-sm text-primary" : "text-base-content/60 hover:text-base-content"
            }`}
          >
            6 Months
          </button>
          <button
            onClick={() => setView("years")}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
               view === "years" ? "bg-base-100 shadow-sm text-primary" : "text-base-content/60 hover:text-base-content"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="flex-1 mt-4">
         {mounted ? (
           <ResponsiveContainer width="100%" height="100%" minHeight={280}>
             <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
               <XAxis
                 dataKey="name"
                 stroke="currentColor"
                 className="text-base-content/60"
                 tick={{ fontSize: 11, fontWeight: 600 }}
                 axisLine={false}
                 tickLine={false}
                 dy={10}
               />
               <YAxis
                 stroke="currentColor"
                 className="text-base-content/60"
                 tick={{ fontSize: 11, fontWeight: 600 }}
                 axisLine={false}
                 tickLine={false}
                 tickFormatter={(value) => `$${value >= 1000 ? (value / 1000) + 'k' : value}`}
               />
               <Tooltip 
                 content={<CustomTooltip />} 
                 cursor={{ fill: 'var(--fallback-b2,oklch(var(--b2)/0.3))', radius: 8 }} 
               />
               <Bar dataKey="spend" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={45} />
             </BarChart>
           </ResponsiveContainer>
         ) : (
           <div className="w-full h-[280px] bg-base-200/20 animate-pulse rounded-xl flex items-center justify-center">
             <span className="loading loading-spinner loading-sm opacity-20"></span>
           </div>
         )}
      </div>
    </div>
  );
}
