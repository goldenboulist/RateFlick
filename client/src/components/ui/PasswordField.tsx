import { forwardRef, useState } from "react";
import { IconEye, IconEyeOff } from "../icons";

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField({ label, error, id, className, ...rest }, ref) {
    const [show, setShow] = useState(false);

    return (
      <div className={className}>
        <label htmlFor={id} className="mb-1 block text-sm text-[var(--muted)]">
          {label}
        </label>
        <div className="interactive relative flex min-h-[44px] items-center rounded-xl border border-[var(--border)] bg-[var(--card)] pl-4 pr-12 shadow-sm hover:border-[var(--muted)]/40 hover:shadow-md focus-within:border-transparent focus-within:ring-2 focus-within:ring-[var(--ring)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg)]">
          <input
            id={id}
            ref={ref}
            type={show ? "text" : "password"}
            className="min-w-0 flex-1 border-0 bg-transparent py-2.5 pr-1 text-[var(--fg)] outline-none placeholder:text-[var(--muted)]"
            {...rest}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((s) => !s)}
            className="interactive absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--muted)] hover:scale-110 hover:bg-[var(--accent-soft)] hover:text-[var(--fg)] active:scale-95"
            aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {show ? <IconEyeOff size={20} /> : <IconEye size={20} />}
          </button>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
