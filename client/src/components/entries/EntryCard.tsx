import { motion } from "framer-motion";
import type { Entry } from "../../types";
import { IconFilm } from "../icons";
import { RatingStars } from "../ui/RatingStars";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: "easeOut" as const },
  }),
};

interface EntryCardProps {
  entry: Entry;
  index: number;
  onEdit: (e: Entry) => void;
  onDelete: (e: Entry) => void;
}

export function EntryCard({ entry, index, onEdit, onDelete }: EntryCardProps) {
  const dateStr = new Date(entry.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -12 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg interactive hover:border-[var(--muted)]/30 hover:shadow-xl"
    >
      <div className="aspect-[2/3] w-full overflow-hidden bg-[var(--accent-soft)]">
        {entry.posterUrl ? (
          <img
            src={entry.posterUrl}
            alt=""
            className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--muted)] transition duration-300 group-hover:scale-110">
            <IconFilm size={56} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-bold text-[var(--fg)] transition group-hover:text-[var(--accent)]">
          {entry.title}
        </h3>
        <p className="flex flex-wrap items-center gap-2 text-[var(--muted)]">
          <RatingStars rating={entry.rating} size="sm" />
          <span className="text-sm tabular-nums">({entry.rating.toFixed(1)})</span>
        </p>
        {entry.genres && entry.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {entry.genres.map((g) => (
              <span
                key={g}
                className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--accent)]"
              >
                {g}
              </span>
            ))}
          </div>
        )}
        {entry.description && (
          <p className="line-clamp-2 text-sm text-[var(--muted)]">{entry.description}</p>
        )}
        <p className="text-xs text-[var(--muted)]">{dateStr}</p>
        <div className="mt-auto flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => onEdit(entry)}
            className="interactive flex-1 rounded-xl border border-[var(--border)] py-2 text-sm font-medium text-[var(--fg)] hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)] hover:shadow-sm active:translate-y-0"
          >
            Modifier
          </button>
          <button
            type="button"
            onClick={() => onDelete(entry)}
            className="interactive flex-1 rounded-xl border border-red-500/40 py-2 text-sm font-medium text-red-600 hover:-translate-y-0.5 hover:border-red-500/60 hover:bg-red-500/10 active:translate-y-0 dark:text-red-400"
          >
            Suppr.
          </button>
        </div>
      </div>
    </motion.article>
  );
}
