import { useState, useEffect } from 'react'
import { RunBikeVolumePoint, getRunBikeVolume } from '@/lib/api'

export default function useRunBikeVolume(): RunBikeVolumePoint[] | null {
  const [data, setData] = useState<RunBikeVolumePoint[] | null>(null)

  useEffect(() => {
    getRunBikeVolume().then(setData)
  }, [])

  return data
}
