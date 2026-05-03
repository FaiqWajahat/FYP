"use client";
import React from 'react';
import { Truck, Package, MapPin, ExternalLink, CheckCircle2, Clock, Globe } from 'lucide-react';

export default function OrderShippingTracker({ order }) {
  if (!order) return null;

  const {
    shipping_method,
    shipping_carrier,
    shipping_tracking_number,
    shipping_status,
    shipping_address
  } = order;

  // If no shipping info yet, show a placeholder or pending state
  if (!shipping_method && !shipping_tracking_number && shipping_status === 'Pending') {
    return (
      <div className="bg-white rounded-3xl p-8 border border-base-200 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-base-50 flex items-center justify-center text-base-content/20">
            <Truck size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-base-content tracking-tight">Logistics & Delivery</h3>
            <p className="text-xs font-bold text-base-content/30 uppercase tracking-widest">Awaiting dispatch details</p>
          </div>
        </div>
        <div className="p-6 bg-base-50 rounded-2xl border border-dashed border-base-200 text-center">
           <Clock size={32} className="mx-auto text-base-content/10 mb-3" />
           <p className="text-sm font-bold text-base-content/40 uppercase tracking-widest">
             Shipping information will be updated once production is complete.
           </p>
        </div>
      </div>
    );
  }

  const steps = [
    { label: 'Packaging', status: ['Packaging', 'Ready for Pickup', 'Dispatched', 'In Transit', 'Delivered'].includes(shipping_status) },
    { label: 'Dispatched', status: ['Dispatched', 'In Transit', 'Delivered'].includes(shipping_status) },
    { label: 'In Transit', status: ['In Transit', 'Delivered'].includes(shipping_status) },
    { label: 'Delivered', status: shipping_status === 'Delivered' },
  ];

  return (
    <div className="bg-white rounded-3xl p-8 border border-base-200 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary)] text-white flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
            <Truck size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-base-content tracking-tight">Shipping Progress</h3>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-md">
                 {shipping_method || 'Standard'}
               </span>
               <span className="w-1 h-1 rounded-full bg-base-300" />
               <span className="text-xs font-bold text-base-content/40">{shipping_status}</span>
            </div>
          </div>
        </div>

        {shipping_tracking_number && (
          <a 
            href={`#`} // Placeholder for actual tracking link generator
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm h-10 px-5 rounded-xl bg-base-900 text-white border-none hover:bg-slate-800 gap-2 font-black uppercase tracking-widest text-[10px]"
          >
            Track on {shipping_carrier || 'Carrier'} Site <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Visual Progress Bar */}
      <div className="relative pt-4 pb-8">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-base-100 -translate-y-1/2 rounded-full" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-[var(--primary)] -translate-y-1/2 rounded-full transition-all duration-1000"
          style={{ width: `${(steps.filter(s => s.status).length - 1) / (steps.length - 1) * 100}%` }}
        />
        
        <div className="relative flex justify-between">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10 ${
                step.status 
                ? 'bg-[var(--primary)] border-white text-white shadow-md' 
                : 'bg-white border-base-100 text-base-content/20'
              }`}>
                {step.status ? <CheckCircle2 size={16} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${
                step.status ? 'text-base-content' : 'text-base-content/20'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-base-100">
        {/* Destination */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-base-content/30 flex items-center gap-2">
            <MapPin size={14} /> Shipping Destination
          </h4>
          <div className="p-5 bg-base-50 rounded-2xl border border-base-200">
             {shipping_address?.street ? (
               <div className="space-y-0.5">
                 <p className="text-sm font-bold text-base-content">{shipping_address.street}</p>
                 <p className="text-xs font-medium text-base-content/60">
                   {shipping_address.city}, {shipping_address.state} {shipping_address.zip}
                 </p>
                 <p className="text-xs font-black text-base-content uppercase tracking-widest pt-2">
                   {shipping_address.country}
                 </p>
               </div>
             ) : (
               <p className="text-xs font-bold text-base-content/30 uppercase italic">Address not provided</p>
             )}
          </div>
        </div>

        {/* Carrier Info */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-base-content/30 flex items-center gap-2">
            <Globe size={14} /> Logistics Details
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-base-200 shadow-sm">
               <span className="text-xs font-bold text-base-content/40 uppercase">Carrier</span>
               <span className="text-sm font-black text-base-content">{shipping_carrier || 'TBA'}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-base-200 shadow-sm">
               <span className="text-xs font-bold text-base-content/40 uppercase">Tracking ID</span>
               <span className="text-sm font-mono font-black text-[var(--primary)]">{shipping_tracking_number || 'Awaiting Dispatch'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
