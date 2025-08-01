import React from "react"

export interface CompactNextGameCardProps {
  homeTeam: string
  awayTeam: string
  date: string
  time: string
  isHome: boolean
  countdown: string
  accentColor?: string
}

export default function CompactNextGameCard({
  homeTeam,
  awayTeam,
  date,
  time,
  isHome,
  countdown,
  accentColor = "#006847",
}: CompactNextGameCardProps) {
  return (
    <div className="max-w-sm rounded-xl bg-white border border-gray-200 shadow-sm p-4 flex items-start gap-3">
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold leading-tight">
              <span style={{ color: accentColor }}>{homeTeam}</span>{" "}
              <span className="font-normal text-gray-900">vs {awayTeam}</span>
            </h3>
            <div className="text-xs text-gray-500 mt-0.5">{countdown}</div>
          </div>
          <div className="text-right text-xs">
            <div>{date}</div>
            <div>{time}</div>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          {isHome && (
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-100 text-green-800">
              Home
            </span>
          )}
          <span className="text-[10px] text-gray-600">Xcel Energy Center</span>
        </div>
      </div>
    </div>
  )
}
