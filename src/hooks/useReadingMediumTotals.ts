import { useEffect, useState } from 'react'
import type { ReadingMediumTotal } from '@/lib/api'
import { getReadingMediumTotals } from '@/lib/api'

interface UseReadingMediumTotalsOptions {
  /**
   * Optional pre-loaded data. When provided the hook will skip fetching.
   */
  data?: ReadingMediumTotal[]
  /**
   * Optional fetcher function. Defaults to {@link getReadingMediumTotals} which
   * fetches Kindle session data and aggregates totals.
   */
  fetcher?: () => Promise<ReadingMediumTotal[]>
}

interface UseReadingMediumTotalsResult {
  data: ReadingMediumTotal[] | null
  isLoading: boolean
  error: Error | null
}

async function defaultFetcher(): Promise<ReadingMediumTotal[]> {
  return getReadingMediumTotals()
}

/**
 * Retrieves total reading time by medium. Uses Kindle session data and falls
 * back to the bundled JSON if fetching fails.
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
