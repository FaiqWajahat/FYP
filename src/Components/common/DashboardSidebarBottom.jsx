'use client'
import { LogOut, Settings, User, ChevronUp, Shield, Loader2, Home } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/store/AuthContext'
import { useRouter } from 'next/navigation'

const DashboardSidebarBottom = () => {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef(null)

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-base-200 animate-pulse">
        <div className="w-9 h-9 rounded-xl bg-base-300" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 bg-base-300 rounded" />
          <div className="h-2 w-12 bg-base-300 rounded" />
        </div>
      </div>
    )
  }

  if (!user) return null

  const userName = profile?.full_name || user?.email?.split('@')[0] || "User"
  const userEmail = user?.email
  const role = profile?.role === 'admin' ? 'Administrator' : 'Factory User'
  const profileImg = profile?.profile_image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"

  return (
    <div className="relative" ref={ref}>
      {/* Popup Menu */}
      {menuOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 z-100 bg-base-100">
          <div className="bg-base-100 border border-base-300 rounded-2xl shadow-2xl shadow-black/15 p-1.5 overflow-hidden">
            <div className="px-3 py-2.5 mb-1 border-b border-base-200">
              <p className="text-xs font-semibold text-base-content truncate">{userName}</p>
              <p className="text-[10px] text-base-content/45 mt-0.5">{userEmail}</p>
            </div>

            <ul className="space-y-0.5">
              {[
                { icon: User, label: 'Profile Settings', href: '/Dashboard/Profile' },
                { icon: Home, label: 'Back to Site', href: '/' },
                { icon: Settings, label: 'Account Settings', href: '/Dashboard/Settings' },
              ].map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors duration-150 font-medium"
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 text-base-content/50" strokeWidth={2} />
                    {label}
                  </Link>
                </li>
              ))}

              <li>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-error/80 hover:bg-error/8 hover:text-error transition-colors duration-150 font-medium cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* User Card Trigger */}
      <button
        onClick={() => setMenuOpen((p) => !p)}
        className={`
          w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200  cursor-pointer group
          ${menuOpen ? 'bg-[var(--primary)]/10 ring-1 ring-[var(--primary)]/20' : 'hover:bg-base-200 bg-base-200'}
        `}
      >
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-xl overflow-hidden">
            <img
              alt="User avatar"
              src={profileImg}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-base-100" />
        </div>

        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold text-base-content leading-tight truncate">{userName}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Shield className="w-2.5 h-2.5 text-[var(--primary)] shrink-0" strokeWidth={2.5} />
            <span className="text-[10px] text-[var(--primary)] font-medium">{role}</span>
          </div>
        </div>

        <ChevronUp
          className={`w-3.5 h-3.5 text-base-content/40 shrink-0 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
          strokeWidth={2}
        />
      </button>
    </div>
  )
}

export default DashboardSidebarBottom