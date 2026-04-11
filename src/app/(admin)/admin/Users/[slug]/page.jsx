"use client";
import DashboardPageHeader from "@/Components/common/DashboardPageHeader";
import DashboardSearch from "@/Components/admin-dashboard/DashboardSearch";
import UsersTable from "@/Components/admin-dashboard/UserTable";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, UserPlus } from "lucide-react";
import Link from "next/link";
import Loader from "@/Components/common/Loader";

const UserPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [slug, setSlug] = useState("All");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (roleFilter) => {
    setLoading(true);
    try {
      let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
      
      if (roleFilter !== "All") {
        query = query.eq('role', roleFilter.toLowerCase());
      }

      const { data, error } = await query;
      if (error) throw error;
      
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const pathSlug = pathname.split("/")[3] || "All";
    const formattedSlug = pathSlug.charAt(0).toUpperCase() + pathSlug.slice(1);
    setSlug(formattedSlug);
    fetchUsers(formattedSlug);
  }, [pathname]);

  const breadData = [
     { name: 'Dashboard', href: '/admin' },
    {
      name: `${slug} Users`,
      href: `/admin/Users/${slug}`,
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader breadData={breadData} heading={`${slug} Users`} />

      <div className="w-full bg-base-100 rounded-xl shadow-lg p-4 lg:p-6">
        {/* Header Section (Search + Actions) */}
        <div className="flex flex-row justify-between gap-3 mb-6">
          {/* Search */}
          <div className="w-full md:w-1/2">
            <DashboardSearch placeholder="Search by Name or Email" />
          </div>

          {/* Action Button */}
          <div className="w-full md:w-auto flex justify-end">
            <Link 
              href="/admin/Users/Add"
              className="btn bg-[var(--primary)] text-white border-transparent hover:brightness-110 rounded-lg gap-2 text-sm font-medium shadow-sm transition-all active:scale-95 h-12 px-6"
            >
              <UserPlus size={18} />
              Add New User
            </Link>
          </div>
        </div>

        {/* Table Area */}
        <div className="w-full bg-base-50/50 rounded-lg border border-base-200">
          {loading ? (
            <Loader variant="inline" message="Synchronizing user base..." />
          ) : (
            <div className="w-full overflow-x-auto">
              <UsersTable users={users} onRefresh={() => fetchUsers(slug)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
