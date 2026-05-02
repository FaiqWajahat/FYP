import React from "react";
import DashboardPageHeader from "@/Components/common/DashboardPageHeader";
import AdminMockupManager from "@/Components/admin-dashboard/mockups/AdminMockupManager";

export default function AdminMockupsPage() {
  return (
    <div className="space-y-8 font-sans pb-10">
      <DashboardPageHeader
        heading="Design Mockups"
        breadData={[
          { name: "Admin", href: "/admin" },
          { name: "Design Studio", href: "#" },
          { name: "Mockups", href: "/admin/Mockups" },
        ]}
      />
      <AdminMockupManager />
    </div>
  );
}
