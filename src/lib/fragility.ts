export const FRAGILITY_THRESHOLDS = {
  medium: 0.33,
  high: 0.66,
} as const

export interface FragilityLevel {
  key: 'low' | 'medium' | 'high'
  /** Label used in charts */
  label: string
  /** Description for textual summaries */
  description: string
  /** Color token used for charts and gauges */
  color: string
  /** Tailwind text color class for page legend */
  textClass: string
  /** Range displayed to users */
  displayMin: number
  displayMax: number
}

export const FRAGILITY_LEVELS: Record<FragilityLevel['key'], FragilityLevel> = {
  low: {
    key: 'low',
    label: 'Low',
    description: 'stable',
    color: 'hsl(var(--chart-3))',
    textClass: 'text-green-600',
    displayMin: 0,
    displayMax: FRAGILITY_THRESHOLDS.medium,
  },
  medium: {
    key: 'medium',
    label: 'Medium',
    description: 'monitor',
    color: 'hsl(var(--chart-8))',
    textClass: 'text-yellow-600',
    displayMin: FRAGILITY_THRESHOLDS.medium + 0.01,
    displayMax: FRAGILITY_THRESHOLDS.high,
  },
  high: {
    key: 'high',
    label: 'High',
    description: 'high risk',
    color: 'hsl(var(--destructive))',
    textClass: 'text-red-600',
    displayMin: FRAGILITY_THRESHOLDS.high + 0.01,
    displayMax: 1,
  },
} as const

export function getFragilityLevel(index: number): FragilityLevel {
  if (index > FRAGILITY_THRESHOLDS.high) return FRAGILITY_LEVELS.high
  if (index > FRAGILITY_THRESHOLDS.medium) return FRAGILITY_LEVELS.medium
  return FRAGILITY_LEVELS.low
}

