import { type NextRequest, NextResponse } from "next/server";
import { getCachedQuestions } from "@/lib/db/queries";
import { questionFiltersSchema } from "@/lib/security/validation";
import { checkRateLimit, GET_RATE_LIMIT } from "@/lib/security/rate-limit";
import { extractIp, hashIp } from "@/lib/security/trial";

export async function GET(request: NextRequest) {
  // Rate limit by IP
  const ip = extractIp(request.headers);
  const rl = checkRateLimit(hashIp(ip), GET_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

  // Validate query params
  const { searchParams } = new URL(request.url);
  const parsed = questionFiltersSchema.safeParse({
    category: searchParams.get("category") ?? undefined,
    level: searchParams.get("level") ?? undefined,
    role: searchParams.get("role") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const { category, level, role } = parsed.data;
    const questions = await getCachedQuestions({
      ...(category && { category }),
      ...(level && { level }),
      ...(role && { roleTag: role }),
    });

    if (questions.length === 0) {
      return NextResponse.json(
        { error: "No questions match your filters" },
        { status: 404 }
      );
    }

    const question = questions[Math.floor(Math.random() * questions.length)];
    return NextResponse.json({ question, total: questions.length });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

export function POST() {
  return NextResponse.json(
    { error: "Question mutations are not permitted" },
    { status: 405 }
  );
}
