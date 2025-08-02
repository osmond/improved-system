"use client"

import Map, { Marker } from "react-map-gl/maplibre"
import maplibregl from "maplibre-gl"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { SessionPoint } from "@/hooks/useRunningSessions"

interface SessionDetailDrawerProps {
  session: SessionPoint | null
  onClose: () => void
}

export default function SessionDetailDrawer({ session, onClose }: SessionDetailDrawerProps) {
  return (
    <Sheet open={!!session} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent side="right" className="w-80 sm:w-96">
        <SheetHeader>
          <SheetTitle>Session Details</SheetTitle>
        </SheetHeader>
        {session && (
          <div className="space-y-4">
            <div className="h-48 w-full">
              <Map
                mapLib={maplibregl}
                mapStyle="https://demotiles.maplibre.org/style.json"
                initialViewState={{ longitude: session.lon, latitude: session.lat, zoom: 12 }}
                attributionControl={false}
                style={{ width: "100%", height: "100%" }}
              >
                <Marker longitude={session.lon} latitude={session.lat}>
                  <circle r={4} fill="hsl(var(--primary))" />
                </Marker>
              </Map>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span>Pace: {session.pace.toFixed(2)} min/mi</span>
              <span>Δ Pace: {session.paceDelta.toFixed(2)} min/mi</span>
              <span>Heart Rate: {session.heartRate} bpm</span>
              <span>Temp: {session.temperature}°F</span>
              <span>Humidity: {session.humidity}%</span>
              <span>Wind: {session.wind} mph</span>
              <span>Start Hour: {session.startHour}</span>
              <span>Duration: {session.duration} min</span>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
