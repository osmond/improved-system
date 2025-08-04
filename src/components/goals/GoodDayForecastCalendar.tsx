"use client"

import { Card } from "@/ui/card"

interface ForecastDay {
  date: string
  probability: number
}

interface Props {
  data: ForecastDay[]
}

export default function GoodDayForecastCalendar({ data }: Props) {
  if (!data || data.length === 0) return null

  return (
    <Card className="p-2">
      <div className="flex gap-2">
        {data.map((d) => (
          <div key={d.date} className="flex flex-col items-center text-xs">
            <div
              className="w-8 h-8 rounded bg-green-500"
              style={{ opacity: d.probability }}
              aria-label={`${d.date} probability ${(d.probability * 100).toFixed(0)}%`}
            />
            <span>
              {new Date(d.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

