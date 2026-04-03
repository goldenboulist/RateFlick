import { motion } from "framer-motion";
import { ThemeSelector } from "../ui/ThemeSelector";
import type { ThemeId } from "../../types";

interface HeaderProps {
  email: string;
  theme: ThemeId;
  onThemeChange: (t: ThemeId, event?: React.MouseEvent) => void;
  onLogout: () => void;
}

export function Header({ email, theme, onThemeChange, onLogout }: HeaderProps) {
  const initial = email.slice(0, 1).toUpperCase();

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-6"
    >
      <div className="flex items-center gap-3">
        <span className="interactive text-2xl font-bold tracking-tight text-[var(--fg)] hover:opacity-80">
          RateFlick
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <ThemeSelector value={theme} onChange={onThemeChange} />
        <div className="interactive flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] py-1 pl-1 pr-2 shadow-sm hover:border-[var(--muted)]/40 hover:shadow-md">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold shadow-inner transition hover:brightness-110"
            style={{
              background: "var(--accent)",
              color: "var(--on-accent)",
            }}
          >
            {initial}
          </span>
          <span className="max-w-[140px] truncate text-sm text-[var(--muted)]">{email}</span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="interactive rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)] hover:shadow-sm active:translate-y-0"
        >
          Déconnexion
        </button>
      </div>
    </motion.header>
  );
}
