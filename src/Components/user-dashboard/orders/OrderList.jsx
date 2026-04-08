"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Package, AlertCircle, FileText, ArrowUpRight } from 'lucide-react';
import StatusFilterBar from '@/Components/user-dashboard/StatusFilterBar';

/**
 * ORDER WORKFLOW:
 *  1. User submits order → appears here with "Payment Pending" status
 *  2. Admin issues an invoice → user approves it in /dashboard/invoices
 *  3. Admin confirms payment → order moves to "Processing" → "Production" → "Completed"
 */
const mockOrders = [
  {
    id: 'ORD-1004',
    date: 'Oct 24, 2026',
    items: 120,
    total: 1148.70,
    status: 'Completed',
    product: 'Polo Shirt — Standard Fit',
    pendingInvoice: null,
  },
  {
    id: 'ORD-1005',
    date: 'Oct 26, 2026',
    items: 500,
    total: 8285.00,
    status: 'Production',
    product: 'Heavyweight Cotton Fleece Hoodie',
    pendingInvoice: 'INV-2024-002',  // final 50% invoice pending
  },
  {
    id: 'ORD-1006',
    date: 'Oct 27, 2026',
    items: 300,
    total: 3978.00,
    status: 'Processing',
    product: 'Track Pants — Custom Sizing',
    pendingInvoice: null,
  },
  {
    id: 'ORD-1007',
    date: 'Oct 28, 2026',
    items: 100,
    total: 3299.00,
    status: 'Payment Pending',
    product: 'Bomber Jacket — 100 pcs',
    pendingInvoice: 'INV-2024-004',  // deposit invoice not yet approved
  },
];

const STATUS_TABS = (orders) => [
  { key: 'All',             label: 'All',             count: orders.length },
  { key: 'Payment Pending', label: 'Payment Pending', count: orders.filter(o => o.status === 'Payment Pending').length },
  { key: 'Processing',      label: 'Processing',      count: orders.filter(o => o.status === 'Processing').length },
  { key: 'Production',      label: 'Production',      count: orders.filter(o => o.status === 'Production').length },
  { key: 'Completed',       label: 'Completed',       count: orders.filter(o => o.status === 'Completed').length },
];

const STATUS_STYLE = {
  'Completed':       'bg-success/10 text-success border-success/30',
  'Production':      'bg-info/10 text-info border-info/30',
  'Processing':      'bg-warning/10 text-warning border-warning/30',
  'Payment Pending': 'bg-error/10 text-error border-error/30',
};

/**
 * Explains what each status means to the user:
 *  Payment Pending → Invoice issued by admin, awaiting user approval + payment transfer
 *  Processing      → Payment confirmed, order being prepared for factory floor
 *  Production      → Factory is actively manufacturing the order
 *  Completed       → Order shipped / delivered
 */
const STATUS_DESC = {
  'Payment Pending': 'Invoice issued — approve & pay to start production',
  'Processing':      'Payment confirmed — preparing for production',
  'Production':      'Factory is manufacturing your order',
  'Completed':       'Order shipped and delivered',
};

export default function OrderList() {
  const [activeTab, setActiveTab]       = useState('All');
  const [searchQuery, setSearchQuery]   = useState('');

  const pendingPaymentCount = mockOrders.filter(o => o.status === 'Payment Pending').length;

  const filteredOrders = mockOrders.filter(order => {
    const matchesTab    = activeTab === 'All' || order.status === activeTab;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.product || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-4 font-sans">

      {/* ── Payment Action Banner ─────────────────────────────────────── */}
      {pendingPaymentCount > 0 && (
        <div className="flex items-start gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-2xl shadow-sm">
          <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-amber-800">
              {pendingPaymentCount} order{pendingPaymentCount > 1 ? 's' : ''} awaiting payment
            </p>
            <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
              Admin has issued invoice{pendingPaymentCount > 1 ? 's' : ''} for these orders.
              Approve the invoice and transfer the payment to start production.
            </p>
          </div>
          <Link href="/dashboard/invoices"
            className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-2 rounded-xl transition-colors whitespace-nowrap">
            <FileText size={13} /> View Invoices <ArrowUpRight size={11} />
          </Link>
        </div>
      )}

      {/* ── Search ───────────────────────────────────────────────────── */}
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
            placeholder="Search by order ID, product or status…"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0 px-1 text-xs font-mono text-base-content/50">
          <span className="font-bold text-base-content/80 text-sm">{filteredOrders.length}</span>
          <span className="uppercase tracking-widest">order{filteredOrders.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* ── Status Filter ─────────────────────────────────────────────── */}
      <StatusFilterBar
        tabs={STATUS_TABS(mockOrders)}
        activeTab={activeTab}
        onChange={setActiveTab}
        label="Status:"
      />

      {/* ── Orders Table ─────────────────────────────────────────────── */}
      <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-sm sm:table-md w-full">
            <thead className="bg-base-200/40 text-base-content/50 uppercase text-[10px] font-bold tracking-widest border-b border-base-200">
              <tr>
                <th className="py-4 pl-6">Order</th>
                <th className="py-4">Date Placed</th>
                <th className="py-4 text-center">Volume</th>
                <th className="py-4 text-right">Order Total</th>
                <th className="py-4 text-center">Status</th>
                <th className="py-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const hasPendingInvoice = !!order.pendingInvoice;
                  return (
                    <tr key={order.id} className="border-b border-base-200/40 hover:bg-base-200/20 transition-colors group">

                      {/* Order cell */}
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            hasPendingInvoice
                              ? 'bg-amber-100 group-hover:bg-amber-200'
                              : 'bg-[var(--primary)]/10 group-hover:bg-(--primary)/20'
                          }`}>
                            {hasPendingInvoice
                              ? <AlertCircle size={16} className="text-amber-600" />
                              : <Package size={16} className="text-[var(--primary)]" />
                            }
                          </div>
                          <div>
                            <div className="font-bold text-sm tracking-wide text-base-content">{order.id}</div>
                            <div className="text-[10px] text-base-content/40 font-mono mt-0.5 truncate max-w-[160px]">
                              {order.product || 'Custom order'}
                            </div>
                            {/* Pending invoice nudge */}
                            {hasPendingInvoice && (
                              <Link href="/dashboard/invoices"
                                className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-bold text-amber-600 hover:text-amber-800 transition-colors">
                                <FileText size={9} /> Invoice pending approval
                              </Link>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 font-mono text-xs text-base-content/60 whitespace-nowrap">{order.date}</td>

                      {/* Volume */}
                      <td className="py-4 text-center">
                        <span className="font-bold text-sm text-base-content">{order.items.toLocaleString()}</span>
                        <span className="text-[10px] font-normal text-base-content/40 uppercase tracking-widest ml-1">pcs</span>
                      </td>

                      {/* Total */}
                      <td className="py-4 text-right font-bold text-sm text-[var(--primary)]">
                        ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Status */}
                      <td className="py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${STATUS_STYLE[order.status] || 'bg-base-200 text-base-content border-base-300'}`}>
                            {order.status}
                          </span>
                          {STATUS_DESC[order.status] && (
                            <span className="text-[9px] text-base-content/35 font-medium text-center max-w-[140px] leading-tight hidden lg:block">
                              {STATUS_DESC[order.status]}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          {/* Quick pay link for payment pending orders */}
                          {hasPendingInvoice && (
                            <Link href="/dashboard/invoices"
                              className="btn btn-xs h-8 px-3 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] uppercase tracking-wider font-bold transition-all whitespace-nowrap">
                              <FileText size={11} /> Invoice
                            </Link>
                          )}
                          <Link
                            href={`/dashboard/orders/${order.id.toLowerCase()}`}
                            className="btn btn-xs h-8 px-4 btn-ghost border border-base-200 hover:border-[var(--primary)]/40 hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 text-xs uppercase tracking-wider font-bold transition-all"
                          >
                            <Eye size={13} className="mr-1" /> View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
