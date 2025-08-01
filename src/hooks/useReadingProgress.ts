import { useEffect, useState } from 'react'
import { getReadingProgress, type ReadingProgress } from '@/lib/api'

export interface ReadingProgressState extends ReadingProgress {
  unreadPages: number
}

export default function useReadingProgress(): ReadingProgressState | null {
  const [data, setData] = useState<ReadingProgressState | null>(null)

  useEffect(() => {
    getReadingProgress().then((d) =>
      setData({ ...d, unreadPages: Math.max(d.readingGoal - d.pagesRead, 0) })
    )
  }, [])

  return data
}
