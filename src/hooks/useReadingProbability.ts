import { useEffect, useState } from 'react'
import { getReadingProbability, type ReadingProbabilityPoint } from '@/lib/api'

export default function useReadingProbability(): ReadingProbabilityPoint[] | null {
  const [data, setData] = useState<ReadingProbabilityPoint[] | null>(null)

  useEffect(() => {
    getReadingProbability().then(setData)
  }, [])

  return data
}
