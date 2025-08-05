/**
 * Simple localStorage-backed store for per-session metadata like user tags and
 * false positive adjustments. Falls back to no-op when localStorage is not
 * available (e.g. during server-side rendering).
 */
export interface SessionMeta {
  tags: string[]
  isFalsePositive: boolean
  feltHarder: boolean
}

const STORAGE_KEY = 'session_meta'

function readAll(): Record<number, SessionMeta> {
  if (typeof localStorage === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Record<number, SessionMeta>
  } catch {
    return {}
  }
}

function writeAll(data: Record<number, SessionMeta>): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

/**
 * Return metadata for a specific session id. If no metadata has been stored,
 * an empty default is returned.
 */
export function getSessionMeta(id: number): SessionMeta {
  const all = readAll()
  return all[id] || { tags: [], isFalsePositive: false, feltHarder: false }
}

/**
 * Store metadata for a specific session id.
 */
export function setSessionMeta(id: number, meta: SessionMeta): void {
  const all = readAll()
  all[id] = meta
  writeAll(all)
}

/**
 * Update metadata for a session by merging with existing values. The updated
 * metadata is returned for convenience.
 */
export function updateSessionMeta(id: number, meta: Partial<SessionMeta>): SessionMeta {
  const current = getSessionMeta(id)
  const next = { ...current, ...meta }
  setSessionMeta(id, next)
  return next
}

/**
 * Read all stored metadata at once. Useful when merging stored metadata onto
 * session data after fetching from an API.
 */
export function getAllSessionMeta(): Record<number, SessionMeta> {
  return readAll()
}
