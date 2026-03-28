import React from 'react';
import { User } from 'lucide-react';

export default function PersonalInformationForm() {
  return (
    <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden font-sans">
       <div className="px-6 py-5 border-b border-base-200 flex items-center gap-3">
          <div className="p-2 bg-[var(--primary)]/10 rounded-lg">
             <User size={18} className="text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="font-bold text-base-content uppercase tracking-wider text-sm">Personal Information</h3>
            <p className="text-[10px] text-base-content/50 uppercase tracking-widest mt-0.5">Manage your core account details</p>
          </div>
       </div>

       <div className="p-6">
          <form className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control w-full">
                   <label className="label py-1">
                      <span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">First Name</span>
                   </label>
                   <input type="text" defaultValue="John" className="input input-bordered focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 w-full transition-shadow" />
                </div>
                <div className="form-control w-full">
                   <label className="label py-1">
                      <span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Last Name</span>
                   </label>
                   <input type="text" defaultValue="Doe" className="input input-bordered focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 w-full transition-shadow" />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control w-full">
                   <label className="label py-1">
                      <span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Email Address</span>
                   </label>
                   <input type="email" defaultValue="john.doe@acmecorp.com" className="input input-bordered focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 w-full transition-shadow" />
                </div>
                <div className="form-control w-full">
                   <label className="label py-1">
                      <span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Phone Number</span>
                   </label>
                   <input type="tel" defaultValue="+1 (555) 123-4567" className="input input-bordered focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 w-full transition-shadow" />
                </div>
             </div>

             <div className="w-full border-t border-base-200/60 my-2"></div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control w-full">
                   <label className="label py-1">
                      <span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Company Name</span>
                   </label>
                   <input type="text" defaultValue="Acme Corp Logistics" className="input input-bordered focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 w-full transition-shadow" />
                </div>
                <div className="form-control w-full">
                   <label className="label py-1">
                      <span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">VAT / Tax ID</span>
                   </label>
                   <input type="text" defaultValue="US-942-881-AFT" className="input input-bordered focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 w-full font-mono transition-shadow" />
                </div>
             </div>

             <div className="pt-4 flex justify-end">
                <button type="button" className="btn btn-primary uppercase tracking-wider font-bold text-xs px-8">
                   Update Changes
                </button>
             </div>
          </form>
       </div>
    </div>
  );
}
