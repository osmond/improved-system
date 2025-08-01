import { useState, useEffect } from 'react'
import { getCurrentWeather, type CurrentWeather } from '@/lib/weather'

export function useCurrentWeather(lat: number, lon: number): CurrentWeather | null {
  const [data, setData] = useState<CurrentWeather | null>(null)
  useEffect(() => {
    getCurrentWeather(lat, lon)
      .then(setData)
      .catch(() => {})
  }, [lat, lon])
  return data
}
