'use client'
import React, { useState, useEffect } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'

export default function RevenueChart({ aggData = { monthlyRevenue: [], weeklyRevenue: [] } }) {
  const [view, setView] = useState('month')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const data = view === 'month' ? aggData.monthlyRevenue : aggData.weeklyRevenue

  return (
    <div className="w-full max-w-full mx-auto rounded-xl shadow-lg p-3 lg:p-6 bg-base-100 text-base-content text-lg transition-colors duration-300">
      {/* Header + Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-lg font-bold">
          {view === 'month' ? 'Monthly Revenue' : 'Weekly Revenue'}
        </h2>

        <div className="flex bg-base-300 dark:bg-base-200 rounded-full transition-colors duration-300">
          <button
            onClick={() => setView('week')}
            aria-pressed={view === 'week'}
            className={`px-4 py-1 rounded-full font-semibold transition-colors duration-300 text-sm ${
              view === 'week' ? 'bg-[var(--primary)] text-white' : 'text-base-content'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setView('month')}
            aria-pressed={view === 'month'}
            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300 text-sm sm:text-base ${
              view === 'month' ? 'bg-[var(--primary)] text-white' : 'text-base-content'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Line Chart */}
      {mounted ? (
        <ResponsiveContainer width="100%" height={340}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 10, left: 10, bottom: 20 }} // increased margins
          >
            <defs>
              <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 6" vertical={false} strokeOpacity={0.06} />

            <XAxis
              dataKey="name"
              stroke="currentColor"
              tick={{ fontSize: 12, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dy={6} // extra space below ticks
              padding={{ left: 10, right: 10 }} // spacing on both ends
            />

            <YAxis
              stroke="currentColor"
              tick={{ fontSize: 12, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              dx={-30} // spacing from chart edge
            />

            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg, #fff)',
                borderRadius: '6px',
                border: '1px solid var(--tooltip-border, #e5e7eb)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
              itemStyle={{ color: 'var(--primary)', fontWeight: 600 }}
              cursor={{ stroke: 'var(--primary)', strokeOpacity: 0.12, strokeWidth: 2 }}
            />

            <Legend verticalAlign="top" align="right" height={36} />

            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="var(--primary)"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              fillOpacity={1}
              fill="url(#gradRevenue)"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-[340px] bg-base-200/20 animate-pulse rounded-xl flex items-center justify-center">
          <span className="loading loading-spinner loading-md opacity-20"></span>
        </div>
      )}
    </div>
  )
}
