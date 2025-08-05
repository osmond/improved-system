/**
 * localStorage-backed store for cluster labels so they remain stable across sessions.
 */
export function getClusterLabels(): Record<number, string> {
  if (typeof localStorage === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem('cluster_labels') || '{}') as Record<number, string>
  } catch {
    return {}
  }
}

export function setClusterLabel(id: number, label: string): void {
  if (typeof localStorage === 'undefined') return
  const all = getClusterLabels()
  all[id] = label
  localStorage.setItem('cluster_labels', JSON.stringify(all))
}

export function getClusterLabel(id: number): string | undefined {
  const all = getClusterLabels()
  return all[id]
}
