import type { ReactNode } from "react";

type Variant =
  | "amber"
  | "yellow"
  | "blue"
  | "purple"
  | "gray"
  | "red"
  | "green"
  | "theme";

const solid: Record<Variant, string> = {
  amber: "bg-amber-500 text-white border-amber-600",
  yellow: "bg-yellow-400 text-yellow-950 border-yellow-500",
  blue: "bg-blue-500 text-white border-blue-600",
  purple: "bg-purple-500 text-white border-purple-600",
  gray: "bg-slate-500 text-white border-slate-600",
  red: "bg-red-500 text-white border-red-600",
  green: "bg-emerald-500 text-white border-emerald-600",
  theme: "bg-[var(--accent)] text-[var(--on-accent)] border-[var(--ring)]",
};

const outline: Record<Variant, string> = {
  amber: "border-amber-500/60 text-amber-700 dark:text-amber-300 bg-transparent",
  yellow: "border-yellow-500/60 text-yellow-800 dark:text-yellow-200 bg-transparent",
  blue: "border-blue-500/60 text-blue-700 dark:text-blue-300 bg-transparent",
  purple: "border-purple-500/60 text-purple-700 dark:text-purple-300 bg-transparent",
  gray: "border-slate-400/60 text-slate-600 dark:text-slate-300 bg-transparent",
  red: "border-red-500/60 text-red-700 dark:text-red-300 bg-transparent",
  green: "border-emerald-500/60 text-emerald-700 dark:text-emerald-300 bg-transparent",
  theme: "border-[var(--border)] text-[var(--muted)] bg-transparent hover:text-[var(--fg)]",
};

interface BadgeProps {
  children: ReactNode;
  active?: boolean;
  variant: Variant;
  onClick?: () => void;
}

export function Badge({ children, active, variant, onClick }: BadgeProps) {
  const base =
    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium interactive hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]";
  const style = active ? solid[variant] : outline[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${style} ${onClick ? "cursor-pointer" : ""}`}
    >
      {children}
    </button>
  );
}
