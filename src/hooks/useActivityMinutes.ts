import { useState, useEffect } from 'react'
import { ActivityMinutes, getActivityMinutes } from '@/lib/api'

/**
 * Hook for retrieving activity minutes from the API.
 *
 * The API call is wrapped in a try/catch so that any failure can be surfaced to
 * the consumer. The hook returns an object containing the `data` retrieved and
 * an `error` if one occurred.
 */
export default function useActivityMinutes(): {
  data: ActivityMinutes[] | null
  error: Error | null
} {
  const [data, setData] = useState<ActivityMinutes[] | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchActivityMinutes = async () => {
      try {
        const result = await getActivityMinutes()
        setData(result)
      } catch (err: unknown) {
        console.error(err)
        setError(err instanceof Error ? err : new Error('Failed to fetch activity minutes'))
      }
    }

    fetchActivityMinutes()
  }, [])

  return { data, error }
}
