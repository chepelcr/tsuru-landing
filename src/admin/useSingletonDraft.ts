// Shared wiring for singleton content-entity editor pages. Holds a local
// structuredClone draft of a store slice, exposes an immutable `update(mut)`
// mutator, and a `save()` that writes the file via downloadJson and pushes the
// value back into the store slice. The page renders <PageHeader entity value
// onSave={save} /> with the returned draft so the floating Save + nav guard work.

import { useState, useCallback } from "react";
import { downloadJson } from "@/lib/admin-store";

export function useSingletonDraft<T>(
  initial: T,
  file: string,
  setSlice: (v: T) => void,
) {
  const [draft, setDraft] = useState<T>(() => structuredClone(initial));

  const update = useCallback((mut: (d: T) => void) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      mut(next);
      return next;
    });
  }, []);

  const save = useCallback(async () => {
    setSlice(draft);
    await downloadJson(file, draft);
  }, [draft, file, setSlice]);

  return { draft, setDraft, update, save };
}

/** Swap two array entries in place (used by reorder controls). */
export function moveItem<T>(arr: T[], i: number, dir: -1 | 1): void {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
}
