import { mapWeatherCode } from './weather'

export interface DailyWeather {
  date: string
  temperature: number
  condition: string
  humidity: number
  wind: number
}

const OPEN_METEO = 'https://api.open-meteo.com/v1/forecast'

export async function getDailyWeather(
  lat: number,
  lon: number,
  date: string,
): Promise<DailyWeather> {
  const url = `${OPEN_METEO}?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,weathercode,windspeed_10m&start_date=${date}&end_date=${date}`
  const res = await fetch(url)
  const json = await res.json()
  const temps = json.hourly?.temperature_2m || []
  const hums = json.hourly?.relative_humidity_2m || []
  const winds = json.hourly?.windspeed_10m || []
  const codes = json.hourly?.weathercode || []
  const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0)
  const condition = codes[0] ?? 0
  // Convert units: temperature (C→F) and wind speed (km/h→mph)
  const tempF = (avg(temps) * 9) / 5 + 32
  const windMph = +(avg(winds) / 1.609).toFixed(1)
  return {
    date,
    temperature: tempF,
    humidity: avg(hums),
    wind: windMph,
    condition: mapWeatherCode(condition),
  }
}

export async function getWeatherForRuns(
  runs: { date: string; lat: number; lon: number }[],
): Promise<DailyWeather[]> {
  const result: DailyWeather[] = []
  for (const run of runs) {
    try {
      result.push(await getDailyWeather(run.lat, run.lon, run.date))
    } catch {
      // ignore errors so dashboards still load
    }
  }
  return result
}

export async function getWeatherForecast(
  lat: number,
  lon: number,
  days = 5,
): Promise<DailyWeather[]> {
  const start = new Date()
  const end = new Date()
  end.setDate(end.getDate() + days - 1)
  const startDate = start.toISOString().slice(0, 10)
  const endDate = end.toISOString().slice(0, 10)
  const url = `${OPEN_METEO}?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,weathercode,windspeed_10m&start_date=${startDate}&end_date=${endDate}`
  const res = await fetch(url)
  const json = await res.json()
  const times: string[] = json.hourly?.time || []
  const temps: number[] = json.hourly?.temperature_2m || []
  const hums: number[] = json.hourly?.relative_humidity_2m || []
  const winds: number[] = json.hourly?.windspeed_10m || []
  const codes: number[] = json.hourly?.weathercode || []

  const byDay: Record<string, { t: number[]; h: number[]; w: number[]; c: number[] }> = {}
  for (let i = 0; i < times.length; i++) {
    const day = times[i].slice(0, 10)
    if (!byDay[day]) byDay[day] = { t: [], h: [], w: [], c: [] }
    byDay[day].t.push(temps[i])
    byDay[day].h.push(hums[i])
    byDay[day].w.push(winds[i])
    byDay[day].c.push(codes[i])
  }

  const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0)
  return Object.keys(byDay)
    .sort()
    .map((date) => {
      const day = byDay[date]
      const condition = day.c[0] ?? 0
      return {
        date,
        temperature: (avg(day.t) * 9) / 5 + 32,
        humidity: avg(day.h),
        wind: +(avg(day.w) / 1.609).toFixed(1),
        condition: mapWeatherCode(condition),
      }
    })
}
