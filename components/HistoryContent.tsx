"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useHydrated } from "@/lib/hooks/useHydrated";

const STATUS_COLORS = {
  pending:
    "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  transcription_failed:
    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  feedback_timeout:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
} as const;

interface Session {
  id: string;
  status: "pending" | "completed" | "transcription_failed" | "feedback_timeout";
  createdAt: Date;
  question: {
    text: string;
    category: string;
    level: string;
  };
}

interface HistoryContentProps {
  sessions: Session[];
}

export default function HistoryContent({ sessions }: HistoryContentProps) {
  const { t } = useTranslation();
  const hydrated = useHydrated();

  const statusLabels = {
    pending: t("statusPending"),
    completed: t("statusCompleted"),
    transcription_failed: t("statusTranscriptionFailed"),
    feedback_timeout: t("statusFeedbackTimeout"),
  } as const;

  const categoryLabels: Record<string, string> = {
    behavioral: t("behavioral"),
    technical: t("technical"),
    situational: t("situational"),
  };

  if (!hydrated) {
    return <div className="space-y-4" />;
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
        <div className="text-5xl mb-4">📋</div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t("historyEmpty")}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold hover:from-indigo-700 hover:to-purple-700 transition-all"
        >
          {t("historyStartNew")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((s) => (
        <div
          key={s.id}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col sm:flex-row sm:items-center gap-4"
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 capitalize">
                {categoryLabels[s.question.category] ?? s.question.category}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 capitalize">
                {s.question.level}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                  STATUS_COLORS[s.status] ?? STATUS_COLORS.pending
                }`}
              >
                {statusLabels[s.status] ?? s.status}
              </span>
            </div>
            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium truncate">
              {s.question.text}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {new Date(s.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <Link
            href={`/session/${s.id}`}
            className="shrink-0 inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 text-sm font-semibold transition-colors"
          >
            {t("historyViewSession")}
          </Link>
        </div>
      ))}
    </div>
  );
}
