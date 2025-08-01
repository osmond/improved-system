import { useEffect, useState } from 'react'
import { getReadingMediumTotals, type ReadingMediumTotal } from '@/lib/api'

export default function useReadingMediumTotals(): ReadingMediumTotal[] | null {
  const [data, setData] = useState<ReadingMediumTotal[] | null>(null)

  useEffect(() => {
    getReadingMediumTotals().then(setData)
  }, [])

  return data
}
