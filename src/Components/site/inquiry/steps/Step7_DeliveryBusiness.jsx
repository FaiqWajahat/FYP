'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Truck, Building2, User, Mail, Phone, Globe } from 'lucide-react';
import { TIMELINES, INCOTERMS } from '../inquiry-data';
import { useInquiryStore } from '@/store/useInquiryStore';

export default function Step7_DeliveryBusiness() {
  const {
    timeline, setTimeline, destination, setDestination,
    incoterm, setIncoterm,
    sampleRequired, setSampleRequired, sampleQty, setSampleQty,
    companyName, setCompanyName, contactName, setContactName,
    email, setEmail, phone, setPhone, website, setWebsite,
    specialNotes, setSpecialNotes,
  } = useInquiryStore();

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>

      {/* Timeline */}
      <h3 className="text-lg font-bold text-slate-900 mb-1">
        <Truck size={16} className="inline mr-1.5 text-blue-500" />
        Production & Delivery
      </h3>
      <p className="text-sm text-slate-500 mb-5">Select your production timeline and shipping preferences.</p>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Production Timeline</label>
        <div className="space-y-2">
          {TIMELINES.map((t) => {
            const isSelected = timeline === t.id;
            return (
              <button key={t.id} onClick={() => setTimeline(t.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left transition-all border ${
                  isSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'
                }`}>
                <div>
                  <p className={`text-sm font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>{t.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  {t.badge && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{t.badge}</span>}
                  {isSelected && <Check size={16} className="text-blue-500" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Shipping Destination */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Shipping Destination</label>
        <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)}
          placeholder="City, Country (e.g., Los Angeles, USA)"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300" />
      </div>

      {/* Incoterms */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Shipping Terms (Incoterm)</label>
        <div className="grid grid-cols-2 gap-2">
          {INCOTERMS.map((inc) => {
            const isSelected = incoterm === inc.id;
            return (
              <button key={inc.id} onClick={() => setIncoterm(inc.id)}
                className={`p-3 rounded-xl text-left transition-all border ${
                  isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-white hover:border-slate-200'
                }`}>
                <p className={`text-sm font-bold ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>{inc.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{inc.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sample */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-slate-700">Pre-Production Sample</label>
          <button onClick={() => setSampleRequired(!sampleRequired)}
            className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${
              sampleRequired ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
            }`}>{sampleRequired ? 'Required' : 'Not Required'}</button>
        </div>
        {sampleRequired && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mt-2">
            <span className="text-sm text-slate-600">Quantity:</span>
            <input type="number" min={1} max={10} value={sampleQty}
              onChange={(e) => setSampleQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-center outline-none focus:border-blue-400" />
            <span className="text-xs text-slate-400">pieces</span>
          </motion.div>
        )}
      </div>

      {/* ── BUSINESS INFO ── */}
      <div className="border-t border-slate-100 pt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          <Building2 size={16} className="inline mr-1.5 text-blue-500" />
          Business & Contact Info
        </h3>
        <p className="text-sm text-slate-500 mb-5">Provide your business details so we can prepare your quotation.</p>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Company Name</label>
              <div className="relative">
                <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your company" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-blue-400 placeholder:text-slate-300" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Contact Person <span className="text-red-500">*</span></label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)}
                  placeholder="Full name" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-blue-400 placeholder:text-slate-300" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Email <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-blue-400 placeholder:text-slate-300" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Phone / WhatsApp</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 8900" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-blue-400 placeholder:text-slate-300" />
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Website (optional)</label>
            <div className="relative">
              <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://www.yoursite.com" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-blue-400 placeholder:text-slate-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Special Notes */}
      <div className="mt-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Special Instructions</label>
        <textarea rows={3} value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)}
          placeholder="Any additional requirements, references, special instructions..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:border-blue-400 transition-all placeholder:text-slate-300 resize-none" />
      </div>
    </motion.div>
  );
}
