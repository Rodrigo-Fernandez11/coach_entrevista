import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/client";
import { sessionCreateSchema } from "@/lib/security/validation";
import {
  checkRateLimit,
  GET_RATE_LIMIT,
  SESSION_RATE_LIMIT,
} from "@/lib/security/rate-limit";
import {
  extractIp,
  hashIp,
  readOrGenerateTrialId,
  setTrialCookie,
} from "@/lib/security/trial";
import { ANONYMOUS_USER_ID, ANONYMOUS_USER_EMAIL } from "@/lib/config";

/**
 * GET /api/sessions
 * Returns the 20 most recent sessions for the caller's trial cookie.
 * No cookie → empty list (never leaks other users' sessions).
 */
export async function GET(request: NextRequest) {
  const ip = extractIp(request.headers);
  const rl = checkRateLimit(hashIp(ip), GET_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

  try {
    const jar = await cookies();
    const trialId = jar.get("ic_trial_id")?.value;
    if (!trialId) {
      return NextResponse.json({ sessions: [] });
    }

    const sessions = await prisma.session.findMany({
      where: { trialId },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        question: {
          select: { text: true, category: true, level: true },
        },
        answers: {
          select: {
            id: true,
            status: true,
            feedback: {
              select: {
                clarityScore: true,
                structureScore: true,
                contentScore: true,
                starCompliance: true,
                summary: true,
              },
            },
          },
          take: 1,
        },
      },
    });

    return NextResponse.json({ sessions });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sessions
 * Creates a new anonymous practice session.
 * Body: { questionId: string }
 * Sets/refreshes the trial cookie on the response.
 */
export async function POST(request: NextRequest) {
  const ip = extractIp(request.headers);
  const rl = checkRateLimit(hashIp(ip), SESSION_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = sessionCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { questionId } = parsed.data;
  const trialId = await readOrGenerateTrialId();

  try {
    // Keep the anonymous-user row alive for FK integrity
    await prisma.user.upsert({
      where: { id: ANONYMOUS_USER_ID },
      update: { lastSessionAt: new Date() },
      create: { id: ANONYMOUS_USER_ID, email: ANONYMOUS_USER_EMAIL },
    });

    const session = await prisma.session.create({
      data: {
        userId: ANONYMOUS_USER_ID,
        questionId,
        trialId,
      },
    });

    const response = NextResponse.json(
      { sessionId: session.id },
      { status: 201 }
    );
    setTrialCookie(response, trialId);
    return response;
  } catch (err: unknown) {
    // FK violation → invalid questionId
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2003"
    ) {
      return NextResponse.json(
        { error: "Invalid questionId" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

