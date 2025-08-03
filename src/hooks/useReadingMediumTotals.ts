import { useEffect, useState } from 'react'
import type { ReadingMediumTotal } from '@/lib/api'

interface UseReadingMediumTotalsResult {
  data: ReadingMediumTotal[] | null
  loading: boolean
  error: Error | null
}

export default function useReadingMediumTotals(
  fetcher?: () => Promise<ReadingMediumTotal[]>,
): UseReadingMediumTotalsResult {
  const [data, setData] = useState<ReadingMediumTotal[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        let totals: ReadingMediumTotal[]
        if (fetcher) {
          totals = await fetcher()
        } else {
          const res = await fetch('/api/reading-medium-totals')
          if (!res.ok) {
            throw new Error('Failed to fetch reading medium totals')
          }
          totals = await res.json()
        }
        if (isMounted) setData(totals)
      } catch (err) {
        if (isMounted) setError(err as Error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [fetcher])

  return { data, loading, error }
}
