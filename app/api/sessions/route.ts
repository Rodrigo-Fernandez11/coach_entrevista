import { type NextRequest, NextResponse } from "next/server";
import { getUserSessions } from "@/lib/db/queries";
import { prisma } from "@/lib/db/client";

const ANONYMOUS_USER_ID = "00000000-0000-0000-0000-000000000000";
const ANONYMOUS_USER_EMAIL = "anonymous@local.test";

/**
 * GET /api/sessions
 * Returns the 20 most recent anonymous sessions.
 */
export async function GET() {
  const sessions = await getUserSessions(ANONYMOUS_USER_ID);

  return NextResponse.json({ sessions });
}

/**
 * POST /api/sessions
 * Creates a new anonymous practice session.
 * Body: { questionId: string }
 * Returns: { sessionId: string }
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { questionId } = body;

  if (!questionId || typeof questionId !== "string") {
    return NextResponse.json(
      { error: "questionId is required" },
      { status: 400 }
    );
  }

  // Keep the current schema intact while the MVP runs without user accounts.
  await prisma.user.upsert({
    where: { id: ANONYMOUS_USER_ID },
    update: { lastSessionAt: new Date() },
    create: { id: ANONYMOUS_USER_ID, email: ANONYMOUS_USER_EMAIL },
  });

  const session = await prisma.session.create({
    data: {
      userId: ANONYMOUS_USER_ID,
      questionId,
    },
  });

  return NextResponse.json({ sessionId: session.id }, { status: 201 });
}
