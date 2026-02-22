'use client';

import React, { useState } from 'react';
import { 
  Building2, MapPin, Receipt, CreditCard, ArrowRight, 
  CheckCircle2, FileText, Pencil, Truck, 
  ShieldCheck, Download, Plane, Ship, Box
} from 'lucide-react';

import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

// ==========================================
// 1. MOCK DATA & FREIGHT RATES
// ==========================================
const ORDER_DATA = {
  orderId: "REQ-8892-FC",
  product: {
    name: "Heavyweight Cotton Fleece Hoodie",
    sku: "FCT-HOOD-400",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop",
    color: "Black",
    unitWeightKg: 0.85, // 850 grams per hoodie
  },
  customization: {
    enabled: true,
    format: "Screen Print",
    formatCost: 1.50,
  },
  sizing: {
    breakdown: [
      { size: "S", qty: 20 },
      { size: "M", qty: 50 },
      { size: "L", qty: 30 }
    ]
  },
  pricing: {
    totalUnits: 100,
    baseUnitPrice: 18.50,
  }
};

// Realistic Factory-to-Door Freight Rates (Per KG)
const FREIGHT_RATES = {
  "United States": { express: 8.50, cargo: 5.50, transitExpress: "3-5 Days", transitCargo: "8-12 Days" },
  "United Kingdom": { express: 7.00, cargo: 4.50, transitExpress: "3-5 Days", transitCargo: "7-10 Days" },
  "Canada": { express: 9.00, cargo: 6.00, transitExpress: "4-6 Days", transitCargo: "10-14 Days" },
  "Australia": { express: 9.50, cargo: 6.50, transitExpress: "5-7 Days", transitCargo: "12-15 Days" },
  "Europe (Other)": { express: 7.50, cargo: 4.80, transitExpress: "4-6 Days", transitCargo: "8-12 Days" },
};

export default function OrderReviewPage() {
  // --- INTERACTIVE STATE ---
  const [shippingMethod, setShippingMethod] = useState('express'); // 'express' | 'cargo'
  const [paymentMethod, setPaymentMethod] = useState('invoice'); // 'invoice' | 'card'
  const [shippingCountry, setShippingCountry] = useState('United States');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Form Data State (makes inputs functional)
  const [formData, setFormData] = useState({
    companyName: '', taxId: '', contactName: '', email: '',
    address: '', city: '', state: '', zip: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- DYNAMIC FREIGHT CALCULATIONS ---
  const { totalUnits, baseUnitPrice } = ORDER_DATA.pricing;
  
  // 1. Calculate Weight
  const totalWeightKg = totalUnits * ORDER_DATA.product.unitWeightKg;
  
  // 2. Determine Rate per KG based on Country and Method
  const activeRateData = FREIGHT_RATES[shippingCountry];
  const ratePerKg = activeRateData[shippingMethod];
  const transitTime = shippingMethod === 'express' ? activeRateData.transitExpress : activeRateData.transitCargo;
  
  // 3. Calculate Final Shipping
  const shippingEstimate = totalWeightKg * ratePerKg;

  // --- PRODUCT COST CALCULATIONS ---
  const brandingCostPerUnit = ORDER_DATA.customization.enabled ? ORDER_DATA.customization.formatCost : 0;
  const finalUnitPrice = baseUnitPrice + brandingCostPerUnit;
  
  const subtotal = totalUnits * finalUnitPrice;
  const total = subtotal + shippingEstimate;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      

      <main className="flex-1 pt-24 pb-20">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          
          {/* --- TOP PROGRESS BAR --- */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-6">Checkout & Logistics</h1>
            <div className="flex items-center gap-3 text-sm font-bold text-slate-400 overflow-x-auto whitespace-nowrap pb-2">
               <span className="text-slate-900 flex items-center gap-1.5"><CheckCircle2 size={18} className="text-green-500"/> Configuration</span>
               <span className="w-12 h-px bg-slate-300"></span>
               <span className="text-blue-600 flex items-center gap-1.5 border-b-2 border-blue-600 pb-1">Logistics & Billing</span>
               <span className="w-12 h-px bg-slate-300"></span>
               <span className="flex items-center gap-1.5">Production</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* ==============================================================
                LEFT COLUMN: FORMS & LOGISTICS
                ============================================================== */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* 1. Company Details */}
              <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><Building2 size={20} /></div>
                  <h2 className="text-xl font-bold text-slate-900">Company & Contact</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wider">Company Name *</label>
                    <input name="companyName" value={formData.companyName} onChange={handleInputChange} type="text" placeholder="e.g. Acme Streetwear" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wider">Tax ID / VAT Number</label>
                    <input name="taxId" value={formData.taxId} onChange={handleInputChange} type="text" placeholder="Optional for Customs" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wider">Contact Name *</label>
                    <input name="contactName" value={formData.contactName} onChange={handleInputChange} type="text" placeholder="John Doe" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wider">Email Address *</label>
                    <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="john@company.com" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" />
                  </div>
                </div>
              </section>

              {/* 2. Destination (Triggers Freight Calc) */}
              <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><MapPin size={20} /></div>
                  <div className="flex-1">
                     <h2 className="text-xl font-bold text-slate-900">Destination Address</h2>
                     <p className="text-xs text-slate-500 mt-0.5">Freight rates update automatically based on country.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wider">Country *</label>
                    <select 
                      value={shippingCountry}
                      onChange={(e) => setShippingCountry(e.target.value)}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none font-bold text-slate-900 cursor-pointer"
                    >
                      {Object.keys(FREIGHT_RATES).map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wider">Street Address *</label>
                    <input name="address" value={formData.address} onChange={handleInputChange} type="text" placeholder="123 Warehouse Row" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wider">City *</label>
                    <input name="city" value={formData.city} onChange={handleInputChange} type="text" placeholder="Los Angeles" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wider">ZIP / Postal Code *</label>
                    <input name="zip" value={formData.zip} onChange={handleInputChange} type="text" placeholder="90001" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" />
                  </div>
                </div>
              </section>

              {/* 3. Logistics / Shipping Method (FIXED CLICK HANDLERS) */}
              <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><Truck size={20} /></div>
                  <h2 className="text-xl font-bold text-slate-900">Freight Method</h2>
                </div>

                <div className="space-y-4">
                  {/* DHL Express */}
                  <div 
                    onClick={() => setShippingMethod('express')}
                    className={`flex items-start gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-blue-600 bg-blue-50/40 shadow-sm' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
                  >
                     <div className="pt-1 flex-shrink-0">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'express' ? 'border-blue-600' : 'border-slate-300'}`}>
                           {shippingMethod === 'express' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                        </div>
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <p className="font-bold text-slate-900 flex items-center gap-2">Air Express <Plane size={14} className="text-slate-400"/></p>
                            <p className="text-xs text-blue-600 font-bold mt-0.5">Est. Transit: {activeRateData.transitExpress}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-black text-slate-900">${activeRateData.express.toFixed(2)}/kg</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">Fastest transit. Factory to Door. Fully tracked via DHL/FedEx.</p>
                     </div>
                  </div>

                  {/* Standard Cargo */}
                  <div 
                    onClick={() => setShippingMethod('cargo')}
                    className={`flex items-start gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${shippingMethod === 'cargo' ? 'border-blue-600 bg-blue-50/40 shadow-sm' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
                  >
                     <div className="pt-1 flex-shrink-0">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'cargo' ? 'border-blue-600' : 'border-slate-300'}`}>
                           {shippingMethod === 'cargo' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                        </div>
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <p className="font-bold text-slate-900 flex items-center gap-2">Standard Air Cargo <Ship size={14} className="text-slate-400"/></p>
                            <p className="text-xs text-blue-600 font-bold mt-0.5">Est. Transit: {activeRateData.transitCargo}</p>
                          </div>
                          <div className="text-right">
                             <span className="text-sm font-black text-slate-900">${activeRateData.cargo.toFixed(2)}/kg</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">Economical for bulk orders. Clears customs and delivers directly to your warehouse.</p>
                     </div>
                  </div>
                </div>
              </section>

              {/* 4. Payment Terms (FIXED CLICK HANDLERS) */}
              <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><Receipt size={20} /></div>
                  <h2 className="text-xl font-bold text-slate-900">Payment Terms</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setPaymentMethod('invoice')} 
                    className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${paymentMethod === 'invoice' ? 'border-blue-600 bg-blue-50/40 shadow-sm' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
                  >
                     <div className="flex justify-between items-start mb-3">
                        <FileText size={24} className={paymentMethod === 'invoice' ? 'text-blue-600' : 'text-slate-400'}/>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'invoice' ? 'border-blue-600' : 'border-slate-300'}`}>
                           {paymentMethod === 'invoice' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                        </div>
                     </div>
                     <p className="font-bold text-slate-900 text-sm">Proforma Invoice</p>
                     <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Submit order now. Pay via Bank Transfer (Wire/ACH) to save on fees.</p>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('card')} 
                    className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/40 shadow-sm' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
                  >
                     <div className="flex justify-between items-start mb-3">
                        <CreditCard size={24} className={paymentMethod === 'card' ? 'text-blue-600' : 'text-slate-400'}/>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-blue-600' : 'border-slate-300'}`}>
                           {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                        </div>
                     </div>
                     <p className="font-bold text-slate-900 text-sm">Pay Deposit Now</p>
                     <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Pay 50% deposit upfront via Credit Card to immediately queue production.</p>
                  </div>
                </div>
              </section>

            </div>

            {/* ==============================================================
                RIGHT COLUMN: LIVE RECEIPT & SUMMARY
                ============================================================== */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl lg:sticky lg:top-32 overflow-hidden">
                
                {/* Summary Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <h3 className="font-black text-lg text-slate-900 uppercase tracking-wider">Order Summary</h3>
                  <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                    <Pencil size={12}/> Edit Config
                  </button>
                </div>

                {/* Product Snapshot */}
                <div className="p-6 border-b border-slate-100">
                   <div className="flex gap-4">
                      <div className="w-24 h-28 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                         <img src={ORDER_DATA.product.image} alt="Product" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-center">
                         <p className="font-bold text-slate-900 leading-snug">{ORDER_DATA.product.name}</p>
                         <p className="text-xs text-slate-500 font-mono mt-1 mb-3">SKU: {ORDER_DATA.product.sku}</p>
                         <div className="flex flex-wrap gap-2">
                           <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded">Color: {ORDER_DATA.product.color}</span>
                           {ORDER_DATA.customization.enabled && (
                             <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded border border-blue-100">
                               {ORDER_DATA.customization.format}
                             </span>
                           )}
                         </div>
                      </div>
                   </div>

                   {/* Size Breakdown */}
                   <div className="mt-5 pt-5 border-t border-slate-100">
                     <div className="flex justify-between items-center mb-3">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Size Breakdown</p>
                        <p className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">{totalUnits} Units Total</p>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {ORDER_DATA.sizing.breakdown.map((item, idx) => (
                           <div key={idx} className="flex items-center border border-slate-200 rounded-md overflow-hidden text-xs shadow-sm">
                              <span className="px-2.5 py-1.5 bg-slate-50 font-bold text-slate-700 border-r border-slate-200">{item.size}</span>
                              <span className="px-2.5 py-1.5 bg-white font-black text-slate-900">{item.qty}</span>
                           </div>
                        ))}
                     </div>
                   </div>
                </div>

                {/* --- LIVE CALCULATIONS --- */}
                <div className="p-6 space-y-5 bg-slate-50/50">
                   
                   {/* Products */}
                   <div>
                     <div className="flex justify-between text-sm font-bold text-slate-800 mb-1.5">
                        <span>Production Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between text-xs text-slate-500 ml-2">
                        <span>• Base Rate ({totalUnits} pcs)</span>
                        <span>${baseUnitPrice.toFixed(2)}/pc</span>
                     </div>
                     {ORDER_DATA.customization.enabled && (
                       <div className="flex justify-between text-xs text-slate-500 ml-2 mt-1">
                          <span>• Branding Surcharge</span>
                          <span>+${ORDER_DATA.customization.formatCost.toFixed(2)}/pc</span>
                       </div>
                     )}
                   </div>

                   {/* Logistics */}
                   <div className="pt-5 border-t border-slate-200">
                     <div className="flex justify-between text-sm font-bold text-slate-800 mb-1.5">
                        <span className="flex items-center gap-1.5"><Truck size={16} className="text-blue-600"/> Freight Estimate</span>
                        <span>${shippingEstimate.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between text-xs text-slate-500 ml-6">
                        <span className="flex items-center gap-1">
                          <Box size={12}/> Total Weight: <strong className="text-slate-700">{totalWeightKg.toFixed(1)} kg</strong>
                        </span>
                     </div>
                     <div className="flex justify-between text-xs text-slate-500 ml-6 mt-1">
                        <span>Rate ({shippingMethod === 'express' ? 'Express' : 'Cargo'} to {shippingCountry})</span>
                        <span>${ratePerKg.toFixed(2)}/kg</span>
                     </div>
                   </div>
                </div>

                {/* Final Total Area */}
                <div className="p-6 bg-slate-900 text-white">
                   <div className="flex justify-between items-end mb-6">
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Amount</span>
                      <span className="text-4xl font-black tracking-tight">${total.toFixed(2)}</span>
                   </div>

                   {/* FIXED TERMS CHECKBOX */}
                   <div 
                     onClick={() => setAgreedToTerms(!agreedToTerms)}
                     className="flex items-start gap-3 cursor-pointer mb-6 group p-3 rounded-lg hover:bg-slate-800 transition-colors"
                   >
                      <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${agreedToTerms ? 'bg-blue-500 border-blue-500' : 'bg-transparent border-slate-500 group-hover:border-blue-400'}`}>
                         {agreedToTerms && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                      <span className="text-xs text-slate-300 leading-relaxed select-none">
                        I verify all specs, sizes, and shipping details. I agree to the <span className="text-white underline">Terms of Production</span>.
                      </span>
                   </div>

                   {/* Primary Action Button */}
                   <button 
                     disabled={!agreedToTerms}
                     className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-500 shadow-xl shadow-blue-900/50 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                   >
                     {paymentMethod === 'invoice' ? 'Generate PO & Submit' : 'Proceed to Payment'} 
                     <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                   </button>
                   
                   {/* Utility */}
                   <button className="w-full mt-4 py-3 border border-slate-700 text-slate-300 rounded-xl font-bold hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2 text-sm">
                     <Download size={16} /> Download Quote PDF
                   </button>

                   <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                     <ShieldCheck size={14}/> Secure Factory Direct Portal
                   </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>

  
    </div>
  );
}