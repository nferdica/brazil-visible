'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h2 className="text-2xl font-bold tracking-tight mb-3">
        Algo deu errado
      </h2>
      <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-md">
        Ocorreu um erro inesperado. Tente recarregar a página.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-neutral-900 dark:bg-white px-6 py-2.5 text-sm font-semibold text-white dark:text-neutral-900 transition-all hover:bg-neutral-700 dark:hover:bg-neutral-200"
      >
        Tentar novamente
      </button>
    </div>
  );
}
