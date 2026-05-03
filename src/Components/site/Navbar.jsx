'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Sparkles, ChevronDown, LayoutDashboard,
  ShoppingBag, Layers, ArrowRight, Zap, Globe, BadgeCheck,
  MessageSquare, Package, User, LogOut, Shield
} from 'lucide-react';

import UserProfile from '@/Components/common/UserProfile';
import { useConfigStore } from '@/store/useConfigStore';
import { useAuth } from '@/store/AuthContext';

// ─── Announcement bar items ─────────────────────────────────────────────────
const ANNOUNCEMENTS = [
  { icon: Zap,        text: '21-Day Express Turnaround' },
  { icon: Globe,      text: 'Shipping to 40+ Countries' },
  { icon: BadgeCheck, text: 'ISO-Certified Quality Control' },
  { icon: Shield,     text: 'Escrow-Protected Payments' },
];

// ─── Desktop nav items ───────────────────────────────────────────────────────
const NAV_LINKS = [
  { href: '/',        label: 'Home'    },
  { href: '/about',   label: 'About'   },
  { href: '/process', label: 'Process' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { user, profile } = useAuth();
  const { projectName }   = useConfigStore();
  const pathname          = usePathname();

  const [categories,       setCategories]       = useState([]);
  const [isScrolled,       setIsScrolled]       = useState(false);
  const [isMobileOpen,     setIsMobileOpen]     = useState(false);
  const [isCatalogOpen,    setIsCatalogOpen]    = useState(false);
  const [hoveredPath,      setHoveredPath]      = useState(null);
  const [announcementIdx,  setAnnouncementIdx]  = useState(0);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const catalogRef = useRef(null);
  const isAdminPath = pathname.startsWith('/admin');

  // ── Data / listeners ───────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => setCategories(d.categories || []))
      .catch(() => {});

    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Rotate announcement ticker
  useEffect(() => {
    const t = setInterval(() => {
      setAnnouncementIdx(i => (i + 1) % ANNOUNCEMENTS.length);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsMobileOpen(false); }, [pathname]);

  // Close catalog on outside click
  useEffect(() => {
    const handler = (e) => {
      if (catalogRef.current && !catalogRef.current.contains(e.target)) {
        setIsCatalogOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeCategories = categories.filter(c => c.status === 'Active');

  return (
    <>
      {/* ── Announcement bar ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAnnouncement && (
          <motion.div
            initial={{ height: 36, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 inset-x-0 z-[99] bg-slate-900 overflow-hidden"
          >
            <div className="h-[36px] flex items-center justify-center px-4 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={announcementIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="flex items-center gap-2 text-[11px] font-semibold text-slate-300"
                >
                  {React.createElement(ANNOUNCEMENTS[announcementIdx].icon, {
                    size: 12,
                    className: 'text-blue-400 shrink-0'
                  })}
                  {ANNOUNCEMENTS[announcementIdx].text}
                </motion.div>
              </AnimatePresence>

              <button
                onClick={() => setShowAnnouncement(false)}
                className="absolute right-4 text-slate-500 hover:text-white transition-colors"
                aria-label="Dismiss"
              >
                <X size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main header ──────────────────────────────────────────────────── */}
      <header
        className={`fixed inset-x-0 z-[100] flex justify-center px-4 sm:px-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          showAnnouncement ? 'top-[36px]' : 'top-0'
        } ${isScrolled ? 'py-3' : 'py-5'}`}
      >
        <motion.div
          layout
          className={`relative flex items-center justify-between w-full max-w-6xl rounded-2xl transition-all duration-500 px-4 sm:px-5 min-h-[60px] ${
            isScrolled
              ? 'bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_40px_rgba(0,0,0,0.08)]'
              : 'bg-white/60 backdrop-blur-md border border-white/30 shadow-sm'
          }`}
        >

          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group z-50"
          >
            {/* Icon mark */}
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:shadow-blue-600/50 transition-shadow">
              <Layers size={15} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors uppercase">
                {projectName}
              </span>
              <span className="text-[9px] font-bold tracking-[0.18em] text-slate-400 uppercase mt-0.5">
                Manufacturing
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ──────────────────────────────────────────────── */}
          <nav
            className="hidden lg:flex items-center gap-0.5"
            onMouseLeave={() => setHoveredPath(null)}
          >
            {NAV_LINKS.map(({ href, label }) => (
              <NavItem
                key={href}
                href={href}
                label={label}
                active={pathname === href}
                hoveredPath={hoveredPath}
                setHoveredPath={setHoveredPath}
              />
            ))}

            {/* ── Catalog dropdown ─────────────────────────────────────── */}
            <div
              ref={catalogRef}
              className="relative"
              onMouseEnter={() => { setIsCatalogOpen(true); setHoveredPath('catalog'); }}
              onMouseLeave={() => { setIsCatalogOpen(false); }}
            >
              <button
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-colors duration-200 z-10 ${
                  pathname.includes('/categories') || isCatalogOpen
                    ? 'text-slate-900'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Catalog
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-300 ${isCatalogOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {hoveredPath === 'catalog' && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-slate-100/80 rounded-xl z-0 pointer-events-none"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <AnimatePresence>
                {isCatalogOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0,  scale: 1 }}
                    exit={{  opacity: 0, y: 8,  scale: 0.97 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[420px] z-[110]"
                  >
                    <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/60 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.12)] overflow-hidden">
                      {/* Header */}
                      <div className="px-5 pt-4 pb-3 border-b border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                          Product Catalog
                        </p>
                        <p className="text-sm font-bold text-slate-800 mt-0.5">
                          Browse {activeCategories.length} categories
                        </p>
                      </div>

                      {/* Category list */}
                      <div className="p-2 max-h-[340px] overflow-y-auto no-scrollbar">
                        {activeCategories.length > 0 ? (
                          activeCategories.map(cat => (
                            <CatalogItem key={cat.id} cat={cat} />
                          ))
                        ) : (
                          <div className="py-10 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            No active categories
                          </div>
                        )}
                      </div>

                      {/* Footer CTA */}
                      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                        <Link
                          href="/categories"
                          className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors group"
                        >
                          View Full Collections
                          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Admin/Store switcher ──────────────────────────────────── */}
            {profile?.role === 'admin' && (
              <>
                <div className="h-4 w-px bg-slate-200 mx-1" />
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredPath('panel')}
                >
                  <Link
                    href={isAdminPath ? '/' : '/admin'}
                    className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-colors z-10 ${
                      isAdminPath || hoveredPath === 'panel'
                        ? 'text-slate-900'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {isAdminPath
                      ? <><ShoppingBag size={13} /> Store</>
                      : <><LayoutDashboard size={13} /> Admin</>
                    }
                  </Link>
                  {hoveredPath === 'panel' && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-slate-100/80 rounded-xl z-0 pointer-events-none"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
              </>
            )}
          </nav>

          {/* ── Right actions ────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 z-50">

            {/* Get Quote CTA */}
            <Link href="/smart-inquiry" className="hidden lg:block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[13px] shadow-md shadow-blue-600/25 hover:shadow-blue-600/40 transition-all"
              >
                <Sparkles size={13} className="text-blue-200" />
                Get a Quote
              </motion.button>
            </Link>

            {/* User profile / login */}
            {user ? (
              <UserProfile />
            ) : (
              <Link href="/login" className="hidden md:block">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-[13px] shadow-sm transition-all"
                >
                  Sign In
                </motion.button>
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMobileOpen(p => !p)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors active:scale-95 border border-slate-200/60"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isMobileOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{   rotate:  90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isMobileOpen ? <X size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2.5} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </motion.div>
      </header>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{   opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[200] bg-white flex flex-col lg:hidden"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <Link href="/" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30">
                  <Layers size={15} className="text-white" />
                </div>
                <span className="text-[15px] font-black tracking-tight text-slate-900 uppercase">{projectName}</span>
              </Link>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors active:scale-95"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-1">
              {[...NAV_LINKS, { href: '/categories', label: 'Catalog' }].map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <Link
                    href={href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center justify-between px-4 py-4 rounded-2xl font-black text-[15px] transition-all ${
                      pathname === href
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {label}
                    <ArrowRight size={16} className={pathname === href ? 'text-blue-200' : 'text-slate-300'} />
                  </Link>
                </motion.div>
              ))}

              {/* Admin switcher in mobile */}
              {profile?.role === 'admin' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <Link
                    href={isAdminPath ? '/' : '/admin'}
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center justify-between px-4 py-4 rounded-2xl font-black text-[15px] text-slate-800 hover:bg-slate-50 transition-all"
                  >
                    <span className="flex items-center gap-3">
                      {isAdminPath
                        ? <ShoppingBag size={16} className="text-blue-600" />
                        : <LayoutDashboard size={16} className="text-blue-600" />
                      }
                      {isAdminPath ? 'User Store' : 'Admin Panel'}
                    </span>
                    <ArrowRight size={16} className="text-slate-300" />
                  </Link>
                </motion.div>
              )}

              {/* Category chips */}
              {activeCategories.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 pt-4 border-t border-slate-100"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 px-4 mb-3">
                    Quick Category Access
                  </p>
                  <div className="flex flex-wrap gap-2 px-2">
                    {activeCategories.slice(0, 6).map(cat => (
                      <Link
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-xl text-[11px] font-bold text-slate-700 transition-colors"
                      >
                        <Layers size={11} />
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </nav>

            {/* Drawer footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="px-6 pb-8 pt-4 border-t border-slate-100 space-y-3"
            >
              <Link href="/smart-inquiry" onClick={() => setIsMobileOpen(false)}>
                <button className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[14px] active:scale-[0.98] transition-all shadow-lg shadow-blue-600/25">
                  <Sparkles size={16} />
                  Get a Free Quote
                </button>
              </Link>

              {!user && (
                <Link href="/login" onClick={() => setIsMobileOpen(false)}>
                  <button className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-[14px] active:scale-[0.98] transition-all">
                    Sign In
                  </button>
                </Link>
              )}

              {user && (
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-black text-sm overflow-hidden">
                    {profile?.profile_image
                      ? <img src={profile.profile_image} alt="" className="w-full h-full object-cover" />
                      : (profile?.full_name?.[0] || <User size={16} />)
                    }
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-slate-900">{profile?.full_name || 'User'}</p>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                      {profile?.role === 'admin' ? 'Administrator' : 'Client'}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer so page content doesn't hide behind fixed header */}
      <div className={`transition-all duration-500 ${showAnnouncement ? 'h-[96px]' : 'h-[76px]'} ${isScrolled ? '' : ''} lg:h-0`} />
    </>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function NavItem({ href, label, active, hoveredPath, setHoveredPath }) {
  const isHovered = hoveredPath === href;
  return (
    <div className="relative" onMouseEnter={() => setHoveredPath(href)}>
      <Link
        href={href}
        className={`relative block px-4 py-2 rounded-xl text-[13px] font-bold transition-colors duration-200 z-10 ${
          active || isHovered ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        {label}
        {active && (
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600" />
        )}
      </Link>
      {isHovered && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 bg-slate-100/80 rounded-xl z-0 pointer-events-none"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
    </div>
  );
}

function CatalogItem({ cat }) {
  return (
    <Link
      href={`/categories/${cat.slug}`}
      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all group"
    >
      {/* Thumbnail */}
      <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/60 group-hover:border-blue-200 transition-colors shadow-sm">
        {cat.image_url ? (
          <img
            src={cat.image_url}
            alt={cat.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Layers size={16} className="text-slate-400" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-black text-slate-800 group-hover:text-blue-600 transition-colors truncate">
          {cat.name}
        </p>
        {(cat.description || cat.subcategories?.length > 0) && (
          <p className="text-[10px] font-semibold text-slate-400 mt-0.5 truncate uppercase tracking-wide">
            {cat.description || cat.subcategories?.slice(0, 3).join(' · ')}
          </p>
        )}
      </div>

      {/* Arrow */}
      <ArrowRight
        size={13}
        className="text-slate-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
      />
    </Link>
  );
}
