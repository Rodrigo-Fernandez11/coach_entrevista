"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { useHydrated } from "@/lib/hooks/useHydrated";

type Level = "junior" | "mid" | "senior" | "";

interface LevelSelectorProps {
  value: Level;
  onChange: (value: Level) => void;
}

const levels: Array<{ value: Level; translationKey: "anyLevel" | "junior" | "mid" | "senior" }> = [
  { value: "", translationKey: "anyLevel" },
  { value: "junior", translationKey: "junior" },
  { value: "mid", translationKey: "mid" },
  { value: "senior", translationKey: "senior" },
];

export default function LevelSelector({ value, onChange }: LevelSelectorProps) {
  const { t } = useTranslation();
  const hydrated = useHydrated();

  if (!hydrated) {
    return <div />;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {t("experienceLevel")}
      </label>
      <div className="grid grid-cols-4 gap-2">
        {levels.map((lvl) => (
          <button
            key={lvl.value || "any"}
            type="button"
            onClick={() => onChange(lvl.value)}
            className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
              value === lvl.value
                ? "bg-indigo-600 text-white shadow-lg scale-105"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {t(lvl.translationKey)}
          </button>
        ))}
      </div>
    </div>
  );
}
