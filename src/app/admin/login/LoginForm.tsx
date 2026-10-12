"use client";

import React, { useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, User, Lock, Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/features/admin/auth/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0284C7] px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md shadow-[#0284C7]/20 transition-all hover:bg-[#0369A1] hover:shadow-lg hover:shadow-[#0284C7]/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-white" />
          <span>Signing in…</span>
        </>
      ) : (
        <span>Sign In</span>
      )}
    </button>
  );
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={loginAction} className="space-y-4 sm:space-y-4.5">
      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="sr-only"
        >
          Email address
        </label>
        <div className="relative flex items-center">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="email"
            required
            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#0284C7] focus:bg-white focus:ring-3 focus:ring-[#0284C7]/15"
          />
          <div className="pointer-events-none absolute right-3 flex items-center text-slate-400">
            <User className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="password"
          className="sr-only"
        >
          Password
        </label>
        <div className="relative flex items-center">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Password"
            required
            minLength={8}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#0284C7] focus:bg-white focus:ring-3 focus:ring-[#0284C7]/15"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2.5 rounded p-1 text-slate-400 hover:text-slate-600 transition focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Lock className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center gap-2 pt-0.5">
        <input
          id="rememberMe"
          name="rememberMe"
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-[#0284C7] focus:ring-[#0284C7]/30 cursor-pointer"
        />
        <label
          htmlFor="rememberMe"
          className="text-xs font-medium text-slate-600 cursor-pointer select-none"
        >
          Remember Me
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-1">
        <SubmitButton />
      </div>
    </form>
  );
}
