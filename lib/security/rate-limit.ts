/**
 * Simple in-memory sliding-window rate limiter.
 *
 * IMPORTANT: This is a per-instance limiter. In a serverless / multi-instance
 * deployment each instance has its own counter, so the effective limit is
 * `limit × instance_count`. The DB-backed TrialUsage table is the authoritative
 * cost guard; this limiter is a cheap first-pass to blunt obviously abusive
 * request patterns on a single instance.
 */

interface WindowEntry {
  timestamps: number[];
}

// Map<key, WindowEntry>
const windows = new Map<string, WindowEntry>();

/** Prune entries older than `windowMs` to keep memory bounded. */
function prune(entry: WindowEntry, windowMs: number, now: number): void {
  const cutoff = now - windowMs;
  // Remove expired timestamps in-place
  let i = 0;
  const { timestamps } = entry;
  while (i < timestamps.length && timestamps[i]! < cutoff) {
    i++;
  }
  if (i > 0) timestamps.splice(0, i);
}

export interface RateLimitConfig {
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  /** Remaining requests in the current window */
  remaining: number;
  /** Epoch ms when the oldest request in the window expires */
  resetAt: number;
}

/**
 * Checks and records a request for the given key.
 *
 * @param key    Unique identifier for the requester (e.g. hashed IP)
 * @param config Rate limit parameters
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const { limit, windowMs } = config;

  let entry = windows.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    windows.set(key, entry);
  }

  prune(entry, windowMs, now);

  const { timestamps } = entry;
  const count = timestamps.length;

  if (count >= limit) {
    const resetAt = timestamps[0]! + windowMs;
    return { allowed: false, remaining: 0, resetAt };
  }

  timestamps.push(now);
  return { allowed: true, remaining: limit - count - 1, resetAt: now + windowMs };
}

// Pre-configured limiters
/** 20 req/min — for GET question/session routes */
export const GET_RATE_LIMIT: RateLimitConfig = { limit: 20, windowMs: 60_000 };

/** 5 req/min — for POST /api/feedback */
export const FEEDBACK_RATE_LIMIT: RateLimitConfig = {
  limit: 5,
  windowMs: 60_000,
};

/** 10 req/min — for POST /api/sessions */
export const SESSION_RATE_LIMIT: RateLimitConfig = {
  limit: 10,
  windowMs: 60_000,
};
