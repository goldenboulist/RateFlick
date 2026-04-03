import type { ThemeId } from "../../types";
import { IconChevronDown, IconPalette } from "../icons";

const themes: { id: ThemeId; label: string }[] = [
  { id: "dark", label: "Sombre" },
  { id: "light", label: "Clair" },
  { id: "red", label: "Rose" },
  { id: "purple", label: "Violet" },
  { id: "forest", label: "Forêt" },
  { id: "gold", label: "Ambre" },
  { id: "ocean", label: "Océan" },
  { id: "coral-reef", label: "Reef Corail" },
  { id: "warm-sunset", label: "Coucher de Soleil" },
];

interface ThemeSelectorProps {
  value: ThemeId;
  onChange: (t: ThemeId, event?: React.MouseEvent) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <div className="relative flex min-w-[200px] items-center gap-2">
      <span className="text-[var(--muted)] transition hover:scale-110 hover:text-[var(--accent)]" aria-hidden>
        <IconPalette size={18} />
      </span>
      <div className="group relative flex-1">
        <select
          value={value}
          onChange={(e) => {
            const event = (e.target as any)._themeChangeEvent;
            onChange(e.target.value as ThemeId, event);
          }}
          onMouseDown={(e) => {
            // Store the mouse down event for position tracking
            (e.target as any)._themeChangeEvent = e;
          }}
          className="interactive w-full cursor-pointer appearance-none rounded-xl border border-[var(--border)] bg-[var(--card)] py-2.5 pl-3 pr-10 text-sm text-[var(--fg)] shadow-sm hover:border-[var(--accent)]/30 hover:shadow-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
          aria-label="Thème"
        >
          {themes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] transition group-hover:text-[var(--fg)]"
          aria-hidden
        >
          <IconChevronDown size={18} />
        </span>
      </div>
    </div>
  );
}
