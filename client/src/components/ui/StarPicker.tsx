import { useId, useState } from "react";

const STAR_PATH =
  "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.45 4.73L5.82 21z";

interface StarPickerProps {
  value: number;
  onChange: (v: number) => void;
  className?: string;
}

const MAX = 5;

export function StarPicker({ value, onChange, className }: StarPickerProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const uid = useId().replace(/:/g, "");

  const display = hovered ?? value;

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const half = e.clientX < rect.left + rect.width / 2;
    setHovered(half ? index - 0.5 : index);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const half = e.clientX < rect.left + rect.width / 2;
    onChange(half ? index - 0.5 : index);
  };

  const starFill = (i: number) => {
    const v = display;
    if (v >= i) return 1;
    if (v >= i - 0.5) return 0.5;
    return 0;
  };

  return (
    <div className={`flex items-center gap-0.5 ${className ?? ""}`}>
      {Array.from({ length: MAX }, (_, k) => k + 1).map((i) => {
        const fill = starFill(i);
        const clipId = `${uid}-clip-${i}`;
        const clipW = 24 * fill;

        return (
          <button
            key={i}
            type="button"
            className="interactive relative h-9 w-8 shrink-0 rounded hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
            onMouseMove={(e) => handleMouseMove(e, i)}
            onMouseLeave={() => setHovered(null)}
            onClick={(e) => handleClick(e, i)}
            aria-label={`${i} étoiles`}
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden>
              <defs>
                <clipPath id={clipId}>
                  <rect x="0" y="0" width={clipW} height="24" />
                </clipPath>
              </defs>
              <path d={STAR_PATH} className="fill-slate-300 dark:fill-slate-600" />
              <g clipPath={`url(#${clipId})`}>
                <path d={STAR_PATH} className="fill-amber-400" />
              </g>
            </svg>
          </button>
        );
      })}
      <span className="ml-2 text-sm tabular-nums text-[var(--muted)]">
        ({display.toFixed(1)})
      </span>
    </div>
  );
}
