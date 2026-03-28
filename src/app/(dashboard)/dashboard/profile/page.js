import React from 'react';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import ProfileHeader from '@/Components/user-dashboard/profile/ProfileHeader';
import PersonalInformationForm from '@/Components/user-dashboard/profile/PersonalInformationForm';
import ShippingBillingAddresses from '@/Components/user-dashboard/profile/ShippingBillingAddresses';
import SecuritySettings from '@/Components/user-dashboard/profile/SecuritySettings';
import NotificationPreferences from '@/Components/user-dashboard/profile/NotificationPreferences';

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6 font-sans pb-12 w-full max-w-7xl mx-auto overflow-x-hidden md:overflow-visible">
      <DashboardPageHeader 
        heading="Profile & Settings" 
        breadData={[{ name: "Dashboard", href: "/dashboard" }, { name: "Profile", href: "/dashboard/profile" }]} 
      />
      
      {/* Heavy Impact Header Banner & Avatar */}
      <ProfileHeader />
      
      {/* Split Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
         
         {/* Main Left Column (Form Data) */}
         <div className="lg:col-span-8 flex flex-col gap-8 min-w-0">
            <PersonalInformationForm />
            <ShippingBillingAddresses />
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
