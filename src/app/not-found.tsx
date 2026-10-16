import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl font-bold text-slate-700">
        404
      </div>
      <h1 className="mt-4 text-xl font-bold text-slate-900 sm:text-2xl">Halaman Tidak Ditemukan</h1>
      <p className="mt-2 text-sm text-slate-600">
        Halaman yang Anda tuju belum tersedia atau telah berpindah alamat.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-lg bg-brand-navy-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-navy-700"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}

