/**
 * Lightweight, in-memory sliding-window rate limiter for server actions and API route handlers.
 * Maintains timestamp-based attempt windows with automatic garbage collection of expired entries.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Periodically prune stale entries older than 1 hour to prevent memory leaks
if (typeof setInterval !== "undefined") {
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      entry.timestamps = entry.timestamps.filter((ts) => now - ts < 3600 * 1000);
      if (entry.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);

  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetSeconds: number;
}

/**
 * Checks if a given identifier exceeds the allowed attempt limit within the time window.
 *
 * @param key Unique key to identify the actor (e.g. `login_ip_192.168.1.1` or `enquiry_ip_...`)
 * @param limit Maximum number of allowed attempts within the window
 * @param windowSeconds Window length in seconds (e.g. 900 for 15 minutes)
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const entry = rateLimitStore.get(key) || { timestamps: [] };

  // Filter timestamps within the active window
  entry.timestamps = entry.timestamps.filter((ts) => now - ts < windowMs);

  if (entry.timestamps.length >= limit) {
    const oldest = entry.timestamps[0];
    const resetSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  entry.timestamps.push(now);
  rateLimitStore.set(key, entry);

  return {
    success: true,
    remaining: limit - entry.timestamps.length,
    resetSeconds: windowSeconds,
  };
}

/**
 * Resets the rate limit for a specific key (e.g. after a successful login).
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}
