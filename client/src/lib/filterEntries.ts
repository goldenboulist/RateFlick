import type { Entry } from "../types";
import type { FilterToggle } from "../components/layout/FilterBar";

export function filterAndSortEntries(
  entries: Entry[],
  query: string,
  active: Set<FilterToggle>,
  ratingRange: [number, number],
  selectedGenres: Set<string>
): Entry[] {
  const q = query.trim().toLowerCase();
  let list = entries.filter((e) => !q || e.title.toLowerCase().includes(q));

  const [minRating, maxRating] = ratingRange;
  if (minRating > 0 || maxRating < 5) {
    list = list.filter((e) => e.rating >= minRating && e.rating <= maxRating);
  }

  if (selectedGenres.size > 0) {
    list = list.filter((e) => e.genres.some((g) => selectedGenres.has(g)));
  }

  const sorted = [...list];
  if (active.has("sortAz")) {
    sorted.sort((a, b) => a.title.localeCompare(b.title, "fr"));
  } else if (active.has("sortZa")) {
    sorted.sort((a, b) => b.title.localeCompare(a.title, "fr"));
  } else if (active.has("sortRatingAsc")) {
    sorted.sort((a, b) => a.rating - b.rating);
  } else if (active.has("sortRatingDesc")) {
    sorted.sort((a, b) => b.rating - a.rating);
  }

  return sorted;
}
