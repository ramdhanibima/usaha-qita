'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Terjadi kesalahan:', error.message);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-danger-50 text-2xl font-bold text-brand-danger-600">
        !
      </div>
      <h1 className="mt-4 text-xl font-bold text-slate-900 sm:text-2xl">Terjadi Kendala Teknis</h1>
      <p className="mt-2 text-sm text-slate-600">
        Mohon maaf, sistem mengalami gangguan saat memuat halaman ini. Silakan coba lagi.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 inline-flex items-center rounded-lg bg-brand-navy-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-navy-700"
      >
        Coba Muat Ulang
      </button>
    </div>
  );
}

