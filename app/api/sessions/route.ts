import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserSessions } from "@/lib/db/queries";
import { prisma } from "@/lib/db/client";

/**
 * GET /api/sessions
 * Returns the 20 most recent sessions for the authenticated user.
 * Returns 401 if not authenticated.
 */
export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await getUserSessions(user.id);

  return NextResponse.json({ sessions });
}

/**
 * POST /api/sessions
 * Creates a new session for the authenticated user.
 * Body: { questionId: string }
 * Returns: { sessionId: string }
 */
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { questionId } = body;

  if (!questionId || typeof questionId !== "string") {
    return NextResponse.json(
      { error: "questionId is required" },
      { status: 400 }
    );
  }

  // Ensure user exists in our DB (Supabase auth user may not have a DB record yet)
  await prisma.user.upsert({
    where: { id: user.id },
    update: { lastSessionAt: new Date() },
    create: { id: user.id, email: user.email! },
  });

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      questionId,
    },
  });

  return NextResponse.json({ sessionId: session.id }, { status: 201 });
}
