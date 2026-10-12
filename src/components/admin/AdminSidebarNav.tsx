"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  FileText,
  GalleryHorizontalEnd,
  GraduationCap,
  Image,
  LayoutDashboard,
  Megaphone,
  Newspaper,
  Settings,
  Inbox,
  ScrollText,
  Sparkles,
  Trophy,
  Users,
  UserCog,
  Library,
  Medal,
} from "lucide-react";
import type { ComponentType } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

const navigationIconMap: Record<string, ComponentType<{ className?: string }>> = {
  "/admin": LayoutDashboard,
  "/admin/home": FileText,
  "/admin/about": FileText,
  "/admin/admissions": GraduationCap,
  "/admin/gu-edge": BookOpen,
  "/admin/campus-life": Sparkles,
  "/admin/placements": Trophy,
  "/admin/library": Library,
  "/admin/advisory-board": Users,
  "/admin/medal-policy": Medal,
  "/admin/pages": FileText,
  "/admin/departments": GraduationCap,
  "/admin/faculty": Users,
  "/admin/programs": BookOpen,
  "/admin/notices": Megaphone,
  "/admin/news": Newspaper,
  "/admin/events": CalendarDays,
  "/admin/gallery": GalleryHorizontalEnd,
  "/admin/media": Image,
  "/admin/submissions": Inbox,
  "/admin/users": UserCog,
  "/admin/activity": ScrollText,
  "/admin/settings": Settings,
};

interface AdminSidebarNavProps {
  items: Array<{ label: string; href: string }>;
}

export function AdminSidebarNav({ items }: AdminSidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 p-4" aria-label="CMS Administration Sidebar">
      {items.map((item) => {
        const Icon = navigationIconMap[item.href] || FileText;
        const isActive =
          pathname === item.href ||
          (item.href !== "/admin" && pathname.startsWith(item.href + "/"));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
              isActive
                ? "bg-[#E8871A] text-white shadow-md shadow-orange-950/20"
                : "text-white/78 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#E8871A]"}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
