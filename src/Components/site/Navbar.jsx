'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, ChevronDown, LayoutDashboard, ShieldCheck, ShoppingBag, Factory, Layers } from 'lucide-react';

import UserProfile from '@/Components/common/UserProfile';
import { useConfigStore } from '@/store/useConfigStore';
import { useAuth } from '@/store/AuthContext';

export default function Navbar() {
  const { user, profile } = useAuth();
  const [categories, setCategories] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCatalogHovered, setIsCatalogHovered] = useState(false);
  const [hoveredPath, setHoveredPath] = useState(null);

  const { projectName } = useConfigStore();
  const pathname = usePathname();

  const isAdminPath = pathname.startsWith('/admin');

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Navbar category fetch failed:", err);
      }
    };
    fetchCats();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 w-full z-[100] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] px-4 sm:px-6 md:px-8 flex justify-center ${isScrolled ? 'py-4 md:py-5' : 'py-5 md:py-6'
          }`}
      >
        <motion.div
          layout
          className={`relative flex items-center justify-between w-full max-w-6xl rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pl-4 pr-4 sm:pl-5 sm:pr-3 min-h-[64px] ${isScrolled
            ? 'bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)]'
            : 'bg-white/50 backdrop-blur-md border border-white/20 shadow-sm'
            }`}
        >
          {/* LOGO SECTION */}
          <Link href="/" className="flex items-center gap-3 group relative z-50 mr-4 sm:mr-8 shrink-0 pl-2 sm:pl-0">
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-primary leading-none group-hover:text-primary/80 transition-colors uppercase">
                {projectName}
              </span>
              <span className="text-[9px] font-bold tracking-[0.2em] text-slate-500 uppercase mt-0.5 leading-none flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Manufacturing
              </span>
            </div>
          </Link>

          {/* CENTER NAVIGATION (DESKTOP) */}
          <nav
            className="hidden lg:flex items-center gap-1.5 relative pointer-events-auto"
            onMouseLeave={() => setHoveredPath(null)}
          >
            <NavItem
              href="/"
              label="Home"
              active={pathname === '/'}
              hoveredPath={hoveredPath}
              setHoveredPath={setHoveredPath}
            />

            {/* Catalog Trigger */}
            <div
              className="relative"
              onMouseEnter={() => {
                setIsCatalogHovered(true);
                setHoveredPath('catalog');
              }}
              onMouseLeave={() => setIsCatalogHovered(false)}
            >
              <button
                className={`relative px-4 py-2 rounded-full text-[13px] font-bold transition-colors duration-300 flex items-center gap-1.5 z-10 ${pathname.includes('/categories') || isCatalogHovered || hoveredPath === 'catalog'
                  ? 'text-slate-900'
                  : 'text-slate-500'
                  }`}
              >
                Catalog
                <ChevronDown size={14} className={`transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isCatalogHovered ? 'rotate-180' : ''}`} />
              </button>

              {hoveredPath === 'catalog' && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-slate-100/80 rounded-full z-0 pointer-events-none"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {/* Animated Mega-Menu Dropdown */}
              <AnimatePresence>
                {isCatalogHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(4px)' }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-5 w-[380px] z-[101]"
                  >
                    <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/50 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] p-4 overflow-hidden">
                      <div className="space-y-1 max-h-[400px] overflow-y-auto no-scrollbar">
                        {categories.filter(c => c.status === 'Active').length > 0 ? (
                          categories.filter(c => c.status === 'Active').map((cat) => (
                            <DropdownLink 
                              key={cat.id}
                              cat={cat}
                              icon={Layers} 
                              href={`/categories/${cat.slug}`} 
                              label={cat.name} 
                              description={cat.description || (cat.subcategories?.slice(0, 3).join(", "))} 
                            />
                          ))
                        ) : (
                          <div className="py-8 text-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No categories active</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 px-1">
                        <Link href="/categories" className="group flex items-center justify-between w-full py-3 px-3 text-[11px] font-black uppercase tracking-widest text-slate-800 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                          Full Collections
                          <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center transition-colors">
                            <span className="text-[10px] leading-none">→</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavItem href="/about" label="About" active={pathname === '/about'} hoveredPath={hoveredPath} setHoveredPath={setHoveredPath} />
            <NavItem href="/contact" label="Contact" active={pathname === '/contact'} hoveredPath={hoveredPath} setHoveredPath={setHoveredPath} />

            {/* Dashboard / Panel Switcher - Only for Admins */}
            {profile?.role === 'admin' && (
              <>
                <div className="h-5 w-px bg-slate-200 mx-2" />
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredPath('panel')}
                >
                  <Link
                    href={isAdminPath ? '/' : '/admin'}
                    className={`relative px-4 py-2 rounded-full text-[13px] font-bold transition-all flex items-center gap-1.5 z-10 ${isAdminPath || hoveredPath === 'panel'
                      ? 'text-slate-900'
                      : 'text-slate-500'
                      }`}
                  >
                    {isAdminPath ? (
                      <><ShoppingBag size={14} /> Store</>
                    ) : (
                      <><LayoutDashboard size={14} /> Admin</>
                    )}
                  </Link>
                  {hoveredPath === 'panel' && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-slate-100/80 rounded-full z-0 pointer-events-none"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
              </>
            )}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3 relative z-50 shrink-0">

            {/* Get Quote - Premium UI Button */}
            <Link href="/smart-inquiry" className="hidden lg:block">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#1e293b' }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-5 py-[10px] bg-slate-900 text-white rounded-full font-bold text-[13px] transition-all shadow-md hover:shadow-xl hover:shadow-slate-900/20"
              >
                <Sparkles size={14} className="text-slate-300" />
                Get Quote
              </motion.button>
            </Link>

            <div className="pl-1 sm:pl-2">
              {user ? (
                <UserProfile />
              ) : (
                <Link href="/login">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 bg-primary text-primary-content rounded-full font-bold text-[13px] shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                  >
                    Login
                  </motion.button>
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center bg-slate-100/50 hover:bg-slate-200 transition-colors text-slate-900 rounded-full active:scale-95 border border-slate-200/50"
              onClick={() => setIsMobileOpen((prev) => !prev)}
            >
              <Menu size={18} strokeWidth={2.5} />
            </button>
          </div>
        </motion.div>
      </header>

      {/* MOBILE FULL-SCREEN DRAWER */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-white/95 backdrop-blur-3xl z-[200] flex flex-col pt-24 pb-8 px-6 lg:hidden"
          >
            {/* Close Button placed precisely over the open button */}
            <div className="absolute top-5 right-4 sm:right-6 flex justify-end">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full transition-colors active:scale-95"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex flex-col h-full">
              <nav className="flex-1 flex flex-col gap-6 mt-8">
                {NAV_LINKS.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1, duration: 0.4 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="text-3xl font-black text-slate-900 hover:text-slate-600 transition-colors flex items-center justify-between group"
                    >
                      {item.label}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300">→</span>
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: NAV_LINKS.length * 0.05 + 0.1, duration: 0.4 }}
                >
                  <Link
                    href="/categories"
                    onClick={() => setIsMobileOpen(false)}
                    className="text-3xl font-black text-slate-900 hover:text-slate-600 transition-colors flex items-center justify-between group"
                  >
                    Catalog
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300">→</span>
                  </Link>
                </motion.div>
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="pt-8 mt-auto border-t border-slate-100 space-y-4"
              >
                <div className="space-y-4">
                  {user ? (
                    <>
                      {profile?.role === 'admin' && (
                        <Link
                          href={isAdminPath ? '/' : '/admin'}
                          onClick={() => setIsMobileOpen(false)}
                          className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl font-bold text-slate-900"
                        >
                          <span className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                              {isAdminPath ? <ShoppingBag size={14} className="text-primary" /> : <LayoutDashboard size={14} className="text-primary" />}
                            </div>
                            {isAdminPath ? 'Switch to User Store' : 'Switch to Admin Panel'}
                          </span>
                        </Link>
                      )}
                      <Link
                        href="/admin/profile"
                        onClick={() => setIsMobileOpen(false)}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl font-bold text-slate-900"
                      >
                        <span className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm overflow-hidden">
                            {profile?.profile_image ? (
                              <img src={profile.profile_image} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <User size={14} className="text-slate-400" />
                            )}
                          </div>
                          Account Settings
                        </span>
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsMobileOpen(false)}
                      className="w-full flex items-center justify-between p-4 bg-primary text-primary-content rounded-2xl font-bold"
                    >
                      <span className="flex items-center gap-3 pl-2">
                        Login / Create Account
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-[12px]">→</span>
                      </div>
                    </Link>
                  )}
                </div>

                <Link href="/smart-inquiry" onClick={() => setIsMobileOpen(false)}>
                  <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 active:scale-95 transition-transform mt-2">
                    <Sparkles size={16} /> Get a Quote
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacing to prevent content hidden under fixed navbar */}
      <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'h-[80px]' : 'h-[104px]'} lg:h-[0px]`} />
    </>
  );
}

// --- SUB-COMPONENTS ---

const NavItem = ({ href, label, active, hoveredPath, setHoveredPath }) => {
  const isHovered = hoveredPath === href;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHoveredPath(href)}
    >
      <Link
        href={href}
        className={`relative px-4 py-2 rounded-full text-[13px] font-bold transition-colors duration-300 block z-10 ${active || isHovered ? 'text-slate-900' : 'text-slate-500'
          }`}
      >
        {label}
      </Link>

      {/* The Liquid Background Element */}
      {isHovered && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 bg-slate-100/80 rounded-full z-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </div>
  );
};

const DropdownLink = ({ href, label, description, icon: Icon, cat }) => (
  <Link href={href} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all group relative overflow-hidden">
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-slate-300 rounded-r-md transition-all duration-300 group-hover:h-1/2 opacity-0 group-hover:opacity-100" />
    <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-white border border-slate-100 group-hover:border-slate-200 transition-all flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md overflow-hidden bg-white">
      {cat?.image_url ? (
        <img src={cat.image_url} alt={label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      ) : (
        Icon && <Icon size={18} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
      )}
    </div>
    <div className="flex flex-col">
      <span className="text-[13px] font-black text-slate-800 group-hover:text-slate-900 transition-colors flex items-center gap-2 uppercase tracking-wide">
        {label}
        <span className="text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">→</span>
      </span>
      <span className="text-[10px] font-bold text-slate-400 mt-0.5 line-clamp-1 uppercase tracking-widest">{description}</span>
    </div>
  </Link>
);
