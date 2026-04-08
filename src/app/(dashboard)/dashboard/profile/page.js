'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/store/AuthContext';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import ProfileHeader from '@/Components/common/profile/ProfileHeader';
import PersonalInformationForm from '@/Components/common/profile/PersonalInformationForm';
import ShippingBillingAddresses from '@/Components/common/profile/ShippingBillingAddresses';
import SecuritySettings from '@/Components/user-dashboard/profile/SecuritySettings';
import NotificationPreferences from '@/Components/user-dashboard/profile/NotificationPreferences';

export default function ProfileSettingsPage() {
  const { user, profile, loading, refreshProfile } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-[var(--primary)]" />
        <p className="text-sm font-black uppercase tracking-widest text-base-content/40">Loading your profile...</p>
      </div>
    );
  }

  const breadData = [
    { name: "Dashboard", href: "/dashboard" }, 
    { name: "Profile", href: "/dashboard/profile" }
  ];

  return (
    <div className="space-y-8 font-sans pb-12 w-full max-w-7xl mx-auto overflow-x-hidden md:overflow-visible">
      <DashboardPageHeader 
        heading="Profile & Settings" 
        breadData={breadData} 
      />
      
      {/* Heavy Impact Header Banner & Avatar */}
      <ProfileHeader profile={profile} user={user} refreshProfile={refreshProfile} />
      
      {/* Split Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
         
         {/* Main Left Column (Form Data) */}
         <div className="lg:col-span-8 flex flex-col gap-8 min-w-0">
            <PersonalInformationForm profile={profile} user={user} refreshProfile={refreshProfile} />
            <ShippingBillingAddresses profile={profile} user={user} refreshProfile={refreshProfile} />
            <SecuritySettings />
         </div>

         {/* Right Sidebar (Preferences & Summaries) */}
         <div className="lg:col-span-4 flex flex-col gap-8 min-w-0">
            <div className="sticky top-24 z-10">
               <NotificationPreferences />
            </div>
         </div>
         
      </div>
    </div>
  );
}
