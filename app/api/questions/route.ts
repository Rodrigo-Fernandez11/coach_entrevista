import { type NextRequest, NextResponse } from "next/server";
import { getCachedQuestions } from "@/lib/db/queries";
import type {
  QuestionCategory,
  QuestionLevel,
} from "@/app/generated/prisma/enums";

/**
 * GET /api/questions?category=&level=&role=
 * Returns a random question matching optional filters.
 * Returns 404 if no questions match.
 */
export async function GET(request: NextRequest) {
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

  const question = questions[Math.floor(Math.random() * questions.length)];

  return NextResponse.json({ question, total: questions.length });
}

/**
 * POST /api/questions
 * Question mutations are disabled while the app runs without authentication.
 */
export function POST() {
  return NextResponse.json(
    { error: "Question mutations are disabled" },
    { status: 405 }
  );
}
