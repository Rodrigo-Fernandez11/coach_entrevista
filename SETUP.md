# Guía de configuración — Interview Coach

## Requisitos previos

- Node.js 20+
- pnpm 9+
- Cuenta en [Supabase](https://supabase.com) (gratis)
- Cuenta en [OpenAI](https://platform.openai.com) (necesitás crédito)

---

## Pasos

### 1. Crear proyecto en Supabase

1. Ingresá a [supabase.com](https://supabase.com) y creá un proyecto nuevo.
2. Esperá a que termine el provisioning (~2 min).
3. Anotá:
   - **Project URL**: `Project Settings → API → URL`
   - **Service Role Key**: `Project Settings → API → service_role` (secreta)
   - **DATABASE_URL** (pooled): `Project Settings → Database → Connection pooling → Transaction mode → URI` (puerto **6543**)
   - **DIRECT_URL**: `Project Settings → Database → Connection string → URI` (puerto **5432**)

### 2. Obtener API Key de OpenAI

1. Ingresá a [platform.openai.com/api-keys](https://platform.openai.com/api-keys).
2. Creá una nueva clave.
3. **Importante**: antes de usarla en producción, configurá un límite de gasto mensual en `Billing → Usage limits`. El modelo usado es `gpt-4o-mini` (muy económico), pero un límite de USD 5–10/mes es una red de seguridad recomendada.

### 3. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Abrí `.env.local` y completá todos los valores. Ver la tabla de variables de costo a continuación.

### 4. Instalar dependencias

```bash
pnpm install
```

### 5. Ejecutar las migraciones de base de datos

> **Si la DB está disponible** (ya configuraste DATABASE_URL y DIRECT_URL):
```bash
pnpm db:migrate
```

> **Si la DB todavía no está disponible**: el archivo de migración ya está en `prisma/migrations/20260612000001_add_trial_usage/migration.sql`. Ejecutá `pnpm db:migrate` cuando la base de datos esté lista.

### 6. Cargar preguntas de ejemplo

```bash
pnpm db:seed
```

### 7. Iniciar el servidor de desarrollo

```bash
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000).

---

## Variables de protección de costos

| Variable | Default | Descripción |
|---|---|---|
| `TRIAL_MAX_FEEDBACK` | `1` | Máximo de análisis de IA por cookie de trial. Con `1`, cada visitante obtiene un análisis gratuito. |
| `DAILY_FEEDBACK_CAP` | `50` | Límite diario global de análisis de IA (todos los usuarios combinados). Actúa como freno de gasto. |
| `IP_HASH_SALT` | `""` | Salt para el hash de IPs. Generá uno con `openssl rand -hex 32` antes de deployar. |

### ¿Por qué estas variables importan?

- **`TRIAL_MAX_FEEDBACK`**: evita que un mismo usuario consuma múltiples llamadas a OpenAI. Se verifica tanto por cookie como por IP hasheada.
- **`DAILY_FEEDBACK_CAP`**: freno absoluto de servidor. Si se alcanza, todos los usuarios reciben "servicio temporalmente no disponible" hasta el día siguiente.
- **`IP_HASH_SALT`**: nunca se almacena la IP real. Solo un hash SHA-256 irreversible.

---

## Notas adicionales

- El rate limiting en memoria (`lib/security/rate-limit.ts`) es por instancia. En un entorno serverless con múltiples instancias, el límite efectivo es `limit × instancias`. El `DAILY_FEEDBACK_CAP` de base de datos es el guardián de costos definitivo.
- Para producción, considera usar Redis para rate limiting distribuido.
- `pnpm prisma generate` puede fallar con error `EPERM` si el servidor de desarrollo está corriendo. Detené `pnpm dev` primero y ejecutá `pnpm prisma generate` nuevamente.
