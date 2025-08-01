import useSWR from 'swr'

export interface WildGame {
  gameDate: string
  opponent: string
  home: boolean
  [key: string]: any
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function useWildSchedule(limit = 1) {
  const { data } = useSWR<WildGame[]>(`/api/nhl/schedule?limit=${limit}`, fetcher)
  return data ?? null
}
