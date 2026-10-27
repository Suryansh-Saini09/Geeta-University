"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home, GraduationCap } from "lucide-react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log sanitized error digest for observability without disclosing stack or internal messages to visitors
    if (error.digest) {
      console.error(`[Notice] Application error (Ref: ${error.digest})`);
    } else {
      console.error("[Notice] Application error occurred");
    }
  }, [error]);

  return (
    <div className="relative min-h-[75vh] w-full flex items-center justify-center bg-[#0A1F44] text-white overflow-hidden py-16 px-4">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#1A3A6B]/50 via-[#E8871A]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[280px] h-[280px] bg-[#E8871A]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-400 text-sm font-semibold mb-6 shadow-inner">
          <AlertCircle className="w-4 h-4" />
          <span>Notice &bull; Temporary Interruption</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif text-white drop-shadow-sm">
          Something Went Unexpectedly Wrong
        </h1>

        <p className="mt-4 text-slate-300 max-w-lg text-base sm:text-lg leading-relaxed font-sans">
          We encountered an unexpected technical issue while preparing this page. Our technical team has been notified.
        </p>

        {error.digest && (
          <p className="mt-3 text-xs font-mono text-slate-400 bg-white/5 px-3 py-1.5 rounded-md border border-white/10">
            Reference code: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#E8871A] to-[#F5A623] text-white font-semibold text-base shadow-lg shadow-[#E8871A]/25 hover:shadow-[#E8871A]/40 hover:scale-[1.02] transition-all duration-200"
          >
            <RotateCcw className="w-5 h-5" />
            Try Loading Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-base hover:bg-white/20 hover:scale-[1.02] transition-all duration-200"
          >
            <Home className="w-5 h-5 text-[#E8871A]" />
            Back to Homepage
          </Link>

          <Link
            href="/programs-after-12th"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-base hover:bg-white/20 hover:scale-[1.02] transition-all duration-200"
          >
            <GraduationCap className="w-5 h-5 text-[#E8871A]" />
            Explore Programs
          </Link>
        </div>
      </div>
    </div>
  );
}
