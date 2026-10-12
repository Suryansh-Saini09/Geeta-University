"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  User,
} from "lucide-react";

import type { AdminSessionUser } from "@/server/auth/session";
import { hasPermission } from "@/server/auth/permissions";
import { logoutAction } from "@/features/admin/auth/actions";
import { AdminSidebarNav } from "./AdminSidebarNav";

interface AdminShellProps {
  user: AdminSessionUser;
  children: React.ReactNode;
}

export default function AdminShell({ user, children }: AdminShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Restore collapsed state preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem("gu_cms_sidebar_collapsed");
      if (saved === "true") setIsCollapsed(true);
    } catch {
      // ignore localStorage errors
    }
  }, []);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("gu_cms_sidebar_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const userPermissions = {
    manageUsers: hasPermission(user.role, "manageUsers"),
    viewAuditLogs: hasPermission(user.role, "viewAuditLogs"),
    viewSubmissions: hasPermission(user.role, "viewSubmissions"),
    manageSettings: hasPermission(user.role, "manageSettings"),
  };

  const formattedRole = user.role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased flex flex-col">
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Admin Grid Layout */}
      <div
        className={`min-h-screen grid transition-all duration-200 ${
          isCollapsed ? "lg:grid-cols-[72px_1fr]" : "lg:grid-cols-[260px_1fr]"
        }`}
      >
        {/* ===================== SIDEBAR ===================== */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200/80 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
            isMobileOpen ? "translate-x-0 w-72 shadow-xl" : "-translate-x-full lg:w-auto"
          } ${isCollapsed ? "lg:w-[72px]" : "lg:w-[260px]"}`}
        >
          {/* Brand Header */}
          <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 overflow-hidden focus:outline-none"
              title="Geeta University CMS"
            >
              <div className="relative h-9 w-9 shrink-0 flex items-center justify-center rounded-lg bg-white p-1">
                <Image
                  src="/GU-Logo.webp"
                  alt="Geeta University"
                  width={36}
                  height={36}
                  className="h-8 w-auto object-contain"
                  priority
                />
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-slate-900 tracking-tight truncate">
                      Geeta University
                    </span>
                    <span className="rounded bg-emerald-50 px-1 py-0.2 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                      Live
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">University CMS</span>
                </div>
              )}
            </Link>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
              aria-label="Close navigation drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto">
            <AdminSidebarNav
              isCollapsed={isCollapsed}
              onNavigate={() => setIsMobileOpen(false)}
              userRole={user.role}
              userPermissions={userPermissions}
            />
          </div>

          {/* Sidebar Footer User Info */}
          <div className="border-t border-slate-100 p-3 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-bold text-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-900">{user.name}</p>
                  <p className="truncate text-[10px] text-slate-500 font-medium">{formattedRole}</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ===================== MAIN CONTENT WRAPPER ===================== */}
        <div className="flex min-w-0 flex-col flex-1">
          {/* Top Admin Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-xs">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setIsMobileOpen(true)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Desktop Sidebar Toggle Button */}
              <button
                type="button"
                onClick={toggleCollapsed}
                className="hidden lg:flex items-center justify-center rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <PanelLeftOpen className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </button>

              {/* Header Title Context */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
                <span>Geeta University</span>
                <span className="text-slate-300">/</span>
                <span className="font-semibold text-slate-800">Admin Control Panel</span>
              </div>
            </div>

            {/* User Profile & Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-900">{user.name}</span>
                <span className="text-[11px] text-slate-500">{formattedRole}</span>
              </div>

              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
                >
                  <LogOut className="h-3.5 w-3.5 text-slate-400" />
                  <span>Logout</span>
                </button>
              </form>
            </div>
          </header>

          {/* Main Route Content */}
          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
