"use client"
import React, { useState } from 'react';
import { Truck, Navigation, CreditCard, PlusCircle, PenLine, Trash2, X } from 'lucide-react';

export default function ShippingBillingAddresses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden font-sans">
         <div className="px-6 py-5 border-b border-base-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100/30">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-[var(--primary)]/10 rounded-lg shrink-0">
                  <Navigation size={18} className="text-[var(--primary)]" />
               </div>
               <div>
                 <h3 className="font-bold text-base-content uppercase tracking-wider text-sm flex items-center gap-2">Addresses</h3>
                 <p className="text-[10px] text-base-content/50 uppercase tracking-widest mt-0.5">Manage delivery & billing locations</p>
               </div>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="btn btn-sm btn-outline text-xs uppercase tracking-wider shrink-0 w-full sm:w-auto"
            >
               <PlusCircle size={14} className="mr-1" /> Add New Address
            </button>
         </div>

         <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Default Shipping */}
            <div className="relative border border-[var(--primary)]/40 bg-[var(--primary)]/5 rounded-xl p-6 shadow-sm flex flex-col h-full hover:border-[var(--primary)] transition-colors">
               <div className="absolute top-4 right-4 text-[10px] bg-[var(--primary)] text-white px-2.5 py-1 rounded font-bold uppercase tracking-widest shadow-sm">
                  Default
               </div>
               
               <div className="flex items-center gap-2 mb-4 pr-16 bg-transparent">
                  <Truck size={18} className="text-[var(--primary)] shrink-0" />
                  <h4 className="font-bold text-sm uppercase tracking-wide text-base-content">Shipping Address</h4>
               </div>
               
               <div className="flex-grow space-y-1 mb-6">
                  <p className="text-sm font-bold text-base-content tracking-wide">Acme Warehouse 1</p>
                  <p className="text-xs text-base-content/70 leading-relaxed font-mono whitespace-pre-line">
                     123 Industrial Pkwy
                     Suite 400
                     New York, NY 10001
                     United States
                  </p>
               </div>
               
               <div className="flex gap-3 text-xs font-bold uppercase tracking-widest mt-auto border-t border-[var(--primary)]/10 pt-4">
                  <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 text-[var(--primary)] hover:opacity-70 transition-opacity">
                     <PenLine size={14} /> Edit
                  </button>
               </div>
            </div>

            {/* Default Billing */}
            <div className="relative border border-base-200 bg-base-100 rounded-xl p-6 flex flex-col h-full hover:shadow-md hover:border-base-300 transition-all">
               
               <div className="flex items-center gap-2 mb-4 pr-16">
                  <CreditCard size={18} className="text-base-content/60 shrink-0" />
                  <h4 className="font-bold text-sm uppercase tracking-wide text-base-content/80">Billing Address</h4>
               </div>
               
               <div className="flex-grow space-y-1 mb-6">
                  <p className="text-sm font-bold text-base-content tracking-wide">Acme HQ</p>
                  <p className="text-xs text-base-content/60 leading-relaxed font-mono whitespace-pre-line">
                     456 Financial District
                     Floor 12
                     New York, NY 10005
                     United States
                  </p>
               </div>
               
               <div className="flex gap-4 text-xs font-bold uppercase tracking-widest mt-auto border-t border-base-200/60 pt-4">
                  <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 text-base-content/60 hover:text-[var(--primary)] transition-colors">
                     <PenLine size={14} /> Edit
                  </button>
                  <button className="flex items-center gap-1.5 text-base-content/60 hover:text-error transition-colors">
                     <Trash2 size={14} /> Delete
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Address Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto font-sans">
           <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col my-auto border border-base-200">
               
               <div className="px-6 py-5 border-b border-base-200 flex justify-between items-center bg-base-100/30">
                  <h3 className="font-bold text-lg text-base-content tracking-tight">Address Details</h3>
                  <button 
                     onClick={() => setIsModalOpen(false)} 
                     className="btn btn-sm btn-ghost btn-circle"
                  >
                     <X size={18} className="text-base-content/60" />
                  </button>
               </div>

               <div className="p-6 overflow-y-auto max-h-[70vh]">
                  <form className="space-y-4">
                     <div className="form-control">
                        <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Location Name</span></label>
                        <input type="text" placeholder="e.g. Acme Warehouse 1" className="input input-bordered focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30" />
                     </div>
                     <div className="form-control">
                        <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Address Type</span></label>
                        <select className="select select-bordered focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30">
                           <option>Shipping Address</option>
                           <option>Billing Address</option>
                        </select>
                     </div>
                     <div className="form-control border-t border-base-200/60 pt-4 mt-2">
                        <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Street Address</span></label>
                        <input type="text" placeholder="123 Industrial Pkwy" className="input input-bordered focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 mb-4" />
                        <input type="text" placeholder="Apt, Suite, Building (Opional)" className="input input-bordered focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                           <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">City</span></label>
                           <input type="text" placeholder="New York" className="input input-bordered focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30" />
                        </div>
                        <div className="form-control">
                           <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">State / Region</span></label>
                           <input type="text" placeholder="NY" className="input input-bordered focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30" />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4 pb-2">
                        <div className="form-control">
                           <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Postal Code</span></label>
                           <input type="text" placeholder="10001" className="input input-bordered focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30" />
                        </div>
                        <div className="form-control">
                           <label className="label py-1"><span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Country</span></label>
                           <select className="select select-bordered focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30">
                              <option>United States</option>
                              <option>Canada</option>
                              <option>United Kingdom</option>
                           </select>
                        </div>
                     </div>
                  </form>
               </div>

               <div className="p-6 border-t border-base-200 bg-base-200/30 flex justify-end gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost text-xs uppercase tracking-wider font-bold">
                     Cancel
                  </button>
                  <button onClick={() => setIsModalOpen(false)} className="btn btn-primary text-xs uppercase tracking-wider font-bold px-8">
                     Save Address
                  </button>
               </div>

           </div>
        </div>
      )}
    </>
  );
}
