import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Entry } from "../../types";
import { GENRES } from "../../lib/genres";
import { IconArrowTopRightOnSquare } from "../icons";
import { StarPicker } from "../ui/StarPicker";

const POSTER_HELP_URL = "https://www.themoviedb.org/";

const schema = z.object({
  title: z.string().min(1, "Titre requis"),
  rating: z.number().min(0).max(5),
  genre: z.string().min(1, "Genre requis"),
  description: z.string().optional(),
  posterUrl: z
    .string()
    .optional()
    .refine((s) => !s?.trim() || /^https?:\/\/.+/.test(s.trim()), {
      message: "URL invalide",
    }),
});

export type EntryFormValues = z.infer<typeof schema>;

interface EntryFormProps {
  initial?: Entry | null;
  createdAtLabel?: string;
  onSubmit: (data: EntryFormValues) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function EntryForm({
  initial,
  createdAtLabel,
  onSubmit,
  onCancel,
  loading,
}: EntryFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EntryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? "",
      rating: initial?.rating ?? 3,
      genre: initial?.genre ?? "Autre",
      description: initial?.description ?? "",
      posterUrl: initial?.posterUrl ?? "",
    },
  });

  const rating = watch("rating");
  const genre = watch("genre");
  const posterUrl = watch("posterUrl");

  useEffect(() => {
    if (!initial) {
      setValue("rating", 3);
    }
  }, [initial, setValue]);

  return (
    <form onSubmit={handleSubmit((v) => onSubmit(v))} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-[var(--muted)]">Titre</label>
        <input
          {...register("title")}
          placeholder="Titre du film ou de la série"
          className="interactive w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-[var(--fg)] hover:border-[var(--muted)]/40 hover:shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <span className="mb-2 block text-sm text-[var(--muted)]">Note</span>
        <StarPicker value={rating} onChange={(v) => setValue("rating", v)} />
        {errors.rating && (
          <p className="mt-1 text-sm text-red-500">{errors.rating.message}</p>
        )}
      </div>

      <div>
        <span className="mb-2 block text-sm text-[var(--muted)]">Genre</span>
        <input type="hidden" {...register("genre")} />
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setValue("genre", g)}
              className={
                "interactive inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] " +
                (genre === g
                  ? "bg-[var(--accent)] text-[var(--on-accent)] border-[var(--ring)]"
                  : "border-[var(--border)] text-[var(--muted)] bg-transparent hover:text-[var(--fg)]")
              }
            >
              {g}
            </button>
          ))}
        </div>
        {errors.genre && (
          <p className="mt-1 text-sm text-red-500">{errors.genre.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm text-[var(--muted)]">Description</label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="Description (optionnel)"
          className="interactive w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-[var(--fg)] hover:border-[var(--muted)]/40 hover:shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
        />
      </div>

      {createdAtLabel && (
        <div>
          <label className="mb-1 block text-sm text-[var(--muted)]">Créé le</label>
          <input
            readOnly
            value={createdAtLabel}
            className="w-full cursor-not-allowed rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] px-4 py-2.5 text-[var(--muted)]"
          />
        </div>
      )}

      <div>
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <label className="text-sm text-[var(--muted)]">URL de l’affiche</label>
          <button
            type="button"
            onClick={() =>
              window.open(POSTER_HELP_URL, "_blank", "noopener,noreferrer")
            }
            className="interactive inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1.5 text-xs font-medium text-[var(--fg)] shadow-sm hover:-translate-y-0.5 hover:border-[var(--accent)]/30 hover:bg-[var(--accent-soft)] hover:shadow-md active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
          >
            <IconArrowTopRightOnSquare size={14} />
            Ouvrir themoviedb.org
          </button>
        </div>
        <p className="mb-2 text-xs text-[var(--muted)]">
          Collez l’adresse d’une image (clic droit sur l’affiche → copier l’adresse de
          l’image).
        </p>
        <input
          {...register("posterUrl")}
          className="interactive w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-[var(--fg)] hover:border-[var(--muted)]/40 hover:shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
          placeholder="https://…"
        />
        {errors.posterUrl && (
          <p className="mt-1 text-sm text-red-500">{errors.posterUrl.message}</p>
        )}
        {posterUrl?.trim() && (
          <img
            src={posterUrl.trim()}
            alt=""
            className="interactive mt-2 h-40 w-28 rounded-lg object-cover shadow-md ring-1 ring-black/5 transition hover:ring-2 hover:ring-[var(--accent)]/30"
          />
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="interactive rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] hover:-translate-y-0.5 hover:bg-[var(--accent-soft)] hover:shadow-sm active:translate-y-0"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="interactive rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--on-accent)] hover:-translate-y-0.5 hover:shadow-lg hover:brightness-110 active:translate-y-0 disabled:translate-y-0 disabled:opacity-60 disabled:hover:shadow-none"
        >
          {loading ? "Enregistrement…" : initial ? "Mettre à jour" : "Ajouter"}
        </button>
      </div>
    </form>
  );
}
