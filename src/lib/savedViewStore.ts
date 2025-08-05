export interface SavedView {
  id: string
  /** ISO timestamp when this view was saved */
  created: string
  method: 'tsne' | 'umap'
  sessions: import('@/hooks/useRunningSessions').SessionPoint[]
  axisHints?: import('@/hooks/useRunningSessions').AxisHint[] | null
}

const KEY = 'saved_views'

export function getSavedViews(): SavedView[] {
  if (typeof localStorage === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]') as SavedView[]
  } catch {
    return []
  }
}

export function saveView(view: SavedView): void {
  if (typeof localStorage === 'undefined') return
  const all = getSavedViews()
  all.push(view)
  localStorage.setItem(KEY, JSON.stringify(all))
}

export function removeView(id: string): void {
  if (typeof localStorage === 'undefined') return
  const filtered = getSavedViews().filter((v) => v.id !== id)
  localStorage.setItem(KEY, JSON.stringify(filtered))
}
