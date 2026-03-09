"use client";

import React, { useState } from "react";
import ModalLogout from "../dashboard/component-dashboard/modal/logout-modal";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  Ticket,
  History,
  User,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Services", href: "/dashboard/services", icon: Settings },
  // { name: "Active Vouchers", href: "/dashboard/no_dashboard", icon: Ticket },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Profile", href: "/dashboard/user-profile", icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const toggleDark = () => {
    setDark((d) => !d);
    document.documentElement.classList.toggle("dark");
  };

  // This handles the actual deletion after the modal is confirmed
  function handleLogout() {
    localStorage.removeItem("Authorization");
    setIsLogoutOpen(false);
    router.push("/"); // Changed to absolute path for reliability
  }

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 transition-colors overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 z-20",
          collapsed ? "w-20" : "w-64",
        )}
      >
        <SidebarContent
          menuItems={menuItems}
          pathname={pathname}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          dark={dark}
          toggleDark={toggleDark}
          handleSignOut={() => setIsLogoutOpen(true)} // Open modal instead of instant logout
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="relative w-72 flex flex-col bg-white dark:bg-slate-800 h-full shadow-xl">
            <div className="p-4 flex justify-end">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 text-slate-500"
              >
                <X size={24} />
              </button>
            </div>
            <SidebarContent
              menuItems={menuItems}
              pathname={pathname}
              collapsed={false}
              dark={dark}
              toggleDark={toggleDark}
              handleSignOut={() => setIsLogoutOpen(true)}
            />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header for Mobile */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="text-slate-600 dark:text-slate-300"
          >
            <Menu size={24} />
          </button>
          <div className="text-teal-600 dark:text-teal-400 font-bold tracking-tight">
            GIGALINK
          </div>
          <div className="w-6" />
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          {children}
        </main>
      </div>

      {/* Logout Modal - Moved to Layout level to fix syntax and state scope */}
      <ModalLogout
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}

interface SidebarContentProps {
  menuItems: any[];
  pathname: string;
  collapsed: boolean;
  setCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
  dark: boolean;
  toggleDark: () => void;
  handleSignOut: () => void;
}

function SidebarContent({
  menuItems,
  pathname,
  collapsed,
  setCollapsed,
  dark,
  toggleDark,
  handleSignOut,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-slate-200 dark:border-slate-700 shrink-0">
        {!collapsed && (
          <span className="font-bold text-teal-600 dark:text-teal-400 text-xl tracking-tighter uppercase">
            Gigalink
          </span>
        )}
        {setCollapsed && (
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              "p-1.5 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-slate-500 hover:text-teal-600 transition-colors",
              collapsed && "mx-auto",
            )}
          >
            <ChevronLeft
              size={18}
              className={cn(
                "transition-transform duration-300",
                collapsed && "rotate-180",
              )}
            />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-6 space-y-1.5 px-3 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-800/50"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200",
                collapsed && "justify-center px-0",
              )}
            >
              <item.icon
                size={20}
                className={cn(
                  "shrink-0 transition-colors",
                  isActive
                    ? "text-teal-600 dark:text-teal-400"
                    : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300",
                )}
              />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-1.5 shrink-0 bg-white dark:bg-slate-800">
        <button
          onClick={toggleDark}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors",
            collapsed && "justify-center px-0",
          )}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && <span>{dark ? "Light Mode" : "Dark Mode"}</span>}
        </button>

        <button
          onClick={handleSignOut} // Triggers the modal open in parent
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors",
            collapsed && "justify-center px-0",
          )}
        >
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}
