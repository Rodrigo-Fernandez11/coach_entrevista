import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db/client";
import type { QuestionCategory, QuestionLevel } from "@/app/generated/prisma/enums";

// ──────────────────────────────────────────────
// Ownership guard
// ──────────────────────────────────────────────

/**
 * Asserts that an Answer record belongs to the given user.
 * Throws a 403-style error if ownership check fails.
 * Used before any transcription / feedback operation.
 */
export async function assertOwns(
  answerId: string,
  userId: string
): Promise<void> {
  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
    select: {
      session: {
        select: { userId: true },
      },
    },
  });

  if (!answer) {
    throw new Error(`Answer not found: ${answerId}`);
  }

  if (answer.session.userId !== userId) {
    throw new Error(
      `Forbidden: answer ${answerId} does not belong to user ${userId}`
    );
  }
}

// ──────────────────────────────────────────────
// Question queries
// ──────────────────────────────────────────────

interface QuestionFilters {
  category?: QuestionCategory;
  level?: QuestionLevel;
  roleTag?: string;
}

/**
 * Fetches questions from the DB with optional filters.
 * Cached with a 1-hour TTL to avoid repeated DB hits.
 */
export const getCachedQuestions = unstable_cache(
  async (filters: QuestionFilters = {}) => {
    return prisma.question.findMany({
      where: {
        ...(filters.category && { category: filters.category }),
        ...(filters.level && { level: filters.level }),
        ...(filters.roleTag && { roleTag: filters.roleTag }),
      },
      orderBy: { createdAt: "asc" },
    });
  },
  ["questions"],
  { revalidate: 3600 } // 1 hour TTL
);

// ──────────────────────────────────────────────
// Session queries
// ──────────────────────────────────────────────

/**
 * Returns the 20 most recent sessions for a user,
 * including question text and feedback scores.
 */
export async function getUserSessions(userId: string) {
  return prisma.session.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      question: {
        select: { text: true, category: true, level: true },
      },
      answers: {
        select: {
          id: true,
          textAnswer: true,
          transcript: true,
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
        take: 1, // one answer per session in v1
      },
    },
  });
}
