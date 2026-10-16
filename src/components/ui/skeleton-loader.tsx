import React from 'react';
import { cn } from '@/lib/utils';

export type SkeletonVariant = 'text' | 'rectangular' | 'circular';

export interface SkeletonLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
}

/**
 * Komponen SkeletonLoader untuk menangani Loading State (AC-SYS-02.1).
 * Memberikan visual feedback bahwa data sedang dimuat dengan efek pulse yang halus.
 */
export function SkeletonLoader({
  className,
  variant = 'rectangular',
  width,
  height,
  style,
  ...props
}: SkeletonLoaderProps) {
  const variantStyles: Record<SkeletonVariant, string> = {
    text: 'h-4 w-full rounded',
    rectangular: 'rounded-lg w-full',
    circular: 'rounded-full shrink-0',
  };

  const inlineStyles: React.CSSProperties = {
    width,
    height,
    ...style,
  };

  return (
    <div
      role="status"
      aria-label="Memuat konten..."
      className={cn(
        'animate-pulse bg-slate-200',
        variantStyles[variant],
        className
      )}
      style={inlineStyles}
      {...props}
    >
      <span className="sr-only">Memuat...</span>
    </div>
  );
}

/**
 * Komponen pembantu untuk menampilkan kerangka kartu yang sedang dimuat (Loading Card).
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <SkeletonLoader variant="rectangular" className="h-5 w-24 rounded-full" />
        <SkeletonLoader variant="rectangular" className="h-5 w-20 rounded-full" />
      </div>
      <div className="space-y-2">
        <SkeletonLoader variant="text" className="h-6 w-3/4" />
        <SkeletonLoader variant="text" className="h-4 w-full" />
        <SkeletonLoader variant="text" className="h-4 w-5/6" />
      </div>
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <SkeletonLoader variant="text" className="h-4 w-1/3" />
        <SkeletonLoader variant="rectangular" className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

