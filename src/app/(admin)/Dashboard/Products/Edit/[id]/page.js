"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// Components
import ProductFormHeader from "@/Components/admin-dashboard/product-upload/ProductFormHeader";
import BasicInfoSection from "@/Components/admin-dashboard/product-upload/BasicInfoSection";
import PricingInventorySection from "@/Components/admin-dashboard/product-upload/PricingInventorySection";
import ProductDetailsSection from "@/Components/admin-dashboard/product-upload/ProductDetailsSection";
import MediaUploadSection from "@/Components/admin-dashboard/product-upload/MediaUploadSection";
import ProductFormSidebar from "@/Components/admin-dashboard/product-upload/ProductFormSidebar";
import ProductFormActions from "@/Components/admin-dashboard/product-upload/ProductFormActions";
import Loader from "@/Components/common/Loader";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  
  // State Management
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    subCategory: "",
    fabric: "",
    gsm: "",
    gsmWeight: "",
    moq: "",
    pricingTiers: [],
    brandingOptions: [],
    leadTime: "",
    quantity: "",
    description: "",
    colors: "",
    sizes: "",
    tags: "",
    sizingMode: "standard",
    sizeChart: [],
    images: [],
    status: "Active",
    isFeatured: false,
    releaseDate: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("");

  // 1. Fetch existing product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        if (res.data.product) {
          setForm(res.data.product);
        }
      } catch (err) {
        toast.error("Failed to load product data.");
        router.push("/Dashboard/Products/All");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  // Helper to update fields
  const setField = useCallback((name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }, [errors]);

  // Validation Logic
  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Title is required";
    if (!form.category) next.category = "Category is required";
    if (!form.pricingTiers || form.pricingTiers.length === 0) {
       next.pricingTiers = "At least one pricing tier is required";
    } else {
       const hasEmptyPrices = form.pricingTiers.some(t => !t.price);
       if (hasEmptyPrices) next.pricingTiers = "Please enter valid prices for all tiers";
    }
    if (!form.quantity) next.quantity = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) {
       window.scrollTo({ top: 0, behavior: 'smooth' });
       return;
    }

    setIsSubmitting(true);
    setLoadingMessage("Synchronizing changes with warehouse...");
    
    try {
      // Logic for new images (blobs) if user added more
      const finalImageUrls = [];
      if (form.images && form.images.length > 0) {
        for (let i = 0; i < form.images.length; i++) {
          const imgSrc = form.images[i];
          if (imgSrc.startsWith("blob:")) {
            const response = await fetch(imgSrc);
            const blob = await response.blob();
            const formData = new FormData();
            formData.append("file", blob, `updated-img-${i}.jpg`);
            const uploadRes = await axios.post("/api/upload", formData);
            if (uploadRes.data.success) finalImageUrls.push(uploadRes.data.url);
          } else {
            finalImageUrls.push(imgSrc);
          }
        }
      }

      const payload = { ...form, images: finalImageUrls };
      const productRes = await axios.put(`/api/products/${id}`, payload);

      if (productRes.data.success) {
        toast.success("Product updated successfully!");
        setTimeout(() => {
          setIsSubmitting(false);
          router.push("/Dashboard/Products/All");
        }, 800);
      }

    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update product");
      setIsSubmitting(false);
      setLoadingMessage("");
    }
  };

  if (loading) return <Loader message="Fetching Product Specifications..." />;

  return (
    <div className="min-h-screen bg-transparent flex flex-col relative w-full h-full">
      {loadingMessage && <Loader message={loadingMessage} />}
      
      <ProductFormHeader 
        activeStep={4} 
        onSaveDraft={() => toast.success("Draft saved locally")}
        saving={false}
      />

      <div className="w-full mx-auto px-4 md:px-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-8">
            <BasicInfoSection form={form} setField={setField} errors={errors} />
            <PricingInventorySection form={form} setField={setField} errors={errors} />
            <ProductDetailsSection form={form} setField={setField} errors={errors} />
            <MediaUploadSection form={form} setField={setField} errors={errors} />
          </div>

          <div className="lg:col-span-4">
            <ProductFormSidebar 
                form={form} 
                setField={setField} 
                onDiscard={() => router.push("/Dashboard/Products/All")}
            />
          </div>

        </div>
      </div>

      <div className="pb-6">
        <ProductFormActions 
          onPublish={handleUpdate}
          onSaveDraft={() => toast.success("Draft saved")}
          onReset={() => router.push("/Dashboard/Products/All")}
          isSubmitting={isSubmitting}
          isDrafting={false}
          errorCount={Object.keys(errors).length}
        />
      </div>
    </div>
  );
}
