"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, LockKeyhole, ArrowLeft } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin portal route error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl shadow-slate-200/70 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-700">
          Admin Portal Alert
        </p>

        <h1 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#0A1F44]">
          Unable to Load Admin Service
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          A server or database connection issue occurred while loading this section.
          If this is on a live deployment, please verify that your database environment variables are configured.
        </p>

        {error.digest && (
          <div className="mt-4 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono text-slate-500">
            Error digest: {error.digest}
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A1F44] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-200 transition hover:bg-[#F5A623]"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>

          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-[#0A1F44] hover:bg-slate-50 transition"
          >
            <LockKeyhole className="h-4 w-4" />
            Go to Login
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Main site
          </Link>
        </div>
      </div>
    </main>
  );
}
