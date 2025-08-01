
import { useEffect, useState } from 'react'

import { getWildSchedule, type WildGame } from '@/lib/api'

export default function useWildSchedule(limit = 1) {
  const [data, setData] = useState<WildGame[] | null>(null)

  useEffect(() => {

    let cancelled = false
    getWildSchedule(limit).then((res) => {
      if (!cancelled) setData(res)
    })
    return () => {
      cancelled = true
    }

  }, [limit])

  return data
}
