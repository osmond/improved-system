import {
  ChartContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from '@/components/ui/chart'

export interface AnnualMileage {
  year: number
  totalMiles: number
}

interface AnnualMileageChartProps {
  data: AnnualMileage[]
}

export function AnnualMileageChart({ data }: AnnualMileageChartProps) {
  const config = { totalMiles: { color: 'hsl(var(--chart-7))' } }
  return (
    <ChartContainer config={config} className='h-60'>
      <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='year' />
        <YAxis />
        <Tooltip />
        <Bar dataKey='totalMiles' fill='hsl(var(--chart-7))' />
      </BarChart>
    </ChartContainer>
  )
}
