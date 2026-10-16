import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'neutral'
  | 'navy'
  | 'emerald'
  | 'amber'
  | 'danger'
  | 'simulation';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

/**
 * Komponen Badge untuk menampilkan label status, kategori, atau penanda data simulasi.
 * Sesuai kriteria kepatuhan AC-SYS-03.2, varian 'simulation' wajib kontras dan mudah dikenali.
 */
export function Badge({
  className,
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    'inline-flex items-center font-medium rounded-full select-none transition-colors';

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  const variantStyles: Record<BadgeVariant, string> = {
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    navy: 'bg-brand-navy-50 text-brand-navy-800 border border-brand-navy-200',
    emerald: 'bg-brand-emerald-50 text-brand-emerald-800 border border-brand-emerald-200',
    amber: 'bg-brand-amber-50 text-brand-amber-800 border border-brand-amber-200',
    danger: 'bg-brand-danger-50 text-brand-danger-800 border border-brand-danger-200',
    simulation:
      'bg-amber-100/90 text-amber-900 border border-amber-300 font-semibold tracking-wide shadow-xs',
  };

  const dotColors: Record<BadgeVariant, string> = {
    neutral: 'bg-slate-400',
    navy: 'bg-brand-navy-600',
    emerald: 'bg-brand-emerald-600',
    amber: 'bg-brand-amber-600',
    danger: 'bg-brand-danger-600',
    simulation: 'bg-amber-600 animate-pulse',
  };

  return (
    <span
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {variant === 'simulation' && !children ? 'Data simulasi' : children}
    </span>
  );
}

