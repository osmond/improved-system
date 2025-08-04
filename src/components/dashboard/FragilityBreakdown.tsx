import React from 'react'
import useFragilityIndex from '@/hooks/useFragilityIndex'
import { Skeleton } from '@/ui/skeleton'

export default function FragilityBreakdown() {
  const fragility = useFragilityIndex()
  if (!fragility) return <Skeleton className="h-10 w-40" />
  const { acwr, disruption } = fragility
  const acwrComponent = Math.max(0, acwr - 1)
  const acwrWidth = Math.min(acwrComponent, 1) * 50
  const disruptionWidth = Math.min(disruption, 1) * 50

  return (
    <div className="flex flex-col items-center space-y-1 w-40">
      <div className="w-full h-3 bg-muted rounded flex overflow-hidden" aria-label="Fragility breakdown">
        <div
          style={{ width: `${acwrWidth}%`, backgroundColor: 'hsl(var(--chart-8))' }}
          className="h-full"
        />
        <div
          style={{ width: `${disruptionWidth}%`, backgroundColor: 'hsl(var(--chart-3))' }}
          className="h-full"
        />
      </div>
      <div className="flex justify-between w-full text-xs text-muted-foreground">
        <span>ACWR {acwr.toFixed(2)}</span>
        <span>Disrupt {disruption.toFixed(2)}</span>
      </div>
    </div>
  )
}
