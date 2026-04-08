'use client';

import React from 'react';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import UserForm from '@/Components/admin-dashboard/UserForm';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddUserPage() {
  const router = useRouter();

  const handleAddUser = async (formData) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create user");
      }

      toast.success("User created successfully!");
      router.push('/Dashboard/Users/All');
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const breadData = [
    { name: 'Dashboard', href: '/Dashboard' },
    { name: 'Users', href: '/Dashboard/Users/All' },
    { name: 'Add User', href: '/Dashboard/Users/Add' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DashboardPageHeader
          breadData={breadData}
          heading="Add New User"
          subHeading="Invite a new team member or administrative partner."
        />
        {/* <Link
          href="/Dashboard/Users/All"
          className="btn btn-ghost btn-sm gap-2 text-base-content/50 hover:text-base-content"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to List
        </Link> */}
      </div>

      <div className="w-full mx-auto">
        <UserForm onSave={handleAddUser} />
      </div>
    </div>
  );
}
