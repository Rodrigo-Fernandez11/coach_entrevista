import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { questionIdSchema } from "@/lib/security/validation";
import { checkRateLimit, GET_RATE_LIMIT } from "@/lib/security/rate-limit";
import { extractIp, hashIp } from "@/lib/security/trial";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limit by IP
  const ip = extractIp(request.headers);
  const rl = checkRateLimit(hashIp(ip), GET_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

  // Validate UUID param
  const { id } = await params;
  const parsed = questionIdSchema.safeParse({ id });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid question ID" },
      { status: 400 }
    );
  }

  try {
    const question = await prisma.question.findUnique({
      where: { id: parsed.data.id },
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

export function PATCH() {
  return NextResponse.json(
    { error: "Question mutations are disabled" },
    { status: 405 }
  );
}

export function DELETE() {
  return NextResponse.json(
    { error: "Question mutations are disabled" },
    { status: 405 }
  );
}
