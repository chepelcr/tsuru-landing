// Transient admin-shell state (Zustand) — deliberately separate from
// admin-store.ts so admin-only UI state never leaks into the public bundle.
// admin-store signals saves via the DOM event "tsuru:content-saved" rather than
// importing this module.

import { create } from "zustand";
import { fetchGitStatus } from "./local-cms";

interface AdminUiState {
  // Current editor, registered by PageHeader (or a self-registering page).
  dirty: boolean;
  save: (() => Promise<void>) | null;
  filename: string | null;
  setEditor: (e: { dirty: boolean; save: () => Promise<void>; filename: string }) => void;
  clearEditor: () => void;

  // Unsaved-changes nav guard.
  navTarget: string | null;
  requestNav: (href: string) => void;
  closeNav: () => void;

  // Publish (git working-tree) pending state.
  pendingPublish: boolean;
  refreshPublish: () => Promise<void>;
}

export const useAdminUi = create<AdminUiState>((set) => ({
  dirty: false,
  save: null,
  filename: null,
  setEditor: ({ dirty, save, filename }) => set({ dirty, save, filename }),
  clearEditor: () => set({ dirty: false, save: null, filename: null }),

  navTarget: null,
  requestNav: (href) => set({ navTarget: href }),
  closeNav: () => set({ navTarget: null }),

  pendingPublish: false,
  refreshPublish: async () => {
    const r = await fetchGitStatus();
    set({ pendingPublish: !!r.pending });
  },
}));

/**
 * Link/nav click handlers call this: if the open editor is dirty, block the nav
 * and open the confirm modal. Returns true when it handled (blocked) the click.
 */
export function guardNavigation(href: string): boolean {
  const { dirty, requestNav } = useAdminUi.getState();
  if (dirty) {
    requestNav(href);
    return true;
  }
  return false;
}
