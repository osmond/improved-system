// src/lib/utils.ts
export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function minutesSince(date: string | number | Date): number {
  const d = new Date(date)
  return Math.floor((Date.now() - d.getTime()) / 60000)
}

export function generateTrendMessage(): string {
  const direction = Math.random() < 0.5 ? 'up' : 'down'
  const percentage = (Math.random() * (8 - 3) + 3).toFixed(1)
  return `Trending ${direction} by ${percentage}% this month`
}

