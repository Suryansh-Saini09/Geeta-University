"use client";

import { usePathname } from "next/navigation";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import FloatingSocialBar from "@/components/layout/FloatingSocialBar";

export default function SiteChrome({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStandaloneRoute =
    pathname?.startsWith("/admin") || pathname?.startsWith("/social-links");

  if (isStandaloneRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <FloatingSocialBar />
      <main className="w-full min-w-0 flex-1">{children}</main>
      {footer ?? <Footer />}
    </>
  );
}
