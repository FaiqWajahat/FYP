import React from "react";
import DashboardPageHeader from "@/Components/common/DashboardPageHeader";
import AddMockupForm from "@/Components/admin-dashboard/mockups/AddMockupForm";

export default function AddMockupPage() {
  return (
    <div className="space-y-8 font-sans pb-10">
      <DashboardPageHeader
        heading="Create New Mockup"
        breadData={[
          { name: "Admin", href: "/admin" },
          { name: "Design Studio", href: "/admin/Mockups" },
          { name: "Mockups", href: "/admin/Mockups" },
          { name: "Add New", href: "/admin/Mockups/Add" },
        ]}
      />

      <div className="w-full">
        <AddMockupForm />
      </div>
    </div>
  );
}
