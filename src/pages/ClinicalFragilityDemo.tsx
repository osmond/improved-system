import React from "react"
import OutcomeFlipSimulator from "@/components/fragility/OutcomeFlipSimulator"

export default function ClinicalFragilityDemoPage() {
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Clinical Fragility Demo</h1>
      <OutcomeFlipSimulator />
    </div>
  )
}
