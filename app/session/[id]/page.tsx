import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/client";
import Header from "@/components/Header";
import AnswerForm from "@/components/AnswerForm";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Session — Interview Coach",
};

const CATEGORY_LABELS: Record<string, string> = {
  behavioral: "Behavioral",
  technical: "Technical",
  situational: "Situational",
};

const LEVEL_LABELS: Record<string, string> = {
  junior: "Junior",
  mid: "Mid",
  senior: "Senior",
};

export default async function SessionPage({ params }: Props) {
  const { id } = await params;

  const session = await prisma.session.findUnique({
    where: { id },
    include: {
      question: true,
    },
  });

  if (!session) {
    notFound();
  }

  // Ownership check: if this session was created for a specific trial cookie,
  // ensure the current visitor's cookie matches — prevents session enumeration.
  // Null trialId means a legacy/authenticated row; allow those through.
  if (session.trialId !== null) {
    const jar = await cookies();
    const visitorTrialId = jar.get("ic_trial_id")?.value ?? null;
    if (visitorTrialId !== session.trialId) {
      notFound();
    }
  }

  const { question } = session;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="mx-auto max-w-3xl px-4 py-12">
          {/* Question card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 capitalize">
                {CATEGORY_LABELS[question.category] ?? question.category}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 capitalize">
                {LEVEL_LABELS[question.level] ?? question.level}
              </span>
            </div>
            <p className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed">
              {question.text}
            </p>
          </div>

          {/* Answer form + feedback (client component) */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <AnswerForm sessionId={session.id} />
          </div>
        </div>
      </main>
    </>
  );
}
