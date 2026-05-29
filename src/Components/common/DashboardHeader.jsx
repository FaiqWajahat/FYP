"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogOut, User, Settings as SettingsIcon } from "lucide-react";
import { useConfigStore } from "@/store/useConfigStore";
import { useAuth } from "@/store/AuthContext";
import ThemeToggle from "./ThemeToggle";

const DashboardHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const { projectName } = useConfigStore();
  const { user, profile, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = pathname?.startsWith('/admin');
  const profileHref = isAdmin ? '/admin/Profile' : '/dashboard/profile';
  const settingsHref = isAdmin ? '/admin/Profile' : '/dashboard/settings';

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 h-16 border-b border-base-200">
      <div className="flex-none hover:bg-base-200 p-1.5 rounded-xl transition-colors">
        <Menu 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="cursor-pointer text-base-content/80 hover:text-base-content" 
          size={20}
        />
      </div>
      
      <div className="flex-1 ml-4">
        <Link href="/" className="inline-block">
          <h1 className="text-xl font-black tracking-tighter text-[var(--primary)] uppercase">
            {projectName}
          </h1>
        </Link>
      </div>

      <div className="navbar-end gap-3">
        <ThemeToggle />

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar border border-base-300 overflow-hidden bg-base-200/50 hover:border-[var(--primary)]/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
              {profile?.profile_image ? (
                <img
                  alt={profile?.full_name || "User profile"}
                  src={profile.profile_image}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[var(--primary)] text-white font-extrabold text-xs uppercase tracking-wider">
                  {getInitials(profile?.full_name || user?.email)}
                </div>
              )}
            </div>
          </div>
          
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-2xl z-[100] mt-3 w-56 p-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)] border border-base-200/80 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            {/* Header info */}
            <div className="px-3 py-2.5 border-b border-base-200 mb-1">
              <p className="text-xs font-black text-base-content tracking-tight truncate">
                {profile?.full_name || "Factory Flow Member"}
              </p>
              <p className="text-[10px] font-bold text-base-content/40 truncate">
                {user?.email}
              </p>
            </div>

            <li>
              <Link href={profileHref} className="flex items-center gap-2 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-base-content/70 hover:text-base-content">
                <User size={14} className="text-base-content/50" />
                Profile
              </Link>
            </li>
            
            {!isAdmin && (
              <li>
                <Link href={settingsHref} className="flex items-center gap-2 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-base-content/70 hover:text-base-content">
                  <SettingsIcon size={14} className="text-base-content/50" />
                  Settings
                </Link>
              </li>
            )}
            
            <li>
              <button 
                onClick={handleLogout}
                className="flex w-full items-center gap-2 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-error hover:bg-error/10"
              >
                <LogOut size={14} />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
