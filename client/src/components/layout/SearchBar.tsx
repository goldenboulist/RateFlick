import { IconSearch } from "../icons";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="group relative min-w-[200px] flex-1">
      <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[var(--muted)] transition group-focus-within:text-[var(--accent)]">
        <IconSearch size={20} />
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Rechercher par titre…"}
        className="interactive w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2.5 pl-10 pr-4 text-[var(--fg)] shadow-sm placeholder:text-[var(--muted)] hover:border-[var(--muted)]/50 hover:shadow-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
      />
    </div>
  );
}
