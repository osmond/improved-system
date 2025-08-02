import React from "react";
import CompactNextGameCard from "@/components/dashboard/CompactNextGameCard";

export default function CompactNextGameCardPage() {
  return (
    <div className="p-4">
      <CompactNextGameCard homeTeam="Wild" awayTeam="Blues" date="Sep 30, 2025" time="7:00 PM" isHome={true} countdown="in 2 months" accentColor="#006847" />
    </div>
  );
}
