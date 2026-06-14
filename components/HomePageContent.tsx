"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { useHydrated } from "@/lib/hooks/useHydrated";
import StartSessionForm from "@/components/StartSessionForm";
import Header from "@/components/Header";

const HOW_IT_WORKS_STEPS = [
  { number: "1", titleKey: "howItWorksStep1", descKey: "howItWorksStep1Desc" } as const,
  { number: "2", titleKey: "howItWorksStep2", descKey: "howItWorksStep2Desc" } as const,
  { number: "3", titleKey: "howItWorksStep3", descKey: "howItWorksStep3Desc" } as const,
];

export default function HomePageContent() {
  const { t } = useTranslation();
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="mx-auto max-w-4xl px-4 py-20">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                ✨ AI-Powered Practice
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                🎁 {t("freeTrialBadge")}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
              {t("title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          {/* How it works strip */}
          <div className="mb-12">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-5">
              {t("howItWorksTitle")}
            </p>
            <div className="grid grid-cols-3 gap-4">
              {HOW_IT_WORKS_STEPS.map((step) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center text-center p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm mb-3">
                    {step.number}
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {t(step.titleKey)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t(step.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Section */}
          <div className="max-w-2xl mx-auto mb-12">
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
