"use client";
import React from 'react';
import { Layers, Box, Scissors, Link as LinkIcon, FileText, Download, Ruler, ExternalLink } from 'lucide-react';
import AdminShippingDetails from '@/Components/admin-dashboard/AdminShippingDetails';

export default function AdminOrderSpecs({ order }) {
  const [activeTab, setActiveTab] = React.useState('specs');
  if (!order) return null;

  const sizing = order.sizing || { mode: 'standard', breakdown: {} };
  const customization = order.customization || { enabled: false, format: 'None' };
  const designAssets = order.design_assets || [];
  const totalUnits = sizing.totalUnits || 0;

  // Size chart data from sizing JSONB
  const sizeChartUrl = sizing.size_chart_url || null;
  const isCustomSizing = sizing.mode === 'custom';
  const customSizeRows = isCustomSizing && Array.isArray(sizing.breakdown) ? sizing.breakdown : [];

  // Detect if the size chart is an image or a document
  const isImageChart = sizeChartUrl && /\.(jpg|jpeg|png|webp|gif|svg)(\?|$)/i.test(sizeChartUrl);

  // Normalize sizing breakdown for display
  const sizeEntries = sizing.mode === 'standard'
    ? Object.entries(sizing.breakdown || {}).map(([label, qty]) => ({ label, qty, max: Math.max(...Object.values(sizing.breakdown || {}), 10) }))
    : (sizing.breakdown || []).map(row => ({ label: row.name, qty: parseInt(row.qty) || 0, max: 100 }));

  const tabs = [
    { id: 'specs', label: 'Technical Specs', badge: null },
    { id: 'designs', label: 'Design Assets', badge: designAssets.length > 0 ? designAssets.length : null },
    { id: 'sizechart', label: 'Size Chart', badge: sizeChartUrl ? 1 : null },
    { id: 'logistics', label: 'Logistics', badge: order.shipping_tracking_number ? '✓' : null },
  ];

  return (
    <div className="bg-base-100 rounded-3xl shadow-sm border border-base-200 overflow-hidden flex flex-col font-sans h-full">
      {/* 1. Tab Header */}
      <div className="flex items-center justify-between border-b border-base-200 bg-base-50/50 px-4 py-2">
        <div className="flex items-center gap-1 bg-base-100 p-1 rounded-2xl border border-base-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[var(--primary)] text-white shadow-md'
                  : 'text-base-content/40 hover:text-base-content hover:bg-base-50'
              }`}
            >
              {tab.label}
              {tab.badge != null && (
                <span className={`px-1.5 py-0.5 rounded-md text-[9px] border ${
                  activeTab === tab.id
                    ? 'bg-white/20 border-white/30 text-white'
                    : 'bg-base-200 border-base-300 text-base-content/40'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="px-4 hidden md:block">
          <span className="text-[10px] font-bold text-base-content/30 uppercase tracking-widest">
            Volume: <span className="text-base-content/60">{totalUnits} Units</span>
          </span>
        </div>
      </div>

      {/* 2. Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto max-h-[700px] custom-scrollbar">

        {/* ── TAB: TECHNICAL SPECS ── */}
        {activeTab === 'specs' && (
          <div className="p-8 space-y-10 animate-in fade-in duration-500">

            {/* Mockup Preview */}
            {order.mockup_url && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-base-content/30 uppercase tracking-widest">Product Mockup</span>
                  <a
                    href={order.mockup_url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-xs h-7 px-3 gap-1 bg-[var(--primary)] text-white border-none rounded-lg font-bold uppercase tracking-wider shadow-sm hover:brightness-110 transition-all"
                  >
                    <Download size={12} /> Download
                  </a>
                </div>
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-base-200 bg-slate-50 group">
                  <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
                  <img
                    src={order.mockup_url}
                    alt="Order Mockup"
                    className="w-full h-full object-contain p-6 group-hover:scale-105 transition-all duration-700 ease-out z-10 relative"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all flex items-end justify-end p-4 z-20">
                    <a
                      href={order.mockup_url}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-circle btn-sm bg-white border-none shadow-lg text-[var(--primary)]"
                    >
                      <Download size={14} />
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Sizing Breakdown */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 flex items-center gap-2">
                  <Scissors size={14} className="text-[var(--primary)]" /> Dimension Matrix
                </h4>
                <div className="space-y-4 pr-4">
                  {sizeEntries.map((size) => {
                    const pct = Math.min(100, Math.round((size.qty / (size.max || 1)) * 100));
                    return (
                      <div key={size.label}>
                        <div className="flex justify-between items-end mb-1.5">
                          <span className="text-[11px] font-bold text-base-content tracking-tight uppercase">{size.label}</span>
                          <span className="text-[11px] font-bold text-[var(--primary)]">{size.qty} PCS</span>
                        </div>
                        <div className="w-full bg-base-100 border border-base-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 bg-[var(--primary)]"
                            style={{ width: `${size.qty > 0 ? Math.max(5, pct) : 0}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Configurations */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 flex items-center gap-2">
                  <Layers size={14} className="text-[var(--primary)]" /> Configuration
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="p-4 bg-white rounded-2xl border border-base-200 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="text-[9px] font-bold text-base-content/30 uppercase tracking-widest mb-0.5">Customization</p>
                      <p className="text-[11px] font-bold text-base-content uppercase">{customization.format}</p>
                    </div>
                    <Layers size={16} className="text-base-content/20" />
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-base-200 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="text-[9px] font-bold text-base-content/30 uppercase tracking-widest mb-0.5">Sizing Mode</p>
                      <p className="text-[11px] font-bold text-base-content uppercase">{sizing.mode}</p>
                    </div>
                    <Box size={16} className="text-base-content/20" />
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-base-200 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="text-[9px] font-bold text-base-content/30 uppercase tracking-widest mb-0.5">Reference SKU</p>
                      <p className="text-[11px] font-bold text-[var(--primary)] uppercase">{order.sku}</p>
                    </div>
                    <LinkIcon size={16} className="text-base-content/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: DESIGN ASSETS ── */}
        {activeTab === 'designs' && (
          <div className="p-8 space-y-6 animate-in slide-in-from-right-2 duration-500">
            {designAssets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {designAssets.map((asset, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-5 border border-base-200 group transition-all duration-300 shadow-sm hover:shadow-md">
                    <div className="aspect-square bg-base-50 rounded-xl border border-base-100 flex items-center justify-center overflow-hidden mb-4 relative">
                      <img
                        src={asset.url}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-all duration-700 z-10 relative"
                        alt={`Asset ${idx + 1}`}
                      />
                      <div className="absolute inset-0 bg-base-900/5 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center z-20">
                        <a
                          href={asset.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-circle btn-sm bg-white border-none shadow-lg text-[var(--primary)]"
                        >
                          <Download size={14} />
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-base-content truncate uppercase tracking-tight">ASSET_{String(idx + 1).padStart(2, '0')}</p>
                        <p className="text-[8px] font-mono text-base-content/30 uppercase tracking-widest">{asset.url.split('/').pop().slice(0, 10)}...</p>
                      </div>
                      <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center bg-base-50/50 rounded-3xl border-2 border-dashed border-base-200 text-center px-8">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-base-content/10 mb-4 border border-base-200">
                  <FileText size={24} />
                </div>
                <h5 className="text-[11px] font-bold text-base-content/60 uppercase tracking-widest mb-2">No Branding Assets</h5>
                <p className="text-[10px] font-bold text-base-content/30 max-w-[200px] uppercase tracking-tight leading-snug">This order contains no external branding requirements or files.</p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: SIZE CHART ── */}
        {activeTab === 'sizechart' && (
          <div className="p-8 space-y-8 animate-in slide-in-from-right-2 duration-500">

            {sizeChartUrl ? (
              <>
                {/* File card header */}
                <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-base-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
                      <Ruler size={22} className="text-[var(--primary)]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-base-content/30 uppercase tracking-widest mb-0.5">Customer Size Chart</p>
                      <p className="text-[11px] font-bold text-base-content">
                        {sizeChartUrl.split('/').pop().split('?')[0] || 'size-chart-file'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={sizeChartUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-xs h-8 px-3 gap-1.5 bg-base-200 text-base-content border-none rounded-xl font-bold uppercase tracking-wider hover:bg-base-300 transition-all"
                    >
                      <ExternalLink size={12} /> Open
                    </a>
                    <a
                      href={sizeChartUrl}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-xs h-8 px-3 gap-1.5 bg-[var(--primary)] text-white border-none rounded-xl font-bold uppercase tracking-wider shadow-sm hover:brightness-110 transition-all"
                    >
                      <Download size={12} /> Download
                    </a>
                  </div>
                </div>

                {/* Image preview (if applicable) */}
                {isImageChart && (
                  <div className="relative rounded-2xl overflow-hidden border border-base-200 bg-slate-50 group">
                    <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
                    <img
                      src={sizeChartUrl}
                      alt="Customer Size Chart"
                      className="w-full object-contain max-h-[500px] p-4 group-hover:scale-[1.02] transition-all duration-700 z-10 relative"
                    />
                  </div>
                )}

                {/* Non-image file embed (PDF etc.) */}
                {!isImageChart && sizeChartUrl && (
                  <div className="rounded-2xl overflow-hidden border border-base-200 bg-base-50/50">
                    <iframe
                      src={sizeChartUrl}
                      title="Size Chart Document"
                      className="w-full h-[480px] border-0"
                    />
                  </div>
                )}

                {/* Custom size rows table */}
                {isCustomSizing && customSizeRows.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 flex items-center gap-2">
                      <Scissors size={14} className="text-[var(--primary)]" /> Specified Size Quantities
                    </h4>
                    <div className="bg-white rounded-2xl border border-base-200 overflow-hidden shadow-sm">
                      <table className="w-full text-sm">
                        <thead className="bg-base-50 border-b border-base-200">
                          <tr>
                            <th className="text-left px-6 py-3 text-[9px] font-black uppercase tracking-widest text-base-content/40">Size / Label</th>
                            <th className="text-right px-6 py-3 text-[9px] font-black uppercase tracking-widest text-base-content/40">Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customSizeRows.map((row, i) => (
                            <tr key={row.id || i} className="border-b border-base-100 last:border-0 hover:bg-base-50 transition-colors">
                              <td className="px-6 py-3.5 text-[11px] font-bold text-base-content uppercase tracking-tight">{row.name}</td>
                              <td className="px-6 py-3.5 text-right">
                                <span className="px-3 py-1 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] text-[11px] font-black">
                                  {row.qty} pcs
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-base-50 border-t border-base-200">
                          <tr>
                            <td className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-base-content/40">Total</td>
                            <td className="px-6 py-3 text-right text-[11px] font-black text-[var(--primary)]">
                              {customSizeRows.reduce((sum, r) => sum + (parseInt(r.qty) || 0), 0)} pcs
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty state */
              <div className="h-[400px] flex flex-col items-center justify-center bg-base-50/50 rounded-3xl border-2 border-dashed border-base-200 text-center px-8">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-base-content/10 mb-4 border border-base-200">
                  <Ruler size={28} />
                </div>
                <h5 className="text-[11px] font-bold text-base-content/60 uppercase tracking-widest mb-2">
                  {isCustomSizing ? 'No Size Chart Uploaded' : 'Standard Sizing Used'}
                </h5>
                <p className="text-[10px] font-bold text-base-content/30 max-w-[220px] uppercase tracking-tight leading-snug">
                  {isCustomSizing
                    ? 'The customer did not attach a size chart file with this order.'
                    : 'This order uses the standard factory size chart. No custom file was provided.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: LOGISTICS & SHIPPING ── */}
        {activeTab === 'logistics' && (
          <div className="p-0 h-full animate-in slide-in-from-right-2 duration-500">
             <AdminShippingDetails order={order} />
          </div>
        )}

      </div>
    </div>
  );
}
