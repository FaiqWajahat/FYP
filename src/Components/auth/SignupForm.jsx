'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Chrome, Loader2 } from 'lucide-react';
import { useConfigStore } from '@/store/useConfigStore';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/store/AuthContext';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const { projectName } = useConfigStore();
  const { signInWithGoogle } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const onGoogleSignup = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      toast.error("Failed to initiate Google Signup");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 sm:p-12 bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create Workspace</h2>
          <p className="text-sm font-medium text-slate-500">
            Join {projectName} and modernize your supply chain.
          </p>
        </div>

        <div className="mb-6">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGoogleSignup}
            type="button"
            className="w-full py-3.5 bg-white border-2 border-slate-100 text-slate-700 rounded-xl text-sm font-bold flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-200 transition-all font-sans"
          >
            <Chrome size={18} className="text-blue-500" />
            Sign up with Google
          </motion.button>
        </div>

        <div className="mb-6 relative flex items-center justify-center">
          <div className="absolute inset-x-0 h-px bg-slate-100" />
          <span className="relative z-10 bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            Or register with email
          </span>
        </div>

        <form className="space-y-4" onSubmit={handleSignup}>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input 
                type="text" 
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Work Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:bg-slate-900 transition-all mt-6 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"} <ArrowRight size={16} />
          </motion.button>
        </form>

        <p className="mt-8 text-center text-xs font-medium text-slate-500 leading-relaxed">
          By signing up, you agree to our <Link href="/terms" className="underline hover:text-slate-900 transition-colors">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-slate-900 transition-colors">Privacy Policy</Link>.
        </p>

        <p className="mt-6 text-center text-sm font-medium text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
