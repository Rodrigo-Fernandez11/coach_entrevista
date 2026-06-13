export const translations = {
  es: {
    // Home
    title: "Interview Coach",
    subtitle:
      "Practicá tus respuestas y recibí feedback con IA sobre claridad, estructura y método STAR.",
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
    startingButton: "Iniciando…",
    noQuestionsError: "No hay preguntas que coincidan con tus filtros",
    failedSessionError: "No se pudo iniciar la sesión. Intentá de nuevo.",
    unexpectedError: "Algo salió mal. Intentá de nuevo.",
    // How it works strip
    howItWorksTitle: "¿Cómo funciona?",
    howItWorksStep1: "Elegí una pregunta",
    howItWorksStep1Desc: "Filtrá por tipo y nivel",
    howItWorksStep2: "Respondé",
    howItWorksStep2Desc: "Escribí tu respuesta STAR",
    howItWorksStep3: "Recibí feedback",
    howItWorksStep3Desc: "IA analiza tu respuesta",
    freeTrialBadge: "1 análisis gratuito",
    // Session page
    sessionTitle: "Tu pregunta",
    categoryLabel: "Categoría",
    levelLabel: "Nivel",
    answerPlaceholder:
      "Escribí tu respuesta usando el método STAR (Situación, Tarea, Acción, Resultado)...",
    charCounter: "{{count}} / 2000 caracteres",
    charMin: "Mínimo 20 caracteres",
    submitAnswer: "Obtener feedback →",
    submittingAnswer: "Analizando…",
    // Feedback result
    feedbackTitle: "Tu feedback",
    clarityScore: "Claridad",
    structureScore: "Estructura",
    contentScore: "Contenido",
    starCompliance: "Método STAR",
    evidenceLabel: "Evidencia",
    strengthsLabel: "Fortalezas",
    improvementsLabel: "Áreas de mejora",
    summaryLabel: "Resumen",
    // Trial states
    trialExhausted: "Ya usaste tu análisis gratuito",
    trialExhaustedDesc:
      "Cada cuenta tiene un análisis gratuito. Volvé mañana o registrate para más.",
    dailyCap: "Servicio temporalmente no disponible",
    dailyCapDesc: "Límite diario alcanzado. Volvé mañana para más análisis.",
    alreadyAnswered: "Esta sesión ya tiene una respuesta",
    alreadyAnsweredDesc:
      "Ya se generó un análisis para esta sesión. Iniciá una nueva sesión desde la página principal.",
    trialRequired: "Tu sesión de prueba no fue encontrada. Por favor iniciá una nueva sesión desde la página principal.",
    // History page
    historyTitle: "Sesiones anteriores",
    historyEmpty: "Todavía no tenés sesiones. ¡Empezá una nueva!",
    historyStartNew: "Iniciar nueva sesión →",
    historyStatus: "Estado",
    historyDate: "Fecha",
    historyQuestion: "Pregunta",
    historyViewSession: "Ver →",
    statusPending: "Pendiente",
    statusCompleted: "Completado",
    statusFeedbackTimeout: "Error de feedback",
    statusTranscriptionFailed: "Error",
    // Error page
    errorTitle: "Algo salió mal",
    errorDesc: "Ocurrió un error inesperado. Por favor, intentá de nuevo.",
    errorRetry: "Intentar de nuevo",
  },
  en: {
    // Home
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
    startingButton: "Starting…",
    noQuestionsError: "No questions match your filters",
    failedSessionError: "Failed to start session. Please try again.",
    unexpectedError: "Something went wrong. Please try again.",
    // How it works strip
    howItWorksTitle: "How it works",
    howItWorksStep1: "Pick a question",
    howItWorksStep1Desc: "Filter by type and level",
    howItWorksStep2: "Answer",
    howItWorksStep2Desc: "Write your STAR answer",
    howItWorksStep3: "Get feedback",
    howItWorksStep3Desc: "AI analyzes your response",
    freeTrialBadge: "1 free analysis",
    // Session page
    sessionTitle: "Your question",
    categoryLabel: "Category",
    levelLabel: "Level",
    answerPlaceholder:
      "Write your answer using the STAR method (Situation, Task, Action, Result)...",
    charCounter: "{{count}} / 2000 characters",
    charMin: "Minimum 20 characters",
    submitAnswer: "Get feedback →",
    submittingAnswer: "Analyzing…",
    // Feedback result
    feedbackTitle: "Your feedback",
    clarityScore: "Clarity",
    structureScore: "Structure",
    contentScore: "Content",
    starCompliance: "STAR Method",
    evidenceLabel: "Evidence",
    strengthsLabel: "Strengths",
    improvementsLabel: "Areas to improve",
    summaryLabel: "Summary",
    // Trial states
    trialExhausted: "You've used your free analysis",
    trialExhaustedDesc:
      "Each account gets one free analysis. Come back tomorrow or sign up for more.",
    dailyCap: "Service temporarily unavailable",
    dailyCapDesc: "Daily limit reached. Come back tomorrow for more analyses.",
    alreadyAnswered: "This session already has an answer",
    alreadyAnsweredDesc:
      "An analysis was already generated for this session. Start a new session from the home page.",
    trialRequired: "Your trial session was not found. Please start a new session from the home page.",
    // History page
    historyTitle: "Past sessions",
    historyEmpty: "No sessions yet. Start a new one!",
    historyStartNew: "Start a new session →",
    historyStatus: "Status",
    historyDate: "Date",
    historyQuestion: "Question",
    historyViewSession: "View →",
    statusPending: "Pending",
    statusCompleted: "Completed",
    statusFeedbackTimeout: "Feedback error",
    statusTranscriptionFailed: "Error",
    // Error page
    errorTitle: "Something went wrong",
    errorDesc: "An unexpected error occurred. Please try again.",
    errorRetry: "Try again",
  },
};

export type Language = "es" | "en";
export type TranslationKey = keyof typeof translations.en;

export function getTranslation(language: Language, key: TranslationKey): string {
  return translations[language]?.[key] ?? translations.en[key];
}
