'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, Menu, X, Sparkles, MapPin, Phone, HelpCircle, 
  Download, Shirt, Scissors, LayoutGrid, Home
} from 'lucide-react';

// Assuming these are your local components
import UserProfile from './UserProfile';
import CartButton from './CartButton';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Active state for 'All Categories' (exact match)
  const isAllCategoriesActive = pathname === '/categories';

  return (
    <>
      <header 
        className={`sticky top-0 left-0 right-0 w-full z-[9999] border-b border-slate-200 bg-white transition-all duration-300 ${
          isScrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        {/* Top Utility Bar */}
        <div className="bg-slate-950 text-slate-400 text-[11px] font-medium py-2 px-4 md:px-8 flex justify-between items-center relative z-[10000]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin size={12} className="text-blue-500" /> PK
            </span>
            <span className="hidden sm:block w-px h-3 bg-slate-800"></span>
            <span className="hidden sm:flex items-center gap-1.5 hover:text-white transition cursor-pointer active:text-blue-400">
              <Phone size={12} /> +92 333 1234567
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="/help" className="flex items-center gap-1 hover:text-white active:text-blue-400 transition">
              <HelpCircle size={12} /> Help
            </Link>
          </div>
        </div>

        {/* Main Header Row */}
        <div className="w-full border-b border-slate-100 relative z-[10000]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4 md:gap-8 bg-white relative">
            
            {/* 1. LOGO */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0 relative z-50">
              <div className="relative bg-blue-600 text-white p-2 rounded-lg group-hover:rotate-6 transition-transform duration-300">
                <PackageIcon size={26} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none">
                  Factory<span className="text-blue-600">Flow</span>
                </span>
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Apparel Mfg
                </span>
              </div>
            </Link>

            {/* 2. DESKTOP SEARCH BAR */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-auto relative group z-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
              <input 
                type="text" 
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-md bg-slate-50 text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all shadow-inner"
                placeholder="Search products, categories..."
              />
            </div>

            {/* 3. RIGHT ACTIONS */}
            <div className="flex items-center gap-3 md:gap-5 relative z-50 bg-white">
              
              {/* Search Icon for Tablets (Hidden on mobile and large desktops) */}
              <button 
                className="hidden md:flex lg:hidden p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                 <Search size={22} />
              </button>

              <Link href="/smart-inquiry" className="hidden md:block">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-md font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg">
                  <Sparkles size={16} />
                  <span>Smart Inquiry</span>
                </button>
              </Link>

              <CartButton />
              <div className="hidden sm:block">
                <UserProfile />
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                className="lg:hidden p-2 -mr-2 text-slate-800 hover:bg-slate-100 active:scale-90 rounded-lg transition-all"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open Menu"
              >
                <Menu size={26} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Nav (Desktop Only) */}
        <div className="hidden lg:block bg-white relative z-[9998]">
          <div className="max-w-7xl mx-auto px-8">
            <nav className="flex items-center gap-8">
               {/* All Categories Button */}
               <Link 
                 href="/categories" 
                 className={`flex items-center gap-2 text-sm font-bold py-4 cursor-pointer transition-all border-b-2 ${
                   isAllCategoriesActive 
                    ? 'text-blue-600 border-blue-600' 
                    : 'text-slate-900 border-transparent hover:text-blue-600 hover:border-blue-600/30'
                 }`}
               >
                 <LayoutGrid size={16} /> All Categories
               </Link>

               <div className="h-4 w-px bg-slate-300"></div>

               <NavLink href="/categories/hoodies" label="Hoodies" />
               <NavLink href="/categories/jackets" label="Jackets" />
               <NavLink href="/categories/tracksuits" label="Tracksuits" />
               <NavLink href="/categories/t-shirts" label="T-Shirts" />
               
               <div className="ml-auto">
                 <Link href="/catalog" className="text-xs font-bold text-slate-600 flex items-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">
                   <Download size={14} className="text-blue-600"/> Factory Catalog
                 </Link>
               </div>
            </nav>
          </div>
        </div>
      </header>

      {/* --- MOBILE MENU --- */}
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[11000] lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 right-0 w-[85%] max-w-[360px] bg-white shadow-2xl z-[11001] lg:hidden flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
          {/* Mobile Menu Header */}
          <div className="p-5 flex justify-between items-center border-b border-slate-100 bg-slate-50">
            <span className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Menu size={20} className="text-blue-600"/> Menu
            </span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="p-2 bg-white rounded-full shadow-sm text-slate-500 hover:text-red-500 active:scale-90 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile Menu Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Mobile Search - Fixes the hidden search on small screens */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-slate-400" />
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  placeholder="Search products..."
                />
              </div>

              {/* Mobile CTA */}
              <Link href="/smart-inquiry" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col gap-1 p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl text-white shadow-lg active:scale-95 transition-transform">
                <div className="flex items-center gap-2 font-bold"><Sparkles size={18} className="text-blue-400" /> Smart Inquiry</div>
                <p className="text-xs text-slate-300">Start your custom production</p>
              </Link>

              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Navigation</h3>
                
                <MobileListLink href="/" label="Home" icon={<Home size={18}/>} />
                <MobileListLink href="/categories" label="All Categories" icon={<LayoutGrid size={18}/>} isActive={isAllCategoriesActive} />
              </div>

              {/* Mobile Categories Grid */}
              <div className="pt-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Categories</h3>
                <div className="grid grid-cols-2 gap-3">
                    <MobileCategoryGridLink href="/categories/hoodies" label="Hoodies" icon={<Scissors size={18}/>} />
                    <MobileCategoryGridLink href="/categories/jackets" label="Jackets" icon={<Shirt size={18}/>} />
                    <MobileCategoryGridLink href="/categories/tracksuits" label="Tracksuits" icon={<Scissors size={18}/>} />
                    <MobileCategoryGridLink href="/categories/t-shirts" label="T-Shirts" icon={<Shirt size={18}/>} />
                </div>
              </div>

              {/* Utility Link */}
              <div className="pt-4 border-t border-slate-100">
                <Link href="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                  <Download size={18} /> Download Catalog
                </Link>
              </div>
          </div>
      </div>
    </>
  );
};

// --- Helpers & Sub-components ---

const PackageIcon = ({size, strokeWidth}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22v-10"/>
  </svg>
);

const NavLink = ({ href, label }) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);
  return (
    <Link 
      href={href} 
      className={`relative group text-sm font-medium py-4 transition-colors ${
        isActive ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
      }`}
    >
      {label}
      <span className={`absolute left-0 right-0 bottom-0 h-0.5 bg-blue-600 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
    </Link>
  );
};

// For List-style mobile links (Home, All Categories)
const MobileListLink = ({ href, label, icon, isActive }) => {
  const pathname = usePathname();
  const active = isActive !== undefined ? isActive : pathname === href;
  
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${
        active ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      <span className={active ? 'text-blue-600' : 'text-slate-400'}>{icon}</span> {label}
    </Link>
  );
};

// For Grid-style mobile links (Hoodies, Jackets, etc.)
const MobileCategoryGridLink = ({ href, label, icon }) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-sm font-medium transition-all active:scale-95 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      <div className={isActive ? 'text-blue-200' : 'text-slate-400'}>{icon}</div> 
      {label}
    </Link>
  );
};

export default Navbar;