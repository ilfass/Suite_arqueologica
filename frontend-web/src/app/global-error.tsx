'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <div className="text-6xl mb-4">💥</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Error Crítico
            </h1>
            <p className="text-gray-600 mb-6">
              Ha ocurrido un error crítico en la aplicación.
            </p>
            <button
              onClick={reset}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reiniciar aplicación
            </button>
          </div>
        </div>
      </body>
    </html>
  );
} 