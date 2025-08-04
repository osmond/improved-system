'use client'

import React, { useState, useMemo } from 'react'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { computeFragilityIndex, computePValue } from '@/lib/clinicalFragility'
import * as Collapsible from '@radix-ui/react-collapsible'
import { ChevronRight } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/tooltip'

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

interface TermProps {
  term: string
  definition: string
  href?: string
}

function Term({ term, definition, href }: TermProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="underline decoration-dotted cursor-help">{term}</span>
      </TooltipTrigger>
      <TooltipContent>
        {definition}
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="ml-1 underline"
          >
            Docs
          </a>
        )}
      </TooltipContent>
    </Tooltip>
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

  const [open, setOpen] = useState(false)

  return (
    <TooltipProvider>
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
          <div>
            <Term
              term="P-value"
              definition="Probability of observing these results if the null hypothesis is true."
              href="https://en.wikipedia.org/wiki/P-value"
            />
            : {p.toPrecision(3)}
          </div>
          <div>
            <Term
              term="Fragility Index"
              definition="Number of outcome flips needed to lose statistical significance."
              href="https://en.wikipedia.org/wiki/Fragility_index"
            />
            : {fi}
          </div>
        </div>
        <Collapsible.Root
          open={open}
          onOpenChange={setOpen}
          className="space-y-2"
        >
          <Collapsible.Trigger asChild>
            <Button
              variant="outline"
              aria-expanded={open}
              aria-controls="how-it-works"
            >
              How it works
              <ChevronRight className="ml-2 h-4 w-4 transition-transform data-[state=open]:rotate-90" />
            </Button>
          </Collapsible.Trigger>
          <Collapsible.Content
            id="how-it-works"
            className="space-y-2 rounded-md border p-4 text-sm"
          >
            <p>
              1. Enter counts into a 2×2 table for events and non-events in
              each group.
            </p>
            <p>
              2. Calculate the{' '}
              <Term
                term="p-value"
                definition="Measure of how compatible the data are with the null hypothesis."
                href="https://en.wikipedia.org/wiki/P-value"
              />{' '}
              using{' '}
              <Term
                term="Fisher's exact test"
                definition="Statistical test for small-sample 2×2 tables."
                href="https://en.wikipedia.org/wiki/Fisher%27s_exact_test"
              />
              .
            </p>
            <p>
              3. Flip outcomes between groups until the{' '}
              <Term
                term="p-value"
                definition="Measure of how compatible the data are with the null hypothesis."
                href="https://en.wikipedia.org/wiki/P-value"
              />
              {' '}reaches 0.05 or higher; the number of flips is the{' '}
              <Term
                term="fragility index"
                definition="Count of flips required for non-significance."
                href="https://en.wikipedia.org/wiki/Fragility_index"
              />
              .
            </p>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
    </TooltipProvider>
  )
}
