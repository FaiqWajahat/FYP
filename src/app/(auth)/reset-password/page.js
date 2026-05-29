'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Cpu, Factory, Hammer, Truck, Star } from 'lucide-react';
import ResetPasswordForm from '@/Components/auth/ResetPasswordForm';
import { useConfigStore } from '@/store/useConfigStore';

// Reusable supply chain demo component for design consistency
function SupplyChainDemo() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { 
      label: "AI Tech Pack", 
      desc: "Specs generated & parsed", 
      icon: Cpu, 
      status: "AI Analysis Complete" 
    },
    { 
      label: "Smart Sourcing", 
      desc: "Matched to ethical factory", 
      icon: Factory, 
      status: "Factory Confirmed" 
    },
    { 
      label: "Active Production", 
      desc: "Real-time output monitoring", 
      icon: Hammer, 
      status: "Sewing & QC Checklist" 
    },
    { 
      label: "Live Logistics", 
      desc: "Dispatched to hub", 
      icon: Truck, 
      status: "Arriving in 2 Days" 
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(15,23,42,0.02)] hover:border-blue-200 hover:shadow-[0_12px_40px_rgba(37,99,235,0.05)] transition-all duration-300">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Flow Simulator</span>
        </div>
        <div className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Active Session
        </div>
      </div>

      <div className="relative flex justify-between items-center mb-8 px-4">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
        
        <motion.div 
          className="absolute top-1/2 left-0 h-0.5 bg-blue-500 -translate-y-1/2 z-0 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: activeStep / (steps.length - 1) }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ width: '100%' }}
        />

        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isActive = idx === activeStep;
          const isCompleted = idx < activeStep;

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  backgroundColor: isActive ? "#2563eb" : isCompleted ? "#dbeafe" : "#ffffff",
                  borderColor: isActive ? "#2563eb" : isCompleted ? "#3b82f6" : "#e2e8f0"
                }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm cursor-pointer"
                onClick={() => setActiveStep(idx)}
              >
                <StepIcon size={16} className={isActive ? "text-white" : isCompleted ? "text-blue-600" : "text-slate-400"} />
              </motion.div>
              <div className="absolute top-12 whitespace-nowrap text-center">
                <p className={`text-[10px] font-bold ${isActive ? "text-slate-900 font-extrabold" : "text-slate-400"}`}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-slate-900 rounded-2xl p-4 font-mono text-left relative overflow-hidden shadow-inner">
        <div className="absolute top-2 right-3 flex gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
          <span className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
        </div>
        <p className="text-[10px] font-bold text-slate-500 mb-2">// PIPELINE LOG</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="space-y-1"
          >
            <p className="text-xs text-blue-400 font-semibold">
              &gt; <span className="text-slate-400">Step {activeStep + 1}:</span> {steps[activeStep].status}
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
              Status: <span className="text-emerald-400 font-bold">READY</span>
            </p>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Info: {steps[activeStep].desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  const { projectName } = useConfigStore();

  return (
    <div className="flex w-full min-h-screen bg-white">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col pt-8 pb-8 px-6 sm:px-12 bg-white relative z-10">
        
        {/* Simple Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Box size={12} className="text-white" />
            </div>
            <div className="text-sm font-black tracking-tight text-slate-900 uppercase">{projectName}</div>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center my-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full"
          >
            <ResetPasswordForm />
          </motion.div>
        </div>

        {/* Simple Footer */}
        <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          © {new Date().getFullYear()} {projectName}. Digital Ecosystem.
        </div>
      </div>

      {/* Right Column - Brand Graphics */}
      <div className="hidden lg:flex w-1/2 bg-slate-50 relative overflow-hidden items-center justify-center p-12 border-l border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
        
        <motion.div 
          animate={{ 
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" 
        />
        <motion.div 
          animate={{ 
            x: [0, -30, 30, 0],
            y: [0, 40, -30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" 
        />
        
        <motion.div 
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.1 }}
           className="relative z-10 w-full max-w-lg text-slate-900"
        >
          <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-8 shadow-[0_4px_10px_rgba(0,0,0,0.02)]">
             <Box size={22} className="text-blue-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-[1.1] tracking-tight mb-5">
            Choose a Strong Password. <br />
            <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Keep Your Factory Secure.</span>
          </h1>
          <p className="text-base text-slate-500 font-semibold leading-relaxed mb-8">
            Create a new password. Make sure it uses a mix of symbols, letters, and numbers to safeguard your supply chain data.
          </p>
          
          <div className="mb-8">
            <SupplyChainDemo />
          </div>

          <div className="p-6 bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.03)] hover:border-blue-200 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="text-amber-500 fill-amber-500" />
                ))}
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Enterprise Verified</span>
            </div>
            <p className="text-xs font-semibold text-slate-600 leading-relaxed italic">
              "Credential updates are immediately synched and applied. The system enforces strict secure guidelines for passwords."
            </p>
            <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs">SJ</div>
              <div>
                <p className="text-xs font-black text-slate-900">Sarah Jenkins</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Head of Production · Modus Collective</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
