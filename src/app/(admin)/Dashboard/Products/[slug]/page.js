"use client";
import DashboardPageHeader from "@/Components/common/DashboardPageHeader";
import DashboardSearch from "@/Components/admin-dashboard/DashboardSearch";
import ProductsTable from "@/Components/admin-dashboard/ProductTable";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loader from "@/Components/common/Loader";

const UserPage = () => {
  const pathname = usePathname();
  const [slug, setSlug] = useState("All");
  const [dbProducts, setDbProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const res = await axios.get('/api/products');
      if (res.data.products) {
        setDbProducts(res.data.products);
      }
    } catch (err) {
      toast.error("Failed to fetch products for dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    const pathSlug = pathname.split("/")[3] || "All";
    setSlug(pathSlug);

    if (pathSlug !== "All") {
      const filteredData = dbProducts.filter(
        (v) => (v.quantity || v.stock) <= (v.threshold || 5)
      );
      const sortProducts = filteredData.sort((a, b) => (a.quantity || a.stock) - (b.quantity || b.stock));
      setProducts(sortProducts);
    } else {
      setProducts(dbProducts);
    }
  }, [pathname, dbProducts]);

  const breadData = [
     { name: 'Dashboard', href: '/Dashboard' },
    {
      name: `${slug==='All'?slug:'Low Stock'} Products`,
      href: `/Dashboard/Products/${slug} Products`,
    },
  ];


  return (
    <>
     <DashboardPageHeader breadData={breadData} heading={`${slug==='All'?"All Products":"Low Stock Products"}`} />

<div className="w-full bg-base-100 rounded-xl shadow-lg p-4 lg:p-6">
  {/* Header Section */}
  <div className="flex flex-row justify-between gap-3 mb-6">
    {/* Search */}
    <div className="w-full md:w-1/2">
      <DashboardSearch placeholder="Search by ID or Name" />
    </div>

    {/* Add Product Button */}
    <div className="w-full md:w-auto flex justify-end">
      <Link
        href="/Dashboard/Products/Add"
        className="btn bg-[var(--primary)] text-white border-transparent hover:brightness-110 rounded-lg gap-2 text-sm font-medium shadow-sm transition-all active:scale-95"
      >
        <ShoppingBag className="w-4 h-4" /> Add Product
      </Link>
    </div>
  </div>

  {/* Table Area */}
  <div className="w-full bg-base-50/50 rounded-lg border border-base-200">
    {loading ? (
      <Loader variant="inline" message="Generating Warehouse Inventory..." />
    ) : (
      <div className="w-full overflow-x-auto">
        <ProductsTable products={products} onRefresh={() => fetchAll(true)} />
      </div>
    )}
  </div>
</div>

    </>
  );
};

export default UserPage;
