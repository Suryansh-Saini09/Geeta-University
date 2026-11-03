"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

/**
 * Isolated client-side component to handle hash-based smooth scrolling
 * for program pages without forcing the entire ProgramPage hierarchy to be a Client Component.
 */
export default function ProgramHashScroll() {
  const lenis = useLenis();

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const timer = setTimeout(() => {
        if (lenis) {
          lenis.scrollTo(`#${hash}`, { offset: -130 });
        } else {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [lenis]);

  return null;
}

