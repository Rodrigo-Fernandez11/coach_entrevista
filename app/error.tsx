"use client";

import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorContent reset={reset} />;
}

function ErrorContent({ reset }: { reset: () => void }) {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t("errorTitle")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t("errorDesc")}
        </p>
        <button
          onClick={reset}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          {t("errorRetry")}
        </button>
      </div>
    </main>
  );
}
