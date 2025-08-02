import React from 'react'
import { Card } from '@/components/ui/card'
import useRouteSimilarity from '@/hooks/useRouteSimilarity'

export default function RouteSimilarity() {
  const result = useRouteSimilarity()

  if (!result) {
    return <Card className="p-4">Calculating...</Card>
  }

  const { routeA, routeB, similarity } = result

  return (
    <Card className="p-4 space-y-2">
      <h2 className="font-semibold">Route Similarity</h2>
      <p>
        Comparing <span className="font-medium">{routeA.name}</span> with{' '}
        <span className="font-medium">{routeB.name}</span>.
      </p>
      <p className="text-sm text-muted-foreground">
        Jaccard similarity: {(similarity * 100).toFixed(1)}%
      </p>
    </Card>
  )
}
