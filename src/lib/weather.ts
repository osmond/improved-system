export interface CurrentWeather {
  temperature: number
  condition: string
}

function mapWeatherCode(code: number): string {
  if (code === 0) return 'Clear'
  if (code >= 1 && code <= 3) return 'Cloudy'
  if (code === 45 || code === 48) return 'Fog'
  if (code >= 51 && code <= 57) return 'Drizzle'
  if (code >= 61 && code <= 67) return 'Rain'
  if (code >= 71 && code <= 77) return 'Snow'
  if (code >= 80 && code <= 82) return 'Rain'
  if (code >= 95) return 'Storm'
  return 'Unknown'
}

export async function getCurrentWeather(
  lat: number,
  lon: number,
): Promise<CurrentWeather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch weather')
  }
  const data = await res.json()
  const cw = data.current_weather
  return {
    temperature: cw.temperature,
    condition: mapWeatherCode(cw.weathercode),
  }
}
