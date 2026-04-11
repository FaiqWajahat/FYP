"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

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

export default function AddProductPage() {
  const router = useRouter();
  
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
    pricingTiers: [
      { label: "Sample / MOQ", quantity: 1, range: "1-19", price: "", desc: "Quality Check" }
    ],
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
  const [isDrafting, setIsDrafting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Helper to update fields
  const setField = useCallback((name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
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
    if (!form.sku.trim()) next.sku = "SKU is required";
    if (!form.category) next.category = "Category is required";
    
    // Validate pricing tiers
    if (!form.pricingTiers || form.pricingTiers.length === 0) {
       next.pricingTiers = "At least one pricing tier is required";
    } else {
       const hasEmptyPrices = form.pricingTiers.some(t => !t.price);
       if (hasEmptyPrices) next.pricingTiers = "Please enter valid prices for all tiers";
    }

    if (!form.colors || !form.colors.trim()) next.colors = "Select at least one color";
    if (!form.sizes || !form.sizes.trim()) next.sizes = "Select at least one size";
    if (!form.images || form.images.length === 0) next.images = "At least one product image is required";

    if (!form.quantity) next.quantity = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePublish = async () => {
    if (!validate()) {
       window.scrollTo({ top: 0, behavior: 'smooth' });
       return;
    }

    setIsSubmitting(true);
    setLoadingMessage("Converting and uploading images to secure vault...");
    
    try {
      // 1. Upload Images to Cloudinary via backend API
      const uploadedImageUrls = [];
      if (form.images && form.images.length > 0) {
        for (let i = 0; i < form.images.length; i++) {
          const imgSrc = form.images[i];
          if (imgSrc.startsWith("blob:")) {
            const response = await fetch(imgSrc);
            const blob = await response.blob();
            
            const formData = new FormData();
            formData.append("file", blob, `product-img-${i}.jpg`);
            
            const uploadRes = await axios.post("/api/upload", formData, {
              headers: { "Content-Type": "multipart/form-data" }
            });
            
            if (uploadRes.data.success) {
               uploadedImageUrls.push(uploadRes.data.url);
            }
          } else {
            uploadedImageUrls.push(imgSrc);
          }
        }
      }

      setLoadingMessage("Publishing product globally...");

      // 2. Prepare payload & Post to API via Axios
      const payload = { ...form, images: uploadedImageUrls };
      const productRes = await axios.post("/api/products", payload);

      if (productRes.data.success) {
        console.log("Published Data:", productRes.data.product);
        toast.success("Product published successfully!");
        setLoadingMessage("Success! Redirecting...");
        
        setTimeout(() => {
          setIsSubmitting(false);
          setLoadingMessage("");
          router.push("/admin/Products/All");
        }, 800);
      }

    } catch (err) {
      console.error("Publish Failed:", err);
      const errorMsg = err.response?.data?.error || err.message || "Failed to publish product";
      toast.error(errorMsg);
      setIsSubmitting(false);
      setLoadingMessage("");
    }
  };

  const handleSaveDraft = () => {
    setIsDrafting(true);
    console.log("Saving Draft:", form);
    setTimeout(() => setIsDrafting(false), 1500);
  };

  const handleReset = () => {
    if (confirm("Reset all form fields? This cannot be undone.")) {
      setForm({
        name: "", sku: "", category: "", subCategory: "", 
        pricingTiers: [{ label: "Sample", quantity: 1, range: "1-20", price: "", desc: "Quality Check" }], 
        quantity: "", description: "", colors: "", sizes: "", tags: "",
        images: [], status: "Active", thrashold: "5", sizingMode: "standard"
      });
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen  bg-transparent flex flex-col relative w-full h-full">
      {loadingMessage && <Loader message={loadingMessage} />}
      <ProductFormHeader 
        activeStep={form.images?.length > 0 ? 4 : form.description ? 3 : form.price ? 2 : 1} 
        onSaveDraft={handleSaveDraft}
        saving={isDrafting}
      />

      <div className="w-full  mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form Area (Column 1-8) */}
          <div className="lg:col-span-8 space-y-8">
            <BasicInfoSection 
                form={form} 
                setField={setField} 
                errors={errors} 
            />
            
            <PricingInventorySection 
                form={form} 
                setField={setField} 
                errors={errors} 
            />
            
            <ProductDetailsSection 
                form={form} 
                setField={setField} 
                errors={errors} 
            />
            
            <MediaUploadSection 
                form={form} 
                setField={setField} 
                errors={errors} 
            />
          </div>

          {/* Sidebar Area (Column 9-12) */}
          <div className="lg:col-span-4">
            <ProductFormSidebar 
                form={form} 
                setField={setField} 
                onDiscard={handleReset}
            />
          </div>

        </div>
      </div>

      {/* Floating Action Bar */}
    <div className="pb-6">
      <ProductFormActions 
        onPublish={handlePublish}
        onSaveDraft={handleSaveDraft}
        onReset={handleReset}
        isSubmitting={isSubmitting}
        isDrafting={isDrafting}
        errorCount={Object.keys(errors).length}
      />
    </div>
    </div>
  );
}
