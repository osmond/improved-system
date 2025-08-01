import { useState, useEffect } from 'react'
import { getLocationEfficiency, LocationEfficiency } from '@/lib/api'

export default function useLocationEfficiency(): LocationEfficiency[] | null {
  const [data, setData] = useState<LocationEfficiency[] | null>(null)

  useEffect(() => {
    getLocationEfficiency().then(setData)
  }, [])

  return data
}
