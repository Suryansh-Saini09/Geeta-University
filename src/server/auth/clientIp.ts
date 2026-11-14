import "server-only";

import { isIP } from "node:net";
import { env } from "@/lib/env";

export type TrustedProxyProvider = "cloudflare" | "hostinger" | "vercel" | "none";

/**
 * Normalizes and validates an IP candidate string using Node.js `node:net.isIP()`.
 * - Strips optional port suffix for IPv4 (e.g. "192.168.1.1:8080")
 * - Unwraps IPv6 bracket notation (e.g. "[::1]")
 * - Converts IPv6 hex characters to lowercase
 * - Returns null if the string is not a valid IPv4 or IPv6 address
 */
export function normalizeIp(candidate: unknown): string | null {
  if (!candidate || typeof candidate !== "string") {
    return null;
  }

  const trimmed = candidate.trim();
  if (!trimmed) {
    return null;
  }

  // Handle IPv4 with port (e.g. 192.168.1.1:8080)
  const isIpv4WithPort =
    trimmed.includes(":") &&
    !trimmed.includes("[") &&
    trimmed.split(":").length === 2 &&
    isIP(trimmed.split(":")[0]) === 4;

  const cleanIp = isIpv4WithPort
    ? trimmed.split(":")[0]
    : trimmed.replace(/^\[(.*)\]$/, "$1");

  if (isIP(cleanIp) !== 0) {
    return cleanIp.toLowerCase();
  }

  return null;
}

/**
 * Safely extracts a header value from Next.js Headers or plain record.
 */
function extractHeader(
  headers: Headers | Record<string, string | string[] | undefined> | null | undefined,
  name: string
): string | null {
  if (!headers) return null;

  if (typeof (headers as Headers).get === "function") {
    return (headers as Headers).get(name);
  }

  const lowerName = name.toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === lowerName) {
      if (Array.isArray(value)) {
        return value[0] || null;
      }
      return typeof value === "string" ? value : null;
    }
  }

  return null;
}

/**
 * Determines the active trusted proxy provider based on configuration and environment.
 */
export function resolveTrustedProxyProvider(): TrustedProxyProvider {
  if (env.TRUSTED_PROXY_PROVIDER) {
    return env.TRUSTED_PROXY_PROVIDER;
  }

  if (process.env.VERCEL === "1") {
    return "vercel";
  }

  if (process.env.NODE_ENV === "production") {
    // Default production architecture for Geeta University VPS / Hostinger deployment
    return "hostinger";
  }

  return "none";
}

/**
 * Extracts and validates the authentic client IP address based on trusted proxy assumptions.
 *
 * ## Proxy Trust Architecture
 * 1. **Cloudflare (`cloudflare`):**
 *    Trusts `CF-Connecting-IP`. Cloudflare overwrites or strips incoming client-supplied
 *    headers at its edge, guaranteeing this header contains the connecting client's IP.
 *
 * 2. **Vercel (`vercel`):**
 *    Trusts `x-vercel-forwarded-for` (set by Vercel's edge network) or `x-real-ip`.
 *
 * 3. **Hostinger / Nginx VPS (`hostinger`):**
 *    Hostinger Nginx/LiteSpeed reverse proxies set `X-Real-IP: $remote_addr`.
 *    If only `X-Forwarded-For` is present, the **rightmost** (last) hop is extracted
 *    because upstream proxies append the client IP to the end of the chain. Leftmost
 *    entries are untrusted as they can be forged by the client.
 *
 * 4. **Local / Direct (`none`):**
 *    Used in local development and automated testing. Evaluates `X-Real-IP` and
 *    rightmost `X-Forwarded-For` before defaulting to "127.0.0.1".
 *
 * In all modes, if headers are missing or malformed, returns `"unknown-ip"`.
 * Attacker-controlled arbitrary strings are never used as rate-limit identities.
 */
export function getClientIp(
  headers: Headers | Record<string, string | string[] | undefined> | null | undefined,
  overrideProvider?: TrustedProxyProvider
): string {
  const provider = overrideProvider || resolveTrustedProxyProvider();
  let candidateIp: string | null = null;

  switch (provider) {
    case "cloudflare": {
      const cfIp = extractHeader(headers, "cf-connecting-ip");
      candidateIp = normalizeIp(cfIp);
      break;
    }

    case "vercel": {
      const vercelIp =
        extractHeader(headers, "x-vercel-forwarded-for") ||
        extractHeader(headers, "x-real-ip");
      candidateIp = normalizeIp(vercelIp);
      break;
    }

    case "hostinger": {
      // Hostinger Nginx / LiteSpeed reverse proxy sets X-Real-IP to $remote_addr
      const realIp = extractHeader(headers, "x-real-ip");
      candidateIp = normalizeIp(realIp);

      if (!candidateIp) {
        const xff = extractHeader(headers, "x-forwarded-for");
        if (xff) {
          const parts = xff.split(",").map((p) => p.trim()).filter(Boolean);
          // In reverse-proxy topology, parse from the RIGHT (closest trusted hop)
          for (let i = parts.length - 1; i >= 0; i--) {
            const parsed = normalizeIp(parts[i]);
            if (parsed) {
              candidateIp = parsed;
              break;
            }
          }
        }
      }
      break;
    }

    case "none":
    default: {
      const realIp = extractHeader(headers, "x-real-ip");
      candidateIp = normalizeIp(realIp);

      if (!candidateIp) {
        const xff = extractHeader(headers, "x-forwarded-for");
        if (xff) {
          const parts = xff.split(",").map((p) => p.trim()).filter(Boolean);
          for (let i = parts.length - 1; i >= 0; i--) {
            const parsed = normalizeIp(parts[i]);
            if (parsed) {
              candidateIp = parsed;
              break;
            }
          }
        }
      }

      if (!candidateIp && process.env.NODE_ENV !== "production") {
        candidateIp = "127.0.0.1";
      }
      break;
    }
  }

  return candidateIp || "unknown-ip";
}
