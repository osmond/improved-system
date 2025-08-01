import { useState, useEffect } from 'react'
import { ActivityMinutes, getActivityMinutes } from '@/lib/api'

export default function useActivityMinutes(): ActivityMinutes[] | null {
  const [data, setData] = useState<ActivityMinutes[] | null>(null)
  useEffect(() => {
    getActivityMinutes().then(setData)
  }, [])
  return data
}
