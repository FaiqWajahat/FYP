'use client';

import React, { useState, useEffect } from 'react';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import ProfileHeader from '@/Components/common/profile/ProfileHeader';
import PersonalInformationForm from '@/Components/common/profile/PersonalInformationForm';
import ShippingBillingAddresses from '@/Components/common/profile/ShippingBillingAddresses';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [fetching, setFetching] = useState(true);

  const fetchUser = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProfileData(data);
    } catch (err) {
      toast.error("User not found or access denied.");
      router.push('/Dashboard/Users/All');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (id) fetchUser();
  }, [id, router]);

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-[var(--primary)]" />
        <p className="text-sm font-black uppercase tracking-widest text-base-content/40">Fetching account details...</p>
      </div>
    );
  }

  const breadData = [
    { name: 'Dashboard', href: '/Dashboard' },
    { name: 'Users', href: '/Dashboard/Users/All' },
    { name: 'Edit User', href: `/Dashboard/Users/Edit/${id}` },
  ];

  return (
    <div className="space-y-8 pb-12 w-full max-w-7xl mx-auto">
      <DashboardPageHeader
        breadData={breadData}
        heading={`User Management`}
        subHeading={`Editing Profile for ${profileData?.full_name || 'User'}`}
      />

      <ProfileHeader 
        profile={profileData} 
        targetUserId={id} 
        onSuccess={fetchUser} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
         <div className="lg:col-span-8 flex flex-col gap-8 min-w-0">
            <PersonalInformationForm 
              profile={profileData} 
              targetUserId={id} 
              onSuccess={fetchUser} 
              showRoleSelector={true} 
            />
            <ShippingBillingAddresses 
              profile={profileData} 
              targetUserId={id} 
              onSuccess={fetchUser} 
            />
         </div>

         <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl shadow-blue-900/10">
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-blue-500/20 rounded-xl">
                    <svg size={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                 </div>
                 <h4 className="font-black uppercase tracking-widest text-sm">Admin Controls</h4>
               </div>
               <p className="text-xs text-white/50 font-medium mb-8 leading-relaxed">As an administrator, you are modifying an external user profile. Changes are logged and applied instantly.</p>
               <button onClick={() => router.push('/Dashboard/Users/All')} className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                  Back to User List
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
