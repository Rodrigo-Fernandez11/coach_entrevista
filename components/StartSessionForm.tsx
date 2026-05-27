"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = "behavioral" | "technical" | "situational" | "";
type Level = "junior" | "mid" | "senior" | "";

export default function StartSessionForm() {
  const router = useRouter();
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
        setError(body.error ?? "No questions match your filters");
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
        setError("Failed to start session. Please try again.");
        setLoading(false);
        return;
      }

      const { sessionId } = await sRes.json();
      router.push(`/session/${sessionId}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Start a new session
      </h2>

      <form onSubmit={handleStartSession} className="space-y-6">
        {error && (
          <div
            role="alert"
            className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
          >
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Question type
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Any type</option>
            <option value="behavioral">Behavioral</option>
            <option value="technical">Technical</option>
            <option value="situational">Situational</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="level"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Experience level
          </label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value as Level)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Any level</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Starting session…" : "Start session →"}
        </button>
      </form>
    </div>
  );
}
