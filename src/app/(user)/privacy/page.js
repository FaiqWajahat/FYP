'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, ShieldCheck, Database } from 'lucide-react';
import CTA from '@/Components/site/CTA';

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      icon: <Database className="text-blue-500" />,
      content: 'We collect information you provide directly to us, such as when you create an account, submit an inquiry, or communicate with us. This includes your name, email address, company details, and manufacturing specifications.'
    },
    {
      title: '2. How We Use Your Data',
      icon: <Eye className="text-emerald-500" />,
      content: 'Your data is used to facilitate manufacturing processes, provide customer support, and improve our digital tools. We do not sell your personal or business data to third-party advertisers.'
    },
    {
      title: '3. Data Security',
      icon: <ShieldCheck className="text-amber-500" />,
      content: 'We implement industry-standard security measures, including SSL encryption and secure cloud storage, to protect your design files and transaction history from unauthorized access.'
    },
    {
      title: '4. Your Rights',
      icon: <Lock className="text-rose-500" />,
      content: 'You have the right to access, update, or request the deletion of your personal information at any time through your dashboard settings or by contacting our support team.'
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
              <Lock size={14} /> Privacy First
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
              Privacy <span className="text-blue-600">Policy</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
              Your trust is our most valuable asset. Learn how we protect your data and intellectual property in the manufacturing process.
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

          <div className="mt-16 pt-8 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-400 font-medium italic">
              Last updated: May 3rd, 2026. For privacy concerns, please email privacy@factoryflow.com
            </p>
          </div>
        </div>
      </section>

      <CTA />
    </div>
  );
}
