import { cookies } from "next/headers";
import { prisma } from "@/lib/db/client";
import Header from "@/components/Header";
import HistoryHeader from "@/components/HistoryHeader";
import HistoryContent from "@/components/HistoryContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "History — Interview Coach",
};

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
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <HistoryHeader />
          <HistoryContent sessions={sessions} />
        </div>
      </main>
    </>
  );
}
