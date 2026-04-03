import { create } from "zustand";
import type { Entry } from "../types";

interface EntriesState {
  entries: Entry[];
  setEntries: (e: Entry[]) => void;
  upsertEntry: (e: Entry) => void;
  removeEntry: (id: string) => void;
}

export const useEntriesStore = create<EntriesState>((set) => ({
  entries: [],
  setEntries: (entries) => set({ entries }),
  upsertEntry: (entry) =>
    set((s) => {
      const i = s.entries.findIndex((x) => x.id === entry.id);
      if (i === -1) return { entries: [entry, ...s.entries] };
      const next = [...s.entries];
      next[i] = entry;
      return { entries: next };
    }),
  removeEntry: (id) =>
    set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
}));
