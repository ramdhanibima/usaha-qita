'use client';

import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DisclaimerBannerProps {
  className?: string;
  dismissible?: boolean;
}

/**
 * Banner Kepatuhan & Transparansi Etis (AC-SYS-03.1, AC-SYS-03.2).
 * Memberikan penegasan transparan kepada pengguna bahwa Usaha Qita adalah platform edukatif & simulasi mandiri.
 */
export function DisclaimerBanner({
  className,
  dismissible = false,
}: DisclaimerBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-label="Pemberitahuan Kepatuhan Hukum & Etika"
      className={cn(
        'w-full border-b border-amber-200 bg-amber-50/90 text-amber-900 px-4 py-2 text-xs sm:text-xs',
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 sm:px-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
          <p className="leading-snug">
            <strong className="font-semibold">Transparansi Prototipe Demo:</strong> Usaha Qita adalah platform
            prototipe independen edukasi perencanaan usaha mandiri & simulasi data. Usaha Qita{' '}
            <span className="font-semibold underline decoration-amber-400">
              bukan aplikasi perbankan resmi penerbit pinjaman dari PT Bank Rakyat Indonesia (Persero) Tbk
            </span>
            .
          </p>
        </div>

        {dismissible && (
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="inline-flex h-8 w-8 min-h-[32px] min-w-[32px] items-center justify-center rounded text-amber-700 hover:bg-amber-100 hover:text-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 shrink-0"
            aria-label="Tutup pemberitahuan"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

