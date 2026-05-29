import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCachedQuestions } from "@/lib/db/queries";
import { prisma } from "@/lib/db/client";
import type {
  QuestionCategory,
  QuestionLevel,
} from "@/app/generated/prisma/enums";
import { z } from "zod";

const CreateQuestionSchema = z.object({
  text: z.string().min(10, "Question must be at least 10 characters"),
  category: z.enum(["behavioral", "technical", "situational"]),
  level: z.enum(["junior", "mid", "senior"]),
  roleTag: z.string().optional(),
});

/**
 * GET /api/questions?category=&level=&role=
 * Returns a random question matching optional filters.
 * Returns 404 if no questions match.
 * Returns 401 if not authenticated.
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

  const question = questions[Math.floor(Math.random() * questions.length)];

  return NextResponse.json({ question, total: questions.length });
}

/**
 * POST /api/questions
 * Create a new question. Requires text, category, level.
 * Returns 401 if not authenticated, 400 if validation fails.
 */
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = CreateQuestionSchema.parse(body);

    const question = await prisma.question.create({
      data: {
        text: validatedData.text,
        category: validatedData.category,
        level: validatedData.level,
        roleTag: validatedData.roleTag || "",
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
