"use client";
import React, { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";


import DashboardPageHeader from "@/Components/common/DashboardPageHeader";

import OrdersTable from "@/Components/admin-dashboard/OrdersTable";

import Loader from "@/Components/common/Loader";
import ConfirmationDialog from "@/Components/common/ConfirmationDialog";
import Link from "next/link";

const OrderPage = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, order: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const pathname = usePathname();
  const slug = pathname.split("/").pop() || "All";

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error("Failed to load orders: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteTrigger = (order) => {
    setDeleteDialog({ open: true, order });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.order) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders?id=${deleteDialog.order.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Order deleted successfully");
        setOrders((prev) => prev.filter((o) => o.id !== deleteDialog.order.id));
        setDeleteDialog({ open: false, order: null });
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error("Delete failed: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (slug === "Pending") {
      result = result.filter((o) => {
        const s = (o.status || "").toLowerCase();
        return s === "pending" || s === "payment pending" || s === "on hold";
      });
    } else if (slug === "Processing") {
      result = result.filter((o) => {
        const s = (o.status || "").toLowerCase();
        return s === "processing" || s === "quality check";
      });
    } else if (slug === "Completed") {
      result = result.filter((o) => {
        const s = (o.status || "").toLowerCase();
        const stage = (o.production_stage || "").toLowerCase();
        return (
          s === "completed" || 
          s === "dispatched" || 
          s === "delivered" ||
          stage === "delivered / complete" ||
          stage === "completed"
        );
      });
    } else if (slug !== "All") {
      // Fallback metric matching
      result = result.filter(
        (o) =>
          (o.status || "").toLowerCase() === slug.toLowerCase() ||
          (o.production_stage || "").replace(/\s+/g, "").toLowerCase() === slug.toLowerCase()
      );
    }

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      result = result.filter(
        (o) =>
          String(o.display_id || "").includes(s) ||
          (o.product_name || "").toLowerCase().includes(s) ||
          (o.profiles?.full_name || "").toLowerCase().includes(s) ||
          (o.sku || "").toLowerCase().includes(s)
      );
    }

    return result;
  }, [orders, slug, searchTerm]);

  const breadData = [
    { name: "Dashboard", href: "/admin" },
    { name: "Orders", href: "/admin/Orders/All" },
    { name: `${slug} Orders`, href: `/admin/Orders/${slug}` },
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader breadData={breadData} heading={`${slug} Orders`} />

      <div className="w-full bg-base-100 rounded-xl shadow-lg p-4 lg:p-6">
        {/* Header Section (Search + Actions) */}
        <div className="flex flex-row justify-between gap-3 mb-6">
          {/* Search */}
          <div className="w-full md:w-1/2">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, Customer, Product or SKU..."
              className="input input-bordered w-full text-sm"
            />
          </div>

          {/* Action Button */}
          <div className="w-full md:w-auto flex justify-end">
            <Link
              href="/admin/Orders/Add"
              className="btn bg-[var(--primary)] text-white border-transparent hover:brightness-110 rounded-xl gap-2 text-sm font-black uppercase tracking-widest shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" /> Add Order
            </Link>
          </div>
        </div>

        {/* Table Area */}
        <div className="w-full bg-base-50/50 rounded-lg border border-base-200">
          {loading ? (
            <Loader variant="inline" message="Loading orders..." />
          ) : (
            <OrdersTable orders={filteredOrders} onDelete={handleDeleteTrigger} />
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, order: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Order"
        message={`Are you sure you want to permanently delete Order #ORD-${
          1000 + (deleteDialog.order?.display_id || 0)
        }? This action cannot be undone.`}
        confirmText="Yes, Delete Order"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default OrderPage;
