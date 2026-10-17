'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Compass, BarChart3, CheckSquare, MessageSquare, LayoutDashboard, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Beranda', href: '/', icon: Compass },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Peluang Usaha', href: '/opportunities', icon: Compass },
  { label: 'Kalkulator BEP', href: '/calculator', icon: BarChart3 },
  { label: 'Roadmap', href: '/roadmap', icon: CheckSquare },
  { label: 'Konsultasi Mantri', href: '/consultation', icon: MessageSquare },
];

/**
 * Komponen Navigasi Utama Aplikasi Usaha Qita (AC-SYS-04.1).
 * Mendukung navigasi desktop horizontal dan mobile drawer vertikal responsif
 * dengan touch target minimal 44x44px.
 */
export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Menutup drawer saat rute berpindah
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Kunci scroll saat mobile menu terbuka
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy-600 rounded-lg p-1"
          aria-label="Usaha Qita — Halaman Utama"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy-600 font-extrabold text-white shadow-sm transition-transform group-hover:scale-105">
            UQ
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-brand-navy-900 leading-none">
              Usaha Qita
            </span>
            <span className="text-[11px] font-semibold text-brand-navy-600 tracking-tight leading-tight mt-0.5">
              Prototipe Independen UMKM
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Link (>= 768px) */}
        <nav
          className="hidden md:flex md:items-center md:gap-1 lg:gap-2"
          aria-label="Navigasi Utama"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors min-h-[44px]',
                  isActive
                    ? 'bg-brand-navy-50 text-brand-navy-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button (Desktop) & Hamburger Button (Mobile) */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <Link href="/onboarding">
              <Button size="sm" variant="primary" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                Mulai Rencana
              </Button>
            </Link>
          </div>

          {/* Tombol Hamburger Mobile (< 768px) dengan touch target min 44x44px */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex md:hidden h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy-600"
            aria-label={mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (< 768px) */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col bg-white/95 backdrop-blur-md md:hidden border-t border-slate-200 overflow-y-auto animate-in slide-in-from-top-2 duration-200"
        >
          <div className="px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors min-h-[44px]',
                    isActive
                      ? 'bg-brand-navy-50 text-brand-navy-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5',
                      isActive ? 'text-brand-navy-600' : 'text-slate-400'
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-auto p-4 border-t border-slate-100 bg-slate-50">
            <Link href="/onboarding" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button fullWidth variant="primary" size="md">
                Mulai Rencana Usaha
              </Button>
            </Link>
            <p className="mt-3 text-center text-xs text-slate-500">
              Simulasi & Edukasi Wirausaha Mandiri
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

