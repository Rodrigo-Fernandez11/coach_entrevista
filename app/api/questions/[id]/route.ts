import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

/**
 * GET /api/questions/:id
 * Fetch a single question by ID.
 * Returns 404 if not found.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const question = await prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch question" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/questions/:id
 * Question mutations are disabled while the app runs without authentication.
 */
export function PATCH() {
  return NextResponse.json(
    { error: "Question mutations are disabled" },
    { status: 405 }
  );
}

/**
 * DELETE /api/questions/:id
 * Question mutations are disabled while the app runs without authentication.
 */
export function DELETE() {
  return NextResponse.json(
    { error: "Question mutations are disabled" },
    { status: 405 }
  );
}
