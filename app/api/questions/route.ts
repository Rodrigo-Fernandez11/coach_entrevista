import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCachedQuestions } from "@/lib/db/queries";
import type {
  QuestionCategory,
  QuestionLevel,
} from "@/app/generated/prisma/enums";

/**
 * GET /api/questions?role=&level=&category=
 * Returns a random question matching optional filters.
 * Returns 404 if no questions match.
 * Returns 401 if not authenticated.
 *
 * NOTE: Full implementation is in Batch 2 (T-17, T-18).
 * This stub provides the endpoint needed by the home page.
 */
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as QuestionCategory | null;
  const level = searchParams.get("level") as QuestionLevel | null;
  const roleTag = searchParams.get("role") ?? undefined;

  const questions = await getCachedQuestions({
    ...(category && { category }),
    ...(level && { level }),
    ...(roleTag && { roleTag }),
  });

  if (questions.length === 0) {
    return NextResponse.json(
      { error: "No questions match your filters" },
      { status: 404 }
    );
  }

  // Random selection
  const question = questions[Math.floor(Math.random() * questions.length)];

  return NextResponse.json({ question, total: questions.length });
}
