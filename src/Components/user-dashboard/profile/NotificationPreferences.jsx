import React from 'react';
import { Bell, Mail, MessageSquare } from 'lucide-react';

export default function NotificationPreferences() {
  return (
    <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden font-sans h-full">
       <div className="px-6 py-5 border-b border-base-200 flex items-center gap-3">
          <div className="p-2 bg-info/10 rounded-lg">
             <Bell size={18} className="text-info" />
          </div>
          <div>
            <h3 className="font-bold text-base-content uppercase tracking-wider text-sm">Notifications</h3>
            <p className="text-[10px] text-base-content/50 uppercase tracking-widest mt-0.5">Control your email alerts</p>
          </div>
       </div>

       <div className="p-6 space-y-4">
          <div className="form-control hover:bg-base-200/50 p-4 -mx-4 rounded-xl transition-colors cursor-pointer group">
             <label className="flex items-center justify-between cursor-pointer w-full gap-4">
                <div className="flex-1 pr-6">
                   <span className="label-text font-bold text-sm tracking-wide flex items-center gap-2 group-hover:text-[var(--primary)] transition-colors">
                     <Mail size={16} className="text-base-content/60 group-hover:text-[var(--primary)] transition-colors" /> Order Progress Updates
                   </span>
                   <p className="text-xs text-base-content/50 mt-1.5 leading-relaxed">Get notified when your order moves to a new production phase (e.g., from Cutting to Sewing).</p>
                </div>
                <input type="checkbox" className="toggle toggle-md shrink-0" style={{ '--tglbg': 'var(--primary)', backgroundColor: 'transparent' }} defaultChecked />
             </label>
          </div>
          
          <div className="form-control hover:bg-base-200/50 p-4 -mx-4 rounded-xl transition-colors cursor-pointer group">
             <label className="flex items-center justify-between cursor-pointer w-full gap-4">
                <div className="flex-1 pr-6">
                   <span className="label-text font-bold text-sm tracking-wide flex items-center gap-2 group-hover:text-[var(--primary)] transition-colors">
                      <MessageSquare size={16} className="text-base-content/60 group-hover:text-[var(--primary)] transition-colors" /> Mockup Approvals
                   </span>
                   <p className="text-xs text-base-content/50 mt-1.5 leading-relaxed">Immediate alerts when a designer uploads a tech pack or physical sample photo requiring your review.</p>
                </div>
                <input type="checkbox" className="toggle toggle-md shrink-0" style={{ '--tglbg': 'var(--primary)', backgroundColor: 'transparent' }} defaultChecked />
             </label>
          </div>
          
          <div className="w-full border-t border-base-200/60 my-2"></div>

          <div className="form-control hover:bg-base-200/50 p-4 -mx-4 rounded-xl transition-colors cursor-pointer group">
             <label className="flex items-center justify-between cursor-pointer w-full gap-4">
                <div className="flex-1 pr-6">
                   <span className="label-text font-bold text-sm tracking-wide flex items-center gap-2 text-base-content/80 group-hover:text-base-content transition-colors">
                      Promotional Offers
                   </span>
                   <p className="text-xs text-base-content/40 mt-1.5 leading-relaxed">Receive manufacturing discounts, seasonal shipping rates, and newsletter updates.</p>
                </div>
                <input type="checkbox" className="toggle toggle-md shrink-0" />
             </label>
          </div>
       </div>
    </div>
  );
}
