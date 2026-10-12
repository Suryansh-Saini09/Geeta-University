"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Info,
  GraduationCap,
  Sparkles,
  Compass,
  Trophy,
  Library,
  Users,
  Medal,
  FileText,
  Building2,
  BookOpen,
  Image as ImageIcon,
  Newspaper,
  CalendarDays,
  Megaphone,
  GalleryHorizontalEnd,
  Inbox,
  UserCog,
  ScrollText,
  Settings,
  ChevronDown,
  Globe,
  FolderKanban,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";

export interface NavChildItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: "manageUsers" | "viewAuditLogs" | "viewSubmissions" | "manageSettings";
}

export interface NavSubgroup {
  id: string;
  label: string;
  children: NavChildItem[];
}

export interface NavGroup {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: NavChildItem[];
  subgroups?: NavSubgroup[];
}

interface AdminSidebarNavProps {
  isCollapsed?: boolean;
  onNavigate?: () => void;
  userRole: string;
  userPermissions: {
    manageUsers: boolean;
    viewAuditLogs: boolean;
    viewSubmissions: boolean;
    manageSettings: boolean;
  };
}

export const navigationGroups: NavGroup[] = [
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
          { label: "Campus Life CMS", href: "/admin/campus-life", icon: Compass },
          { label: "Placements CMS", href: "/admin/placements", icon: Trophy },
          { label: "Library CMS", href: "/admin/library", icon: Library },
          { label: "Advisory Board CMS", href: "/admin/advisory-board", icon: Users },
          { label: "Medal Policy CMS", href: "/admin/medal-policy", icon: Medal },
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
      { label: "Departments", href: "/admin/departments", icon: Building2 },
      { label: "Programs", href: "/admin/programs", icon: BookOpen },
    ],
  },
  {
    id: "assets-publishing",
    label: "Assets & Publishing",
    icon: FolderKanban,
    children: [
      { label: "Media", href: "/admin/media", icon: ImageIcon },
      { label: "News", href: "/admin/news", icon: Newspaper },
      { label: "Events", href: "/admin/events", icon: CalendarDays },
      { label: "Notices", href: "/admin/notices", icon: Megaphone },
      { label: "Gallery", href: "/admin/gallery", icon: GalleryHorizontalEnd },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    icon: SlidersHorizontal,
    children: [
      { label: "Submissions", href: "/admin/submissions", icon: Inbox, permission: "viewSubmissions" },
      { label: "Users", href: "/admin/users", icon: UserCog, permission: "manageUsers" },
      { label: "Activity", href: "/admin/activity", icon: ScrollText, permission: "viewAuditLogs" },
    ],
  },
];

export function AdminSidebarNav({
  isCollapsed = false,
  onNavigate,
  userPermissions,
}: AdminSidebarNavProps) {
  const pathname = usePathname();

  const isRouteActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Determine initial open states for groups and subgroups
  const initialOpenGroups = useMemo(() => {
    const map: Record<string, boolean> = {
      "website-content": false,
      "academic-management": false,
      "assets-publishing": false,
      "operations": false,
    };

    for (const group of navigationGroups) {
      const hasDirectChildActive = group.children.some((c) => isRouteActive(c.href));
      const hasSubgroupChildActive = group.subgroups?.some((sub) =>
        sub.children.some((c) => isRouteActive(c.href))
      );
      if (hasDirectChildActive || hasSubgroupChildActive) {
        map[group.id] = true;
      }
    }
    return map;
  }, [pathname]);

  const initialOpenSubgroups = useMemo(() => {
    const map: Record<string, boolean> = {
      "more-website-content": false,
    };

    for (const group of navigationGroups) {
      if (group.subgroups) {
        for (const sub of group.subgroups) {
          if (sub.children.some((c) => isRouteActive(c.href))) {
            map[sub.id] = true;
          }
        }
      }
    }
    return map;
  }, [pathname]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(initialOpenGroups);
  const [openSubgroups, setOpenSubgroups] = useState<Record<string, boolean>>(initialOpenSubgroups);

  // Auto-expand group and subgroup when route changes
  useEffect(() => {
    for (const group of navigationGroups) {
      const hasDirectChildActive = group.children.some((c) => isRouteActive(c.href));
      const hasSubgroupChildActive = group.subgroups?.some((sub) =>
        sub.children.some((c) => isRouteActive(c.href))
      );

      if (hasDirectChildActive || hasSubgroupChildActive) {
        setOpenGroups((prev) => ({ ...prev, [group.id]: true }));
      }

      if (group.subgroups) {
        for (const sub of group.subgroups) {
          if (sub.children.some((c) => isRouteActive(c.href))) {
            setOpenSubgroups((prev) => ({ ...prev, [sub.id]: true }));
          }
        }
      }
    }
  }, [pathname]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const toggleSubgroup = (subgroupId: string) => {
    setOpenSubgroups((prev) => ({
      ...prev,
      [subgroupId]: !prev[subgroupId],
    }));
  };

  return (
    <nav className="flex-1 space-y-1 px-3 py-3" aria-label="University CMS Navigation">
      {/* 1. Dashboard */}
      <div>
        <Link
          href="/admin"
          onClick={onNavigate}
          title={isCollapsed ? "Dashboard" : undefined}
          className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            pathname === "/admin"
              ? "bg-slate-100 text-slate-900 font-semibold shadow-2xs"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <LayoutDashboard
            className={`h-4 w-4 shrink-0 transition-colors ${
              pathname === "/admin" ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
            }`}
          />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>
      </div>

      {/* 2. Navigation Groups */}
      {navigationGroups.map((group) => {
        const visibleDirectChildren = group.children.filter((child) => {
          if (!child.permission) return true;
          return userPermissions[child.permission];
        });

        const isGroupOpen = !!openGroups[group.id];
        const isDirectChildActive = visibleDirectChildren.some((child) => isRouteActive(child.href));
        const isSubgroupActive = group.subgroups?.some((sub) =>
          sub.children.some((c) => isRouteActive(c.href))
        );
        const isAnyActive = isDirectChildActive || isSubgroupActive;
        const GroupIcon = group.icon;

        return (
          <div key={group.id} className="pt-2">
            {!isCollapsed ? (
              <>
                {/* Group Heading Button */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors ${
                    isAnyActive ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                  }`}
                  aria-expanded={isGroupOpen}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <GroupIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate whitespace-nowrap">{group.label}</span>
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-150 ${
                      isGroupOpen ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                </button>

                {isGroupOpen && (
                  <div className="mt-1 space-y-0.5 pl-2 border-l border-slate-100 ml-3">
                    {/* Primary Group Links */}
                    {visibleDirectChildren.map((item) => {
                      const Icon = item.icon;
                      const active = isRouteActive(item.href);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onNavigate}
                          className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                            active
                              ? "bg-slate-100 font-semibold text-slate-900 border-l-2 border-slate-900 -ml-2 pl-2"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 shrink-0 transition-colors ${
                              active ? "text-slate-900" : "text-slate-400"
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}

                    {/* Subgroups (e.g. More Website Content) */}
                    {group.subgroups?.map((sub) => {
                      const isSubOpen = !!openSubgroups[sub.id];
                      const isSubChildActive = sub.children.some((c) => isRouteActive(c.href));

                      return (
                        <div key={sub.id} className="pt-1">
                          <button
                            type="button"
                            onClick={() => toggleSubgroup(sub.id)}
                            className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-semibold transition-colors ${
                              isSubChildActive
                                ? "text-slate-900 font-bold"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                            aria-expanded={isSubOpen}
                          >
                            <span className="flex items-center gap-1.5 truncate">
                              <ChevronRight
                                className={`h-3 w-3 shrink-0 text-slate-400 transition-transform duration-150 ${
                                  isSubOpen ? "rotate-90" : "rotate-0"
                                }`}
                              />
                              <span className="truncate">{sub.label}</span>
                            </span>
                            <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-medium text-slate-500">
                              {sub.children.length}
                            </span>
                          </button>

                          {isSubOpen && (
                            <div className="mt-0.5 space-y-0.5 pl-2.5 border-l border-slate-200/60 ml-2">
                              {sub.children.map((item) => {
                                const Icon = item.icon;
                                const active = isRouteActive(item.href);

                                return (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onNavigate}
                                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors ${
                                      active
                                        ? "bg-slate-100 font-semibold text-slate-900 border-l-2 border-slate-900 -ml-2 pl-2"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                                  >
                                    <Icon
                                      className={`h-3.5 w-3.5 shrink-0 ${
                                        active ? "text-slate-900" : "text-slate-400"
                                      }`}
                                    />
                                    <span className="truncate">{item.label}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              /* Collapsed Icon Mode */
              <div className="space-y-1">
                {visibleDirectChildren.map((item) => {
                  const Icon = item.icon;
                  const active = isRouteActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      title={item.label}
                      className={`flex items-center justify-center rounded-lg p-2 transition-colors ${
                        active
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${active ? "text-slate-900" : "text-slate-400"}`}
                      />
                    </Link>
                  );
                })}
                {group.subgroups?.flatMap((sub) => sub.children).map((item) => {
                  const Icon = item.icon;
                  const active = isRouteActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      title={item.label}
                      className={`flex items-center justify-center rounded-lg p-2 transition-colors ${
                        active
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${active ? "text-slate-900" : "text-slate-400"}`}
                      />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* 3. Settings (Separated at bottom) */}
      {userPermissions.manageSettings && (
        <div className="pt-4 mt-4 border-t border-slate-100">
          <Link
            href="/admin/settings"
            onClick={onNavigate}
            title={isCollapsed ? "Settings" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isRouteActive("/admin/settings")
                ? "bg-slate-100 text-slate-900 font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Settings
              className={`h-4 w-4 shrink-0 ${
                isRouteActive("/admin/settings") ? "text-slate-900" : "text-slate-400"
              }`}
            />
            {!isCollapsed && <span>Settings</span>}
          </Link>
        </div>
      )}
    </nav>
  );
}
