// src/lib/locationStore.ts
// Utilities for persisting a user's long-term location engagement baseline.

export interface LocationBaseline {
  /** Normalized location entropy rolling average */
  locationEntropy: number;
  /** Out-of-home frequency rolling average */
  outOfHomeFrequency: number;
}

const KEY_PREFIX = "locationBaseline:";

function storageKey(userId: string) {
  return `${KEY_PREFIX}${userId}`;
}

export function getLocationBaseline(userId: string): LocationBaseline | null {
  const raw = localStorage.getItem(storageKey(userId));
  return raw ? (JSON.parse(raw) as LocationBaseline) : null;
}

function saveLocationBaseline(userId: string, baseline: LocationBaseline) {
  localStorage.setItem(storageKey(userId), JSON.stringify(baseline));
}

/**
 * Update and persist the long-term baseline using exponential smoothing.
 * The `alpha` parameter controls how quickly the baseline adapts.
 */
export function updateLocationBaseline(
  userId: string,
  current: LocationBaseline,
  alpha = 0.1,
): LocationBaseline {
  const existing = getLocationBaseline(userId);
  const next = existing
    ? {
        locationEntropy:
          existing.locationEntropy * (1 - alpha) + current.locationEntropy * alpha,
        outOfHomeFrequency:
          existing.outOfHomeFrequency * (1 - alpha) +
          current.outOfHomeFrequency * alpha,
      }
    : current;
  saveLocationBaseline(userId, next);
  return next;
}

