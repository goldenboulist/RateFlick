import { useCallback, useEffect } from "react";
import { apiFetch } from "../services/api";
import { useEntriesStore } from "../store/entriesStore";
import type { Entry } from "../types";

export function useEntriesLoader(enabled: boolean) {
  const setEntries = useEntriesStore((s) => s.setEntries);

  const load = useCallback(async () => {
    const data = await apiFetch<Entry[]>("/entries");
    setEntries(data);
  }, [setEntries]);

  useEffect(() => {
    if (enabled) void load();
  }, [enabled, load]);

  return { load };
}
