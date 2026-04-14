"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Eye, Package, AlertCircle, FileText, ArrowUpRight, Loader2, ShieldCheck, Clock } from 'lucide-react';
import StatusFilterBar from '@/Components/user-dashboard/StatusFilterBar';
import Loader from '@/Components/common/Loader';

const STATUS_TABS = (orders) => [
  { key: 'All',             label: 'All',             count: orders.length },
  { key: 'Payment Pending', label: 'Payment Pending', count: orders.filter(o => o.status === 'Payment Pending' || o.status === 'payment pending').length },
  { key: 'Processing',      label: 'Processing',      count: orders.filter(o => o.status === 'Processing').length },
  { key: 'Production',      label: 'Production',      count: orders.filter(o => o.status === 'Production').length },
  { key: 'Completed',       label: 'Completed',       count: orders.filter(o => o.status === 'Completed').length },
];

const STATUS_STYLE = {
  'Completed':       'bg-success/10 text-success border-success/30',
  'Production':      'bg-info/10 text-info border-info/30',
  'Processing':      'bg-warning/10 text-warning border-warning/30',
  'payment pending': 'bg-error/10 text-error border-error/30',
  'Payment Pending': 'bg-error/10 text-error border-error/30',
};

const STATUS_DESC = {
  'payment pending': 'Invoice issued — approve & pay to start production',
  'Payment Pending': 'Invoice issued — approve & pay to start production',
  'Processing':      'Payment confirmed — preparing for production',
  'Production':      'Factory is manufacturing your order',
  'Completed':       'Order shipped and delivered',
};

const PHASES = [
  { title: 'Design & Tech Pack' },
  { title: 'Fabric Sourcing' },
  { title: 'Pattern Making' },
  { title: 'Sampling' },
  { title: 'Bulk Cutting' },
  { title: 'Printing & Embroidery' },
  { title: 'Stitching & Assembly' },
  { title: 'Finishing & QA' },
  { title: 'Packaging & Dispatch' },
  { title: 'Delivered / Complete' },
];

export default function OrderList() {
  const [activeTab, setActiveTab]       = useState('All');
  const [searchQuery, setSearchQuery]   = useState('');
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/user/orders');
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getOrderStatus = (status) => {
    if (status?.toLowerCase() === 'payment pending') return 'Payment Pending';
    return status || 'Processing';
  };

  const pendingPaymentCount = orders.filter(o => {
     return o.invoices?.some(inv => inv.status === 'pending' || inv.status === 'unpaid');
  }).length;

  const filteredOrders = orders.filter(order => {
    const status = getOrderStatus(order.status);
    const matchesTab    = activeTab === 'All' || status === activeTab;
    const productName = order.product_name || order.product?.name || 'Custom order';
    const displayId = order.display_id ? `ORD-${order.display_id}` : order.id;
    const matchesSearch =
      displayId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (loading) {
     return (
        <Loader message="Loading orders..." variant="full" />
     );
  }

  if (error) {
     return (
        <div className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-200">
           <AlertCircle className="w-5 h-5 inline mr-2" /> Error loading orders: {error}
        </div>
     )
  }

  return (
    <div className="space-y-4 font-sans">
      {/* 0. Urgent Notification Banner */}
      {pendingPaymentCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm border-l-4 border-l-amber-400 mb-6 transition-all animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm border border-amber-200/50">
              <AlertCircle size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-black text-amber-900 tracking-tight leading-none">
                {pendingPaymentCount} {pendingPaymentCount > 1 ? 'Orders' : 'Order'} Awaiting Payment
              </p>
              <p className="text-sm text-amber-700 font-bold uppercase tracking-widest text-[10px] opacity-80 leading-relaxed">
                Admin has issued billing documents requiring your settlement to begin manufacturing.
              </p>
            </div>
          </div>
          <Link 
            href="/dashboard/invoices?status=pending"
            className="btn btn-md bg-amber-600 hover:bg-amber-700 text-white border-none rounded-2xl font-black uppercase tracking-widest text-[10px] w-full sm:w-auto px-8 shadow-lg shadow-amber-200 flex items-center gap-2"
          >
            <FileText size={14} /> Review All Invoices <ArrowUpRight size={14} />
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
            placeholder="Search by order ID, product or SKU…"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0 px-1 text-xs font-mono text-base-content/50">
          <span className="font-bold text-base-content/80 text-sm">{filteredOrders.length}</span>
          <span className="uppercase tracking-widest">order{filteredOrders.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* ── Status Filter ─────────────────────────────────────────────── */}
      <StatusFilterBar
        tabs={STATUS_TABS(orders)}
        activeTab={activeTab}
        onChange={setActiveTab}
        label="Context:"
      />

      {/* ── Orders Roadmap Table ──────────────────────────────────────── */}
      <div className="bg-base-100 rounded-[2rem] shadow-sm border border-base-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-md w-full border-separate border-spacing-0">
            <thead className="bg-base-200/40 text-base-content/50 uppercase text-[9px] font-black tracking-[0.2em] border-b border-base-200">
              <tr>
                <th className="py-6 pl-10">Project Identity</th>
                <th className="py-6">Production Lifecycle</th>
                <th className="py-6 text-center">Billing Health</th>
                <th className="py-6 text-center">Inventory</th>
                <th className="py-6 text-right pr-10">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const hasPendingInvoice = order.invoices?.some(inv => inv.status === 'pending' || inv.status === 'unpaid');
                  const isFullyPaid = order.invoices?.length > 0 && order.invoices?.every(inv => inv.status === 'paid' || inv.status === 'approved');
                  
                  const currentStage = order.stage_index ?? 0;
                  const phaseTitle = PHASES[currentStage]?.title || 'Processing';
                  const progressPct = Math.min(((currentStage + 1) / PHASES.length) * 100, 100);
                  
                  const displayId = order.display_id ? `ORD-${order.display_id}` : order.id.slice(0, 8);
                  const productName = order.product_name || order.product?.name || 'Custom order';
                  
                  let volume = 0;
                  if (order.sizing) {
                     if (Array.isArray(order.sizing)) {
                        volume = order.sizing.reduce((a,b) => a + (Number(b.qty)||0), 0);
                     } else {
                        volume = Object.values(order.sizing).reduce((a,b) => a + (Number(b)||0), 0);
                     }
                  } else if (order.pricing?.totalUnits) {
                     volume = order.pricing.totalUnits;
                  }

                  const totalAmt = order.total_amount || order.pricing?.totalWithFees || order.pricing?.subtotal || 0;

                  return (
                    <tr key={order.id} className="hover:bg-base-50/50 transition-all duration-300 group">
                      {/* 1. Identity Cell */}
                      <td className="py-8 pl-10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-base-50 border border-base-200 flex items-center justify-center text-base-content/20 group-hover:text-[var(--primary)] group-hover:border-[var(--primary)]/20 transition-all shadow-inner">
                            <Package size={20} />
                          </div>
                          <div className="space-y-1">
                            <p className="font-black text-base text-base-content tracking-tight leading-none">{displayId}</p>
                            <p className="text-xs font-bold text-base-content/40 tracking-tight">{productName}</p>
                            <p className="text-[9px] font-mono font-bold text-base-content/20 uppercase tracking-widest">{order.sku || 'No SKU'}</p>
                          </div>
                        </div>
                      </td>

                      {/* 2. Production Progress Cell */}
                      <td className="py-8 min-w-[240px]">
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-4">
                             <p className={`text-[10px] font-black uppercase tracking-wider ${currentStage >= 9 ? 'text-emerald-600' : 'text-[var(--primary)]'}`}>
                               {phaseTitle}
                             </p>
                             <p className="text-[10px] font-mono font-bold text-base-content/30">{Math.round(progressPct)}%</p>
                          </div>
                          <div className="h-1.5 w-full bg-base-200 rounded-full overflow-hidden">
                             <div 
                               className={`h-full transition-all duration-1000 ease-out ${currentStage >= 9 ? 'bg-emerald-500' : 'bg-[var(--primary)]'}`}
                               style={{ width: `${progressPct}%` }}
                             />
                          </div>
                        </div>
                      </td>

                      {/* 3. Billing Health Cell */}
                      <td className="py-8 text-center">
                        <div className="flex flex-col items-center gap-2">
                           {hasPendingInvoice ? (
                             <Link href={`/dashboard/invoices?orderId=${displayId}`} className="group/bill">
                               <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest animate-pulse cursor-pointer hover:bg-amber-100 transition-colors">
                                 <AlertCircle size={10} /> Action Required
                               </span>
                             </Link>
                           ) : isFullyPaid ? (
                             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                               <ShieldCheck size={10} /> Paid & Cleared
                             </span>
                           ) : (
                             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-base-200 bg-base-50 text-base-content/40 text-[10px] font-black uppercase tracking-widest">
                               <Clock size={10} /> In Preparation
                             </span>
                           )}
                           <p className="text-sm font-black text-base-content tracking-tighter">
                             ${totalAmt.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                           </p>
                        </div>
                      </td>

                      {/* 4. Volume Cell */}
                      <td className="py-8 text-center">
                         <p className="text-base font-black text-base-content leading-none">{volume.toLocaleString()}</p>
                         <p className="text-[9px] font-bold text-base-content/30 uppercase tracking-[0.2em] mt-1">Total PCS</p>
                      </td>

                      {/* 5. Action Cell */}
                      <td className="py-8 text-right pr-10">
                        <Link
                          href={`/dashboard/orders/${order.id}`}
                          className="btn btn-md bg-white border-base-200 hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5 text-[10px] uppercase font-black tracking-widest rounded-2xl px-6 transition-all"
                        >
                          Details <ArrowUpRight size={14} className="ml-1 opacity-40" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-32">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 rounded-3xl bg-base-50 flex items-center justify-center border border-base-200 shadow-inner">
                        <Search size={28} className="text-base-content/10" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-black text-base-content tracking-tight">Deployment Not Found</p>
                        <p className="text-sm font-bold text-base-content/30">Adjust your criteria or contact factory support.</p>
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
