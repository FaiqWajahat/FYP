'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Send, Check, RotateCcw, Package, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { INQUIRY_STEPS, PRODUCT_CATEGORIES, FABRIC_OPTIONS, TIMELINES } from './inquiry-data';
import { useInquiryStore } from '@/store/useInquiryStore';

import Step1_ProductCategory from './steps/Step1_ProductCategory';
import Step2_Construction from './steps/Step2_Construction';
import Step3_MaterialSpecs from './steps/Step3_MaterialSpecs';
import Step4_ColorArtwork from './steps/Step4_ColorArtwork';
import Step5_SizingMeasurements from './steps/Step5_SizingMeasurements';
import Step6_BrandingPackaging from './steps/Step6_BrandingPackaging';
import Step7_DeliveryBusiness from './steps/Step7_DeliveryBusiness';
import Step8_ReviewSubmit from './steps/Step8_ReviewSubmit';

const STEP_COMPONENTS = {
  1: Step1_ProductCategory,
  2: Step2_Construction,
  3: Step3_MaterialSpecs,
  4: Step4_ColorArtwork,
  5: Step5_SizingMeasurements,
  6: Step6_BrandingPackaging,
  7: Step7_DeliveryBusiness,
  8: Step8_ReviewSubmit,
};

function ProgressBar({ currentStep, onStepClick }) {
  return (
    <div className="flex items-center justify-center gap-1 w-full overflow-x-auto no-scrollbar py-1 px-1">
      {INQUIRY_STEPS.map((step, i) => {
        const isActive = currentStep === step.id;
        const isComplete = currentStep > step.id;
        return (
          <React.Fragment key={step.id}>
            <button
              onClick={() => onStepClick(step.id)}
              className={`flex items-center  gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : isComplete
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isActive ? 'bg-white/20 text-white' : isComplete ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                {isComplete ? <Check size={10} /> : step.id}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.shortLabel}</span>
            </button>
            {i < INQUIRY_STEPS.length - 1 && (
              <div className={`w-4 h-0.5 shrink-0 rounded-full ${isComplete ? 'bg-emerald-300' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ── Large Product Image Panel ───────────────────────────── */
function ProductImagePanel() {
  const { categoryId, uploadedDesignImage } = useInquiryStore();
  const category = PRODUCT_CATEGORIES.find((c) => c.id === categoryId);
  const displayImage = uploadedDesignImage || category?.image;

  return (
    <div className="flex flex-col h-full">
      {/* Large Product Image */}
      <div className="relative flex-1 min-h-[580px] rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center group">
        {displayImage ? (
          <>
            <div className="absolute inset-0 bg-slate-100" />
            <Image
              src={displayImage}
              alt={category?.name || 'Your Product'}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle inner shadow/border */}
            <div className="absolute inset-0 border border-black/5 rounded-3xl pointer-events-none" />

            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

            {/* Product label */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
              <p className="text-2xl font-black text-white leading-tight drop-shadow-md">{category?.name || 'Your Custom Product'}</p>
              <p className="text-sm text-white/80 mt-1.5 font-medium drop-shadow-sm">{category?.description || 'Upload a design to get started'}</p>
            </div>

            {/* Corner badge */}
            {category && (
              <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-white/20">
                <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{category.construction.length} Specs</span>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50">
            <div className="w-20 h-20 rounded-3xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-5">
              <Package size={32} className="text-slate-400" />
            </div>
            <p className="text-base font-bold text-slate-600">Select a Product</p>
            <p className="text-sm text-slate-400 mt-2 max-w-[200px]">Choose a category to see the product image</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InquiryWizard() {
  const store = useInquiryStore();
  const { currentStep, setStep, nextStep, prevStep, resetInquiry, categoryId } = store;
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);

  const handleNext = () => {
    // Only validate truly essential fields to allow flexibility
    if (currentStep === 1) {
      if (!store.categoryId) return toast.error('Please select a Product Category');
    } else if (currentStep === 3) {
      if (!store.fabricId) return toast.error('Please select a Fabric');
      if (store.fabricId === 'custom' && !store.customFabricNotes?.trim()) {
        return toast.error('Please specify your custom fabric details');
      }
    } else if (currentStep === 5) {
      if (store.getTotalQty() === 0) return toast.error('Please enter quantity for at least one size');
    } else if (currentStep === 7) {
      if (!store.contactName?.trim()) return toast.error('Contact Name is required');
      if (!store.email?.trim()) return toast.error('Email Address is required');
    }

    // Steps 2 (Construction), 4 (Color), 6 (Branding) are now optional
    nextStep();
  };

  const handleStepClick = (stepId) => {
    if (stepId <= currentStep) {
      setStep(stepId);
    } else {
      // Prevent jumping forward if current step isn't validated
      handleNext();
    }
  };

  const handleSubmit = async () => {
    // Final safety validation
    if (!store.categoryId || !store.fabricId || store.getTotalQty() === 0 || !store.contactName || !store.email) {
      toast.error('Please complete all required fields across all steps before submitting.');
      return;
    }

    setSubmitting(true);
    const t = toast.loading('Preparing files for upload...');

    try {
      // ─── Helper: Upload a base64 file to Cloudinary ────────
      const uploadToCloudinary = async (base64Data, folder) => {
        if (!base64Data) return null;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64Data, folder }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Upload failed');
        return data.url;
      };

      // ─── Upload all files to Cloudinary ────────────────────
      let uploadedDesignUrl = null;
      let sizeChartUrl = null;
      let labelArtworkUrl = null;
      let hangTagUrl = null;

      // 1. Design image (Step 1)
      if (store.uploadedDesignImage) {
        toast.loading('Uploading design reference...', { id: t });
        uploadedDesignUrl = await uploadToCloudinary(store.uploadedDesignImage, 'inquiry-designs');
      }

      // 2. Size chart (Step 5)
      if (store.sizeChartData) {
        toast.loading('Uploading size chart...', { id: t });
        sizeChartUrl = await uploadToCloudinary(store.sizeChartData, 'inquiry-size-charts');
      }

      // 3. Label artwork (Step 6)
      if (store.labelArtworkData) {
        toast.loading('Uploading label artwork...', { id: t });
        labelArtworkUrl = await uploadToCloudinary(store.labelArtworkData, 'inquiry-labels');
      }

      // 4. Hang tag (Step 6)
      if (store.hangTagData) {
        toast.loading('Uploading hang tag design...', { id: t });
        hangTagUrl = await uploadToCloudinary(store.hangTagData, 'inquiry-hang-tags');
      }

      // 5. Artwork placement files (Step 4) — upload each one
      toast.loading('Uploading artwork files...', { id: t });
      const processedPlacements = [];
      for (const placement of store.artworkPlacements) {
        let artworkFileUrl = null;
        if (placement.fileData) {
          artworkFileUrl = await uploadToCloudinary(placement.fileData, 'inquiry-artwork');
        }
        processedPlacements.push({
          zone: placement.zone,
          technique: placement.technique,
          fileName: placement.fileName,
          fileUrl: artworkFileUrl,
          notes: placement.notes,
        });
      }

      // ─── Build payload with Cloudinary URLs ────────────────
      toast.loading('Submitting inquiry...', { id: t });
      const category = PRODUCT_CATEGORIES.find((c) => c.id === store.categoryId);
      const payload = {
        categoryId: store.categoryId,
        categoryName: category?.name || '',
        uploadedDesignName: store.uploadedDesignName,
        uploadedDesignUrl: uploadedDesignUrl,
        construction: store.construction,
        fabricId: store.fabricId,
        gsm: store.gsm,
        customFabricNotes: store.customFabricNotes,
        colorType: store.colorType,
        zoneColors: store.zoneColors,
        customPantone: store.customPantone,
        artworkPlacements: processedPlacements,
        artworkNotes: store.artworkNotes,
        sizes: store.sizes,
        sizeChartFile: store.sizeChartFile,
        sizeChartUrl: sizeChartUrl,
        customMeasurements: store.customMeasurements,
        measurements: store.measurements,
        gradingNotes: store.gradingNotes,
        labelType: store.labelType,
        labelPlacement: store.labelPlacement,
        labelArtworkFile: store.labelArtworkFile,
        labelArtworkUrl: labelArtworkUrl,
        packaging: store.packaging,
        hangTagFile: store.hangTagFile,
        hangTagUrl: hangTagUrl,
        timeline: store.timeline,
        destination: store.destination,
        incoterm: store.incoterm,
        sampleRequired: store.sampleRequired,
        sampleQty: store.sampleQty,
        companyName: store.companyName,
        contactName: store.contactName,
        email: store.email,
        phone: store.phone,
        website: store.website,
        specialNotes: store.specialNotes,
      };

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit inquiry');
      }

      setSubmittedId(result.displayId || '');
      setSubmitted(true);
      toast.success('Inquiry submitted successfully!', { id: t });
      store.resetInquiry();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Submit error:', err);
      toast.error(err.message || 'Failed to submit inquiry', { id: t });
    } finally {
      setSubmitting(false);
    }
  };

  const StepComponent = STEP_COMPONENTS[currentStep];

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md px-8">
          <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3">Inquiry Submitted!</h2>
          {submittedId && (
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 mb-3">
              <span className="text-sm font-bold text-blue-700">{submittedId}</span>
            </div>
          )}
          <p className="text-sm text-slate-500 leading-relaxed mb-2">
            Your manufacturing quotation request has been transmitted. Our team will review your specifications and prepare a detailed quote.
          </p>
          <p className="text-xs text-slate-400 mb-8">We typically respond within 24–48 business hours.</p>
          <button onClick={() => { resetInquiry(); setSubmitted(false); }}
            className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-colors">
            <RotateCcw size={14} /> Start New Inquiry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-4">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manufacturing Inquiry</h1>
          <p className="text-sm text-slate-500 mt-0.5">Complete each step to submit your production quotation request.</p>
        </div>
        <button
          onClick={() => setShowResetModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-500 bg-slate-100 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
        >
          <RotateCcw size={14} /> Reset Form
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-5 flex justify-center items-center w-full bg-white rounded-2xl border border-slate-100 p-2 shadow-sm">
        <ProgressBar currentStep={currentStep} onStepClick={handleStepClick} />
      </div>

      {/* Main Content — Product Image Left + Form Right */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* LEFT — Large Product Image Panel (sticky) */}
        <aside className="w-full lg:w-[360px] xl:w-[400px] shrink-0">
          <div className="lg:sticky lg:top-24">
            <ProductImagePanel />
          </div>
        </aside>

        {/* RIGHT — Step Content + Navigation */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm min-h-[520px]">
            <AnimatePresence mode="wait">
              {StepComponent && <StepComponent key={currentStep} />}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <button onClick={prevStep} disabled={currentStep === 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${currentStep === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}>
              <ChevronLeft size={16} /> Back
            </button>
            {currentStep < 8 ? (
              <button onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? <><Loader2 size={14} className="animate-spin" /> Submitting...</> : <><Send size={14} /> Submit Inquiry</>}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-xl border border-slate-100 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4 text-rose-500">
                <RotateCcw size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Reset Inquiry?</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Are you sure you want to clear the form? All your entered specifications and details will be permanently lost.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    resetInquiry();
                    setShowResetModal(false);
                    toast.success('Form has been reset');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-md shadow-rose-200"
                >
                  Yes, Reset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
