// Lightweight client-side persistence helpers (mock storage — no backend).
// All QHSE data is stored in the browser's localStorage so edits survive reloads
// without any Supabase/server involvement.

export function loadState<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const saved = window.localStorage.getItem(key)
    if (saved === null) return fallback
    return JSON.parse(saved) as T
  } catch {
    return fallback
  }
}

export function saveState<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or unavailable — fail silently in this mock app
  }
}

// Merge a saved partial object over a fallback so newly-added fields keep their
// defaults even if an older shape was persisted.
export function loadMerged<T extends object>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const saved = window.localStorage.getItem(key)
    if (saved === null) return fallback
    return { ...fallback, ...(JSON.parse(saved) as Partial<T>) }
  } catch {
    return fallback
  }
}
