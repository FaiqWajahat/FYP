'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { useConfigStore } from '@/store/useConfigStore';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const { projectName } = useConfigStore();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;
      
      toast.success("Account created! Please check your email for verification.");
      router.push('/login');
    } catch (err) {
      toast.error(err.message || "Failed to create account");
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

  return (
    <div className="w-full max-w-md mx-auto p-8 sm:p-10 bg-white rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.05)] border border-slate-100/80 relative overflow-hidden">
      {/* Decorative backdrop glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create Workspace</h2>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            Join {projectName} and modernize your supply chain.
          </p>
        </motion.div>

        <form className="space-y-4" onSubmit={handleSignup}>
          <motion.div variants={itemVariants} className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl transition-all duration-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
              <div className="pl-4 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input 
                type="text" 
                className="w-full pl-3 pr-4 py-3.5 bg-transparent text-sm font-medium text-slate-900 focus:outline-none placeholder:text-slate-400"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Work Email</label>
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

          <motion.div variants={itemVariants} className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Password</label>
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

          <motion.div variants={itemVariants} className="pt-2">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"} <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </form>

        <motion.p variants={itemVariants} className="mt-6 text-center text-[10px] font-medium text-slate-400 leading-relaxed">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-slate-600 transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-slate-600 transition-colors">
            Privacy Policy
          </Link>.
        </motion.p>

        <motion.p variants={itemVariants} className="mt-6 text-center text-sm font-medium text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
