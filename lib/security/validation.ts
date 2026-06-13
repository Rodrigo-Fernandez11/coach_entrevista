import { z } from "zod";

// ── Reusable primitives ──────────────────────────────────────────────────────

const uuid = z.string().uuid("Must be a valid UUID");

const questionCategory = z.enum(["behavioral", "technical", "situational"]);

const questionLevel = z.enum(["junior", "mid", "senior"]);

// ── Route-specific schemas ────────────────────────────────────────────────────

/** GET /api/questions query params */
export const questionFiltersSchema = z.object({
  category: questionCategory.optional(),
  level: questionLevel.optional(),
  role: z.string().max(50, "Role tag must be 50 characters or less").optional(),
});

/** GET /api/questions/:id — param validation */
export const questionIdSchema = z.object({ id: uuid });

/** POST /api/sessions body */
export const sessionCreateSchema = z.object({
  questionId: uuid,
});

/** POST /api/feedback body */
export const feedbackRequestSchema = z.object({
  sessionId: uuid,
  answer: z
    .string()
    .min(20, "Answer must be at least 20 characters")
    .max(2000, "Answer must be 2000 characters or less"),
  language: z.enum(["es", "en"]).default("es"),
});

export type QuestionFilters = z.infer<typeof questionFiltersSchema>;
export type SessionCreate = z.infer<typeof sessionCreateSchema>;
export type FeedbackRequest = z.infer<typeof feedbackRequestSchema>;
