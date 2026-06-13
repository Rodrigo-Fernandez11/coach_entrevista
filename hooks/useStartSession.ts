"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";

type Category = "behavioral" | "technical" | "situational" | "";
type Level = "junior" | "mid" | "senior" | "";

interface UseStartSessionReturn {
  loading: boolean;
  error: string | null;
  startSession: (category: Category, level: Level) => Promise<void>;
}

export function useStartSession(): UseStartSessionReturn {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startSession(
    category: Category,
    level: Level
  ): Promise<void> {
    setError(null);
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (level) params.set("level", level);

      const qRes = await fetch(`/api/questions?${params.toString()}`);
      if (!qRes.ok) {
        const body = await qRes.json();
        setError((body as { error?: string }).error ?? t("noQuestionsError"));
        return;
      }

      const { question } = (await qRes.json()) as { question: { id: string } };

      const sRes = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question.id }),
      });

      if (!sRes.ok) {
        setError(t("failedSessionError"));
        return;
      }

      const { sessionId } = (await sRes.json()) as { sessionId: string };
      router.push(`/session/${sessionId}`);
    } catch {
      setError(t("unexpectedError"));
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, startSession };
}
