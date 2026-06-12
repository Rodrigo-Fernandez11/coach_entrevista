"use client";

import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
