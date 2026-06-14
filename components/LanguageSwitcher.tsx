"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useHydrated } from "@/lib/hooks/useHydrated";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div className="inline-flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <button className="px-3 py-1.5 rounded-md text-sm font-semibold text-gray-600 dark:text-gray-400 w-8" />
        <button className="px-3 py-1.5 rounded-md text-sm font-semibold text-gray-600 dark:text-gray-400 w-8" />
      </div>
    );
  }

  return (
    <div className="inline-flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setLanguage("es")}
        className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
          language === "es"
            ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        }`}
      >
        ES
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
          language === "en"
            ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        }`}
      >
        EN
      </button>
    </div>
  );
}
