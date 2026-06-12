"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";
import StartSessionForm from "@/components/StartSessionForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function HomePage() {
  const { language } = useLanguage();
  const t = (key: any) => getTranslation(language, key);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="flex justify-end mb-8">
          <LanguageSwitcher />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            {t("subtitle")}
          </p>
        </div>

        <StartSessionForm />

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <a
            href="/history"
            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            {t("viewHistory")}
          </a>
        </p>
      </div>
    </main>
  );
}
