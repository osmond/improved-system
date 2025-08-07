import { useEffect, useState } from 'react'
import type { ReadingMediumTotal } from '@/lib/api'
import { getReadingMediumTotals } from '@/lib/api'

interface UseReadingMediumTotalsOptions {
  /**
   * Optional pre-loaded data. When provided the hook will skip fetching.
   */
  data?: ReadingMediumTotal[]
  /**
   * Optional fetcher function. By default the hook attempts to call
   * `/api/reading-medium-totals` and falls back to mock data if the endpoint
   * is unavailable.
   */
  fetcher?: () => Promise<ReadingMediumTotal[]>
}

interface UseReadingMediumTotalsResult {
  data: ReadingMediumTotal[] | null
  isLoading: boolean
  error: Error | null
}

async function defaultFetcher(): Promise<ReadingMediumTotal[]> {
  try {
    const res = await fetch('/api/reading-medium-totals')
    if (!res.ok) throw new Error('Failed to fetch reading medium totals')
    return res.json()
  } catch {
    return getReadingMediumTotals()
  }
}

/**
 * Retrieves total reading time by medium. Attempts to fetch from the
 * `/api/reading-medium-totals` endpoint and falls back to locally generated
 * mock data when the API is absent.
 */
export default function useReadingMediumTotals(
  options: UseReadingMediumTotalsOptions = {},
): UseReadingMediumTotalsResult {
  const { data: initialData, fetcher } = options
  const [data, setData] = useState<ReadingMediumTotal[] | null>(
    initialData ?? null,
  )
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (initialData) return

    let active = true
    const load = async () => {
      try {
        setIsLoading(true)
        const result = await (fetcher ?? defaultFetcher)()
        if (active) setData(result)
      } catch (e) {
        if (active) setError(e as Error)
      } finally {
        if (active) setIsLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [initialData, fetcher])

  return { data, isLoading, error }
}
