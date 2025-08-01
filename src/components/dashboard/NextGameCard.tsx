import React from "react"

export interface NextGameCardProps {
  homeTeam: string
  awayTeam: string
  date: string
  time: string
  location: string
  isHome: boolean
  countdown: string
  logoUrl: string
  accentColor?: string
}

export default function NextGameCard({
  homeTeam,
  awayTeam,
  date,
  time,
  location,
  isHome,
  countdown,
  logoUrl,
  accentColor = "#8A1538",
}: NextGameCardProps) {
  return (
    <div className="max-w-md w-full rounded-2xl bg-white border border-gray-200 shadow-md p-6 flex flex-col">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div
            className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center ring-1 ring-gray-200"
            aria-label={`${homeTeam} logo`}
          >
            <img src={logoUrl} alt={`${homeTeam} logo`} className="w-10 h-10 object-contain" />
          </div>
        </div>
        <div className="flex-grow flex flex-col">
          <div>
            <span className="text-xs text-gray-500">Next Game</span>
            <h2 className="mt-1 text-2xl font-semibold leading-tight">
              <span style={{ color: accentColor }}>{homeTeam}</span>{" "}
              <span className="font-normal text-gray-900">vs {awayTeam}</span>
            </h2>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">{countdown}</span>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-1 text-right">
          <div className="text-sm font-medium text-gray-700">
            {date}, {time}
          </div>
          <div className="flex gap-2">
            {isHome && (
              <span
                className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full"
                style={{ backgroundColor: "#E6F4EA", color: "#1F4F2A" }}
              >
                Home
              </span>
            )}
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
              {location}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <button className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10m-11 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
          Game Details
        </button>
      </div>
    </div>
  )
}
