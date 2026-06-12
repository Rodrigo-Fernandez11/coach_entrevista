"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLanguage("es")}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          language === "es"
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        }`}
      >
        Español
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          language === "en"
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        }`}
      >
        English
      </button>
    </div>
  );
}
