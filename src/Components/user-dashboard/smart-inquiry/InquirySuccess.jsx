"use client";
import React from 'react';
import {
  CheckCircle, ArrowRight, Package, Palette, Shirt, Tag, Clock,
  RefreshCw, Building2, Globe, Calendar, DollarSign, FileText, Ruler
} from 'lucide-react';

export default function InquirySuccess({ category, config, onReset }) {
  const totalPieces =
    Object.entries(config.sizes).filter(([, q]) => q > 0).reduce((a, [, b]) => a + b, 0) +
    (config.customSizes || []).reduce((a, s) => a + (s.qty || 0), 0);

  const inquiryId = `INQ-${Math.floor(Math.random() * 90000) + 10000}`;
  const today = new Date();
  const responseDate = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const Row = ({ label, value, primary }) =>
    value ? (
      <div className="flex flex-col gap-0.5">
        <span className="text-[9px] text-base-content/30 uppercase tracking-widest font-bold">{label}</span>
        <span className={`text-xs font-bold capitalize ${primary ? 'text-primary' : 'text-base-content'}`}>{value}</span>
      </div>
    ) : null;

  const uploadedFiles = [
    config.logoFile && { label: 'Logo', name: config.logoFile.name },
    config.printFile && { label: 'Print', name: config.printFile.name },
    config.sizeChartFile && { label: 'Size Chart', name: config.sizeChartFile.name },
    config.neckLabelFile && { label: 'Neck Label', name: config.neckLabelFile.name },
  ].filter(Boolean);

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">

      {/* Success Icon */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle size={40} className="text-success" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-[10px] font-black">✓</span>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 bg-success/10 text-success text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
          <CheckCircle size={11} /> Inquiry Submitted
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-base-content tracking-tight mb-3">
          Your inquiry is on its way!
        </h1>
        <p className="text-sm text-base-content/50 max-w-md leading-relaxed">
          Our production team will review your specifications and get back to you with a detailed quotation and estimated lead time.
        </p>
      </div>

      {/* Reference Card */}
      <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden mb-6">
        <div className="bg-primary/5 border-b border-primary/10 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest mb-0.5">Inquiry Reference</p>
            <p className="text-xl font-black text-primary tracking-tight">{inquiryId}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-base-content/40 font-medium uppercase tracking-widest mb-0.5">Submitted</p>
            <p className="text-sm font-bold text-base-content">{fmt(today)}</p>
          </div>
        </div>

        {/* Product */}
        <div className="px-5 pt-5 pb-3 border-b border-base-200">
          <p className="text-[10px] text-base-content/30 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
            <Shirt size={9} /> Product Specification
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Row label="Category" value={category?.name} />
            <Row label="Base Colour" value={config.baseColor?.name} />
            <Row label="Rib Colour" value={config.ribColor?.name} />
            <Row label="Fabric" value={config.fabric} />
            <Row label="Fit" value={config.fit} />
            <Row label="Inner Lining" value={config.innerLining} />
            {config.zipperType && config.zipperType !== 'No Zipper' && (
              <Row label="Zipper" value={config.zipperType} />
            )}
            <Row label="Total Pieces" value={totalPieces > 0 ? `${totalPieces.toLocaleString()} pcs` : null} primary />
          </div>
        </div>

        {/* Size Breakdown */}
        {totalPieces > 0 && (
          <div className="px-5 py-4 border-b border-base-200">
            <p className="text-[10px] text-base-content/30 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
              <Ruler size={9} /> Size Breakdown
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(config.sizes).filter(([, q]) => q > 0).map(([size, qty]) => (
                <div key={size} className="flex flex-col items-center bg-base-200 rounded-lg px-3 py-2 min-w-[44px]">
                  <span className="text-[9px] text-base-content/40 font-bold">{size}</span>
                  <span className="text-sm font-extrabold text-base-content">{qty}</span>
                </div>
              ))}
              {config.customSizes?.filter(s => s.qty > 0).map((s, i) => (
                <div key={i} className="flex flex-col items-center bg-primary/10 rounded-lg px-3 py-2 min-w-[44px]">
                  <span className="text-[9px] text-primary/60 font-bold">{s.label || '?'}</span>
                  <span className="text-sm font-extrabold text-primary">{s.qty}</span>
                </div>
              ))}
            </div>
            {config.sizeChartFile && (
              <p className="text-[10px] text-primary/60 mt-2 font-medium">📎 Custom size chart: {config.sizeChartFile.name}</p>
            )}
          </div>
        )}

        {/* Branding */}
        {(config.logoPlacements?.length > 0 || config.printTechnique || config.hangTag) && (
          <div className="px-5 py-4 border-b border-base-200">
            <p className="text-[10px] text-base-content/30 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
              <Tag size={9} /> Branding & Print
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {config.printTechnique && <Row label="Print Technique" value={config.printTechnique} />}
              {config.logoPlacements?.length > 0 && <Row label="Logo Placements" value={config.logoPlacements.length + ' location(s)'} />}
              {config.hangTag && <Row label="Hang Tag" value={config.hangTag} />}
              {config.neckLabelText && <Row label="Neck Label" value={config.neckLabelText} />}
              {config.customCareLabel && <Row label="Care Label" value="Custom" />}
            </div>
          </div>
        )}

        {/* Packaging */}
        {config.packaging && (
          <div className="px-5 py-4 border-b border-base-200">
            <p className="text-[10px] text-base-content/30 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
              <Package size={9} /> Packaging & Finishing
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Row label="Packaging" value={config.packaging} />
              {config.foldingStyle && <Row label="Fold Style" value={config.foldingStyle} />}
              {config.individualBag && <Row label="Individual Bag" value="Yes" />}
              {config.barcodeRequired && <Row label="Barcode / SKU" value="Required" />}
            </div>
          </div>
        )}

        {/* Business Info */}
        {(config.companyName || config.targetCountry || config.deliveryDeadline) && (
          <div className="px-5 py-4 border-b border-base-200">
            <p className="text-[10px] text-base-content/30 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
              <Building2 size={9} /> Business Info & Delivery
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Row label="Company" value={config.companyName} />
              <Row label="Contact" value={config.contactPerson} />
              <Row label="Email" value={config.email} />
              <Row label="Phone" value={config.phone} />
              <Row label="Destination" value={config.targetCountry} />
              <Row label="Deadline" value={config.deliveryDeadline} />
              {(config.budgetMin || config.budgetMax) && (
                <Row label="Budget / pc" value={`${config.budgetCurrency} ${config.budgetMin || '?'} – ${config.budgetMax || '?'}`} />
              )}
              <Row label="Sample Required" value={config.sampleRequired ? 'Yes' : 'No'} />
              {config.ndaRequired && <Row label="NDA" value="Required" />}
            </div>
          </div>
        )}

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="px-5 py-4 border-b border-base-200">
            <p className="text-[10px] text-base-content/30 uppercase tracking-widest font-bold mb-3">Attached Files</p>
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((f, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-semibold px-2.5 py-1 rounded-full">
                  📎 {f.label}: {f.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {config.additionalNotes && (
          <div className="px-5 py-4">
            <p className="text-[10px] text-base-content/30 uppercase tracking-widest font-bold mb-2">Additional Notes</p>
            <p className="text-xs text-base-content/60 leading-relaxed">{config.additionalNotes}</p>
          </div>
        )}
      </div>

      {/* Next Steps */}
      <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm p-5 mb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-4 flex items-center gap-1.5">
          <Clock size={11} /> What happens next?
        </h3>
        <div className="space-y-3">
          {[
            { step: '01', title: 'Review & Verification', desc: 'Our team reviews your specifications within 24 hours.', time: 'Within 24 hrs' },
            { step: '02', title: 'Quotation Sent', desc: 'You receive a detailed quote with MOQ, pricing & lead time.', time: `By ${fmt(responseDate)}` },
            { step: '03', title: 'Sample Approval', desc: config.sampleRequired ? 'We create a physical sample for your approval before bulk production.' : 'Digital mockup sent for approval — physical sample on request.', time: '5–7 business days' },
            { step: '04', title: 'Production Begins', desc: 'After approval, production starts with full trackability in your dashboard.', time: 'Post-approval' },
          ].map(({ step, title, desc, time }) => (
            <div key={step} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
                {step}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-base-content">{title}</p>
                  <span className="text-[9px] text-primary/60 font-semibold whitespace-nowrap">{time}</span>
                </div>
                <p className="text-[11px] text-base-content/50 mt-0.5 leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
        <button onClick={onReset} className="btn btn-outline btn-sm gap-2 font-semibold">
          <RefreshCw size={14} /> Submit Another Inquiry
        </button>
        <a href="/dashboard/orders" className="btn btn-primary btn-sm gap-2 font-bold px-6">
          View My Orders <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}
