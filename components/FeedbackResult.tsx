"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import type { TranslationKey } from "@/lib/translations";

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

interface FeedbackResultProps {
  feedback: FeedbackData;
}

interface ScoreBarProps {
  label: string;
  score: number;
}

function ScoreBar({ label, score }: ScoreBarProps) {
  const pct = (score / 5) * 100;
  const color =
    score >= 4
      ? "bg-emerald-500"
      : score >= 3
        ? "bg-indigo-500"
        : score >= 2
          ? "bg-amber-500"
          : "bg-red-500";

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {score}/5
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function FeedbackResult({ feedback }: FeedbackResultProps) {
  const { t } = useTranslation();

  const scores: Array<{ key: TranslationKey; value: number }> = [
    { key: "clarityScore", value: feedback.clarityScore },
    { key: "structureScore", value: feedback.structureScore },
    { key: "contentScore", value: feedback.contentScore },
    { key: "starCompliance", value: feedback.starCompliance },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
        {t("feedbackTitle")}
      </h3>

      {/* Scores */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        {scores.map(({ key, value }) => (
          <ScoreBar key={key} label={t(key)} score={value} />
        ))}
      </div>

      {/* Evidence */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 mb-2">
          {t("evidenceLabel")}
        </p>
        <blockquote className="text-gray-700 dark:text-gray-300 italic text-sm leading-relaxed">
          &ldquo;{feedback.evidence}&rdquo;
        </blockquote>
      </div>

      {/* Strengths */}
      {feedback.strengths.length > 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-3">
            {t("strengthsLabel")}
          </p>
          <ul className="space-y-2">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="mt-0.5 text-emerald-500">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {feedback.improvements.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-3">
            {t("improvementsLabel")}
          </p>
          <ul className="space-y-2">
            {feedback.improvements.map((imp, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="mt-0.5 text-amber-500">→</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
          {t("summaryLabel")}
        </p>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          {feedback.summary}
        </p>
      </div>
    </div>
  );
}
