"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import CategoryForm from '@/Components/admin-dashboard/CategoryForm';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import BrandLoader from '@/Components/common/BrandLoader';
import { toast } from 'react-hot-toast';

export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const { data } = await axios.get(`/api/categories/${params.id}`);
                setCategory(data.category);
            } catch (err) {
                toast.error("Failed to load category data");
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchCategory();
    }, [params.id]);

    const breadData = [
        { name: 'Dashboard', href: '/admin' },
        { name: 'Categories', href: '/admin/Categories' },
        { name: 'Edit Category', href: '#' },
    ];

    if (loading) return <BrandLoader message="Loading category..." />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <DashboardPageHeader 
                    breadData={breadData} 
                    heading={`Edit ${category?.name || "Category"}`} 
                    subHeading={"Modify your category details and images."}
                />
                <Link 
                    href="/admin/Categories"
                    className="btn btn-ghost btn-sm gap-2 text-base-content/50 hover:text-base-content"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to List
                </Link>
            </div>

            <div className="max-w-5xl mx-auto">
                <CategoryForm 
                    editCategory={category}
                    onSave={() => router.push('/admin/Categories')} 
                    onCancel={() => router.push('/admin/Categories')}
                />
            </div>
        </div>
    );
}
