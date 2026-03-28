'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  PenTool, 
  FileText, 
  Settings, 
  Truck, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const STEPS = [
  {
    id: 1,
    title: 'Draft Your Vision',
    description: 'Use our Smart Inquiry tool to customize base products or upload your own sketches/tech packs.',
    icon: <PenTool size={32} />,
    color: 'bg-blue-100 text-blue-600',
    delay: 0.2
  },
  {
    id: 2,
    title: 'Receive Smart Quote',
    description: 'Our system analyzes material costs and GSM to give you an estimated wholesale quote instantly.',
    icon: <FileText size={32} />,
    color: 'bg-indigo-100 text-indigo-600',
    delay: 0.4
  },
  {
    id: 3,
    title: 'Live Production',
    description: 'Track your order status (Cutting, Stitching, Packing) in real-time via your client dashboard.',
    icon: <Settings size={32} className="animate-spin-slow" />, // Custom slow spin class or remove animation
    color: 'bg-purple-100 text-purple-600',
    delay: 0.6
  },
  {
    id: 4,
    title: 'Global Delivery',
    description: 'Your bulk order is packed and shipped directly from Sialkot to your doorstep anywhere in the world.',
    icon: <Truck size={32} />,
    color: 'bg-green-100 text-green-600',
    delay: 0.8
  }
];

const Process = () => {
  return (
    <section className="py-20 bg-slate-50  relative overflow-hidden">
      
      {/* Background Decor (Optional Gears/Pattern) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute right-0 top-20 w-96 h-96 bg-slate-900 rounded-full blur-3xl"></div>
        <div className="absolute left-0 bottom-20 w-72 h-72 bg-blue-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">
            The Factory Flow Process
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-3 mb-4">
            From Concept to Doorstep
          </h2>
          <p className="text-slate-600 text-lg">
            We've simplified the complex manufacturing process. Here is how your 
            <span className="font-bold text-slate-900"> Smart Inquiry</span> comes to life.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 z-[-10] "></div>

          {STEPS.map((step) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: step.delay }}
              className="relative group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 left-6 bg-slate-900 text-white text-xs font-bold w-8 h-8 flex items-center justify-center rounded-full border-4 border-slate-50">
                {step.id}
              </div>

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                {step.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {step.description}
              </p>

              {/* Hover Effect Line */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-blue-600 group-hover:w-full transition-all duration-500 rounded-b-2xl"></div>
            </motion.div>
          ))}

        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link href="/smart-inquiry">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-lg font-bold text-lg shadow-xl hover:bg-blue-700 transition-colors"
            >
              Start Your Inquiry Now <ArrowRight size={20} />
            </motion.button>
          </Link>
          <p className="mt-4 text-sm text-slate-500 flex items-center justify-center gap-2">
            <CheckCircle2 size={16} className="text-green-500" />
            No credit card required for initial quote
          </p>
        </div>

      </div>
    </section>
  );
};

export default Process;