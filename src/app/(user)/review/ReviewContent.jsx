'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';

import { useOrderStore } from '@/store/useOrderStore';
import OrderSummarySection from './components/OrderSummarySection';
import PaymentMethodSection from './components/PaymentMethodSection';
import PaymentScheduleSection from './components/PaymentScheduleSection';
import OrderSidePanel from './components/OrderSidePanel';

// Helper: calculate transfer fee amount
function calcTransferFee(method, baseTotal) {
  if (!method) return 0;
  return parseFloat((baseTotal * (method.feePercent || 0) + (method.feeFixed || 0)).toFixed(2));
}

export default function ReviewContent() {
  const router = useRouter();
  const orderData = useOrderStore();

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!orderData.product) {
    return (
      <div className="min-h-screen bg-slate-50 flex  flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <CheckCircle2 size={32} className="text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">No active order found</h2>
        <p className="text-slate-500 mb-8 max-w-sm">Please return to our product catalog to configure your order.</p>
        <Link href="/categories" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const {
    orderId,
    pricing,
    paymentMethod,
    paymentDivision,
    setPaymentMethod,
    setPaymentDivision
  } = orderData;

  // Dynamic calculations
  const baseTotal = pricing?.subtotal || 0;
  const transferFee = calcTransferFee(paymentMethod, baseTotal);
  const grandTotal = baseTotal + transferFee;

  const amountDueNow = paymentDivision === 'split' ? grandTotal * 0.5 : grandTotal;
  const canSubmit = paymentMethod && paymentDivision && agreedToTerms;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setTimeout(() => {
      router.push('/confirmation');
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col pt-20">
      <div className="container max-w-7xl mx-auto px-4 md:px-8">

        {/* ---- PAGE HEADER + PROGRESS BAR ---- */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-4 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Product
            </button>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-5">
              Order Review & Payment
            </h1>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 overflow-x-auto whitespace-nowrap pb-1">
              <Link
                href={`/categories/hoodies/${orderData.product.sku}`}
                className="flex items-center gap-1.5 text-slate-400 hover:text-blue-600 transition-colors"
              >
                <CheckCircle2 size={16} className="text-green-500" /> Configuration
              </Link>
              <ChevronRight size={14} />
              <span className="flex items-center gap-1.5 text-blue-600 border-b-2 border-blue-600 pb-0.5">
                Review & Payment
              </span>
              <ChevronRight size={14} />
              <span>Confirmation</span>
            </div>
          </div>

          <Link
            href={`/categories/hoodies/${orderData.product.sku}`}
            className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-blue-300 transition-all shadow-sm flex items-center gap-2 w-fit"
          >
            Edit Configuration
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-8">
            <OrderSummarySection orderData={orderData} />

            <PaymentMethodSection
              selectedMethodId={paymentMethod?.id}
              onMethodSelect={setPaymentMethod}
            />

            <PaymentScheduleSection
              selectedDivision={paymentDivision}
              onDivisionSelect={setPaymentDivision}
              grandTotal={grandTotal}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5">
            <OrderSidePanel
              orderId={orderId}
              subtotal={baseTotal}
              selectedMethod={paymentMethod}
              transferFee={transferFee}
              grandTotal={grandTotal}
              paymentDivision={paymentDivision}
              amountDueNow={amountDueNow}
              agreedToTerms={agreedToTerms}
              setAgreedToTerms={setAgreedToTerms}
              canSubmit={canSubmit}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
