'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, Sparkles, MessageSquare, Package, FileText, LogOut } from 'lucide-react';

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Robust click-outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    // 'mousedown' detects clicks faster/better than 'click'
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-[1000] hidden md:block" ref={containerRef}>
      <motion.button 
        onClick={(e) => {
         
          setIsOpen(!isOpen);
        }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all cursor-pointer ${
          isOpen ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' : 'bg-white border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden pointer-events-none">
          <User size={18} className="text-slate-500" />
        </div>
        <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-100">
              <p className="text-sm font-bold text-slate-900">John Client</p>
            
            </div>
            
            {/* Manufacturing */}
            <div className="py-2">
              <p className="px-5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Links</p>
              <DropdownLink href="/dashboard/inquiries" icon={<Sparkles size={16} className="text-blue-500" />} label="My Inquiries" />
              <DropdownLink href="/dashboard/messages" icon={<MessageSquare size={16} className="text-blue-500" />} label="Messages" />
              <DropdownLink href="/dashboard/messages" icon={<MessageSquare size={16} className="text-blue-500" />} label="Orders" />
            </div>

            {/* Retail */}
            <div className="py-2 border-t border-slate-100">
              <p className="px-5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account</p>
              <DropdownLink href="/dashboard/orders" icon={<Package size={16} />} label="Dashboard" />
              <DropdownLink href="/dashboard/history" icon={<FileText size={16} />} label="Profile" />
            </div>

            {/* Logout */}
            <div className="bg-slate-50 p-2 border-t border-slate-100">
              <button className="flex w-full items-center justify-center gap-2 text-xs font-semibold text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors">
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple link helper
const DropdownLink = ({ href, icon, label }) => (
  <Link href={href} className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors group">
    <div className="text-slate-400 group-hover:text-blue-500">{icon}</div>
    <span>{label}</span>
  </Link>
);

export default UserProfile;