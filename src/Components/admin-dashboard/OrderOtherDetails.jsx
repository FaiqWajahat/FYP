"use client";
import React from 'react';
import { CreditCard, User, MapPin, Phone, Mail, Fingerprint } from 'lucide-react';

const OrderOtherDetails = ({ order }) => {
  if (!order) return null;
  const profile = order.profiles || {};

  return (
    <div className="w-full grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Customer Record */}
      <div className="bg-base-100 rounded-xl border border-base-200 shadow-sm overflow-hidden">
        <div className="px-4 py-2 bg-base-200/50 border-b border-base-200">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-base-content/50">Client Identity</h3>
        </div>
        <div className="p-5 flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
            <User className="text-primary" size={20} />
          </div>
          <div className="flex flex-col">
            <h4 className="text-sm font-black text-base-content">{profile.full_name || 'Guest User'}</h4>
            <div className="mt-2 space-y-1">
               <div className="flex items-center gap-2 text-[10px] text-base-content/60 font-medium">
                  <Mail size={12} className="shrink-0" />
                  <span className="truncate">{profile.email || 'No email provided'}</span>
               </div>
               <div className="flex items-center gap-2 text-[10px] text-base-content/60 font-medium">
                  <Fingerprint size={12} className="shrink-0" />
                  <span className="font-mono">ID: {profile.id?.slice(0,8) || 'Unknown'}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Production Metadata */}
      <div className="bg-base-100 rounded-xl border border-base-200 shadow-sm overflow-hidden">
        <div className="px-4 py-2 bg-base-200/50 border-b border-base-200">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-base-content/50">Production Specs</h3>
        </div>
        <div className="p-5 flex items-start gap-4">
          <div className="w-12 h-12 bg-base-200 rounded-xl flex items-center justify-center shrink-0">
             <Fingerprint className="text-base-content/40" size={20} />
          </div>
          <div className="flex flex-col">
            <h4 className="text-sm font-black text-base-content">System Reference</h4>
            <div className="mt-2 space-y-1">
               <p className="text-[10px] font-medium text-base-content/60 uppercase racking-tight">
                  <span className="text-primary font-black">Internal ID:</span> {order.id}
               </p>
               <p className="text-[10px] font-medium text-base-content/60 uppercase tracking-tight">
                  <span className="text-primary font-black">SKU Prefix:</span> {order.sku?.split('-')[0] || 'N/A'}
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estimated Shipping */}
      <div className="bg-base-100 rounded-xl border border-base-200 shadow-sm overflow-hidden">
        <div className="px-4 py-2 bg-base-200/50 border-b border-base-200">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-base-content/50">Logistics Overview</h3>
        </div>
        <div className="p-5 flex items-start gap-4">
          <div className="w-12 h-12 bg-base-200 rounded-xl flex items-center justify-center shrink-0 font-mono text-xs font-black text-base-content/40">
             MAP
          </div>
          <div className="flex flex-col">
            <h4 className="text-sm font-black text-base-content">Shipping Status</h4>
            <div className="mt-2 space-y-1">
               <p className="text-[10px] font-medium text-base-content/60 leading-relaxed uppercase">
                  {order.shipping_tracking ? (
                    <span className="text-emerald-600 font-black">Tracking: {order.shipping_tracking}</span>
                  ) : (
                    "No tracking info generated yet."
                  )}
               </p>
               <p className="text-[10px] font-medium text-base-content/40 italic">
                  Address details are locked to the user profile or technical sheet.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderOtherDetails;