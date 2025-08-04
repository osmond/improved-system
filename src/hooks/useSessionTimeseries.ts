import { useEffect, useState } from 'react'
import { getSessionTimeseries, type PaceWeatherPoint } from '@/lib/api'

export default function useSessionTimeseries(sessionId: number | null) {
  const [data, setData] = useState<PaceWeatherPoint[] | null>(null)

  useEffect(() => {
    if (sessionId == null) {
      setData(null)
      return
    }
    getSessionTimeseries(sessionId).then(setData)
  }, [sessionId])

  return data
}
