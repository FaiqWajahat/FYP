'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Import the review content dynamically with SSR disabled.
// This is the definitive fix for hydration errors caused by 
// client-side persistent state (localStorage) mismatches.
const ReviewContent = dynamic(() => import('./ReviewContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen pt-20 bg-slate-50 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-bold text-slate-400 animate-pulse">Loading Secure Order Portal...</p>
    </div>
  ),
});

export default function OrderReviewPage() {
  return <ReviewContent />;
}