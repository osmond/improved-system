import { describe, it, expect, vi, afterEach } from 'vitest'
import { getWeatherForRuns } from '../weatherApi'

afterEach(() => {
  vi.unstubAllGlobals()
})

function mockFetch(delays: number[], rejectIndex?: number) {
  let call = 0
  const fetchMock = vi.fn(() => {
    const idx = call++
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (idx === rejectIndex) {
          reject(new Error('fail'))
          return
        }
        resolve({
          json: async () => ({
            hourly: {
              temperature_2m: [0],
              relative_humidity_2m: [0],
              weathercode: [0],
              windspeed_10m: [0],
            },
          }),
        })
      }, delays[idx])
    })
  })
  vi.stubGlobal('fetch', fetchMock)
}

describe('getWeatherForRuns', () => {
  it('returns weather data in the original order', async () => {
    const runs = [
      { date: '2024-01-01', lat: 0, lon: 0 },
      { date: '2024-01-02', lat: 0, lon: 0 },
      { date: '2024-01-03', lat: 0, lon: 0 },
    ]
    mockFetch([30, 10, 20])
    const result = await getWeatherForRuns(runs)
    expect(result.map((r) => r.date)).toEqual(runs.map((r) => r.date))
  })

  it('continues when a run fails and keeps order of the rest', async () => {
    const runs = [
      { date: '2024-01-01', lat: 0, lon: 0 },
      { date: '2024-01-02', lat: 0, lon: 0 },
      { date: '2024-01-03', lat: 0, lon: 0 },
    ]
    mockFetch([30, 10, 20], 1)
    const result = await getWeatherForRuns(runs)
    expect(result.map((r) => r.date)).toEqual([
      '2024-01-01',
      '2024-01-03',
    ])
  })
})
