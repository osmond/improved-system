import React from "react"
import OutcomeFlipSimulator from "@/components/fragility/OutcomeFlipSimulator"

export default function ClinicalFragilityDemoPage() {
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Clinical Fragility Demo</h1>
      <p className="text-sm">
        Read more in the <a href="/docs/fragility-index.md" className="underline">Fragility Index guide</a> and
        <a href="/docs/fragility-examples.md" className="underline ml-1">examples</a>.
      </p>
      <OutcomeFlipSimulator />
    </div>
  )
}
