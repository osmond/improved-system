import {
  ChartContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from '@/components/ui/chart'

export interface PaceDistributionBin {
  bin: string
  upper: number
  lower: number
}

interface PaceDistributionChartProps {
  data: PaceDistributionBin[]
}

export function PaceDistributionChart({ data }: PaceDistributionChartProps) {
  const config = {
    upper: { color: 'hsl(var(--muted-foreground))' },
    lower: { color: 'hsl(var(--muted-foreground))' },
  }
  return (
    <ChartContainer
      config={config}
      className='h-60 md:col-span-2'
      title='Pace Distribution'
    >
      <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='bin' />
        <YAxis hide />
        <ReferenceLine y={0} strokeDasharray='3 3' stroke='hsl(var(--muted))' />
        <Area dataKey='upper' fill='hsl(var(--muted-foreground))' stroke='none' />
        <Area dataKey='lower' fill='hsl(var(--muted-foreground))' stroke='none' />
      </AreaChart>
    </ChartContainer>
  )
}
