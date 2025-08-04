import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import CircularFragilityRing from './CircularFragilityRing'
import FragilityBreakdown from './FragilityBreakdown'
import FragilityIndexSparkline from './FragilityIndexSparkline'

export default function FragilityIndexCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fragility Index</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-4">
          <CircularFragilityRing />
          <FragilityBreakdown />
        </div>
        <div className="w-full max-w-sm">
          <FragilityIndexSparkline />
        </div>
      </CardContent>
    </Card>
  )
}
