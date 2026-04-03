'use client'
import { LogOut, Settings, User, ChevronUp, Shield } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useRef, useEffect } from 'react'

const DashboardSidebarBottom = ({
  userName = "John Doe",
  userEmail = "john@example.com",
  role = "Administrator"
}) => {
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

  return (
    <div className="relative" ref={ref}>
      {/* Popup Menu */}
      {menuOpen && (
        <div className="absolute bottom-full  left-0 right-0 mb-2 z-50">
          <div className="bg-base-100 border border-base-300 rounded-2xl shadow-2xl shadow-black/15 p-1.5 overflow-hidden">
            {/* User info inside popup */}
            <div className="px-3 py-2.5 mb-1 border-b border-base-200">
              <p className="text-xs font-semibold text-base-content truncate">{userName}</p>
              <p className="text-[10px] text-base-content/45 mt-0.5">{userEmail}</p>
            </div>

            <ul className="space-y-0.5">
              {[
                { icon: User, label: 'Profile', href: '/profile' },
                { icon: Settings, label: 'Settings', href: '/settings' },
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
                  onClick={() => setMenuOpen(false)}
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
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-xl overflow-hidden">
            <img
              alt="User avatar"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Online indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-base-100" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold text-base-content leading-tight truncate">{userName}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Shield className="w-2.5 h-2.5 text-[var(--primary)] shrink-0" strokeWidth={2.5} />
            <span className="text-[10px] text-[var(--primary)] font-medium">{role}</span>
          </div>
        </div>

        {/* Chevron */}
        <ChevronUp
          className={`w-3.5 h-3.5 text-base-content/40 shrink-0 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
          strokeWidth={2}
        />
      </button>
    </div>
  )
}

export default DashboardSidebarBottom