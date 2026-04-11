'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import {
  CheckCircle2, LayoutDashboard, FileText, Clock,
  Upload, ShieldCheck, ArrowRight
} from 'lucide-react';
import { useConfigStore } from '@/store/useConfigStore';
import { useSearchParams } from 'next/navigation';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  
  const [visible, setVisible] = useState(false);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { projectName } = useConfigStore();

  // Trigger the entrance animation on mount and fetch data
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    
    async function fetchOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/orders?id=${orderId}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error("Fetch confirmation error:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrder();
    return () => clearTimeout(t);
  }, [orderId]);

  const submittedAt = order ? new Date(order.created_at).toLocaleString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }) : "--";

  const displayId = order ? `ORD-${1000 + (order.display_id || 0)}` : (orderId ? "Locating..." : "N/A");

  return (
    <div className="flex-1 flex flex-col pt-20">
      <div className="flex-1 flex items-center justify-center px-4">
        <div
          className={`w-full max-w-2xl transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >

          {/* ---- SUCCESS CARD ---- */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden">

            {/* Top Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-center relative">
              {/* Decorative rings */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
              </div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-white/30">
                  <CheckCircle2 size={40} className="text-white" strokeWidth={2} />
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white mb-2">Order Request Submitted!</h1>
                <p className="text-blue-100 text-sm">
                  Thank you for your order. We&apos;ve received everything.
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 py-8 space-y-7">

              {/* Order ID + Timestamp */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
                  <p className="font-mono font-black text-slate-900 text-lg">{displayId}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Submitted At</p>
                  <p className="text-sm font-semibold text-slate-600">{submittedAt}</p>
                </div>
              </div>

              {/* Main Message */}
              <div className="text-center px-2">
                <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                  Your order request has been successfully submitted. Our team will review and process it shortly.
                </p>
              </div>

              {/* What Happens Next */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">What Happens Next</p>

                <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                  <div className="p-2 bg-blue-600 rounded-xl flex-shrink-0">
                    <Clock size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Order appears on your Dashboard</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Your order will be visible on your dashboard within <strong>1 hour</strong> after submission. You can track its status from there.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                  <div className="p-2 bg-indigo-600 rounded-xl flex-shrink-0">
                    <Upload size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Invoice uploaded to your Dashboard</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Your <strong>Proforma Invoice</strong> will be generated and uploaded to your dashboard so you can download it anytime.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <div className="p-2 bg-emerald-600 rounded-xl flex-shrink-0">
                    <FileText size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Confirmation email on its way</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      A confirmation email with your order details will be sent to your registered email address shortly.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/dashboard"
                  className="flex-1 py-3.5 px-5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                >
                  <LayoutDashboard size={17} />
                  Go to Dashboard
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/"
                  className="flex-1 py-3.5 px-5 border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:border-slate-300 hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Trust Line */}
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold pt-1">
                <ShieldCheck size={13} /> Secured · {projectName} Factory Portal
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center pt-20"><span className="loading loading-spinner text-blue-600"></span></div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}

