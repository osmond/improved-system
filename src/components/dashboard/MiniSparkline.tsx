import { AreaChart, Area, ResponsiveContainer } from "@/components/ui/chart";

export interface MiniSparklinePoint {
  date: string;
  value: number;
}

export interface MiniSparklineProps {
  data: MiniSparklinePoint[];
}

export function MiniSparkline({ data }: MiniSparklineProps) {
  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--chart-1))"
            fill="url(#sparkFill)"
            dot={false}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MiniSparkline;
