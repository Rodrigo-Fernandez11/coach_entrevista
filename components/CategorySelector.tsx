"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { useHydrated } from "@/lib/hooks/useHydrated";

type Category = "behavioral" | "technical" | "situational" | "";

interface CategorySelectorProps {
  value: Category;
  onChange: (value: Category) => void;
}

const categories: Array<{ value: Category; translationKey: "anyType" | "behavioral" | "technical" | "situational" }> = [
  { value: "", translationKey: "anyType" },
  { value: "behavioral", translationKey: "behavioral" },
  { value: "technical", translationKey: "technical" },
  { value: "situational", translationKey: "situational" },
];

export default function CategorySelector({
  value,
  onChange,
}: CategorySelectorProps) {
  const { t } = useTranslation();
  const hydrated = useHydrated();

  if (!hydrated) {
    return <div />;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {t("questionType")}
      </label>
      <div className="grid grid-cols-2 gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value || "any"}
            type="button"
            onClick={() => onChange(cat.value)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              value === cat.value
                ? "bg-indigo-600 text-white shadow-lg scale-105"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {t(cat.translationKey)}
          </button>
        ))}
      </div>
    </div>
  );
}
