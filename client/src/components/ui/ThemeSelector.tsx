import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ThemeId } from "../../types";
import { IconChevronDown, IconPalette, IconCheck } from "../icons";

const themes: { id: ThemeId; color: string }[] = [
  { id: "light", color: "#ffffff" },
  { id: "red", color: "#fb7185" },
  { id: "gold", color: "#fbbf24" },
  { id: "forest", color: "#34d399" },
  { id: "ocean", color: "#38bdf8" },
  { id: "purple", color: "#a78bfa" },
  { id: "dark", color: "#111111" },
  { id: "blood-moon", color: "#e63946" },
  { id: "coral-reef", color: "#e94560" },
  { id: "pumpkin-spice", color: "#ea7317" },
  { id: "warm-sunset", color: "#f59e0b" },
  { id: "sand-dune", color: "#d4a853" },
  { id: "neon-noir", color: "#39ff14" },
  { id: "poison-ivy", color: "#84cc16" },
  { id: "bioluminescent", color: "#00ffcc" },
  { id: "arctic-aurora", color: "#00d4aa" },
  { id: "amethyst", color: "#9333ea" },
  { id: "rose-ember", color: "#f472b6" },
];

interface ThemeSelectorProps {
  value: ThemeId;
  onChange: (t: ThemeId, event?: React.MouseEvent) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentTheme = themes.find((t) => t.id === value) || themes[0];

  return (
    <div className="relative flex items-center gap-2" ref={containerRef}>
      <span className="text-[var(--muted)] transition hover:scale-110 hover:text-[var(--accent)]" aria-hidden>
        <IconPalette size={18} />
      </span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="interactive flex min-w-[160px] items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] py-2 pl-3 pr-2 text-sm text-[var(--fg)] shadow-sm hover:border-[var(--accent)]/30 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          aria-label="Changer le thème"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full border border-white/10 shadow-sm"
              style={{ backgroundColor: currentTheme.color }}
            />
            <span className="font-medium">{currentTheme.id}</span>
          </div>
          <IconChevronDown
            size={16}
            className={`text-[var(--muted)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-1.5 shadow-xl backdrop-blur-md"
            >
              <div className="grid grid-cols-1 gap-1" role="listbox">
                {themes.map((t) => (
                  <>
                    {t.id === "dark" ? <div className="border-b border-[var(--border)] my-2" /> : null}
                    <button
                        key={t.id}
                        role="option"
                        aria-selected={value === t.id}
                        onClick={(e) => {
                          onChange(t.id, e as unknown as React.MouseEvent);
                          setIsOpen(false);
                        }}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all hover:bg-[var(--accent-soft)] ${
                          value === t.id ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "text-[var(--fg)]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="h-4 w-4 rounded-full border border-white/10 shadow-sm"
                            style={{ backgroundColor: t.color }}
                          />
                          <span className={value === t.id ? "font-semibold" : "font-medium"}>{t.id}</span>
                        </div>
                        {value === t.id && <IconCheck size={14} />}
                      </button>
                  </>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
