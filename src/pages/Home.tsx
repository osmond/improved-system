import React from 'react'

import ChartRadialLabel from '@/components/examples/RadialChartLabel'
import ChartRadialText from '@/components/examples/RadialChartText'
import ChartBarDefault from '@/components/examples/BarChartDefault'
import ChartRadialGrid from '@/components/examples/RadialChartGrid'

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <ChartRadialLabel />
        <ChartRadialText />
        <ChartBarDefault />
        <ChartRadialGrid />
      </div>
    </div>
  )
}
