"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  Image,
  FileText,
  User,
  Settings,
  BrainCircuit,
} from "lucide-react";

// Menu config for User Dashboard
const mainMenu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Orders",
    icon: ShoppingBag,
    href: "/dashboard/orders",
  },
  {
    title: "Smart Inquiry",
    icon: BrainCircuit,
    href: "/dashboard/smart-inquiry",
  },
  {
    title: "Mockups",
    icon: Image,
    href: "/dashboard/mockups",
  },
  {
    title: "Invoices",
    icon: FileText,
    href: "/dashboard/invoices",
  },
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/dashboard/messages",
  },
];

const accountMenu = [
  { title: "Profile", icon: User, href: "/dashboard/profile" },
  { title: "Settings", icon: Settings, href: "/dashboard/settings" },
];

const SidebarMenu = ({ items, pathname }) => (
  <ul className="menu rounded-box w-full text-[15px] font-light">
    {items.map((item, index) => (
      <li className="" key={index}>
        {item.children ? (
          <details>
            <summary className="flex items-center gap-2 w-full hover:bg-base-200 rounded-md px-2 py-1">
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.title}</span>
            </summary>
            <ul className="ml-5 border-l pl-3 space-y-1">
              {item.children.map((child, cIndex) => (
                <li className="" key={cIndex}>
                  <Link
                    href={child.href}
                    className={`block px-2 py-1 rounded-md hover:bg-base-200 ${pathname === child.href ? "text-primary font-medium " : ""
                      }`}
                  >
                    {child.title}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        ) : (
          <Link
            href={item.href || "#"}
            className={`flex items-center gap-2 w-full px-2 py-1 rounded-md hover:bg-base-200 ${pathname === item.href ? "text-primary font-medium " : ""
              }`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{item.title}</span>
          </Link>
        )}
      </li>
    ))}
  </ul>
);

const UserDashboardMenu = () => {
  const pathname = usePathname();

  return (
    <div className="w-full h-full flex flex-col justify-between py-4">
      {/* Main Menu */}
      <div>
        <p className="px-4 mb-2 uppercase text-xs text-gray-500">Main</p>
        <SidebarMenu items={mainMenu} pathname={pathname} />
      </div>

      {/* Account Menu */}
      <div>
        <p className="px-4 mt-6 mb-2 uppercase text-xs text-gray-500">
          Account
        </p>
        <SidebarMenu items={accountMenu} pathname={pathname} />
      </div>
    </div>
  );
};

export default UserDashboardMenu;
