'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, Sparkles, MessageSquare, Package, LogOut, LayoutDashboard } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/store/AuthContext';

const UserProfile = () => {
  const { profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const pathname = usePathname();

  // Close on navigate
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!profile) return null;

  return (
    <div className="relative z-[1001] hidden md:block" ref={containerRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center gap-2 p-1 pl-1 pr-3 rounded-2xl border transition-all duration-300 ${isOpen
          ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/10'
          : 'bg-white border-slate-200 hover:border-slate-400 hover:shadow-md'
          }`}
      >
        <div className={`h-9 w-9 rounded-xl flex items-center justify-center overflow-hidden transition-colors ${isOpen ? 'bg-blue-600' : 'bg-slate-100'}`}>
          {profile.profile_image ? (
            <img src={profile.profile_image} alt={profile.full_name} className="w-full h-full object-cover" />
          ) : (
            <User size={20} className={isOpen ? 'text-white' : 'text-slate-500'} />
          )}
        </div>
        <div className="flex flex-col items-start mr-1">
          <span className={`text-[11px] font-black uppercase tracking-wider leading-none ${isOpen ? 'text-white' : 'text-slate-900'}`}>
            {profile.full_name?.split(' ')[0] || 'User'}
          </span>
          <span className={`text-[9px] font-bold mt-0.5 leading-none ${isOpen ? 'text-blue-200' : 'text-slate-400'}`}>
            {profile.role === 'admin' ? 'Administrator' : 'Client'}
          </span>
        </div>
        <ChevronDown size={14} className={`transition-transform duration-500 ease-out ${isOpen ? 'rotate-180 text-white' : 'text-slate-400'}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-4 w-62 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-slate-200/50 overflow-hidden z-[1002]"
          >
            {/* Minimalist List for Profile, Chats, Dashboard */}
            <div className="p-3 space-y-1">
              <DropdownLink href="/dashboard" icon={<LayoutDashboard size={16} />} label="Dashboard" />
              <DropdownLink href="/dashboard/messages" icon={<MessageSquare size={16} />} label="Messages" />
              <DropdownLink href="/dashboard/profile" icon={<User size={16} />} label="Profile" />


            </div>

            {/* Logout Footer */}
            <div className="p-3 bg-slate-50/50 border-t border-slate-100">
              <button
                onClick={signOut}
                className="flex w-full items-center justify-center gap-2 text-xs font-black text-slate-500 hover:text-red-600 hover:bg-red-50 py-3 rounded-2xl transition-all duration-300"
              >
                <LogOut size={14} strokeWidth={2.5} /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DropdownLink = ({ href, icon, label }) => (
  <Link href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all group">
    <div className="text-slate-400 group-hover:text-blue-600 transition-colors">{icon}</div>
    <span className="text-[13px] font-bold text-slate-700 group-hover:text-slate-900">{label}</span>
  </Link>
);

export default UserProfile;
