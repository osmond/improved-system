// src/lib/utils.ts
export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatPace(pace: number): string {
  const m = Math.floor(pace)
  const s = Math.round((pace - m) * 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
