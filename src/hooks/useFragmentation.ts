import { useEffect, useMemo, useState } from 'react'
import { getActivitySnapshots, type ActivitySnapshot } from '@/lib/api'

export interface FragmentationEvent {
  timestamp: string
  appChanges: number
  location: string
  network: string
}

export function detectFragmentation(
  snaps: ActivitySnapshot[],
  threshold = 5,
): FragmentationEvent[] {
  return snaps
    .filter((s) => s.appChanges >= threshold)
    .map((s) => ({
      timestamp: s.timestamp,
      appChanges: s.appChanges,
      location: s.location,
      network: s.network,
    }))
}

export default function useFragmentation(
  threshold = 5,
): FragmentationEvent[] | null {
  const [snaps, setSnaps] = useState<ActivitySnapshot[] | null>(null)
  useEffect(() => {
    getActivitySnapshots().then(setSnaps)
  }, [])
  return useMemo(
    () => (snaps ? detectFragmentation(snaps, threshold) : null),
    [snaps, threshold],
  )
}

