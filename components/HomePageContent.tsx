"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/translations";
import StartSessionForm from "@/components/StartSessionForm";
import Header from "@/components/Header";

export default function HomePageContent() {
  const { language } = useLanguage();
  const t = (key: any) => getTranslation(language, key);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="mx-auto max-w-4xl px-4 py-20">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                ✨ AI-Powered Practice
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
              {t("title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          {/* Form Section */}
          <div className="max-w-2xl mx-auto mb-16">
            <StartSessionForm />
          </div>

          {/* Footer Link */}
          <div className="text-center">
            <a
              href="/history"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition-colors"
            >
              {t("viewHistory")}
              <span className="text-xl">→</span>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
