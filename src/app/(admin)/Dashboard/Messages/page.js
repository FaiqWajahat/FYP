import React from 'react';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import ChatApp from '@/Components/common/ChatApp';

export default function AdminMessagesPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader 
        heading="User Messages" 
        breadData={[{ name: "Dashboard", href: "/Dashboard" }, { name: "Messages", href: "/Dashboard/Messages" }]} 
      />
      
      {/* We pass isAdmin={true} so the sidebar shows multiple customers */}
      <ChatApp isAdmin={true} />
    </div>
  );
}
