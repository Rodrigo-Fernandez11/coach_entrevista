import { createHash, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import {
  TRIAL_MAX_FEEDBACK,
  DAILY_FEEDBACK_CAP,
  IP_HASH_SALT,
} from "@/lib/config";

// ── Cookie ───────────────────────────────────────────────────────────────────

const TRIAL_COOKIE = "ic_trial_id";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * Reads the trial cookie, returning an existing value or a freshly generated
 * UUID if none is set.
 *
 * Caller is responsible for persisting a newly generated id via setTrialCookie.
 */
export async function readOrGenerateTrialId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(TRIAL_COOKIE)?.value;
  if (existing) return existing;
  return randomUUID();
}

/**
 * Appends the trial cookie to a NextResponse.
 * Must be called before the response is returned.
 */
export function setTrialCookie(response: NextResponse, trialId: string): void {
  const isProduction = process.env.NODE_ENV === "production";
  response.cookies.set(TRIAL_COOKIE, trialId, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: ONE_YEAR_SECONDS,
    path: "/",
  });
}

// ── IP hashing ───────────────────────────────────────────────────────────────

/**
 * Extracts the caller IP from standard forwarding headers.
 * Returns 'unknown' when no IP can be determined.
 */
export function extractIp(
  headers: Readonly<Headers> | import("next/server").NextRequest["headers"]
): string {
  const forwarded = (headers as Headers).get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",");
    const first = parts[0]?.trim();
    if (first) return first;
  }
  const realIp = (headers as Headers).get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

/**
 * Returns a one-way SHA-256 hash of the IP + salt so we never store raw IPs.
 */
export function hashIp(ip: string): string {
  return createHash("sha256")
    .update(ip + IP_HASH_SALT)
    .digest("hex");
}

// ── Soft pre-checks ──────────────────────────────────────────────────────────

export type AllowanceResult =
  | { allowed: true }
  | { allowed: false; reason: "trial_exhausted" | "daily_cap" };

/**
 * Non-atomic soft checks run BEFORE reserveTrialSlot.
 * These provide a fast rejection path for obviously-over-cap requests.
 * The hard enforcement is inside reserveTrialSlot (atomic DB update).
 *
 * Rules (in order):
 * 1. Global daily cap — sum of feedbackCount across all TrialUsage rows updated today.
 * 2. Per-trial count must be < TRIAL_MAX_FEEDBACK.
 * 3. Per-IP sum across all trials must be < TRIAL_MAX_FEEDBACK (skipped for 'unknown'
 *    IPs because grouping all unknown callers would block legitimate users).
 */
export async function checkTrialAllowance(
  trialId: string,
  ipHash: string
): Promise<AllowanceResult> {
  // 1. Global daily cap — count actual feedback calls, not row count
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const dailyAggregate = await prisma.trialUsage.aggregate({
    _sum: { feedbackCount: true },
    where: { updatedAt: { gte: todayStart } },
  });
  const dailyTotal = dailyAggregate._sum.feedbackCount ?? 0;
  if (dailyTotal >= DAILY_FEEDBACK_CAP) {
    return { allowed: false, reason: "daily_cap" };
  }

  // 2. Per-trial check
  const trialRecord = await prisma.trialUsage.findUnique({
    where: { trialId },
    select: { feedbackCount: true },
  });
  if (trialRecord && trialRecord.feedbackCount >= TRIAL_MAX_FEEDBACK) {
    return { allowed: false, reason: "trial_exhausted" };
  }

  // 3. Per-IP sum check — skip when IP is unknown to avoid false positives
  if (ipHash !== hashIp("unknown")) {
    const ipRecords = await prisma.trialUsage.findMany({
      where: { ipHash },
      select: { feedbackCount: true },
    });
    const ipTotal = ipRecords.reduce((sum, r) => sum + r.feedbackCount, 0);
    if (ipTotal >= TRIAL_MAX_FEEDBACK) {
      return { allowed: false, reason: "trial_exhausted" };
    }
  }

  return { allowed: true };
}

// ── Atomic trial slot reservation ────────────────────────────────────────────

export type ReserveResult =
  | { reserved: true }
  | { reserved: false; reason: "trial_exhausted" };

/**
 * Atomically reserves one trial slot for the given trialId + ipHash pair.
 *
 * Implementation: inside a serializable transaction we upsert the TrialUsage
 * row (creating it with feedbackCount=0 if absent), then run an updateMany
 * guarded by `feedbackCount < TRIAL_MAX_FEEDBACK`. If updateMany returns
 * count=0 the cap was already reached → not reserved.
 *
 * Call this BEFORE the OpenAI call. On any downstream failure, call
 * releaseTrialSlot to give the slot back.
 */
export async function reserveTrialSlot(
  trialId: string,
  ipHash: string
): Promise<ReserveResult> {
  return await prisma.$transaction(
    async (tx) => {
      // Ensure the row exists with feedbackCount=0 if new
      await tx.trialUsage.upsert({
        where: { trialId },
        create: { trialId, ipHash, feedbackCount: 0 },
        update: {},
      });

      // Increment only when under the cap — race-safe at DB level
      const result = await tx.trialUsage.updateMany({
        where: { trialId, feedbackCount: { lt: TRIAL_MAX_FEEDBACK } },
        data: { feedbackCount: { increment: 1 } },
      });

      if (result.count === 0) {
        return { reserved: false, reason: "trial_exhausted" as const };
      }
      return { reserved: true };
    },
    { isolationLevel: "Serializable" }
  );
}

/**
 * Decrements the feedback counter for a trial that was reserved but whose
 * downstream work (OpenAI call or DB persistence) failed, so the user's slot
 * is not burned by a transient error.
 *
 * Uses updateMany with `feedbackCount > 0` to prevent going below zero.
 */
export async function releaseTrialSlot(trialId: string): Promise<void> {
  await prisma.trialUsage.updateMany({
    where: { trialId, feedbackCount: { gt: 0 } },
    data: { feedbackCount: { increment: -1 } },
  });
}
