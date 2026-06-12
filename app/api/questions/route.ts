// importamos type nextRequest y NextResponse de next/server para manejar las solicitudes y respuestas en este endpoint de la API y usamos type porque estamos definiendo los tipos de los parámetros de consulta que esperamos recibir en las solicitudes GET. Esto nos ayuda a garantizar que los datos que recibimos sean del tipo esperado y facilita el desarrollo al proporcionar autocompletado y verificación de tipos en nuestro código.

// importamos la función getCachedQuestions desde nuestra capa de acceso a datos para obtener preguntas de entrevista basadas en los filtros proporcionados.

// importamos los tipos QuestionCategory y QuestionLevel para definir los tipos de datos que esperamos recibir en los parámetros de consulta.

import { type NextRequest, NextResponse } from "next/server";
import { getCachedQuestions } from "@/lib/db/queries";
import type {
  QuestionCategory,
  QuestionLevel,
} from "@/app/generated/prisma/enums";

// logica: este endpoint maneja las solicitudes GET para obtener preguntas de entrevista basadas en filtros opcionales como categoría, nivel y etiqueta de rol. Si no se encuentran preguntas que coincidan con los filtros, devuelve un error 404. Si se encuentran preguntas, selecciona una al azar y devuelve esa pregunta junto con el total de preguntas que coinciden con los filtros.

// El endpoint POST está deshabilitado y devuelve un error 405 si se intenta usarlo, indicando que las mutaciones de preguntas no están permitidas mientras la aplicación se ejecuta sin autenticación.

//  usamos async/await para manejar las operaciones asíncronas al obtener preguntas de la base de datos, lo que nos permite escribir código más limpio y fácil de entender. También usamos destructuración para extraer los parámetros de consulta de la URL de la solicitud y el operador de propagación para construir el objeto de filtros que se pasa a la función getCachedQuestions.

export async function GET(request: NextRequest) {
  // reques : nextRequest es el objeto que representa la solicitud entrante, que contiene información como la URL, los encabezados, el cuerpo, etc. En este caso, lo usamos para extraer los parámetros de consulta de la URL.

  // guardamos en variables los parámetros de consulta category, level y roleTag que se esperan recibir en la solicitud. Estos parámetros se utilizan para filtrar las preguntas de entrevista que se obtienen de la base de datos.
  // desestructuramos searchParams de la URL de la solicitud que es igual a new URL(request.url) para obtener los parámetros de consulta de la URL. Luego, usamos el método get para extraer los valores de category, level y roleTag de los parámetros de consulta. Si alguno de estos parámetros no está presente en la URL, se asigna null (para category y level) o undefined (para roleTag) respectivamente.
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as QuestionCategory | null;
  const level = searchParams.get("level") as QuestionLevel | null;
  const roleTag = searchParams.get("role") ?? undefined;

  const questions = await getCachedQuestions({
    ...(category && { category }),
    ...(level && { level }),
    ...(roleTag && { roleTag }),
  });

  if (questions.length === 0) {
    return NextResponse.json(
      { error: "No questions match your filters" },
      { status: 404 }
    );
  }

  const question = questions[Math.floor(Math.random() * questions.length)];

  return NextResponse.json({ question, total: questions.length });
}

// logica: este endpoint maneja las solicitudes POST para crear nuevas preguntas de entrevista. Sin embargo, está deshabilitado mientras la aplicación se ejecuta sin autenticación, devolviendo un error 405 para indicar que las mutaciones de preguntas no están permitidas.

export async function POST() {
  return NextResponse.json(
    { error : "Mutaciones de preguntas no permitidas mientras la aplicación se ejecuta sin autenticación" },
    { status : 405 }
  )
}