"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useStartSession } from "@/hooks/useStartSession";
import CategorySelector from "@/components/CategorySelector";
import LevelSelector from "@/components/LevelSelector";

type Category = "behavioral" | "technical" | "situational" | "";
type Level = "junior" | "mid" | "senior" | "";

export default function StartSessionForm() {
  const { t } = useTranslation();
  const { loading, error, startSession } = useStartSession();
  const [category, setCategory] = useState<Category>("");
  const [level, setLevel] = useState<Level>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await startSession(category, level);
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        {t("startNewSession")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div
            role="alert"
            className="p-4 text-sm text-red-700 bg-red-50 border-l-4 border-red-600 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-500"
          >
            {error}
          </div>
        )}

        <CategorySelector value={category} onChange={setCategory} />
        <LevelSelector value={level} onChange={setLevel} />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-base font-bold text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
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
              {t("startingButton")}
            </span>
          ) : (
            t("startButton")
          )}
        </button>
      </form>
    </div>
  );
}
