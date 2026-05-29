'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useConfigStore } from '@/store/useConfigStore';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export default function ForgotPasswordForm() {
  const { projectName } = useConfigStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) throw error;
      
      toast.success("Reset link sent!");
      setSent(true);
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 26 },
    },
  };

  if (sent) {
    return (
      <div className="w-full max-w-md mx-auto p-8 sm:p-10 bg-white rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.05)] border border-slate-100/80 relative overflow-hidden text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 size={32} />
        </motion.div>
        
        <h2 className="text-2xl font-black text-slate-900 mb-2">Check Your Email</h2>
        <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">
          We have sent a secure password reset link to <strong className="text-slate-800">{email}</strong>. Please follow the instructions to reset your password.
        </p>

        <Link href="/login" className="inline-flex w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold items-center justify-center transition-all cursor-pointer">
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 sm:p-10 bg-white rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.05)] border border-slate-100/80 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Reset Password</h2>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            Enter the email address associated with your {projectName} account, and we'll send you a link to reset your password.
          </p>
        </motion.div>

        <form className="space-y-6" onSubmit={handleResetRequest}>
          <motion.div variants={itemVariants} className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl transition-all duration-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
              <div className="pl-4 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                className="w-full pl-3 pr-4 py-3.5 bg-transparent text-sm font-medium text-slate-900 focus:outline-none placeholder:text-slate-400"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Reset Link"} <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </form>

        <motion.p variants={itemVariants} className="mt-8 text-center text-sm font-medium text-slate-500">
          Remembered your password?{' '}
          <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
            Sign In
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
