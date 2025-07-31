import { useEffect, useState } from 'react'
import { getRouteSessions, RouteSession } from '@/lib/api'

export function useRouteSessions(route: string | null): RouteSession[] | null {
  const [sessions, setSessions] = useState<RouteSession[] | null>(null)

  useEffect(() => {
    if (!route) return
    getRouteSessions(route).then(setSessions)
  }, [route])

  return sessions
}

export default useRouteSessions
