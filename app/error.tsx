"use client";
// usamos use cluent por que este componente se renderiza en el cliente, no en el servidor, y necesitamos usar hooks como useEffect para manejar los errores de manera adecuada.
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }; // el error puede tener una propiedad digest opcional que proporciona información adicional sobre el error.
  reset: () => void; // reset es una función que se llama para restablecer el estado de error y permitir que el usuario intente nuevamente.
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
