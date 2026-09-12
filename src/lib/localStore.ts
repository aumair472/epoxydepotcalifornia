/**
 * Tiny localStorage-backed external store for `useSyncExternalStore`.
 * The server snapshot is always the fallback, so hydration never mismatches;
 * the client re-renders with the persisted value right after hydrating.
 */
export interface LocalStore<T> {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  set: (next: T | ((prev: T) => T)) => void;
}

export function createLocalStore<T>(key: string, fallback: T, parse: (raw: unknown) => T): LocalStore<T> {
  let state = fallback;
  let loaded = false;
  const listeners = new Set<() => void>();

  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) state = parse(JSON.parse(raw));
    } catch {
      state = fallback;
    }
  };

  const emit = () => listeners.forEach((l) => l());

  const onStorage = (event: StorageEvent) => {
    if (event.key !== key) return;
    loaded = false;
    load();
    emit();
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot() {
      load();
      return state;
    },
    getServerSnapshot() {
      return fallback;
    },
    set(next) {
      load();
      state = typeof next === "function" ? (next as (prev: T) => T)(state) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch {
        // Storage may be unavailable (private mode, quota) — keep in-memory state.
      }
      emit();
    },
  };
}
