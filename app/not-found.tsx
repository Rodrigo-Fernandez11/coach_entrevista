// aca definimos el componente que se renderiza cuando el usuario navega a una ruta que no existe en la aplicación. Este componente muestra un mensaje de error 404 y un enlace para volver a la página de inicio.
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}

// usamos  min-h-screen para asegurarnos de que el contenido ocupe al menos la altura completa de la pantalla, flex para centrar el contenido tanto vertical como horizontalmente, y bg-gray-50 y dark:bg-gray-900 para proporcionar un fondo claro u oscuro según el tema del usuario. El texto se estiliza con clases como text-4xl para el tamaño del título, text-lg para el mensaje, y text-gray-600 o text-gray-400 para el color del texto dependiendo del tema. El enlace de regreso a la página de inicio se estiliza con clases que le dan un fondo azul, texto blanco, y un efecto hover para mejorar la experiencia del usuario.