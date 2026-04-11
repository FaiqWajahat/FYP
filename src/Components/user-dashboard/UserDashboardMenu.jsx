"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  Image,
  FileText,
  User,
  Settings,
  BrainCircuit,
  ChevronRight
} from "lucide-react";

// Menu config for User Dashboard
const navGroups = [
  {
    groupLabel: "Main",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { title: "Orders", icon: ShoppingBag, href: "/dashboard/orders" },
      { title: "Smart Inquiry", icon: BrainCircuit, href: "/dashboard/smart-inquiry" },
      { title: "Mockups", icon: Image, href: "/dashboard/mockups" },
      { title: "Invoices", icon: FileText, href: "/dashboard/invoices" },
      { title: "Messages", icon: MessageSquare, href: "/dashboard/messages" },
    ]
  },
  {
    groupLabel: "Account",
    items: [
      { title: "Profile", icon: User, href: "/dashboard/profile" },
      { title: "Settings", icon: Settings, href: "/dashboard/settings" },
    ]
  }
];

// ─── Single Nav Item ───────────────────────────────────────────
const NavItem = ({ item, pathname }) => {
  const isRoot = item.href === '/dashboard' || item.href === '/dashboard';
  const isChildActive = item.children?.some((c) => pathname === c.href || pathname?.startsWith(c.href + "/"));
  const isActive = item.href ? (pathname === item.href || (!isRoot && pathname?.startsWith(item.href + "/"))) : isChildActive;

  const [open, setOpen] = useState(isChildActive || false);

  // Auto-open if a child becomes active
  useEffect(() => {
    if (isChildActive) setOpen(true);
  }, [isChildActive]);

  if (item.children) {
    return (
      <li className="relative">
        <button
          onClick={() => setOpen((p) => !p)}
          className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer select-none relative z-10 ${
             isChildActive ? "text-[var(--primary)]" : "text-base-content/70 hover:text-base-content"
          }`}
        >
          {isChildActive && (
             <motion.div layoutId="user-active-parent" className="absolute inset-0 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-xl -z-10" />
          )}
          {!isChildActive && (
             <div className="absolute inset-0 bg-base-200/50 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity -z-10" />
          )}

          <span
            className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all duration-300 ${
              isChildActive ? "bg-[var(--primary)] text-white shadow-sm shadow-[var(--primary)]/30" : "bg-base-200 text-base-content/60 group-hover:bg-base-300 group-hover:text-base-content"
            }`}
          >
            <item.icon className="w-4 h-4" strokeWidth={isChildActive ? 2.5 : 2} />
          </span>

          <span className="flex-1 text-left">{item.title}</span>

          {item.badge && (
            <span className={`badge badge-xs badge-error font-extrabold shadow-sm`}>
              {item.badge}
            </span>
          )}

          <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight className={`w-4 h-4 transition-colors ${isChildActive ? "text-[var(--primary)]/70" : "text-base-content/40 group-hover:text-base-content/70"}`} />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <ul className="ml-[1.45rem] mt-1 space-y-1 border-l-[1.5px] border-base-300 pl-3 py-1">
                {item.children.map((child, ci) => {
                  const childActive = pathname === child.href || pathname?.startsWith(child.href + "/");
                  return (
                    <li key={ci} className="relative">
                      <Link
                        href={child.href}
                        className={`group/child flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative z-10 ${
                          childActive ? "text-[var(--primary)]" : "text-base-content/60 hover:text-base-content"
                        }`}
                      >
                         {childActive && (
                           <motion.div layoutId="user-active-child" className="absolute inset-0 bg-[var(--primary)]/10 rounded-lg -z-10" />
                         )}
                         {!childActive && (
                           <div className="absolute inset-0 bg-base-200/50 opacity-0 group-hover/child:opacity-100 rounded-lg transition-opacity -z-10" />
                         )}
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${childActive ? "bg-[var(--primary)] shadow-sm shadow-[var(--primary)]/40" : "bg-base-content/30 group-hover/child:bg-base-content/50"}`} />
                        {child.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </li>
    );
  }

  // Simple link
  return (
    <li className="relative">
      <Link
        href={item.href || "#"}
        className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 relative z-10 ${
          isActive ? "text-[var(--primary)]" : "text-base-content/70 hover:text-base-content"
        }`}
      >
        {isActive && (
           <motion.div layoutId="user-active-parent" className="absolute inset-0 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-xl -z-10" />
        )}
        {!isActive && (
           <div className="absolute inset-0 bg-base-200/50 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity -z-10" />
        )}

        <span
          className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all duration-300 ${
            isActive ? "bg-[var(--primary)] text-white shadow-sm shadow-[var(--primary)]/30" : "bg-base-200 text-base-content/60 group-hover:bg-base-300 group-hover:text-base-content"
          }`}
        >
          <item.icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
        </span>

        <span className="flex-1">{item.title}</span>

        {item.badge && (
          <span className={`badge badge-xs badge-error font-extrabold shadow-sm`}>
            {item.badge}
          </span>
        )}
      </Link>
    </li>
  );
};

// ─── User Dashboard Menu ───────────────────────────────────────
const UserDashboardMenu = () => {
  const pathname = usePathname();

  return (
    <div className="w-full flex flex-col gap-6 pt-2">
      {navGroups.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-1.5">
          <p className="px-3 text-[10px] font-black uppercase tracking-widest text-base-content/40 select-none">
            {group.groupLabel}
          </p>
          <ul className="space-y-1">
            {group.items.map((item, ii) => (
              <NavItem key={ii} item={item} pathname={pathname} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default UserDashboardMenu;

