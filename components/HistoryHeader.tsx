"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useHydrated } from "@/lib/hooks/useHydrated";

export default function HistoryHeader() {
  const { t } = useTranslation();
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        {t("historyTitle")}
      </h2>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
      >
        + {t("startNewSession")}
      </Link>
    </div>
  );
}
