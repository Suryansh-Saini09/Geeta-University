import { LockKeyhole } from "lucide-react";

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
  const { error } = await searchParams;
  const message = error ? errorMessages[error] : null;

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-md items-center">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0A1F44] text-white">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E8871A]">
              Staff access
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold text-[#0A1F44]">
              Sign in to CMS
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Manage university pages, programs, media, submissions, and SEO
              from a protected dashboard.
            </p>
          </div>

          {message ? (
            <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {message}
            </div>
          ) : null}

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
