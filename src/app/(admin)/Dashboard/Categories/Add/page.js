"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import CategoryForm from '@/Components/admin-dashboard/CategoryForm';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddCategoryPage() {
    const router = useRouter();

    const breadData = [
        { name: 'Dashboard', href: '/Dashboard' },
        { name: 'Categories', href: '/Dashboard/Categories' },
        { name: 'Add Category', href: '/Dashboard/Categories/Add' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <DashboardPageHeader 
                    breadData={breadData} 
                    heading={"Create Category"} 
                    subHeading={"Add a new grouping for your products."}
                />
                <Link 
                    href="/Dashboard/Categories"
                    className="btn btn-ghost btn-sm gap-2 text-base-content/50 hover:text-base-content"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to List
                </Link>
            </div>

            <div className="max-w-5xl mx-auto">
                <CategoryForm 
                    onSave={() => router.push('/Dashboard/Categories')} 
                    onCancel={() => router.push('/Dashboard/Categories')}
                />
            </div>
        </div>
    );
}
