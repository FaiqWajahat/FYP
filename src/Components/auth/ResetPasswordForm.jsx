'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/store/AuthContext';
import { toast } from 'react-hot-toast';

export default function ResetPasswordForm() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasSession = !!user;
  const checking = authLoading;

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast.success("Password updated successfully! Logging you in...");
      router.push('/');
    } catch (err) {
      console.error("Update password error:", err);
      toast.error(err.message || "Failed to update password");
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

  if (checking) {
    return (
      <div className="w-full max-w-md mx-auto p-8 sm:p-10 bg-white rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.05)] border border-slate-100/80 text-center">
        <Loader2 className="animate-spin text-blue-600 mx-auto" size={32} />
        <p className="text-sm font-semibold text-slate-500 mt-4">Verifying session...</p>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="w-full max-w-md mx-auto p-8 sm:p-10 bg-white rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.05)] border border-slate-100/80 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
        >
          <AlertCircle size={32} />
        </motion.div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Invalid Session</h2>
        <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">
          Your recovery link is expired, invalid, or you are trying to access this page directly. Please request a new link from the forgot password page.
        </p>
        <button
          onClick={() => router.push('/forgot-password')}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold items-center justify-center transition-all cursor-pointer"
        >
          Request Reset Link
        </button>
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
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">New Password</h2>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            Please enter your new password below. Ensure it is at least 6 characters long.
          </p>
        </motion.div>

        <form className="space-y-4" onSubmit={handleUpdatePassword}>
          <motion.div variants={itemVariants} className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">New Password</label>
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl transition-all duration-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
              <div className="pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full pl-3 pr-3 py-3.5 bg-transparent text-sm font-medium text-slate-900 focus:outline-none placeholder:text-slate-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-4 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Confirm New Password</label>
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl transition-all duration-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
              <div className="pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full pl-3 pr-3 py-3.5 bg-transparent text-sm font-medium text-slate-900 focus:outline-none placeholder:text-slate-400"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"} <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
