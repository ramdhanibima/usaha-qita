import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar, Footer, DisclaimerBanner } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Usaha Qita — Prototipe Perencana Usaha & Simulasi Mandiri UMKM',
  description:
    'Platform prototipe independen edukasi & simulasi perencanaan usaha mandiri untuk calon wirausaha dan UMKM Indonesia dengan matematika finansial deterministik.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased selection:bg-brand-navy-100 selection:text-brand-navy-900">
        {/* Banner Penegasan Kepatuhan & Transparansi Simulasi */}
        <DisclaimerBanner />

        {/* Header Navigasi Global (Desktop & Mobile Drawer) */}
        <Navbar />

        {/* Konten Halaman Utama */}
        <main className="flex-1">{children}</main>

        {/* Footer Kepatuhan Etis & Transparansi Simulasi */}
        <Footer />
      </body>
    </html>
  );
}
