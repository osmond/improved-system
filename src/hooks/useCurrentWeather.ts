import { useState, useEffect } from 'react'
import { getCurrentWeather, type CurrentWeather } from '@/lib/weather'

export function useCurrentWeather(lat: number, lon: number): CurrentWeather | null {
  const [data, setData] = useState<CurrentWeather | null>(null)
  useEffect(() => {
    const controller = new AbortController()
    getCurrentWeather(lat, lon, controller.signal)
      .then(setData)
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch current weather', err)
        }
      })
    return () => controller.abort()
  }, [lat, lon])
  return data
}
