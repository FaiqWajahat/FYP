'use client';
import React, { useState } from "react";
import DashboardHeader from "@/Components/common/DashboardHeader";
import DashboardSidebar from "@/Components/admin-dashboard/DashboardSidebar";
import { Inter } from "next/font/google";
import { useConfigStore } from "@/store/useConfigStore";


const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isDarkMode } = useConfigStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);


  return (
    <div
      data-theme={mounted && isDarkMode ? "dark" : "light"}
      className={`${inter.className} flex h-screen w-full overflow-hidden`}
    >
      {/* Sidebar */}
      <div
        className={`fixed lg:relative w-64 h-screen z-50 shadow-lg transition-all duration-700 ease-in-out flex-shrink-0
        ${sidebarOpen ? "-ml-64 lg:ml-0" : "ml-0 lg:-ml-64"}`}
      >
        <DashboardSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Main column */}
      <div className="flex flex-1 min-w-0 min-h-0 flex-col transition-all duration-700 ease-in-out">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-base-100/80 backdrop-blur supports-[backdrop-filter]:bg-base-100/60">
          <DashboardHeader
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </header>

        {/* Content */}
        <main className="flex-1 min-w-0 min-h-0 overflow-auto lg:px-6 px-4 py-4 bg-base-200">
          {children}
        </main>

        {/* Footer */}
        <footer className="h-10 flex items-center justify-center bg-base-100 text-xs text-gray-500 shrink-0">
          Made with love by{" "}
          <span className="text-primary ml-1 font-bold">Factory Flow</span>
        </footer>
      </div>
    </div>
  );

}
