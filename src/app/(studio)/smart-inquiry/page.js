import React, { Suspense } from 'react';
import InquiryWizard from '@/Components/site/inquiry/InquiryWizard';
import Loader from '@/Components/common/Loader';

export const metadata = {
  title: 'Manufacturing Inquiry | Request a Quote',
  description: 'Submit your custom apparel manufacturing inquiry with full product specifications, sizing, branding, and delivery details.',
};

export default function SmartInquiryPage() {
  return (
    <Suspense fallback={<Loader message="Initializing Inquiry Studio..." />}>
      <InquiryWizard />
    </Suspense>
  );
}
