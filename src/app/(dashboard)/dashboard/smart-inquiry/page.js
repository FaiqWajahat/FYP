import DashboardPageHeader from '@/Components/common/DashboardPageHeader';
import SmartInquiryWizard from '@/Components/user-dashboard/smart-inquiry/SmartInquiryWizard';

export default function SmartInquiryPage() {
  return (
    <div className="space-y-6 font-sans pb-12">
      <DashboardPageHeader
        heading="Smart Inquiry"
        breadData={[
          { name: 'Dashboard', href: '/admin' },
          { name: 'Smart Inquiry', href: '/admin/smart-inquiry' },
        ]}
      />
      <SmartInquiryWizard />
    </div>
  );
}


