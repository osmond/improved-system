import { useEffect, useState } from 'react'
import { DailyWeather, getDailyWeather } from '@/lib/weatherApi'

export default function useDailyWeather(
  lat: number,
  lon: number,
  date: string,
): DailyWeather | null {
  const [data, setData] = useState<DailyWeather | null>(null)
  useEffect(() => {
    getDailyWeather(lat, lon, date).then(setData).catch(() => setData(null))
  }, [lat, lon, date])
  return data
}
