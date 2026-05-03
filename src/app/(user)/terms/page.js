'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ScrollText, CheckCircle2, AlertCircle } from 'lucide-react';
import CTA from '@/Components/site/CTA';

export default function TermsPage() {
  const sections = [
    {
      title: '1. Manufacturing & Production',
      icon: <ScrollText className="text-blue-500" />,
      content: 'All orders placed through Factory Flow are subject to production capacity and material availability. Standard lead times are estimates and may vary based on order complexity, quantity, and seasonal demand. Production officially begins only after the initial milestone payment (Deposit) is received and all tech packs/mockups are approved.'
    },
    {
      title: '2. Quality Standards & Tolerance',
      icon: <CheckCircle2 className="text-emerald-500" />,
      content: 'We adhere to international AQL 2.5/4.0 quality standards. However, as textile manufacturing involves manual processes, a +/- 5% tolerance on measurements, weight (GSM), and color shading (Lab Dips) is considered standard in the industry. Clients are responsible for reviewing physical samples before bulk production.'
    },
    {
      title: '3. Payment Terms & Milestones',
      icon: <Shield className="text-amber-500" />,
      content: 'Payments are split into milestones: Typically 50% Deposit to start and 50% Balance upon completion before shipping. For verified high-volume partners, custom schedules (e.g., 30/40/30) may apply. All funds are held securely until production milestones are verified by our Quality Assurance team.'
    },
    {
      title: '4. Cancellations & Returns',
      icon: <AlertCircle className="text-rose-500" />,
      content: 'Once production has commenced, orders cannot be cancelled as raw materials are procured and garments are cut specifically for your brand. Returns are only accepted for manufacturing defects that exceed the AQL threshold. Claims must be filed within 14 days of shipment arrival.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-100 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest mb-6">
              <Shield size={14} /> Legal Framework
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
              Terms of <span className="text-blue-600">Production</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
              Welcome to the Factory Flow manufacturing ecosystem. These terms govern your use of our digital platform and our industrial production services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-12">
            {sections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-black text-slate-900">{section.title}</h2>
                </div>
                <p className="text-slate-600 leading-relaxed pl-16">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Last Update */}
          <div className="mt-16 pt-8 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-400 font-medium italic">
              Last updated: May 3rd, 2026. For specific contract inquiries, please contact our legal department at legal@factoryflow.com
            </p>
          </div>
        </div>
      </section>

      <CTA />
    </div>
  );
}
