"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

interface LenisProviderProps {
  children: React.ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const pathname = usePathname();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Detect reduced motion preference on mount
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    // Listen for changes to the preference
    const listener = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, []);

  // Do not run Lenis smooth scroll on admin or standalone routes
  const isStandaloneRoute =
    pathname?.startsWith("/admin") || pathname?.startsWith("/social-links");

  if (isStandaloneRoute) {
    return <>{children}</>;
  }

  const lenisOptions = {
    duration: reducedMotion ? 0 : 1.0,
    smoothWheel: !reducedMotion,
    syncTouch: false,
    wheelMultiplier: 1.0,
    autoRaf: true,
  };

  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}
