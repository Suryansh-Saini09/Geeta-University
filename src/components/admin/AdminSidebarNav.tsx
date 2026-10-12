"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  FolderKanban,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Settings,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";

type PermissionKey =
  | "manageUsers"
  | "viewAuditLogs"
  | "viewSubmissions"
  | "manageSettings";

export interface NavChildItem {
  label: string;
  href: string;
  permission?: PermissionKey;
}

export interface NavSubgroup {
  id: string;
  label: string;
  children: NavChildItem[];
}

export interface NavGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  children: NavChildItem[];
  subgroups?: NavSubgroup[];
}

interface AdminSidebarNavProps {
  isCollapsed?: boolean;
  onNavigate?: () => void;
  userRole: string;
  userPermissions: Record<PermissionKey, boolean>;
}

/**
 * Navigation configuration deliberately uses icons only at the section level.
 * Individual pages are text links, which keeps the sidebar easy to scan.
 */
export const navigationGroups: NavGroup[] = [
  {
    id: "website-content",
    label: "Website Content",
    icon: Globe,
    children: [
      { label: "Home CMS", href: "/admin/home" },
      { label: "About CMS", href: "/admin/about" },
      { label: "Admissions CMS", href: "/admin/admissions" },
      { label: "GU Edge CMS", href: "/admin/gu-edge" },
    ],
    subgroups: [
      {
        id: "more-website-content",
        label: "More Website Content",
        children: [
          { label: "Campus Life CMS", href: "/admin/campus-life" },
          { label: "Placements CMS", href: "/admin/placements" },
          { label: "Library CMS", href: "/admin/library" },
          { label: "Advisory Board CMS", href: "/admin/advisory-board" },
          { label: "Medal Policy CMS", href: "/admin/medal-policy" },
        ],
      },
    ],
  },
  {
    id: "academic-management",
    label: "Academic Management",
    icon: GraduationCap,
    children: [
      { label: "Pages", href: "/admin/pages" },
      { label: "Departments", href: "/admin/departments" },
      { label: "Programs", href: "/admin/programs" },
    ],
  },
  {
    id: "assets-publishing",
    label: "Assets & Publishing",
    icon: FolderKanban,
    children: [
      { label: "Media", href: "/admin/media" },
      { label: "News", href: "/admin/news" },
      { label: "Events", href: "/admin/events" },
      { label: "Notices", href: "/admin/notices" },
      { label: "Gallery", href: "/admin/gallery" },
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
        permission: "viewSubmissions",
      },
      { label: "Users", href: "/admin/users", permission: "manageUsers" },
      { label: "Activity", href: "/admin/activity", permission: "viewAuditLogs" },
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
  const [activeFlyout, setActiveFlyout] = useState<string | null>(null);

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

  const isRouteActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(`${href}/`);

  const groupContainsActiveRoute = (group: NavGroup) =>
    group.children.some((item) => isRouteActive(item.href)) ||
    Boolean(
      group.subgroups?.some((subgroup) =>
        subgroup.children.some((item) => isRouteActive(item.href)),
      ),
    );

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      navigationGroups.map((group) => [group.id, groupContainsActiveRoute(group)] as const),
    ),
  );
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

  // Keep the current route visible and close any old collapsed flyout after navigation.
  useEffect(() => {
    setOpenGroups((previous) => {
      const next = { ...previous };
      for (const group of navigationGroups) {
        if (groupContainsActiveRoute(group)) next[group.id] = true;
      }
      return next;
    });
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
    setActiveFlyout(null);
    // Route changes are the intended trigger here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close the flyout when clicking outside the sidebar or pressing Escape.
  useEffect(() => {
    if (!activeFlyout) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setActiveFlyout(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveFlyout(null);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeFlyout]);

  const navigate = () => {
    setActiveFlyout(null);
    onNavigate?.();
  };

  const toggleGroup = (groupId: string) => {
    setOpenGroups((previous) => ({ ...previous, [groupId]: !previous[groupId] }));
  };

  const toggleSubgroup = (subgroupId: string) => {
    setOpenSubgroups((previous) => ({
      ...previous,
      [subgroupId]: !previous[subgroupId],
    }));
  };

  const renderPageLinks = (items: NavChildItem[], compact = false) =>
    items.map((item) => {
      const active = isRouteActive(item.href);
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={navigate}
          aria-current={active ? "page" : undefined}
          className={[
            "group flex min-w-0 items-center rounded-lg transition-colors",
            compact ? "px-3 py-2 text-sm" : "px-3 py-2 text-[13px]",
            active
              ? "bg-slate-100 font-semibold text-slate-950"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
          ].join(" ")}
        >
          <span className="truncate">{item.label}</span>
        </Link>
      );
    });

  const renderGroupContents = (group: NavGroup, compact = false) => (
    <div className={compact ? "space-y-1" : "ml-3 mt-1 space-y-0.5 border-l border-slate-200 pl-2"}>
      {renderPageLinks(group.children, compact)}

      {group.subgroups?.map((subgroup) => {
        const subgroupActive = subgroup.children.some((item) => isRouteActive(item.href));
        const subgroupOpen = Boolean(openSubgroups[subgroup.id]);

        return (
          <div key={subgroup.id} className="pt-1">
            <button
              type="button"
              onClick={() => toggleSubgroup(subgroup.id)}
              aria-expanded={subgroupOpen}
              className={[
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors",
                subgroupActive
                  ? "text-slate-900"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
              ].join(" ")}
            >
              {subgroupOpen ? (
                <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              )}
              <span className="min-w-0 flex-1 truncate">{subgroup.label}</span>
              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                {subgroup.children.length}
              </span>
            </button>

            {subgroupOpen && (
              <div className="ml-3 mt-1 space-y-0.5 border-l border-slate-200 pl-2">
                {renderPageLinks(subgroup.children, compact)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <nav
      ref={navRef}
      aria-label="University CMS Navigation"
      className={[
        "flex flex-col py-3",
        isCollapsed ? "items-center px-2" : "px-3",
      ].join(" ")}
    >
      <div className="w-full space-y-1">
        {/* Dashboard */}
        <Link
          href="/admin"
          onClick={navigate}
          title={isCollapsed ? "Dashboard" : undefined}
          aria-label={isCollapsed ? "Dashboard" : undefined}
          aria-current={pathname === "/admin" ? "page" : undefined}
          className={[
            "flex items-center rounded-xl text-sm font-semibold transition-colors",
            isCollapsed ? "h-10 w-10 justify-center" : "gap-3 px-3 py-2.5",
            pathname === "/admin"
              ? "bg-slate-100 text-slate-950"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
          ].join(" ")}
        >
          <LayoutDashboard className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>

        <div className="space-y-1 pt-1">
          {visibleGroups.map((group) => {
            const GroupIcon = group.icon;
            const isActive = groupContainsActiveRoute(group);
            const isOpen = Boolean(openGroups[group.id]);

            if (isCollapsed) {
              const flyoutOpen = activeFlyout === group.id;
              return (
                <div key={group.id} className="relative flex justify-center">
                  <button
                    type="button"
                    title={group.label}
                    aria-label={group.label}
                    aria-expanded={flyoutOpen}
                    onClick={() =>
                      setActiveFlyout((current) => (current === group.id ? null : group.id))
                    }
                    className={[
                      "relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                      flyoutOpen || isActive
                        ? "bg-slate-100 text-slate-950"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                    ].join(" ")}
                  >
                    <GroupIcon className="h-[18px] w-[18px]" aria-hidden="true" />
                    {isActive && (
                      <span className="absolute -left-2 h-5 w-0.5 rounded-full bg-slate-900" />
                    )}
                  </button>

                  {flyoutOpen && (
                    <div className="absolute left-full top-0 z-50 ml-3 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/10">
                      <div className="mb-2 border-b border-slate-100 px-2 pb-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                          CMS Navigation
                        </p>
                        <h3 className="mt-1 text-sm font-semibold text-slate-900">{group.label}</h3>
                      </div>
                      {renderGroupContents(group, true)}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <section key={group.id} className="pt-1">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={isOpen}
                  className={[
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[11px] font-bold uppercase tracking-[0.11em] transition-colors",
                    isActive
                      ? "text-slate-900"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
                  ].join(" ")}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <GroupIcon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                    <span className="truncate">{group.label}</span>
                  </span>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                  )}
                </button>

                {isOpen && <div className="mt-1">{renderGroupContents(group)}</div>}
              </section>
            );
          })}
        </div>

        {/* Settings directly after Operations */}
        {userPermissions.manageSettings && (
          <div className="pt-2 mt-2 border-t border-slate-100">
            <Link
              href="/admin/settings"
              onClick={navigate}
              title={isCollapsed ? "Settings" : undefined}
              aria-label={isCollapsed ? "Settings" : undefined}
              aria-current={isRouteActive("/admin/settings") ? "page" : undefined}
              className={[
                "flex items-center rounded-xl text-sm font-semibold transition-colors",
                isCollapsed ? "h-10 w-10 justify-center" : "gap-3 px-3 py-2.5",
                isRouteActive("/admin/settings")
                  ? "bg-slate-100 text-slate-950"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
              ].join(" ")}
            >
              <Settings className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              {!isCollapsed && <span>Settings</span>}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
