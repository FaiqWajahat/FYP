import React, { useState, useEffect } from 'react';
import { MapPin, Home, Globe, Hash, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export default function ShippingBillingAddresses({ profile, user, refreshProfile, targetUserId, onSuccess }) {
   const [isSaving, setIsSaving] = useState(false);
   const [address, setAddress] = useState({
      street: '',
      city: '',
      country: '',
      zip: '',
   });

   const effectiveUserId = targetUserId || user?.id;

   useEffect(() => {
      if (profile?.shipping_address) {
         setAddress({
            street: profile.shipping_address.street || '',
            city: profile.shipping_address.city || '',
            country: profile.shipping_address.country || '',
            zip: profile.shipping_address.zip || '',
         });
      }
   }, [profile]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSaving(true);

      try {
         const { error } = await supabase
            .from('profiles')
            .update({
               shipping_address: address,
               updated_at: new Date().toISOString(),
            })
            .eq('id', effectiveUserId);

         if (error) throw error;

         toast.success('Address updated successfully!');

         if (onSuccess) {
            onSuccess();
         } else if (refreshProfile) {
            refreshProfile();
         }
      } catch (error) {
         console.error('Update error:', error);
         toast.error(error.message || 'Failed to update address');
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <div className="bg-base-100 rounded-3xl shadow-xl shadow-black/5 border border-base-200 overflow-hidden font-sans">
         <div className="px-8 py-6 border-b border-base-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-[var(--primary)]/10 rounded-2xl">
                  <MapPin size={22} className="text-[var(--primary)]" />
               </div>
               <div>
                  <h3 className="font-black text-base-content uppercase tracking-widest text-sm">Shipping Address</h3>
                  <p className="text-[10px] text-base-content/50 font-bold uppercase tracking-widest mt-0.5">Where your products will be delivered</p>
               </div>
            </div>
         </div>

         <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="form-control w-full md:col-span-2">
                     <label className="label py-1">
                        <span className="label-text text-[10px] font-black uppercase tracking-widest text-base-content/60 ml-1">Street Address</span>
                     </label>
                     <div className="relative">
                        <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
                        <input
                           type="text"
                           value={address.street}
                           onChange={(e) => setAddress({ ...address, street: e.target.value })}
                           className="input input-bordered w-full pl-12 h-14 bg-base-200/50 border-transparent focus:bg-base-100 focus:border-[var(--primary)] focus:ring-[var(--primary)]/20 rounded-2xl transition-all font-medium"
                           placeholder="House # / Street Name"
                        />
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="form-control w-full">
                     <label className="label py-1">
                        <span className="label-text text-[10px] font-black uppercase tracking-widest text-base-content/60 ml-1">City</span>
                     </label>
                     <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
                        <input
                           type="text"
                           value={address.city}
                           onChange={(e) => setAddress({ ...address, city: e.target.value })}
                           className="input input-bordered w-full pl-12 h-14 bg-base-200/50 border-transparent focus:bg-base-100 focus:border-[var(--primary)] focus:ring-[var(--primary)]/20 rounded-2xl transition-all font-medium"
                           placeholder="Sialkot"
                        />
                     </div>
                  </div>
                  <div className="form-control w-full">
                     <label className="label py-1">
                        <span className="label-text text-[10px] font-black uppercase tracking-widest text-base-content/60 ml-1">Country</span>
                     </label>
                     <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
                        <input
                           type="text"
                           value={address.country}
                           onChange={(e) => setAddress({ ...address, country: e.target.value })}
                           className="input input-bordered w-full pl-12 h-14 bg-base-200/50 border-transparent focus:bg-base-100 focus:border-[var(--primary)] focus:ring-[var(--primary)]/20 rounded-2xl transition-all font-medium"
                           placeholder="Pakistan"
                        />
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="form-control w-full">
                     <label className="label py-1">
                        <span className="label-text text-[10px] font-black uppercase tracking-widest text-base-content/60 ml-1">ZIP / Postal Code</span>
                     </label>
                     <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
                        <input
                           type="text"
                           value={address.zip}
                           onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                           className="input input-bordered w-full pl-12 h-14 bg-base-200/50 border-transparent focus:bg-base-100 focus:border-[var(--primary)] focus:ring-[var(--primary)]/20 rounded-2xl transition-all font-medium"
                           placeholder="51310"
                        />
                     </div>
                  </div>
               </div>

               <div className="pt-4 flex justify-end">
                  <button
                     type="submit"
                     disabled={isSaving}
                     className="btn bg-[var(--primary)] h-14 px-10 rounded-xl text-white shadow-md shadow-[var(--primary)]/20 font-black uppercase tracking-widest text-xs gap-3"
                  >
                     {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                     {isSaving ? 'Updating Address...' : 'Update Address'}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}
