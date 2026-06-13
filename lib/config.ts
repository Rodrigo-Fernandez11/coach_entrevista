/**
 * Centralized application configuration.
 * All secrets come from environment variables. Defaults are safe for development.
 */

// ── Anonymous user (used as the single shared owner in MVP) ─────────────────
export const ANONYMOUS_USER_ID = "00000000-0000-0000-0000-000000000000";
export const ANONYMOUS_USER_EMAIL = "anonymous@local.test";

// ── Trial gating ────────────────────────────────────────────────────────────
/** Max AI feedback calls allowed per trial cookie */
export const TRIAL_MAX_FEEDBACK = Number(
  process.env.TRIAL_MAX_FEEDBACK ?? "1"
);

/** Hard cap on total feedback calls served across all users in a calendar day */
export const DAILY_FEEDBACK_CAP = Number(
  process.env.DAILY_FEEDBACK_CAP ?? "50"
);

/** Salt mixed into the IP before hashing. Set a random value in prod. */
export const IP_HASH_SALT = process.env.IP_HASH_SALT ?? "";

// ── AI / OpenAI ─────────────────────────────────────────────────────────────
export const OPENAI_MODEL = "gpt-4o-mini";

/** Hard max on answer length accepted from the client (chars) */
export const MAX_ANSWER_CHARS = 2000;

/** Max tokens the model may produce for a feedback response */
export const MAX_FEEDBACK_TOKENS = 600;
