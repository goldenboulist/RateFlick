import { Badge } from "../ui/Badge";
import { RangeSlider } from "../ui/RangeSlider";
import { GENRES } from "../../lib/genres";
import {
  IconSortAsc,
  IconSortDesc,
  IconStar,
  IconTrendDown,
  IconTrendUp,
} from "../icons";

export type FilterToggle =
  | "sortAz"
  | "sortZa"
  | "sortRatingAsc"
  | "sortRatingDesc";

interface FilterBarProps {
  active: Set<FilterToggle>;
  onToggle: (id: FilterToggle) => void;
  ratingRange: [number, number];
  onRatingRangeChange: (val: [number, number]) => void;
  selectedGenres: Set<string>;
  onToggleGenre: (genre: string) => void;
  onClearGenres: () => void;
}

export const SORT_FILTER_IDS: FilterToggle[] = [
  "sortAz",
  "sortZa",
  "sortRatingAsc",
  "sortRatingDesc",
];

export function FilterBar({
  active,
  onToggle,
  ratingRange,
  onRatingRangeChange,
  selectedGenres,
  onToggleGenre,
  onClearGenres,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
    
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="theme"
          active={selectedGenres.size === 0}
          onClick={onClearGenres}
        >
          <span>Tous</span>
        </Badge>
        {GENRES.map((g) => (
          <Badge
            key={g}
            variant="theme"
            active={selectedGenres.has(g)}
            onClick={() => onToggleGenre(g)}
          >
            <span>{g}</span>
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="theme"
          active={active.has("sortAz")}
          onClick={() => onToggle("sortAz")}
        >
          <IconSortAsc size={14} className="shrink-0 opacity-95" />
          <span>A–Z</span>
        </Badge>
        <Badge
          variant="theme"
          active={active.has("sortZa")}
          onClick={() => onToggle("sortZa")}
        >
          <IconSortDesc size={14} className="shrink-0 opacity-95" />
          <span>Z–A</span>
        </Badge>
        <Badge
          variant="theme"
          active={active.has("sortRatingAsc")}
          onClick={() => onToggle("sortRatingAsc")}
        >
          <IconTrendDown size={14} className="shrink-0 opacity-95" />
          <span>Moins bien notés</span>
        </Badge>
        <Badge
          variant="theme"
          active={active.has("sortRatingDesc")}
          onClick={() => onToggle("sortRatingDesc")}
        >
          <IconTrendUp size={14} className="shrink-0 opacity-95" />
          <span>Mieux notés</span>
        </Badge>
      </div>

      <div className="flex items-center gap-4 px-4 py-2 bg-secondary/30 rounded-full ">
        <div className="flex items-center gap-2 text-xs font-medium text-muted">
          <IconStar size={14} className="text-amber-500" />
          <span className="whitespace-nowrap">
            Note: {ratingRange[0].toFixed(1)} – {ratingRange[1].toFixed(1)}
          </span>
        </div>
        <RangeSlider
          min={0}
          max={5}
          step={0.1}
          value={ratingRange}
          onChange={onRatingRangeChange}
          className="w-32"
        />
      </div>

    </div>
  );
}

export function isSortId(id: FilterToggle): boolean {
  return SORT_FILTER_IDS.includes(id);
}
