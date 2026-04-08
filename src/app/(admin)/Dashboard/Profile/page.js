'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import Loader from '@/Components/common/Loader';
import { useAuth } from '@/store/AuthContext';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import ProfileHeader from '@/Components/common/profile/ProfileHeader';
import PersonalInformationForm from '@/Components/common/profile/PersonalInformationForm';
import ShippingBillingAddresses from '@/Components/common/profile/ShippingBillingAddresses';
import SecuritySettings from '@/Components/user-dashboard/profile/SecuritySettings';

const ProfilePage = () => {
  const { user, profile, loading, refreshProfile } = useAuth();

  if (loading) {
    return <Loader message="Accessing encrypted profile data..." />;
  }

  const breadData = [
    { name: 'Dashboard', href: '/Dashboard' },
    { name: 'Profile', href: '/Dashboard/Profile' },
  ];

  return (
    <div className="space-y-8 pb-12 w-full max-w-7xl mx-auto">
      <DashboardPageHeader breadData={breadData} heading="Profile Settings" />

      {/* Heavy Impact Header Banner & Avatar */}
      <ProfileHeader profile={profile} user={user} refreshProfile={refreshProfile} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
         
         {/* Main Left Column (Form Data) */}
         <div className="lg:col-span-8 flex flex-col gap-8 min-w-0">
            <PersonalInformationForm profile={profile} user={user} refreshProfile={refreshProfile} />
            <ShippingBillingAddresses profile={profile} user={user} refreshProfile={refreshProfile} />
            <SecuritySettings />
         </div>

         {/* Right Sidebar - Security & Stats */}
         <div className="lg:col-span-4 flex flex-col gap-8 min-w-0">
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl shadow-blue-900/10">
               <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-blue-500/20 rounded-xl">
                   <svg size={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield text-blue-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                 </div>
                 <h4 className="font-black uppercase tracking-widest text-sm">Security Status</h4>
               </div>
               <p className="text-xs text-white/50 font-medium mb-8 leading-relaxed">Your account is secured with email verification and Enterprise-grade Supabase Auth protection.</p>
               <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:tracking-[0.3em]">
                  Reset Account Password
               </button>
            </div>
         </div>
         
      </div>
    </div>
  );
};

export default ProfilePage;
