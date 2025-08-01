import { useState, useEffect } from 'react'
import { getWildSchedule, type WildGame } from '@/lib/api'

export default function useWildSchedule(limit = 1) {
  const [data, setData] = useState<WildGame[] | null>(null)

  useEffect(() => {
    getWildSchedule(limit).then(setData)
  }, [limit])

  return data
}
