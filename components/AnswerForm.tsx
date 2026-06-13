"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import FeedbackResult from "@/components/FeedbackResult";

interface FeedbackData {
  clarityScore: number;
  structureScore: number;
  contentScore: number;
  starCompliance: number;
  evidence: string;
  strengths: string[];
  improvements: string[];
  summary: string;
}

const MIN_CHARS = 20;
const MAX_CHARS = 2000;

interface AnswerFormProps {
  sessionId: string;
}

export default function AnswerForm({ sessionId }: AnswerFormProps) {
  const { t, language } = useTranslation();
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [trialState, setTrialState] = useState<
    "ok" | "trial_exhausted" | "daily_cap" | "already_answered" | "trial_required"
  >("ok");
  const [error, setError] = useState<string | null>(null);

  const charCount = answer.length;
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, answer, language }),
      });

      if (res.status === 403) {
        setTrialState("trial_required");
        setLoading(false);
        return;
      }

      if (res.status === 409) {
        setTrialState("already_answered");
        setLoading(false);
        return;
      }

      if (res.status === 429) {
        const body = await res.json();
        if (body.error === "daily_cap") {
          setTrialState("daily_cap");
        } else {
          setTrialState("trial_exhausted");
        }
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(t("unexpectedError"));
        setLoading(false);
        return;
      }

      const body = await res.json();
      setFeedback(body.feedback);
    } catch {
      setError(t("unexpectedError"));
    } finally {
      setLoading(false);
    }
  }

  // Trial-exhausted state
  if (trialState === "trial_exhausted") {
    return (
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-8 text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="text-xl font-bold text-amber-800 dark:text-amber-200 mb-2">
          {t("trialExhausted")}
        </h3>
        <p className="text-amber-700 dark:text-amber-300 text-sm">
          {t("trialExhaustedDesc")}
        </p>
      </div>
    );
  }

  // Daily cap state
  if (trialState === "daily_cap") {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div className="text-4xl mb-4">⏳</div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          {t("dailyCap")}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {t("dailyCapDesc")}
        </p>
      </div>
    );
  }

  // Session already answered (409 — duplicate or race)
  if (trialState === "already_answered") {
    return (
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-8 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-amber-800 dark:text-amber-200 mb-2">
          {t("alreadyAnswered")}
        </h3>
        <p className="text-amber-700 dark:text-amber-300 text-sm mb-4">
          {t("alreadyAnsweredDesc")}
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-bold text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
        >
          {t("startNewSession")}
        </Link>
      </div>
    );
  }

  // Trial cookie not found (403)
  if (trialState === "trial_required") {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 p-8 text-center">
        <div className="text-4xl mb-4">🔑</div>
        <p className="text-red-700 dark:text-red-300 text-sm mb-4">
          {t("trialRequired")}
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-bold text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
        >
          {t("startNewSession")}
        </Link>
      </div>
    );
  }

  // Feedback already received
  if (feedback) {
    return <FeedbackResult feedback={feedback} />;
  }

  // Answer form
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          role="alert"
          className="p-4 text-sm text-red-700 bg-red-50 border-l-4 border-red-600 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-500"
        >
          {error}
        </div>
      )}

      <div className="relative">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={t("answerPlaceholder")}
          rows={8}
          maxLength={MAX_CHARS}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition"
        />
        <div
          className={`absolute bottom-3 right-3 text-xs font-medium transition-colors ${
            charCount > MAX_CHARS
              ? "text-red-500"
              : charCount < MIN_CHARS
                ? "text-gray-400"
                : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {charCount < MIN_CHARS
            ? t("charMin")
            : `${charCount} / ${MAX_CHARS}`}
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-base font-bold text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {t("submittingAnswer")}
          </span>
        ) : (
          t("submitAnswer")
        )}
      </button>
    </form>
  );
}
