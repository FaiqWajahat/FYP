"use client";
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import Link from 'next/link';

// Components
import CategoriesTable from '@/Components/admin-dashboard/CategoriesTable';
import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import DashboardSearch from '@/Components/admin-dashboard/DashboardSearch';
import ConfirmationDialog from '@/Components/common/ConfirmationDialog';
import Loader from '@/Components/common/Loader';

const DashboardCategories = () => {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Deletion states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchCategories = useCallback(async (quiet = false) => {
        if (!quiet) setLoading(true);
        try {
            const { data } = await axios.get("/api/categories");
            setCategories(data.categories || []);
        } catch (err) {
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleDelete = async () => {
        if (!categoryToDelete) return;
        setDeleting(true);
        try {
            await axios.delete(`/api/categories/${categoryToDelete.id}`);
            toast.success("Category deleted successfully");
            setIsDeleteModalOpen(false);
            fetchCategories(true);
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to delete");
        } finally {
            setDeleting(false);
            setCategoryToDelete(null);
        }
    };

    const breadData = [
      { name: 'Dashboard', href: '/admin' },
      { name: "Categories", href: `/admin/Categories` },
    ];

    const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.id.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <div className="space-y-6">
            <DashboardPageHeader 
                breadData={breadData} 
                heading={"All Categories"} 
            />

            <div className="w-full bg-base-100 rounded-xl shadow-lg p-4 lg:p-6">
                {/* Header Section (Search + Actions) */}
                <div className="flex flex-row justify-between gap-3 mb-6">
                    {/* Search */}
                    <div className="w-full md:w-1/2">
                        <DashboardSearch 
                            placeholder="Search by ID or Name" 
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Action Button */}
                    <div className="w-full md:w-auto flex justify-end">
                        <Link 
                            href="/admin/Categories/Add" 
                            className="btn bg-[var(--primary)] text-white border-transparent hover:brightness-110 rounded-lg gap-2 text-sm font-medium shadow-sm transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4" /> 
                            New Category
                        </Link>
                    </div>
                </div>

                {/* Table Area */}
                <div className="w-full rounded-lg border border-base-200">
                    {loading ? (
                        <Loader variant="inline" message="Assembling Category Collections..." />
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <CategoriesTable 
                                categories={filteredCategories} 
                                onEdit={(cat) => router.push(`/admin/Categories/Edit/${cat.id}`)}
                                onDelete={(cat) => {
                                    setCategoryToDelete(cat);
                                    setIsDeleteModalOpen(true);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationDialog 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Category?"
                message={`Are you sure you want to delete "${categoryToDelete?.name}"? All products in this category will become un-categorized.`}
                isLoading={deleting}
                confirmLabel="Delete"
                variant="error"
            />
        </div>
    );
}

export default DashboardCategories;
