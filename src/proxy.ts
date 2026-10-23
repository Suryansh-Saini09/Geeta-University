import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/lib/adminSession";

// Valid session tokens are 32-byte base64url strings (typically 43-44 chars, URL-safe base64)
const SESSION_TOKEN_REGEX = /^[A-Za-z0-9_-]{32,64}$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
