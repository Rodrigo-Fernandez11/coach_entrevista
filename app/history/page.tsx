import { cookies } from "next/headers";
import Link from "next/link";
import { prisma } from "@/lib/db/client";
import Header from "@/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "History — Interview Coach",
};

const STATUS_LABELS = {
  pending: "Pending",
  completed: "Completed",
  transcription_failed: "Error",
  feedback_timeout: "Feedback error",
} as const;

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

const CATEGORY_LABELS = {
  behavioral: "Behavioral",
  technical: "Technical",
  situational: "Situational",
} as const;

export default async function HistoryPage() {
  const jar = await cookies();
  const trialId = jar.get("ic_trial_id")?.value;

  const sessions = trialId
    ? await prisma.session.findMany({
        where: { trialId },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          question: {
            select: { text: true, category: true, level: true },
          },
        },
      })
    : [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-line-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Past sessions
            </h2>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              + New session
            </Link>
          </div>

          {sessions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                No sessions yet. Start a new one!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Start a new session →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 capitalize">
                        {CATEGORY_LABELS[s.question.category] ??
                          s.question.category}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 capitalize">
                        {s.question.level}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[s.status] ?? STATUS_COLORS.pending}`}
                      >
                        {STATUS_LABELS[s.status] ?? s.status}
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
                    View →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
