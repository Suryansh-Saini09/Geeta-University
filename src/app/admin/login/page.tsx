import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

import LoginForm from "./LoginForm";

const errorMessages: Record<string, string> = {
  "invalid-input": "Enter a valid email and password.",
  "invalid-credentials": "The email or password is incorrect.",
  "database-error": "Sign-in is temporarily unavailable. Please try again shortly.",
  "session-error": "Failed to create an active session. Please try again.",
  "server-error": "A server error occurred. Please try again.",
};

interface AdminLoginPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const message = resolvedParams.error ? errorMessages[resolvedParams.error] : null;

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-8 sm:px-6 lg:px-12 overflow-hidden">
      {/* Subtle Ambient Background Accents */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-slate-200/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-5xl items-center justify-center gap-10 lg:gap-16 xl:gap-24">
        {/* Left Column: Login Card & Copyright */}
        <div className="flex w-full max-w-[380px] shrink-0 flex-col items-center">
          <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-7 sm:p-9 shadow-xl shadow-slate-200/60 transition-shadow">
            {/* University Logo */}
            <div className="mb-5 flex justify-center">
              <Link
                href="/"
                title="Geeta University"
                className="group flex flex-col items-center focus:outline-none"
              >
                <div className="relative h-12 w-36">
                  <Image
                    src="/GU-Logo.webp"
                    alt="Geeta University"
                    fill
                    sizes="144px"
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Heading */}
            <h1 className="mb-6 text-center text-xl font-bold tracking-tight text-slate-800">
              Log in
            </h1>

            {/* Error Message */}
            {message ? (
              <div
                role="alert"
                className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50/90 px-3.5 py-2.5 text-xs font-semibold text-red-700"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />
                <span>{message}</span>
              </div>
            ) : null}

            {/* Form */}
            <LoginForm />
          </div>

          {/* Footer Copyright */}
          <p className="mt-5 text-center text-xs text-slate-500 select-none">
            &copy; All rights reserved, Geeta University, 2026-27
          </p>
        </div>

        {/* Right Column: Hero SVG Illustration */}
        <div className="hidden lg:flex flex-1 items-center justify-center max-w-lg xl:max-w-xl">
          <div className="relative w-full aspect-[680/500]">
            <Image
              src="/admin-login-illustration.svg"
              alt="Geeta University CMS Administration Illustration"
              fill
              sizes="(max-width: 1280px) 512px, 576px"
              className="object-contain drop-shadow-xs select-none pointer-events-none"
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
}
