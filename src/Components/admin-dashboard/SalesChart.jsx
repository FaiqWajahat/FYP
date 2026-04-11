'use client'
import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
export default function SalesChart({ aggData = { monthlySales: [], weeklySales: [] } }) {
  const [view, setView] = useState("month");

  const toggleView = (selected) => {
    setView(selected);
  };

  const data = view === "month" ? aggData.monthlySales : aggData.weeklySales;

  return (
    <div className="w-full max-w-full  mx-auto rounded-xl  shadow-lg p-3 lg:p-6 bg-base-100 text-base-content text-lg transition-colors duration-300">
      {/* Toggle Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-lg font-bold">
          {view === "month" ? "Monthly Sales" : "Weekly Sales"}
        </h2>
        <div className="flex bg-base-300 dark:bg-base-200 rounded-full  transition-colors duration-300">
          <button
            onClick={() => toggleView("week")}
            className={`px-4 py-1 rounded-full font-semibold transition-colors duration-300 text-sm ${
              view === "week" ? "bg-[var(--primary)] text-white" : "text-base-content"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => toggleView("month")}
            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300 text-sm sm:text-base ${
              view === "month" ? "bg-[var(--primary)] text-white" : "text-base-content"
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={320} minHeight={300}>
        <BarChart data={data} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
          <XAxis
            dataKey="name"
            stroke="currentColor"
            tick={{ fontSize: 12, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="currentColor"
            tick={{ fontSize: 12, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
         <Tooltip
  contentStyle={{
    backgroundColor: "var(--tooltip-bg)", // we define this in Tailwind
    borderRadius: "6px",
    border: "1px solid var(--tooltip-border)",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  }}
  itemStyle={{ color: "var(--primary)", fontWeight: 600 }}
  cursor={{ fill: "rgba(0, 0, 0, 0 )" }}
/>


          <Bar dataKey="sales" fill="var(--primary)" radius={[8, 8, 0, 0]} barSize={35} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}