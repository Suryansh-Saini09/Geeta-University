"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  Home,
  Info,
  GraduationCap,
  Sparkles,
  School,
  FileText,
  Image as ImageIcon,
  Newspaper,
  Calendar,
  Bell,
  Inbox,
  Users,
  Activity,
  SlidersHorizontal,
  Settings,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Award,
  Shield,
  Briefcase,
  Layout,
  type LucideIcon,
} from "lucide-react";

type PermissionKey =
  | "manageUsers"
  | "viewAuditLogs"
  | "viewSubmissions"
  | "manageSettings"
  | "manageContent";

export interface NavChildItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  permission?: PermissionKey;
}

export interface NavSubgroup {
  id: string;
  label: string;
  icon?: LucideIcon;
  children: NavChildItem[];
}

export interface NavGroup {
  id: string;
  label: string;
  icon?: LucideIcon;
  children: NavChildItem[];
  subgroups?: NavSubgroup[];
}

interface AdminSidebarNavProps {
  isCollapsed?: boolean;
  onNavigate?: () => void;
  userRole: string;
  userPermissions: Record<PermissionKey, boolean>;
}

export const navigationGroups: NavGroup[] = [
  {
    id: "main",
    label: "Main",
    children: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    id: "website-content",
    label: "Website Content",
    icon: Globe,
    children: [
      { label: "Home CMS", href: "/admin/home", icon: Home },
      { label: "About CMS", href: "/admin/about", icon: Info },
      { label: "Admissions CMS", href: "/admin/admissions", icon: GraduationCap },
      { label: "GU Edge CMS", href: "/admin/gu-edge", icon: Sparkles },
    ],
    subgroups: [
      {
        id: "more-website-content",
        label: "More Website Content",
        children: [
          { label: "Campus Life CMS", href: "/admin/campus-life", icon: School },
          { label: "Placements CMS", href: "/admin/placements", icon: Briefcase },
          { label: "Library CMS", href: "/admin/library", icon: BookOpen },
          { label: "Advisory Board CMS", href: "/admin/advisory-board", icon: Award },
          { label: "Medal Policy CMS", href: "/admin/medal-policy", icon: Shield },
        ],
      },
    ],
  },
  {
    id: "academic-management",
    label: "Academic Management",
    icon: GraduationCap,
    children: [
      { label: "Pages", href: "/admin/pages", icon: FileText },
      { label: "Departments", href: "/admin/departments", icon: School },
      { label: "Programs", href: "/admin/programs", icon: GraduationCap },
    ],
  },
  {
    id: "assets-publishing",
    label: "Assets & Publishing",
    icon: ImageIcon,
    children: [
      { label: "Media", href: "/admin/media", icon: ImageIcon },
      { label: "News", href: "/admin/news", icon: Newspaper },
      { label: "Events", href: "/admin/events", icon: Calendar },
      { label: "Notices", href: "/admin/notices", icon: Bell },
      { label: "Gallery", href: "/admin/gallery", icon: Sparkles },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    icon: SlidersHorizontal,
    children: [
      {
        label: "Submissions",
        href: "/admin/submissions",
        icon: Inbox,
        permission: "viewSubmissions",
      },
      { label: "Users", href: "/admin/users", icon: Users, permission: "manageUsers" },
      { label: "Activity", href: "/admin/activity", icon: Activity, permission: "viewAuditLogs" },
      { label: "Footer CMS", href: "/admin/footer", icon: Layout, permission: "manageContent" },
      { label: "Settings", href: "/admin/settings", icon: Settings, permission: "manageSettings" },
    ],
  },
];

export function AdminSidebarNav({
  isCollapsed = false,
  onNavigate,
  userPermissions,
}: AdminSidebarNavProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);

  const visibleGroups = useMemo(
    () =>
      navigationGroups
        .map((group) => ({
          ...group,
          children: group.children.filter(
            (item) => !item.permission || Boolean(userPermissions[item.permission]),
          ),
          subgroups: group.subgroups
            ?.map((subgroup) => ({
              ...subgroup,
              children: subgroup.children.filter(
                (item) => !item.permission || Boolean(userPermissions[item.permission]),
              ),
            }))
            .filter((subgroup) => subgroup.children.length > 0),
        }))
        .filter(
          (group) =>
            group.children.length > 0 || (group.subgroups?.length ?? 0) > 0,
        ),
    [userPermissions],
  );

  const isRouteActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const [openSubgroups, setOpenSubgroups] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        navigationGroups.flatMap((group) =>
          (group.subgroups ?? []).map((subgroup) => [
            subgroup.id,
            subgroup.children.some((item) => isRouteActive(item.href)),
          ] as const),
        ),
      ),
  );

  useEffect(() => {
    setOpenSubgroups((previous) => {
      const next = { ...previous };
      for (const group of navigationGroups) {
        for (const subgroup of group.subgroups ?? []) {
          if (subgroup.children.some((item) => isRouteActive(item.href))) {
            next[subgroup.id] = true;
          }
        }
      }
      return next;
    });
  }, [pathname]);

  const toggleSubgroup = (subgroupId: string) => {
    setOpenSubgroups((previous) => ({
      ...previous,
      [subgroupId]: !previous[subgroupId],
    }));
  };

  return (
    <nav ref={navRef} className="px-3 py-2 space-y-3">
      {visibleGroups.map((group) => {
        return (
          <div key={group.id} className="space-y-1">
            {/* Category Header with Dotted Line matching screenshot */}
            {!isCollapsed ? (
              <div className="flex items-center gap-2 px-2.5 pt-3 pb-1 select-none">
                <span className="text-[11px] font-semibold text-slate-400 tracking-wider">
                  {group.label}
                </span>
                <div className="flex-1 border-b border-dotted border-slate-300/80" />
              </div>
            ) : (
              <div className="my-2 border-b border-slate-200" />
            )}

            {/* Nav Items */}
            <div className="space-y-1">
              {group.children.map((item) => {
                const active = isRouteActive(item.href);
                const Icon = item.icon;

                if (isCollapsed) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      title={item.label}
                      className={`flex h-10 w-10 mx-auto items-center justify-center rounded-xl transition-all ${
                        active
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {Icon ? <Icon className="h-5 w-5" /> : null}
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-all ${
                      active
                        ? "bg-blue-600 text-white shadow-xs font-semibold"
                        : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                    }`}
                  >
                    {Icon ? (
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          active
                            ? "text-white"
                            : "text-slate-400 group-hover:text-slate-700"
                        }`}
                      />
                    ) : null}
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}

              {/* Subgroups */}
              {!isCollapsed &&
                group.subgroups?.map((subgroup) => {
                  const subgroupOpen = Boolean(openSubgroups[subgroup.id]);
                  const subgroupHasActive = subgroup.children.some((child) =>
                    isRouteActive(child.href),
                  );

                  return (
                    <div key={subgroup.id} className="pt-0.5">
                      <button
                        type="button"
                        onClick={() => toggleSubgroup(subgroup.id)}
                        className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
                          subgroupHasActive
                            ? "text-blue-600 bg-blue-50/50"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                        }`}
                      >
                        <span className="truncate">{subgroup.label}</span>
                        {subgroupOpen ? (
                          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        )}
                      </button>

                      {subgroupOpen && (
                        <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-slate-100 pl-2">
                          {subgroup.children.map((child) => {
                            const childActive = isRouteActive(child.href);
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={onNavigate}
                                className={`block rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                                  childActive
                                    ? "bg-slate-100 font-bold text-slate-900"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                              >
                                {child.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}