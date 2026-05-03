'use client';

import React from 'react';
import { ClipboardCheck, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOrderStore } from '@/store/useOrderStore';
import { useAuth } from '@/store/AuthContext';
import { useConfigStore } from '@/store/useConfigStore';
import { toast } from 'react-hot-toast';

export default function OrderSummary({
  product,
  selectedColor,
  isCustomizing,
  selectedFormat,
  sizingMode,
  standardQuantities,
  customRows,
  totalQuantity,
  activeTier,
  unitPrice,
  totalEstimate,
  studioRef,
  logoProps,
  sizeChartFile,
}) {
  const router = useRouter();
  const { user } = useAuth();
  const setOrderData = useOrderStore((state) => state.setOrderData);
  const setIsChatOpen = useConfigStore((state) => state.setIsChatOpen);
  const setChatContext = useConfigStore((state) => state.setChatContext);

  const handleReview = async () => {
    // 1. Auth Gate
    if (!user) {
      toast.error("B2B Identity Required: Please log in to proceed with your order configuration.");
      router.push(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (totalQuantity === 0) {
      toast.error("Please add at least 1 unit to your order.");
      return;
    }

    // 2. ── PRODUCTION VALIDATION GATES ──────────────────────────────────────

    // Gate A: Custom branding enabled but no logo uploaded
    if (isCustomizing && (!logoProps || logoProps.length === 0)) {
      toast.error(
        "Branding Upload Required: You've enabled custom branding but haven't uploaded a logo. Please upload at least one logo or disable branding.",
        { duration: 5000, icon: '🎨' }
      );
      return;
    }

    // Gate B: Custom sizing mode but no size chart file uploaded
    if (sizingMode === 'custom' && !sizeChartFile) {
      toast.error(
        "Size Chart Required: You've selected Custom Sizing but haven't uploaded your size chart. Please upload your measurement file (PDF, Excel, CSV, or Image).",
        { duration: 5000, icon: '📐' }
      );
      return;
    }

    // 3. Asset Pipeline Sync (Cloudinary)
    const syncToast = toast.loading("Securing Technical Blueprints & Branding Assets...");

    try {
      // 3a. Capture & Sync Mockup (Canvas State)
      const previewImage = studioRef?.current?.getPreviewImage();
      let finalizedMockupUrl = product.images[0];

      if (previewImage && previewImage.startsWith("data:image")) {
        const mRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: previewImage, folder: "order-mockups" })
        });
        const mData = await mRes.json();
        if (mData.success) finalizedMockupUrl = mData.url;
      }

      // 3b. Sync Branding Assets (Logos)
      const syncLogos = async () => {
        const logos = logoProps ? JSON.parse(JSON.stringify(logoProps)) : [];
        const designAssets = [];

        for (const logo of logos) {
          if (logo.src?.startsWith("data:image")) {
            const res = await fetch("/api/upload", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ file: logo.src, folder: "order-logos" })
            });
            const d = await res.json();
            if (d.success) {
              designAssets.push({ id: logo.id, url: d.url });
              logo.src = d.url;
            } else {
              throw new Error(`Logo upload failed: ${d.error}`);
            }
          } else if (logo.src?.startsWith("http")) {
            designAssets.push({ id: logo.id, url: logo.src });
          }
        }
        return { designAssets, updatedLogoProps: logos };
      };

      const { designAssets, updatedLogoProps } = await syncLogos();

      // 3c. Upload size chart file (if custom sizing mode)
      let sizeChartUrl = null;
      if (sizingMode === 'custom' && sizeChartFile) {
        toast.loading("Uploading size chart...", { id: syncToast });

        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(sizeChartFile);
        });

        const scRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: base64, folder: "size-charts" })
        });
        const scData = await scRes.json();
        if (scData.success) {
          sizeChartUrl = scData.url;
        } else {
          throw new Error(`Size chart upload failed: ${scData.error}`);
        }
      }

      // 4. Final Store Sync
      const newOrderId = `REQ-${Math.floor(Math.random() * 9000) + 1000}-FC`;

      setOrderData({
        orderId: newOrderId,
        product: {
          name: product.name,
          sku: product.sku,
          image: finalizedMockupUrl,
          color: selectedColor.name,
        },
        customization: {
          enabled: isCustomizing,
          format: selectedFormat.name,
          formatPrice: selectedFormat.price,
          logoProps: isCustomizing ? updatedLogoProps : null,
        },
        design_assets: designAssets,
        sizing: {
          mode: sizingMode,
          breakdown: sizingMode === 'standard' ? standardQuantities : customRows,
          totalUnits: totalQuantity,
          ...(sizeChartUrl && { size_chart_url: sizeChartUrl }),
        },
        pricing: {
          unitPrice,
          subtotal: parseFloat(totalEstimate),
        },
        sizeChartUrl,
      });

      toast.success("Design sync complete.", { id: syncToast });
      router.push('/review');
    } catch (err) {
      console.error("Asset Sync Error:", err);
      toast.error("Failed to secure assets. Please try again.", { id: syncToast });
    }
  };

  const handleAuthGate = (actionName) => {
    if (!user) {
      toast.error(`Login Required: Please sign in to access ${actionName}.`);
      router.push(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
      return false;
    }
    return true;
  };

  return (
    <div className="space-y-4 pt-6 border-t border-slate-100">

      {/* Receipt Breakdown */}
      <div className="flex justify-between items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Estimated Total</p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <p>Total Units: <span className="font-bold text-slate-900">{totalQuantity}</span></p>
            <p>Base Tier: <span className="font-bold text-slate-900">{activeTier?.label} (${activeTier?.price})</span></p>
            {isCustomizing && <p>Branding: <span className="font-bold text-blue-600">+${selectedFormat?.price}</span></p>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 mb-1">Unit Price: <strong>${unitPrice?.toFixed(2)}</strong></p>
          <p className="text-3xl font-black text-slate-900 tracking-tight leading-none">${totalEstimate}</p>
        </div>
      </div>

      {/* ── INLINE VALIDATION HINT BANNERS ── */}
      {isCustomizing && (!logoProps || logoProps.length === 0) && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 animate-in fade-in">
          <span className="text-base leading-none mt-0.5">🎨</span>
          <p className="text-xs font-bold text-amber-800 leading-snug">
            Custom branding is enabled — please upload at least one logo to proceed.
          </p>
        </div>
      )}

      {sizingMode === 'custom' && !sizeChartFile && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 animate-in fade-in">
          <span className="text-base leading-none mt-0.5">📐</span>
          <p className="text-xs font-bold text-amber-800 leading-snug">
            Custom sizing selected — please upload your size chart file to proceed.
          </p>
        </div>
      )}

      <button
        onClick={handleReview}
        disabled={totalQuantity === 0}
        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <ClipboardCheck size={20} />
        Review Order
        <span className="text-slate-400 text-sm font-normal hidden sm:inline ml-1">| Next Step</span>
        <ArrowRight size={18} className="ml-1 text-slate-400 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* SECONDARY ACTIONS */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            if (handleAuthGate("Live Chat Support")) {
              setChatContext(`I have a question about ${product.name} (SKU: ${product.sku})`);
              setIsChatOpen(true);
            }
          }}
          className="py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <MessageCircle size={18} className="text-slate-500" /> Live Chat
        </button>

        <button
          onClick={() => {
            if (handleAuthGate("Smart Inquiry Pipeline")) {
              const imageUrl = product.images?.[0] || '';
              const query = new URLSearchParams({
                category: product.category || 'Apparel',
                subCategory: product.subCategory || '',
                imageUrl: imageUrl,
                productName: product.name || 'Custom Product'
              }).toString();
              router.push(`/smart-inquiry?${query}`);
            }
          }}
          className="py-3 bg-blue-50 border-2 border-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-100 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Sparkles size={18} className="text-blue-500" /> Smart Inquiry
        </button>
      </div>
    </div>
  );
}