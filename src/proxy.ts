import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/lib/adminSession";

// Valid session tokens are 32-byte base64url strings (typically 43-44 chars, URL-safe base64)
const SESSION_TOKEN_REGEX = /^[A-Za-z0-9_-]{32,64}$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  if (isAdminRoute && !pathname.startsWith("/admin/login")) {
    const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE);
    const token = sessionCookie?.value;

    if (!token || !SESSION_TOKEN_REGEX.test(token)) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      if (sessionCookie) {
        response.cookies.delete(ADMIN_SESSION_COOKIE);
      }
      return response;
    }
  }

  // Always strip any client-supplied x-is-standalone-route header to prevent client spoofing
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("x-is-standalone-route");

  // Exclusively derive standalone route status from verified server-side pathname
  const isStandalone =
    isAdminRoute ||
    pathname === "/social-links" ||
    pathname.startsWith("/social-links/");

  if (isStandalone) {
    requestHeaders.set("x-is-standalone-route", "1");
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (metadata files)
     * - uploads (static media assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|uploads/).*)",
  ],
};
