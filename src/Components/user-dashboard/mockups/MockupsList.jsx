"use client";
import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import MockupCard from './MockupCard';
import MockupDetailModal from './MockupDetailModal';
import StatusFilterBar from '@/Components/user-dashboard/StatusFilterBar';

const INITIAL_MOCKUPS = [
  { id: 'MOCK-1021', orderId: 'quote-9982', type: 'Digital Tech Pack', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', status: 'pending', date: 'Oct 12, 2026', notes: 'Please review the collar thickness.', version: 'v1.0' },
  { id: 'MOCK-1019', orderId: 'quote-9980', type: 'Fabric Texture', url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80', status: 'approved', date: 'Oct 08, 2026', notes: 'Approved standard cotton blend.', version: 'v2.1' },
  { id: 'MOCK-1015', orderId: 'quote-9975', type: '3D Render', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80', status: 'rejected', date: 'Oct 05, 2026', notes: 'Color is too dark, please lighten by 10%.', version: 'v1.0' },
  { id: 'MOCK-1022', orderId: 'quote-9985', type: 'Physical Sample Photo', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80', status: 'pending', date: 'Oct 14, 2026', notes: 'First physical run. Check logo placement.', version: 'v1.0' },
  { id: 'MOCK-1018', orderId: 'quote-9978', type: 'Packaging Design', url: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80', status: 'approved', date: 'Oct 07, 2026', notes: 'Final box design.', version: 'v3.0' },
  { id: 'MOCK-1005', orderId: 'quote-9950', type: 'Digital Tech Pack', url: 'https://images.unsplash.com/photo-1485230405346-71acb9518d9c?w=800&q=80', status: 'approved', date: 'Sep 25, 2026', notes: 'Initial design block.', version: 'v1.0' }
];

export default function MockupsList() {
  const [mockups, setMockups] = useState(INITIAL_MOCKUPS);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMockup, setSelectedMockup] = useState(null);

  const filteredMockups = mockups.filter(m => activeTab === 'all' ? true : m.status === activeTab);

  const handleAction = (id, newStatus) => {
    setMockups(mockups.map(m => m.id === id ? { ...m, status: newStatus } : m));
    if (selectedMockup && selectedMockup.id === id) {
      setSelectedMockup({ ...selectedMockup, status: newStatus });
    }
  };

  const statusColors = {
    pending: 'bg-warning/10 border-warning/30 text-warning-content',
    approved: 'bg-success/10 border-success/30 text-success',
    rejected: 'bg-error/10 border-error/30 text-error',
  };

  const mockupTabs = [
    { key: 'all',      label: 'All',      count: mockups.length },
    { key: 'pending',  label: 'Pending',  count: mockups.filter(m => m.status === 'pending').length },
    { key: 'approved', label: 'Approved', count: mockups.filter(m => m.status === 'approved').length },
    { key: 'rejected', label: 'Rejected', count: mockups.filter(m => m.status === 'rejected').length },
  ];

  return (
    <>
      {/* Filter Bar */}
      <StatusFilterBar
        tabs={mockupTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        label="Mockup Status:"
      />

      {/* Mockups Grid */}
      {filteredMockups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMockups.map((mockup) => (
            <MockupCard
              key={mockup.id}
              mockup={mockup}
              statusColors={statusColors}
              handleAction={handleAction}
              setSelectedMockup={setSelectedMockup}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-base-100 border border-base-200/60 rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-4">
            <FileText size={24} className="text-base-content/40" />
          </div>
          <h3 className="text-lg font-bold text-base-content mb-2 tracking-wide">No Mockups Found</h3>
          <p className="text-sm text-base-content/60 max-w-sm mb-6">
            {activeTab === 'all'
              ? "There are currently no design mockups uploaded for your orders. Our team will upload them here soon."
              : `You don't have any mockups in the "${activeTab}" status right now.`}
          </p>
          {activeTab !== 'all' && (
            <button onClick={() => setActiveTab('all')} className="btn btn-outline btn-sm uppercase tracking-widest text-xs">
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Mockup Detail Modal */}
      <MockupDetailModal
        selectedMockup={selectedMockup}
        setSelectedMockup={setSelectedMockup}
        statusColors={statusColors}
        handleAction={handleAction}
      />
    </>
  );
}
