export const translations = {
  es: {
    title: "Interview Coach",
    subtitle:
      "Practica tus respuestas y obtén retroalimentación impulsada por IA sobre claridad, estructura y cumplimiento de STAR.",
    viewHistory: "Ver sesiones anteriores →",
    startNewSession: "Iniciar una nueva sesión",
    questionType: "Tipo de pregunta",
    experienceLevel: "Nivel de experiencia",
    anyType: "Cualquier tipo",
    behavioral: "Conductual",
    technical: "Técnica",
    situational: "Situacional",
    anyLevel: "Cualquier nivel",
    junior: "Junior",
    mid: "Mid",
    senior: "Senior",
    startButton: "Iniciar sesión →",
    startingButton: "Iniciando sesión…",
    noQuestionsError: "No hay preguntas que coincidan con tus filtros",
    failedSessionError: "No se pudo iniciar la sesión. Intenta de nuevo.",
    unexpectedError: "Algo salió mal. Intenta de nuevo.",
  },
  en: {
    title: "Interview Coach",
    subtitle:
      "Practice your answers and get AI-powered feedback on clarity, structure, and STAR compliance.",
    viewHistory: "View past sessions →",
    startNewSession: "Start a new session",
    questionType: "Question type",
    experienceLevel: "Experience level",
    anyType: "Any type",
    behavioral: "Behavioral",
    technical: "Technical",
    situational: "Situational",
    anyLevel: "Any level",
    junior: "Junior",
    mid: "Mid",
    senior: "Senior",
    startButton: "Start session →",
    startingButton: "Starting session…",
    noQuestionsError: "No questions match your filters",
    failedSessionError: "Failed to start session. Please try again.",
    unexpectedError: "Something went wrong. Please try again.",
  },
};

export type Language = "es" | "en";
export type TranslationKey = keyof typeof translations.en;

export function getTranslation(language: Language, key: TranslationKey): string {
  return translations[language]?.[key] ?? translations.en[key];
}
