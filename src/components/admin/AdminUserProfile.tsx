"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  User as UserIcon,
  Settings,
  Shield,
  Activity,
  LogOut,
  ChevronDown,
  MoreVertical,
  Loader2,
} from "lucide-react";
import type { AdminSessionUser } from "@/server/auth/session";
import { logoutAction } from "@/features/admin/auth/actions";

interface AdminUserProfileProps {
  user: AdminSessionUser;
  userPermissions: {
    manageUsers: boolean;
    viewAuditLogs: boolean;
    viewSubmissions: boolean;
    manageSettings: boolean;
    manageContent?: boolean;
  };
  variant?: "sidebar" | "header";
  dropdownPosition?: "top" | "bottom";
  isCollapsed?: boolean;
}

export function AdminUserProfile({
  user,
  userPermissions,
  variant = "sidebar",
  dropdownPosition = "bottom",
  isCollapsed = false,
}: AdminUserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Compute clean initials
  const initials = user.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AD";

  const formattedRole = user.role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await logoutAction();
    });
  };

  const isPositionTop = dropdownPosition === "top";

  return (
    <div className="relative" ref={menuRef}>
      {variant === "sidebar" ? (
        /* Sidebar User Card matching screenshot top right / bottom left */
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label="User account menu"
          className={`group flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors focus:outline-none ${
            isOpen ? "bg-slate-100 ring-1 ring-slate-200" : "hover:bg-slate-100/80"
          } ${isCollapsed ? "justify-center" : "justify-between"}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 text-slate-700 font-bold text-xs border border-white shadow-2xs pointer-events-none">
              {initials}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1 max-w-[150px] sm:max-w-[220px]">
                <p className="truncate text-xs font-bold text-slate-900 leading-tight">
                  {user.name}
                </p>
                <p className="truncate text-[11px] text-slate-400 font-normal leading-tight mt-0.5">
                  {user.email || formattedRole}
                </p>
                <p className="truncate text-[10px] text-slate-400 font-normal leading-tight">
                  {formattedRole}
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                isOpen ? "bg-slate-200/80 text-slate-700" : "text-slate-400 group-hover:text-slate-600"
              }`}
            >
              <MoreVertical className="h-4 w-4 shrink-0 pointer-events-none" />
            </div>
          )}
        </button>
      ) : (
        /* Top Header Trigger Button */
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label="User account menu"
          className={`flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-1.5 sm:px-2.5 sm:py-1.5 transition-colors focus:outline-none ${
            isOpen ? "border-slate-300 bg-slate-50 ring-1 ring-slate-200" : "hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 pointer-events-none">
            {initials}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-tight">{user.name}</span>
            <span className="text-[10px] text-slate-500 font-medium leading-tight">{formattedRole}</span>
          </div>
          <ChevronDown
            className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-150 pointer-events-none ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {/* Account Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={`absolute z-50 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in-95 duration-100 ${
            isPositionTop
              ? "bottom-full left-0 mb-2 origin-bottom-left"
              : "top-full right-0 mt-2 origin-top-right"
          }`}
        >
          {/* User Details Header */}
          <div className="border-b border-slate-100 px-3.5 py-3">
            <p className="text-xs font-bold text-slate-900">{user.name}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
              {user.email || formattedRole}
            </p>
            <span className="mt-2 inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
              {formattedRole}
            </span>
          </div>

          {/* Quick Account Links */}
          <div className="py-1">
            {userPermissions.manageSettings && (
              <Link
                href="/admin/settings"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <Settings className="h-3.5 w-3.5 text-slate-400" />
                <span>System Settings</span>
              </Link>
            )}

            {userPermissions.viewAuditLogs && (
              <Link
                href="/admin/activity"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <Activity className="h-3.5 w-3.5 text-slate-400" />
                <span>Activity & Audit Logs</span>
              </Link>
            )}

            {userPermissions.manageUsers && (
              <Link
                href="/admin/users"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <Shield className="h-3.5 w-3.5 text-slate-400" />
                <span>Admin Staff Users</span>
              </Link>
            )}
          </div>

          {/* Logout Action */}
          <div className="border-t border-slate-100 pt-1">
            <form action={logoutAction} onSubmit={handleLogout}>
              <button
                type="submit"
                disabled={isPending}
                role="menuitem"
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-600" />
                ) : (
                  <LogOut className="h-3.5 w-3.5 text-rose-500" />
                )}
                <span>{isPending ? "Signing out..." : "Sign Out"}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
