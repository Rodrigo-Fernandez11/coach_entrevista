"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";
import CategorySelector from "@/components/CategorySelector";
import LevelSelector from "@/components/LevelSelector";

type Category = "behavioral" | "technical" | "situational" | "";
type Level = "junior" | "mid" | "senior" | "";

export default function StartSessionForm() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = (key: any) => getTranslation(language, key);
  const [category, setCategory] = useState<Category>("");
  const [level, setLevel] = useState<Level>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStartSession(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (level) params.set("level", level);

      // Fetch a question matching the selected filters
      const qRes = await fetch(`/api/questions?${params.toString()}`);
      if (!qRes.ok) {
        const body = await qRes.json();
        setError(body.error ?? t("noQuestionsError"));
        setLoading(false);
        return;
      }
      const { question } = await qRes.json();

      // Create a session via server action
      const sRes = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question.id }),
      });

      if (!sRes.ok) {
        setError(t("failedSessionError"));
        setLoading(false);
        return;
      }

      const { sessionId } = await sRes.json();
      router.push(`/session/${sessionId}`);
    } catch {
      setError(t("unexpectedError"));
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        {t("startNewSession")}
      </h2>

      <form onSubmit={handleStartSession} className="space-y-8">
        {error && (
          <div
            role="alert"
            className="p-4 text-sm text-red-700 bg-red-50 border-l-4 border-red-600 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-500 animate-pulse"
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
          {loading ? t("startingButton") : t("startButton")}
        </button>
      </form>
    </div>
  );
}
