# Interview Coach — AI-Powered Interview Practice Platform

Una aplicación web para practicar entrevistas de trabajo con retroalimentación impulsada por IA. Los usuarios responden preguntas, y reciben puntuaciones y sugerencias basadas en el método STAR.

## 🎯 Descripción del Proyecto

**Interview Coach** es una plataforma que ayuda a los candidatos a prepararse para entrevistas de trabajo mediante:

1. **Preguntas variadas** — seleccionar por tipo (behavioral, technical, situational) y nivel (junior, mid, senior)
2. **Grabación de audio** — responder con voz o texto
3. **Transcripción automática** — convertir audio a texto con Whisper API
4. **Evaluación con IA** — análisis STAR y puntuaciones con GPT
5. **Feedback detallado** — claridad, estructura, contenido, cumplimiento STAR, fortalezas y mejoras

---

## 🛠 Stack Tecnológico

| Layer | Tecnología |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Backend** | Next.js API Routes |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma 6.9 |
| **Auth** | Supabase Auth (OAuth) |
| **AI/LLM** | OpenAI (GPT + Whisper) |
| **State Management** | Zustand 5 |
| **Validation** | Zod 3.24 |
| **SDK** | Vercel AI SDK 4.3 |

---

## 📦 Setup & Instalación

### Prerequisitos
- Node.js 18+ (recomendado 20+)
- pnpm (gestor de paquetes)
- Cuenta Supabase
- Cuenta OpenAI con API key

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone <repo>
   cd coach_entrevistas
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**
   Crear `.env.local` (basarse en `.env.example`):
   ```
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
   SUPABASE_SERVICE_ROLE_KEY=xxxx
   
   # Database
   DATABASE_URL=postgresql://...
   DIRECT_URL=postgresql://...
   
   # OpenAI
   OPENAI_API_KEY=sk-...
   ```

4. **Configurar base de datos**
   ```bash
   pnpm db:generate  # Generar cliente Prisma
   pnpm db:migrate   # Ejecutar migraciones
   pnpm db:seed      # Cargar datos iniciales (preguntas)
   ```

5. **Iniciar servidor de desarrollo**
   ```bash
   pnpm dev
   ```
   Abre http://localhost:3000

---

## 📁 Estructura del Proyecto

```
coach_entrevistas/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes (backend)
│   │   ├── questions/       # Questions CRUD (✅ completado)
│   │   │   ├── route.ts     # GET (random), POST (crear)
│   │   │   └── [id]/route.ts # GET, PATCH, DELETE
│   │   ├── sessions/        # Sessions CRUD
│   │   │   └── route.ts     # POST (crear sesión)
│   │   └── answers/         # Answers & feedback (❌ pendiente)
│   │       └── [id]/
│   │           └── feedback/route.ts
│   ├── auth/                # Auth flow
│   │   └── callback/route.ts # OAuth callback
│   ├── page.tsx             # Home (start session)
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   ├── interview/           # Interview flow (❌ pendiente)
│   │   └── [sessionId]/page.tsx
│   ├── feedback/            # Feedback results (❌ pendiente)
│   │   └── [answerId]/page.tsx
│   ├── dashboard/           # Session history (❌ pendiente)
│   │   └── page.tsx
│   ├── layout.tsx           # Root layout
│   ├── error.tsx            # Error boundary
│   └── not-found.tsx        # 404 page
├── components/              # React components
│   └── StartSessionForm.tsx # Form para iniciar sesión
├── lib/                     # Utilidades y helpers
│   ├── db/
│   │   ├── client.ts        # Prisma client singleton
│   │   └── queries.ts       # DB queries reutilizables
│   └── supabase/
│       ├── server.ts        # Supabase server client
│       ├── browser.ts       # Supabase browser client
│       └── storage.ts       # Manejo de archivos (audio)
├── prisma/
│   ├── schema.prisma        # DB schema
│   ├── migrations/          # Historial de migraciones
│   └── seed.ts              # Seed script (preguntas iniciales)
├── public/                  # Archivos estáticos
├── .env.example             # Template de env vars
├── package.json             # Dependencias
├── tsconfig.json            # TypeScript config
├── next.config.ts           # Next.js config
├── tailwind.config.ts       # Tailwind config
└── eslint.config.mjs        # ESLint rules
```

---

## 🗄️ Schema de Base de Datos

### User
```
id: UUID (pk)
email: String (unique)
createdAt: DateTime
lastSessionAt: DateTime?
```

### Question
```
id: UUID (pk)
text: String              # Enunciado de la pregunta
category: Enum           # behavioral | technical | situational
level: Enum              # junior | mid | senior
roleTag: String          # p.ej. "backend", "frontend"
createdAt: DateTime
```

### Session
```
id: UUID (pk)
userId: String (fk)
questionId: String (fk)
status: Enum             # pending | completed | transcription_failed | feedback_timeout
createdAt: DateTime
updatedAt: DateTime
```

### Answer
```
id: UUID (pk)
sessionId: String (fk)
textAnswer: String?      # Respuesta en texto
audioUrl: String?        # URL del archivo de audio
audioPath: String?       # Path local de audio
transcript: String?      # Transcripción de Whisper
duration: Int?           # Duración en segundos
status: Enum             # pending | transcribing | analyzing | done | failed
createdAt: DateTime
updatedAt: DateTime
```

### Feedback
```
id: UUID (pk)
answerId: String (fk, unique)
clarityScore: Int        # 1-5 (qué tan claro fue)
structureScore: Int      # 1-5 (uso del método STAR)
contentScore: Int        # 1-5 (calidad del contenido)
starCompliance: Int      # 1-5 (cumplimiento de STAR)
evidence: String         # Cita del transcript
strengths: String[]      # [fortaleza1, fortaleza2, ...]
improvements: String[]   # [mejora1, mejora2, ...]
summary: String          # Resumen max 280 chars
createdAt: DateTime
```

---

## 🚀 Flujo de la Aplicación

### Usuario nuevo (Sign Up → Session)

```
1. Usuario llega a home (/page.tsx)
   → Si no está autenticado → redirect a /login
   → Si está autenticado → muestra StartSessionForm

2. StartSessionForm
   → Selecciona categoría (behavioral, technical, situational)
   → Selecciona nivel (junior, mid, senior)
   → Click "Start session"
   → GET /api/questions?category=X&level=Y
   → Crea sesión POST /api/sessions { questionId }
   → Redirect a /interview/:sessionId

3. Interview Page (/interview/:sessionId) [❌ PENDIENTE]
   → Muestra la pregunta
   → Controles de grabación de audio
   → Recording → Answer record creado en DB
   → Submit
   → Trigger transcripción + feedback generation

4. Feedback Generation [❌ PENDIENTE]
   → POST /api/answers/:answerId/feedback
   → Whisper API: transcribe audio
   → GPT: analiza STAR, genera scores y feedback
   → Crea Feedback record

5. Results Page (/feedback/:answerId) [❌ PENDIENTE]
   → Muestra transcript
   → Muestra scores (clarity, structure, content, STAR)
   → Muestra strengths y improvements
   → Link a siguiente pregunta o dashboard

6. Dashboard (/dashboard) [❌ PENDIENTE]
   → Lista de sesiones completadas
   → Stats y historial
```

---

## ✅ Tareas Completadas

### ✅ Task #1: Questions API
- [x] GET /api/questions — random con filtros
- [x] POST /api/questions — crear pregunta
- [x] GET /api/questions/:id — obtener por ID
- [x] PATCH /api/questions/:id — actualizar
- [x] DELETE /api/questions/:id — eliminar
- [x] Validación con Zod
- [x] Auth requerida

**Branch:** `feat/questions-api`  
**Commit:** eee8dc0

---

## ❌ Tareas Pendientes (En Orden)

### Task #2: Interview Page UI
**Objetivo:** Crear página `/app/interview/[sessionId]/page.tsx`

**Requirements:**
- Renderizar la pregunta actual
- Mostrar enunciado, categoría, nivel
- Controles de grabación de audio (start, stop, cancel)
- Botón submit respuesta
- Indicador de progreso (pregunta N de M)
- Validar que haya respuesta (audio o texto) antes de submit

**Dependencias:**
- Datos de sesión (questionId, etc.)
- Web Audio API o librería react-microphone
- UI components

**Archivos a modificar/crear:**
- `app/interview/[sessionId]/page.tsx` (nueva)
- `components/AudioRecorder.tsx` (nueva)
- Posible: `lib/hooks/useAudioRecorder.ts` (nueva)

**Wireframe:**
```
┌─────────────────────────────────────────┐
│ Interview Coach                         │
├─────────────────────────────────────────┤
│                                         │
│  Question (2/10)                        │
│  ───────────────────────────────────    │
│                                         │
│  "Tell me about a time when you led  │
│   a project. What was your role?"     │
│                                         │
│  Category: Behavioral | Level: Mid     │
│                                         │
├─────────────────────────────────────────┤
│  [🎙 Start Recording] [Stop] [Cancel]  │
│  Recording: 0:45 sec                    │
│                                         │
│  [✓ Submit Answer]                      │
└─────────────────────────────────────────┘
```

---

### Task #3: Audio Recording Integration
**Objetivo:** Capturar audio, guardar en storage, asociar a Answer

**Requirements:**
- Grabar audio con Web Audio API o librería
- Convertir a blob/file
- Upload a Supabase Storage o similar
- Guardar audioUrl/audioPath en Answer record
- Marcar Answer.status = "transcribing"

**Dependencias:**
- Supabase Storage configurado
- CORS policies correctas

**Archivos a modificar/crear:**
- `lib/supabase/storage.ts` (mejorar/completar)
- `components/AudioRecorder.tsx` (implementar upload)

---

### Task #4: AI Feedback Generation
**Objetivo:** Crear endpoint `/api/answers/:id/feedback`

**Requirements:**
- Transcribir audio con Whisper API
- Analizar transcript con GPT:
  - Extraer estructura STAR (Situation, Task, Action, Result)
  - Puntuaciones 1-5 (clarity, structure, content, STAR compliance)
  - Fortalezas y mejoras
  - Cita de evidence (extracto del transcript)
  - Resumen max 280 caracteres
- Crear record Feedback
- Actualizar Answer.status = "done"

**Dependencias:**
- OpenAI API key
- Prompt engineering para análisis STAR

**Archivos a crear:**
- `app/api/answers/[id]/feedback/route.ts` (nueva)
- Posible: `lib/ai/feedback.ts` (nueva, con prompts)

---

### Task #5: Feedback Results Page
**Objetivo:** Crear página `/app/feedback/[answerId]/page.tsx`

**Requirements:**
- Mostrar transcript de la respuesta
- Display scores (clarity, structure, content, STAR) con visualización (badges, barras)
- Lista de fortalezas
- Lista de mejoras/suggestions
- Resumen (280 chars)
- Botones: "Next Question" | "Back to Dashboard"

**Archivos a crear:**
- `app/feedback/[answerId]/page.tsx` (nueva)
- `components/FeedbackCard.tsx` (nueva)
- `components/ScoreDisplay.tsx` (nueva)

---

### Task #6: Sessions Dashboard
**Objetivo:** Crear página `/app/dashboard/page.tsx`

**Requirements:**
- Listar todas las sesiones del usuario (últimas 20)
- Por cada sesión:
  - Pregunta (texto, categoría, nivel)
  - Fecha
  - Status (pendiente, completada, falló)
  - Respuesta corta / resumen
  - Feedback scores si existe
- Filtros: por categoría, por fecha, por estado
- Link para reanudar o ver feedback

**Archivos a crear:**
- `app/dashboard/page.tsx` (nueva)
- `components/SessionCard.tsx` (nueva)
- `components/SessionFilter.tsx` (nueva)

---

## 🔄 Workflow Profesional

### Ramas
Usamos **feature branches** con naming convencional:

```
main
└── feat/questions-api ✅
└── feat/interview-page (próximo)
└── feat/audio-recording
└── feat/ai-feedback
└── feat/feedback-page
└── feat/dashboard
```

### Commits
Conventional Commits:
- `feat:` — nueva funcionalidad
- `fix:` — bug fix
- `refactor:` — cambios sin alterar comportamiento
- `chore:` — configuración, deps
- `docs:` — documentación

**Ejemplo:**
```
feat: implement interview page UI with audio controls
fix: handle missing transcript in feedback generation
refactor: extract AudioRecorder to separate component
```

### Pull Requests
Antes de mergear a main:
1. Code review (si hay team)
2. Tests pasando
3. Cambios destructivos documentados

---

## 🧪 Testing

**Pendiente:** Setup de tests (Vitest, Playwright)

Por ahora, testing manual:
```bash
pnpm dev
# Abrir http://localhost:3000
# Testear flujo completo
```

---

## 🔐 Seguridad & Consideraciones

- ✅ Auth requerida en todos los endpoints
- ✅ CORS configurado en Supabase
- ✅ API keys en `.env.local` (nunca commitear)
- ✅ Validación con Zod
- ⚠️ TODO: Rate limiting en endpoints de IA (evitar spam)
- ⚠️ TODO: Validar ownership de sesiones antes de feedback

---

## 📊 Métricas & Observabilidad

**Monitoreo básico:**
- Errores de transcripción
- Latencia de GPT
- Sesiones completadas vs. abandonadas

**Pendiente:** Setup de logging/monitoring (LogRocket, Sentry, etc.)

---

## 🤝 Contribución & Próximos Pasos

1. **Completar Task #2** — Interview Page
2. **Completar Task #3** — Audio Recording
3. **Completar Task #4** — AI Feedback
4. **Completar Task #5** — Feedback Page
5. **Completar Task #6** — Dashboard
6. **Setup de tests** — E2E y unit tests
7. **Optimización** — Caché, lazy loading, SSR
8. **Despliegue** — Vercel + Supabase

---

## 📚 Recursos Útiles

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [OpenAI API](https://platform.openai.com/docs)
- [Tailwind CSS 4](https://tailwindcss.com/docs)
- [Zod Validation](https://zod.dev)

---

## ❓ FAQ

**P: ¿Cómo agrego más preguntas a la base de datos?**  
R: Edita `prisma/seed.ts` y ejecuta `pnpm db:seed`

**P: ¿Cómo reseteo la base de datos?**  
R: `pnpm db:migrate reset` (cuidado: borra todo)

**P: ¿Dónde se guardan los archivos de audio?**  
R: En Supabase Storage (configurado en `lib/supabase/storage.ts`)

**P: ¿Qué sucede si falla la transcripción?**  
R: Answer.status = "failed", error se guarda en logs

---

## 📞 Soporte

Para preguntas o issues, abre un PR o issue en el repo.

---

**Última actualización:** Mayo 2026  
**Mantenedor:** Rodrigo
