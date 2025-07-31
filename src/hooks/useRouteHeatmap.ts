import { useState, useEffect } from 'react'
import { getRouteHeatData, RouteHeatPoint } from '@/lib/api'

export function useRouteHeatmap(): RouteHeatPoint[] | null {
  const [data, setData] = useState<RouteHeatPoint[] | null>(null)

  useEffect(() => {
    getRouteHeatData().then(setData)
  }, [])

  return data
}
