/** Utilities for persisting per-session metadata like tags and false positive flag. */
export interface SessionMeta {
  tags: string[]
  isFalsePositive: boolean
}

const STORAGE_KEY = 'session_meta'

function readAll(): Record<number, SessionMeta> {
  if (typeof localStorage === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeAll(data: Record<number, SessionMeta>) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getSessionMeta(id: number): SessionMeta {
  const all = readAll()
  return all[id] || { tags: [], isFalsePositive: false }
}

export function setSessionMeta(id: number, meta: SessionMeta) {
  const all = readAll()
  all[id] = meta
  writeAll(all)
}

export function updateSessionMeta(id: number, meta: Partial<SessionMeta>): SessionMeta {
  const current = getSessionMeta(id)
  const next = { ...current, ...meta }
  setSessionMeta(id, next)
  return next
}

