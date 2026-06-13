"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getTranslation, type TranslationKey } from "@/lib/translations";

/**
 * Returns a typed `t` function bound to the current language.
 * Use this hook instead of the copy-pasted `t(key: any)` pattern.
 */
export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: TranslationKey): string => getTranslation(language, key);

  return { t, language };
}
