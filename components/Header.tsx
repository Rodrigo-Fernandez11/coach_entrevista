"use client";

import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">IC</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Interview Coach
          </h1>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
