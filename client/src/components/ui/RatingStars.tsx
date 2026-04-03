import { useId } from "react";

const STAR_PATH =
  "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.45 4.73L5.82 21z";

interface RatingStarsProps {
  rating: number;
  size?: "sm" | "md";
  className?: string;
}

export function RatingStars({ rating, size = "sm", className }: RatingStarsProps) {
  const uid = useId().replace(/:/g, "");
  const dim = size === "sm" ? "h-4 w-4" : "h-4 w-5";

  function starFill(i: number) {
    if (rating >= i) return 1;
    if (rating >= i - 0.5) return 0.5;
    return 0;
  }

  return (
    <span className={`inline-flex items-center gap-0.5 ${className ?? ""}`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = starFill(i);
        const clipId = `${uid}-r-${i}`;
        const clipW = 24 * fill;

        return (
          <svg key={i} viewBox="0 0 24 24" aria-hidden className={`shrink-0 ${dim}`}>
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
        );
      })}
    </span>
  );
}
