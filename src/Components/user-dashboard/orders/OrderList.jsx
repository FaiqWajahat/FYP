"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Package } from 'lucide-react';
import StatusFilterBar from '@/Components/user-dashboard/StatusFilterBar';

const mockOrders = [
  { id: 'ORD-1004', date: 'Oct 24, 2026', items: 120, total: 1450.00, status: 'Completed' },
  { id: 'ORD-1005', date: 'Oct 26, 2026', items: 500, total: 4200.00, status: 'Production' },
  { id: 'ORD-1006', date: 'Oct 27, 2026', items: 50, total: 600.00, status: 'Processing' },
  { id: 'ORD-1007', date: 'Oct 28, 2026', items: 250, total: 3100.00, status: 'Payment Pending' },
];

const STATUS_TABS = (orders) => [
  { key: 'All',             label: 'All',             count: orders.length },
  { key: 'Processing',      label: 'Processing',      count: orders.filter(o => o.status === 'Processing').length },
  { key: 'Production',      label: 'Production',      count: orders.filter(o => o.status === 'Production').length },
  { key: 'Payment Pending', label: 'Payment Pending', count: orders.filter(o => o.status === 'Payment Pending').length },
  { key: 'Completed',       label: 'Completed',       count: orders.filter(o => o.status === 'Completed').length },
];

export default function OrderList() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = ['All', 'Processing', 'Production', 'Payment Pending', 'Completed'];

  const filteredOrders = mockOrders.filter(order => {
    const matchesTab = activeTab === 'All' || order.status === activeTab;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':       return 'bg-success/10 text-success border-success/30';
      case 'Production':      return 'bg-info/10 text-info border-info/30';
      case 'Processing':      return 'bg-warning/10 text-warning border-warning/30';
      case 'Payment Pending': return 'bg-error/10 text-error border-error/30';
      default:                return 'bg-base-200 text-base-content border-base-300';
    }
  };

  return (
    <div className="space-y-4 font-sans">

      {/* ── Search ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-base-100 px-5 py-4 rounded-xl shadow-sm border border-base-200">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={15} className="text-base-content/40" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm h-10 w-full pl-10 bg-base-200/40 border-base-200 focus:border-[var(--primary)]/50 focus:bg-base-100 transition-all text-sm rounded-lg placeholder:text-base-content/40"
            placeholder="Search by order ID or status…"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0 px-1 text-xs font-mono text-base-content/50">
          <span className="font-bold text-base-content/80 text-sm">{filteredOrders.length}</span>
          <span className="uppercase tracking-widest">order{filteredOrders.length !== 1 ? 's' : ''} found</span>
        </div>
      </div>

      {/* ── Status Filter ── */}
      <StatusFilterBar
        tabs={STATUS_TABS(mockOrders)}
        activeTab={activeTab}
        onChange={setActiveTab}
        label="Order Status:"
      />

      {/* ── Orders Table ── */}
      <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-sm sm:table-md w-full">
            <thead className="bg-base-200/40 text-base-content/50 uppercase text-[10px] font-bold tracking-widest border-b border-base-200">
              <tr>
                <th className="py-4 pl-6">Order Details</th>
                <th className="py-4">Date Placed</th>
                <th className="py-4 text-center">Volume</th>
                <th className="py-4 text-right">Total Price</th>
                <th className="py-4 text-center">Status</th>
                <th className="py-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-base-200/40 hover:bg-base-200/20 transition-colors group">
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--primary)]/20 transition-colors">
                          <Package size={16} className="text-[var(--primary)]" />
                        </div>
                        <div>
                          <div className="font-bold text-sm tracking-wide text-base-content">{order.id}</div>
                          <div className="text-[10px] text-base-content/40 font-mono mt-0.5 uppercase tracking-widest">Customer #592</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-mono text-xs text-base-content/70 whitespace-nowrap">{order.date}</td>
                    <td className="py-4 text-center">
                      <span className="font-bold text-sm text-base-content">{order.items.toLocaleString()}</span>
                      <span className="text-[10px] font-normal text-base-content/40 uppercase tracking-widest ml-1">pcs</span>
                    </td>
                    <td className="py-4 text-right font-bold text-sm text-[var(--primary)]">
                      ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-6">
                      <Link
                        href={`/dashboard/orders/${order.id.toLowerCase()}`}
                        className="btn btn-xs h-8 px-4 btn-ghost border border-base-200 hover:border-[var(--primary)]/40 hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 text-xs uppercase tracking-wider font-bold transition-all"
                      >
                        <Eye size={13} className="mr-1" /> View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-20">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center">
                        <Search size={24} className="text-base-content/30" />
                      </div>
                      <div>
                        <p className="text-sm font-bold tracking-wide text-base-content/50">No orders found</p>
                        <p className="text-xs mt-1 text-base-content/40">Try adjusting your filters or search query.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
