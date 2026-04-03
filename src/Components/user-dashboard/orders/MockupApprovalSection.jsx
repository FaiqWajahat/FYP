"use client";
import React, { useState } from 'react';
import { Eye, ThumbsUp, ThumbsDown, Camera, Check, AlertTriangle, X, ZoomIn } from 'lucide-react';

const MOCKUPS = [
  {
    id: 1, type: 'Digital Tech Pack',
    url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    status: 'approved', date: 'Oct 4',
    note: 'Approved by you on Oct 4.',
  },
  {
    id: 2, type: 'Fabric Swatch',
    url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
    status: 'approved', date: 'Oct 6',
    note: 'Approved by you on Oct 6.',
  },
  {
    id: 3, type: 'Physical Sample',
    url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
    status: 'pending', date: 'Oct 9',
    note: 'Awaiting your approval to proceed.',
  },
];

export default function MockupApprovalSection() {
  const [mockups, setMockups] = useState(MOCKUPS);
  const [lightbox, setLightbox] = useState(null);

  const pendingCount = mockups.filter(m => m.status === 'pending').length;

  const handleApprove = (id) => {
    setMockups(prev =>
      prev.map(m => m.id === id ? { ...m, status: 'approved', note: 'Approved by you just now.' } : m)
    );
  };

  const handleReject = (id) => {
    setMockups(prev =>
      prev.map(m => m.id === id ? { ...m, status: 'rejected', note: 'Rejected. Admin will revise and re-upload.' } : m)
    );
  };

  return (
    <>
      <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden font-sans">
        {/* Header */}
        <div className="p-5 border-b border-base-200/60 flex justify-between items-center">
          <h3 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2 text-base-content/80">
            <Camera size={15} style={{ color: 'var(--primary)' }} />
            Proof Approvals
          </h3>
          {pendingCount > 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/10 border border-warning/25 text-warning text-[11px] font-bold uppercase tracking-wider animate-pulse">
              <AlertTriangle size={12} />
              {pendingCount} Action Required
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 border border-success/25 text-success text-[11px] font-bold uppercase tracking-wider">
              <Check size={12} />
              All Approved
            </div>
          )}
        </div>

        {/* Action Required Banner */}
        {pendingCount > 0 && (
          <div className="px-5 py-2.5 bg-warning/5 border-b border-warning/15 flex items-center gap-2">
            <AlertTriangle size={13} className="text-warning shrink-0" />
            <p className="text-[11px] text-warning/90 font-medium">
              Please review and approve the pending proof{pendingCount > 1 ? 's' : ''} to keep production on schedule.
            </p>
          </div>
        )}

        {/* Cards Grid */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockups.map((mockup) => {
            const isPending = mockup.status === 'pending';
            const isApproved = mockup.status === 'approved';
            const isRejected = mockup.status === 'rejected';

            return (
              <div
                key={mockup.id}
                className={`group rounded-xl overflow-hidden border transition-all duration-300 ${
                  isPending
                    ? 'border-warning/40 shadow-sm shadow-warning/10'
                    : isRejected
                    ? 'border-error/30 opacity-70'
                    : 'border-base-200/60'
                } bg-base-100`}
              >
                {/* Image */}
                <div className="relative w-full h-44 overflow-hidden bg-base-200 cursor-pointer" onClick={() => setLightbox(mockup.url)}>
                  <img
                    src={mockup.url}
                    alt={mockup.type}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-2">
                      <ZoomIn size={18} className="text-base-content" />
                    </div>
                  </div>
                  {/* Status overlay badge */}
                  <div className="absolute top-2 right-2">
                    {isApproved && (
                      <div className="bg-success text-success-content p-1.5 rounded-full shadow">
                        <Check size={11} strokeWidth={3} />
                      </div>
                    )}
                    {isRejected && (
                      <div className="bg-error text-error-content p-1.5 rounded-full shadow">
                        <X size={11} strokeWidth={3} />
                      </div>
                    )}
                    {isPending && (
                      <div className="bg-warning text-warning-content px-2 py-1 rounded-full shadow text-[9px] font-bold uppercase tracking-widest">
                        Pending
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <p className="font-bold text-xs uppercase tracking-wide text-base-content/90">{mockup.type}</p>
                  <p className="text-[10px] text-base-content/40 mt-0.5 font-mono uppercase tracking-widest">Uploaded: {mockup.date}</p>
                  <p className={`text-[11px] mt-2 font-medium leading-relaxed ${
                    isPending ? 'text-warning/80' : isRejected ? 'text-error/70' : 'text-base-content/50'
                  }`}>
                    {mockup.note}
                  </p>

                  {/* Action Buttons */}
                  <div className="mt-3 flex gap-2">
                    {isPending ? (
                      <>
                        <button
                          onClick={() => handleApprove(mockup.id)}
                          className="btn btn-success btn-xs flex-1 h-8 min-h-0 text-[11px] uppercase tracking-wider font-bold gap-1"
                        >
                          <ThumbsUp size={12} /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(mockup.id)}
                          className="btn btn-error btn-outline btn-xs flex-1 h-8 min-h-0 text-[11px] uppercase tracking-wider font-bold gap-1"
                        >
                          <ThumbsDown size={12} /> Reject
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setLightbox(mockup.url)}
                        className="btn btn-ghost btn-xs w-full h-8 min-h-0 border border-base-200 hover:bg-base-200 text-[11px] uppercase tracking-wider font-bold gap-1 text-base-content/60"
                      >
                        <Eye size={12} /> View Full
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-3 -right-3 z-10 bg-base-100 hover:bg-base-200 rounded-full p-1.5 shadow-lg transition-colors"
            >
              <X size={16} />
            </button>
            <img src={lightbox} alt="Proof" className="w-full rounded-xl shadow-2xl object-contain max-h-[80vh]" />
          </div>
        </div>
      )}
    </>
  );
}
