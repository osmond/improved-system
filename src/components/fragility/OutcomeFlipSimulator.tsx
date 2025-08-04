'use client'

import React, { useState, useMemo } from 'react'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { computeFragilityIndex, computePValue } from '@/lib/clinicalFragility'

interface CellProps {
  label: string
  value: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onInc: () => void
  onDec: () => void
}

function Cell({ label, value, onChange, onInc, onDec }: CellProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center space-x-2">
        <Button size="sm" onClick={onDec}>
          -
        </Button>
        <Input
          type="number"
          value={value}
          onChange={onChange}
          className="w-20 text-center"
        />
        <Button size="sm" onClick={onInc}>
          +
        </Button>
      </div>
    </div>
  )
}

export default function OutcomeFlipSimulator() {
  const [a, setA] = useState(5)
  const [b, setB] = useState(0)
  const [c, setC] = useState(0)
  const [d, setD] = useState(5)

  const p = useMemo(() => computePValue(a, b, c, d), [a, b, c, d])
  const fi = useMemo(() => computeFragilityIndex(a, b, c, d), [a, b, c, d])

  const handleChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    setter(Number.isNaN(value) ? 0 : Math.max(0, value))
  }

  const increment = (
    setter: React.Dispatch<React.SetStateAction<number>>,
  ) => () => setter((v) => v + 1)

  const decrement = (
    setter: React.Dispatch<React.SetStateAction<number>>,
  ) => () => setter((v) => Math.max(0, v - 1))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Cell
          label="Group 1 Event"
          value={a}
          onChange={handleChange(setA)}
          onInc={increment(setA)}
          onDec={decrement(setA)}
        />
        <Cell
          label="Group 1 No Event"
          value={b}
          onChange={handleChange(setB)}
          onInc={increment(setB)}
          onDec={decrement(setB)}
        />
        <Cell
          label="Group 2 Event"
          value={c}
          onChange={handleChange(setC)}
          onInc={increment(setC)}
          onDec={decrement(setC)}
        />
        <Cell
          label="Group 2 No Event"
          value={d}
          onChange={handleChange(setD)}
          onInc={increment(setD)}
          onDec={decrement(setD)}
        />
      </div>
      <div className="space-y-1 text-sm">
        <div>P-value: {p.toPrecision(3)}</div>
        <div>Fragility Index: {fi}</div>
      </div>
    </div>
  )
}
