import React from 'react';
import { cn } from '@/lib/utils';

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixText?: string;
  suffixText?: string;
  containerClassName?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      prefixText,
      suffixText,
      id,
      required,
      disabled,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = inputId ? `${inputId}-error` : undefined;
    const helperId = inputId ? `${inputId}-helper` : undefined;

    return (
      <div className={cn('flex flex-col space-y-1.5 w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center justify-between"
          >
            <span>
              {label} {required && <span className="text-brand-danger-600">*</span>}
            </span>
          </label>
        )}

        <div className="relative flex items-center w-full">
          {prefixText && (
            <span className="absolute left-3 text-xs sm:text-sm font-medium text-slate-500 pointer-events-none select-none">
              {prefixText}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              'w-full h-11 min-h-[44px] rounded-lg border bg-white px-3.5 text-sm text-slate-900 transition-colors',
              'placeholder:text-slate-400',
              'focus:outline-none focus:ring-2 focus:ring-brand-navy-600 focus:border-transparent',
              'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
              error
                ? 'border-brand-danger-600 focus:ring-brand-danger-600'
                : 'border-slate-300 hover:border-slate-400',
              prefixText && 'pl-9 sm:pl-10',
              suffixText && 'pr-12 sm:pr-14',
              className
            )}
            {...props}
          />

          {suffixText && (
            <span className="absolute right-3 text-xs font-medium text-slate-500 pointer-events-none select-none">
              {suffixText}
            </span>
          )}
        </div>

        {error ? (
          <p id={errorId} className="text-xs text-brand-danger-600 font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-slate-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

