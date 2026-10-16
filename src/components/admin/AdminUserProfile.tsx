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
  };
}

export function AdminUserProfile({ user, userPermissions }: AdminUserProfileProps) {
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

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex items-center gap-2.5 rounded-lg border border-slate-200/80 bg-white p-1.5 sm:px-2.5 sm:py-1.5 transition-colors hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
      >
        <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
          {initials}
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-semibold text-slate-900 leading-tight">{user.name}</span>
          <span className="text-[10px] text-slate-500 font-medium leading-tight">{formattedRole}</span>
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Account Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg ring-1 ring-black/5 z-50 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
        >
          {/* User Details Header */}
          <div className="border-b border-slate-100 px-3.5 py-2.5">
            <p className="text-xs font-semibold text-slate-900">{user.name}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">{user.email || formattedRole}</p>
            <span className="mt-1.5 inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 border border-slate-200">
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
                className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
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
                className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
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
                className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <Shield className="h-3.5 w-3.5 text-slate-400" />
                <span>Admin Users</span>
              </Link>
            )}
          </div>

          {/* Logout Action */}
          <div className="border-t border-slate-100 pt-1">
            <form onSubmit={handleLogout}>
              <button
                type="submit"
                disabled={isPending}
                role="menuitem"
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-600" />
                ) : (
                  <LogOut className="h-3.5 w-3.5 text-rose-500" />
                )}
                <span>{isPending ? "Logging out..." : "Sign Out"}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
