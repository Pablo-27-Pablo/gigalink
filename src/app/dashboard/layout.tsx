"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Ticket,
  History,
  User,
  Moon,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Navigation Items matching your image
  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Services", href: "/dashboard/no_dashboard", icon: Settings },
    { name: "Active Vouchers", href: "/dashboard/no_dashboard", icon: Ticket },
    { name: "History", href: "/dashboard/no_dashboard", icon: History },
    { name: "Profile", href: "/dashboard/user_profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a121e]">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-[#0f172a] border-r border-gray-800">
        <SidebarContent menuItems={menuItems} pathname={pathname} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="relative w-64 flex flex-col bg-[#0f172a] h-full">
            <div className="p-4 flex justify-end">
              <button onClick={() => setIsMobileOpen(false)}>
                <X className="text-white" />
              </button>
            </div>
            <SidebarContent menuItems={menuItems} pathname={pathname} />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header for Mobile */}
        <header className="md:hidden flex items-center justify-between p-4 bg-[#0f172a] border-b border-gray-800">
          <button onClick={() => setIsMobileOpen(true)}>
            <Menu className="text-white" />
          </button>
          <div className="text-[#00cba9] font-bold">GIGALINK</div>
          <div className="w-6" />
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

// Sub-component for Sidebar logic
function SidebarContent({
  menuItems,
  pathname,
}: {
  menuItems: any[];
  pathname: string;
}) {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="text-[#00cba9] font-bold text-2xl tracking-tighter uppercase mb-10 px-4 hidden md:block">
        GIGALINK
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          // Check if current path matches the link to set "Active" state
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-[#00cba9]/10 text-[#00cba9] border border-[#00cba9]/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon
                className={`h-5 w-5 ${isActive ? "text-[#00cba9]" : "text-gray-500"}`}
              />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-gray-800 space-y-2">
        <button className="flex items-center space-x-3 px-4 py-3 w-full text-gray-400 hover:text-white transition-colors">
          <Moon className="h-5 w-5" />
          <span>Dark Mode</span>
        </button>
        <button className="flex items-center space-x-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 transition-colors">
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
