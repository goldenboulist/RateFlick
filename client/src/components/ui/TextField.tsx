import { forwardRef } from "react";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, error, id, className, ...rest }, ref) {
    return (
      <div className={className}>
        <label htmlFor={id} className="mb-1 block text-sm text-[var(--muted)]">
          {label}
        </label>
        <div className="interactive flex min-h-[44px] items-center rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 shadow-sm hover:border-[var(--muted)]/40 hover:shadow-md focus-within:border-transparent focus-within:ring-2 focus-within:ring-[var(--ring)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg)]">
          <input
            id={id}
            ref={ref}
            className="min-w-0 flex-1 border-0 bg-transparent py-2.5 text-[var(--fg)] outline-none placeholder:text-[var(--muted)]"
            {...rest}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
