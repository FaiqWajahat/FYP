import React from 'react';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import ChatApp from '@/Components/common/ChatApp';

export default function UserMessagesPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader 
        heading="Messages" 
        breadData={[{ name: "Dashboard", href: "/admin" }, { name: "Messages", href: "/admin/messages" }]} 
      />
      
      {/* User view, only shows the store admin contact */}
      <ChatApp isAdmin={false} />
    </div>
  );
}

