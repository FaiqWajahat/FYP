"use client";
import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";
import { Info } from "lucide-react";

const COLORS = [
  "var(--primary)", 
  "#3b82f6", 
  "#60a5fa", 
  "#93c5fd", 
  "#bfdbfe",
  "#dbeafe"
];

const STAGE_COLORS = {
  "Pending Approval": "#f59e0b",
  "In Production":    "#155DFC",
  "Quality Check":    "#8b5cf6",
  "Dispatched":       "#10b981",
  "Delivered":        "#64748b",
};

export default function UserStatusChart({ data = [] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-100 p-3 rounded-xl border border-base-200 shadow-2xl backdrop-blur-md bg-white/90">
          <p className="font-black text-[10px] uppercase tracking-widest text-base-content/40 mb-1">{payload[0].name}</p>
          <p className="text-primary font-black text-lg">
            {payload[0].value} {payload[0].value === 1 ? 'Project' : 'Projects'}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.1) return null;

    return (
      <text x={x} y={y} fill="white" textAnchor={midAngle > 90 && midAngle < 270 ? 'start' : 'end'} dominantBaseline="central" className="text-[10px] font-black uppercase">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-base-100 rounded-2xl shadow-sm border border-base-200 p-5 lg:p-6">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-base-content flex items-center gap-2">
            Order Distribution
          </h2>
          <p className="text-[10px] text-base-content/40 font-bold uppercase tracking-wide mt-1">Lifecycle pipeline health</p>
        </div>
        <div className="p-2 rounded-lg bg-base-200/50 text-base-content/20">
          <Info size={14} />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-[250px]">
        {mounted ? (
          data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={STAGE_COLORS[entry.name] || COLORS[index % COLORS.length]} 
                      className="transition-all hover:opacity-80 outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                   verticalAlign="bottom" 
                   align="center"
                   iconType="circle"
                   formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-base-content/60 ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex flex-col items-center justify-center gap-3 opacity-20">
                <div className="w-16 h-16 rounded-full border-4 border-dashed border-base-content" />
                <p className="text-[10px] font-black uppercase tracking-widest">No Active Projects</p>
             </div>
          )
        ) : (
          <div className="w-40 h-40 rounded-full border-[12px] border-base-200 animate-pulse" />
        )}
      </div>
    </div>
  );
}
