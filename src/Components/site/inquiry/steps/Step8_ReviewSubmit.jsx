'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Edit3, FileText, AlertCircle, Wand2, X, Loader2, Maximize2, Download, ExternalLink, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { PRODUCT_CATEGORIES, FABRIC_OPTIONS, BRANDING_TECHNIQUES, LABEL_TYPES, PACKAGING_OPTIONS, TIMELINES, INCOTERMS, COLOUR_PALETTE } from '../inquiry-data';
import { useInquiryStore } from '@/store/useInquiryStore';

function SectionCard({ title, step, onEdit, isEmpty, children }) {
  return (
    <div className={`rounded-2xl border overflow-hidden ${isEmpty ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100 bg-white'}`}>
      <div className={`flex items-center justify-between px-5 py-3 border-b ${isEmpty ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'}`}>
        <div className="flex items-center gap-2">
          {isEmpty && <AlertCircle size={13} className="text-amber-500" />}
          <h4 className={`text-sm font-bold ${isEmpty ? 'text-amber-700' : 'text-slate-800'}`}>{title}</h4>
        </div>
        <button
          onClick={() => onEdit(step)}
          className={`flex items-center gap-1 text-xs font-semibold transition-colors ${isEmpty ? 'text-amber-600 hover:text-amber-800' : 'text-blue-500 hover:text-blue-700'
            }`}
        >
          <Edit3 size={12} /> {isEmpty ? 'Complete' : 'Edit'}
        </button>
      </div>
      <div className="px-5 py-4 space-y-2">
        {isEmpty ? (
          <p className="text-xs text-amber-600 italic">No selections made yet — click "Complete" to fill in this section.</p>
        ) : children}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-slate-500 shrink-0">{label}</span>
      <span className="text-xs font-medium text-slate-800 text-right max-w-[60%] break-words">{value}</span>
    </div>
  );
}

export default function Step8_ReviewSubmit() {
  const store = useInquiryStore();
  const { setStep } = store;

  const category = PRODUCT_CATEGORIES.find((c) => c.id === store.categoryId);
  const fabric = FABRIC_OPTIONS.find((f) => f.id === store.fabricId);
  const timeline = TIMELINES.find((t) => t.id === store.timeline);
  const incoterm = INCOTERMS.find((i) => i.id === store.incoterm);
  const totalQty = Object.values(store.sizes).reduce((a, b) => a + b, 0);

  const constructionEntries = Object.entries(store.construction).filter(([_, v]) => v);
  const colorEntries = Object.entries(store.zoneColors).filter(([_, v]) => v);
  const selectedPackaging = PACKAGING_OPTIONS.filter((p) => store.packaging.includes(p.id));
  const labelTypeObj = LABEL_TYPES.find((l) => l.id === store.labelType);
  const sizeEntries = Object.entries(store.sizes).filter(([_, v]) => v > 0);
  const measurementEntries = Object.entries(store.measurements).filter(([_, v]) => v);

  const [isGenerating, setIsGenerating] = useState(false);
  const [mockupImage, setMockupImage] = useState(null);
  const [showMockupModal, setShowMockupModal] = useState(false);

  // Completion status for each section
  const isProductEmpty = !store.categoryId;
  const isConstructionEmpty = constructionEntries.length === 0;
  const isMaterialEmpty = !store.fabricId;
  const isColorEmpty = colorEntries.length === 0 && store.artworkPlacements.length === 0;
  const isSizingEmpty = totalQty === 0;
  const isBrandingEmpty = !store.labelType && selectedPackaging.length === 0;
  const isDeliveryEmpty = !store.contactName || !store.email;

  const handleGenerateMockup = async () => {
    if (isProductEmpty || isMaterialEmpty) {
      toast.error('Please select a Product Category and Fabric first.');
      return;
    }

    setIsGenerating(true);
    setShowMockupModal(true);

    try {
      // Map hex codes to human-readable names for better AI understanding
      const namedColors = {};
      Object.entries(store.zoneColors).forEach(([zone, hex]) => {
        const match = COLOUR_PALETTE.find(c => c.hex.toLowerCase() === hex.toLowerCase());
        namedColors[zone] = match ? match.name : hex;
      });

      const payload = {
        categoryName: category?.name,
        fabricName: fabric?.name,
        colorType: store.colorType,
        colors: namedColors,
        construction: store.construction,
        artwork: store.artworkPlacements.map(p => p.type).join(', ')
      };

      const res = await fetch('/api/generate-mockup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate mockup');

      setMockupImage(data.imageUrl);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error generating mockup');
      setShowMockupModal(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadMockup = () => {
    if (!mockupImage) return;
    const link = document.createElement('a');
    link.href = mockupImage;
    link.download = `mockup-${store.categoryId || 'garment'}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Mockup download started');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <FileText size={20} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Review Your Inquiry</h3>
            <p className="text-sm text-slate-500">Double-check all specs before submitting.</p>
          </div>
        </div>

        <button
          onClick={handleGenerateMockup}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl text-sm font-bold transition-all border border-indigo-200 hover:border-indigo-600 shadow-sm"
        >
          <Wand2 size={16} /> Visualize with AI (Beta)
        </button>
      </div>

      {/* Completion badge */}
      {(() => {
        const completed = [!isProductEmpty, !isConstructionEmpty, !isMaterialEmpty, !isColorEmpty, !isSizingEmpty, !isBrandingEmpty, !isDeliveryEmpty];
        const count = completed.filter(Boolean).length;
        return (
          <div className={`p-3 rounded-xl mb-5 flex items-center justify-between ${count === 7 ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
            <span className={`text-xs font-bold ${count === 7 ? 'text-emerald-700' : 'text-amber-700'}`}>
              {count === 7 ? '✓ All sections completed — ready to submit!' : `${count}/7 sections completed`}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${count === 7 ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'}`}>
              {count}/7
            </span>
          </div>
        );
      })()}

      <div className="space-y-3">

        {/* 1. Product */}
        <SectionCard title="1 — Product Category" step={1} onEdit={setStep} isEmpty={isProductEmpty}>
          <Row label="Category" value={category?.name} />
          <Row label="Description" value={category?.description} />
          {store.uploadedDesignName && <Row label="Uploaded Design" value={store.uploadedDesignName} />}
        </SectionCard>

        {/* 2. Construction */}
        <SectionCard title="2 — Construction Details" step={2} onEdit={setStep} isEmpty={isConstructionEmpty}>
          {constructionEntries.map(([key, val]) => {
            const spec = category?.construction.find((c) => c.id === key);
            return <Row key={key} label={spec?.label || key} value={val} />;
          })}
        </SectionCard>

        {/* 3. Material */}
        <SectionCard title="3 — Material & Fabric" step={3} onEdit={setStep} isEmpty={isMaterialEmpty}>
          <Row label="Fabric" value={fabric?.name} />
          <Row label="GSM" value={store.gsm ? `${store.gsm} GSM` : null} />
          <Row label="Finish" value={fabric?.finish} />
          {store.customFabricNotes && <Row label="Custom Notes" value={store.customFabricNotes} />}
        </SectionCard>

        {/* 4. Color & Artwork */}
        <SectionCard title="4 — Color & Artwork" step={4} onEdit={setStep} isEmpty={isColorEmpty}>
          <Row label="Color Type" value={store.colorType} />
          {colorEntries.map(([zone, hex]) => {
            const colorObj = COLOUR_PALETTE.find(c => c.hex.toLowerCase() === hex.toLowerCase());
            const colorName = colorObj ? colorObj.name : 'Custom';
            return (
              <div key={zone} className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{zone}</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: hex }} />
                  <span className="text-xs font-medium text-slate-700">{colorName} <span className="font-mono text-slate-400 text-[10px]">({hex.toUpperCase()})</span></span>
                </div>
              </div>
            )
          })}
          {store.customPantone && <Row label="Pantone Ref" value={store.customPantone} />}
          {store.artworkPlacements.length > 0 && (
            <>
              <Row label="Print Placements" value={`${store.artworkPlacements.length} placement(s)`} />
              {store.artworkPlacements.map((p, i) => (
                <Row key={i} label={`  → ${p.zone || 'TBD'}`}
                  value={`${BRANDING_TECHNIQUES.find(t => t.id === p.technique)?.name || p.technique || 'TBD'}${p.fileName ? ` • ${p.fileName}` : ''}`} />
              ))}
            </>
          )}
          {store.artworkNotes && <Row label="Artwork Notes" value={store.artworkNotes} />}
        </SectionCard>

        {/* 5. Sizing */}
        <SectionCard title="5 — Sizing & Measurements" step={5} onEdit={setStep} isEmpty={isSizingEmpty}>
          {sizeEntries.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {sizeEntries.map(([sz, qty]) => (
                <span key={sz} className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">{sz}: {qty}</span>
              ))}
            </div>
          )}
          <Row label="Total Quantity" value={totalQty > 0 ? `${totalQty} pcs` : null} />
          {store.sizeChartFile && <Row label="Size Chart" value={store.sizeChartFile} />}
          {store.customMeasurements && measurementEntries.length > 0 && (
            <>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">Custom Measurements</div>
              {measurementEntries.map(([k, v]) => (
                <Row key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={`${v} inches`} />
              ))}
            </>
          )}
          {store.gradingNotes && <Row label="Grading Notes" value={store.gradingNotes} />}
        </SectionCard>

        {/* 6. Branding */}
        <SectionCard title="6 — Branding & Packaging" step={6} onEdit={setStep} isEmpty={isBrandingEmpty}>
          <Row label="Label Type" value={labelTypeObj?.name} />
          <Row label="Label Placement" value={store.labelPlacement} />
          {store.labelArtworkFile && <Row label="Label Artwork" value={store.labelArtworkFile} />}
          {selectedPackaging.length > 0 && <Row label="Packaging" value={selectedPackaging.map(p => p.name).join(', ')} />}
          {store.hangTagFile && <Row label="Hang Tag" value={store.hangTagFile} />}
        </SectionCard>

        {/* 7. Delivery & Contact */}
        <SectionCard title="7 — Delivery & Contact" step={7} onEdit={setStep} isEmpty={isDeliveryEmpty}>
          <Row label="Timeline" value={timeline?.label} />
          <Row label="Destination" value={store.destination} />
          <Row label="Incoterm" value={incoterm?.name} />
          <Row label="Sample" value={store.sampleRequired ? `Yes — ${store.sampleQty} pcs` : 'Not required'} />
          <Row label="Company" value={store.companyName} />
          <Row label="Contact" value={store.contactName} />
          <Row label="Email" value={store.email} />
          <Row label="Phone" value={store.phone} />
          {store.website && <Row label="Website" value={store.website} />}
          {store.specialNotes && <Row label="Special Notes" value={store.specialNotes} />}
        </SectionCard>
      </div>

      {/* AI Mockup Modal */}
      <AnimatePresence>
        {showMockupModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[95vh] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <Wand2 size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">AI Concept Visualizer</h3>
                </div>
                <button onClick={() => setShowMockupModal(false)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 sm:p-6 flex-1 overflow-y-auto flex flex-col items-center justify-center bg-slate-100/50 relative">
                {isGenerating ? (
                  <div className="flex flex-col items-center text-center py-10">
                    <Loader2 size={40} className="text-indigo-500 animate-spin mb-4" />
                    <p className="text-base font-bold text-slate-800">Visualizing your design...</p>
                    <p className="text-sm text-slate-500 mt-2 max-w-sm">
                      Our AI is stitching together your {fabric?.name || 'garment'} {category?.name || ''} based on your specifications. This usually takes 10-15 seconds.
                    </p>
                  </div>
                ) : mockupImage ? (
                  <div className="w-full aspect-square max-h-[55vh] relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white flex items-center justify-center group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mockupImage} alt="AI Mockup" className="w-full h-full object-contain p-2" />

                    {/* Action Overlay */}
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-all flex items-end justify-center p-6 opacity-0 group-hover:opacity-100">
                      <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-xl border border-slate-100">
                        <button
                          onClick={handleGenerateMockup}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                        >
                          <RefreshCw size={14} className={isGenerating ? "animate-spin" : ""} /> Try Again
                        </button>
                        <div className="w-px h-4 bg-slate-200" />
                        <button
                          onClick={() => {
                            const win = window.open();
                            win.document.write(`<img src="${mockupImage}" style="max-width:100%; height:auto;" />`);
                          }}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                        >
                          <ExternalLink size={14} /> View Full
                        </button>
                        <div className="w-px h-4 bg-slate-200" />
                        <button
                          onClick={handleDownloadMockup}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-indigo-100"
                        >
                          <Download size={14} /> Download
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {!isGenerating && mockupImage && (
                <div className="p-5 bg-amber-50 border-t border-amber-100">
                  <div className="flex gap-3">
                    <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 leading-relaxed">
                      <strong>AI Conceptual Visualization:</strong> This image was generated by AI to give you a rough conceptual feel of your color and style choices. It is <strong>NOT</strong> a manufacturing tech pack. Your final product will be engineered strictly to the specifications you selected and exact Pantone colors may vary in real life.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
