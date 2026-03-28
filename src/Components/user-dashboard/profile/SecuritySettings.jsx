import React from 'react';
import { ShieldAlert, KeyRound, Smartphone } from 'lucide-react';

export default function SecuritySettings() {
   return (
      <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden font-sans">
         <div className="px-6 py-5 border-b border-base-200 flex items-center gap-3">
            <div className="p-2 bg-error/10 rounded-lg">
               <ShieldAlert size={18} className="text-error" />
            </div>
            <div>
               <h3 className="font-bold text-base-content uppercase tracking-wider text-sm">Security & Access</h3>
               <p className="text-[10px] text-base-content/50 uppercase tracking-widest mt-0.5">Protect your account credentials</p>
            </div>
         </div>

         <div className="p-0">
            {/* Password Section */}
            <div className="p-6 border-b border-base-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <KeyRound size={16} className="text-base-content/70" />
                     <h4 className="font-bold text-sm tracking-wide">Account Password</h4>
                  </div>
                  <p className="text-[11px] text-base-content/60 max-w-sm leading-relaxed">It's a good idea to use a strong password that you're not using elsewhere.</p>
               </div>
               <button className="btn btn-outline btn-sm uppercase tracking-wider font-bold text-xs shrink-0">
                  Change Password
               </button>
            </div>

            {/* 2FA Section */}
            <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <Smartphone size={16} className="text-warning" />
                     <h4 className="font-bold text-sm tracking-wide text-base-content">Two-Factor Authentication</h4>
                  </div>
                  <p className="text-[11px] text-base-content/60 max-w-sm leading-relaxed">Add an extra layer of security to your account by turning on 2FA.</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-warning/10 border border-warning/20 text-warning text-[10px] font-bold uppercase tracking-widest">
                     Not configured
                  </div>
               </div>
               <button className="btn btn-warning btn-outline btn-sm uppercase tracking-wider font-bold text-xs shrink-0">
                  Setup 2FA
               </button>
            </div>
         </div>
      </div>
   );
}
