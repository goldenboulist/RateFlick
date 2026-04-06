import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteModal } from "../components/entries/DeleteModal";
import { EntryCard } from "../components/entries/EntryCard";
import { EntryForm, type EntryFormValues } from "../components/entries/EntryForm";
import {
  FilterBar,
  type FilterToggle,
  SORT_FILTER_IDS,
} from "../components/layout/FilterBar";
import { Header } from "../components/layout/Header";
import { SearchBar } from "../components/layout/SearchBar";
import { Modal } from "../components/ui/Modal";
import { filterAndSortEntries } from "../lib/filterEntries";
import { useDebounce } from "../hooks/useDebounce";
import { useEntriesLoader } from "../hooks/useEntries";
import { useTheme } from "../hooks/useTheme";
import { apiFetch, apiFetchLogout } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useEntriesStore } from "../store/entriesStore";
import type { Entry } from "../types";
import { AnimatedDots } from "../components/auth/AnimatedDots";

export function HomePage() {
  const user = useAuthStore((s) => s.user);
  const logoutStore = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const entries = useEntriesStore((s) => s.entries);
  const setEntries = useEntriesStore((s) => s.setEntries);
  const upsertEntry = useEntriesStore((s) => s.upsertEntry);
  const removeEntry = useEntriesStore((s) => s.removeEntry);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 100);
  const [filters, setFilters] = useState<Set<FilterToggle>>(new Set());
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 5]);
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Entry | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEntriesLoader(!!user);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filtered = useMemo(
    () =>
      filterAndSortEntries(
        entries,
        debouncedSearch,
        filters,
        ratingRange,
        selectedGenres
      ),
    [entries, debouncedSearch, filters, ratingRange, selectedGenres]
  );

  function handleFilterToggle(id: FilterToggle) {
    setFilters((prev) => {
      const next = new Set(prev);
      if (SORT_FILTER_IDS.includes(id)) {
        const was = next.has(id);
        SORT_FILTER_IDS.forEach((s) => next.delete(s));
        if (!was) next.add(id);
      } else {
        if (next.has(id)) next.delete(id);
        else next.add(id);
      }
      return next;
    });
  }

  function handleToggleGenre(genre: string) {
    setSelectedGenres((prev) => {
      const next = new Set(prev);
      if (next.has(genre)) next.delete(genre);
      else next.add(genre);
      return next;
    });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filtered.findIndex((e) => e.id === active.id);
    const newIndex = filtered.findIndex((e) => e.id === over.id);

    const newList = arrayMove(filtered, oldIndex, newIndex);

    // Update rankOrder for all entries in the filtered list
    const updatedEntries = entries.map((e) => {
      const foundIndex = newList.findIndex((n) => n.id === e.id);
      if (foundIndex !== -1) {
        return { ...e, rankOrder: foundIndex };
      }
      return e;
    });

    setEntries(updatedEntries);

    // Persist to server
    try {
      const ranks = newList.map((e, index) => ({
        id: e.id,
        rank_order: index,
      }));
      await apiFetch("/entries/ranks", {
        method: "PUT",
        body: JSON.stringify({ ranks }),
      });
    } catch (error) {
      console.error("Failed to update ranks:", error);
    }
  }

  async function handleLogout() {
    await apiFetchLogout();
    logoutStore();
    navigate("/auth", { replace: true });
  }

  async function handleSubmitForm(data: EntryFormValues) {
    setSaving(true);
    try {
      const body = {
        title: data.title,
        rating: data.rating,
        genres: data.genres,
        description: data.description?.trim() || null,
        poster_url: data.posterUrl?.trim() || null,
      };
      if (editing) {
        const updated = await apiFetch<Entry>(`/entries/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        upsertEntry(updated);
      } else {
        const created = await apiFetch<Entry>("/entries", {
          method: "POST",
          body: JSON.stringify(body),
        });
        upsertEntry(created);
      }
      setModalOpen(false);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiFetch(`/entries/${deleteTarget.id}`, { method: "DELETE" });
      removeEntry(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  const createdAtLabel = editing
    ? new Date(editing.createdAt).toLocaleString("fr-FR")
    : new Date().toLocaleString("fr-FR");

  if (!user) return null;

  return (
    <div className="mx-auto max-w-8xl px-4 py-8">
      <AnimatedDots />
      <Header
        email={user.email}
        theme={theme}
        onThemeChange={setTheme}
        onLogout={() => void handleLogout()}
      />

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start">
        <SearchBar value={search} onChange={setSearch} />
        <motion.button
          type="button"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="interactive shrink-0 rounded-xl bg-[var(--accent)] px-6 py-2.5 font-medium text-[var(--on-accent)] shadow-lg hover:shadow-xl hover:brightness-110"
        >
          Ajouter
        </motion.button>
      </div>

      <div className="mb-8">
        <FilterBar
          active={filters}
          onToggle={handleFilterToggle}
          ratingRange={ratingRange}
          onRatingRangeChange={setRatingRange}
          selectedGenres={selectedGenres}
          onToggleGenre={handleToggleGenre}
          onClearGenres={() => setSelectedGenres(new Set())}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          }}
        >
          <SortableContext
            items={filtered.map((e) => e.id)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence initial={false}>
              {filtered.map((entry, i) => (
                <SortableEntryCard
                  key={entry.id}
                  entry={entry}
                  index={i}
                  onEdit={(e) => {
                    setEditing(e);
                    setModalOpen(true);
                  }}
                  onDelete={setDeleteTarget}
                />
              ))}
            </AnimatePresence>
          </SortableContext>
        </div>
      </DndContext>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-[var(--muted)]">
          Aucune entrée pour ces critères. Ajoutez un film !
        </p>
      )}

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? "Modifier l'entrée" : "Nouvelle entrée"}
      >
        <EntryForm
          key={editing?.id ?? "new"}
          initial={editing}
          createdAtLabel={createdAtLabel}
          loading={saving}
          onCancel={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSubmit={handleSubmitForm}
        />
      </Modal>

      <DeleteModal
        open={!!deleteTarget}
        title={deleteTarget?.title ?? ""}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}

function SortableEntryCard(props: {
  entry: Entry;
  index: number;
  onEdit: (e: Entry) => void;
  onDelete: (e: Entry) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.entry.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <EntryCard {...props} />
    </div>
  );
}

