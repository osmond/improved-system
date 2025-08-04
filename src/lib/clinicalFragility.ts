export function computePValue(a: number, b: number, c: number, d: number): number {
  return pValue(a, b, c, d)
}

export function computeFragilityIndex(a: number, b: number, c: number, d: number): number {
  let flips = 0
  let p = pValue(a, b, c, d)
  if (p >= 0.05) return 0
  while (p < 0.05) {
    if (a <= c) {
      if (b <= 0) break
      a += 1
      b -= 1
    } else {
      if (d <= 0) break
      c += 1
      d -= 1
    }
    flips += 1
    p = pValue(a, b, c, d)
  }
  return flips
}

function pValue(a: number, b: number, c: number, d: number): number {
  if (Math.min(a, b, c, d) < 5) {
    return fisherExactPValue(a, b, c, d)
  }
  return chiSquarePValue(a, b, c, d)
}

function fisherExactPValue(a: number, b: number, c: number, d: number): number {
  const row1 = a + b
  const row2 = c + d
  const col1 = a + c
  const n = row1 + row2
  const obs = hypergeomProb(a, row1, row2, col1)
  let p = 0
  const min = Math.max(0, col1 - row2)
  const max = Math.min(row1, col1)
  for (let i = min; i <= max; i++) {
    const prob = hypergeomProb(i, row1, row2, col1)
    if (prob <= obs + 1e-12) p += prob
  }
  return p
}

function hypergeomProb(x: number, row1: number, row2: number, col1: number): number {
  const n = row1 + row2
  const logP =
    logCombination(row1, x) +
    logCombination(row2, col1 - x) -
    logCombination(n, col1)
  return Math.exp(logP)
}

const logFactorialCache: number[] = [0]
function logFactorial(n: number): number {
  if (logFactorialCache[n] !== undefined) return logFactorialCache[n]
  let last = logFactorialCache.length
  let log = logFactorialCache[last - 1]
  for (let i = last; i <= n; i++) {
    log += Math.log(i)
    logFactorialCache[i] = log
  }
  return logFactorialCache[n]
}

function logCombination(n: number, k: number): number {
  if (k < 0 || k > n) return -Infinity
  return logFactorial(n) - logFactorial(k) - logFactorial(n - k)
}

function chiSquarePValue(a: number, b: number, c: number, d: number): number {
  const n = a + b + c + d
  const numerator = n * (a * d - b * c) ** 2
  const denominator = (a + b) * (c + d) * (a + c) * (b + d)
  const chi2 = numerator / denominator
  return 1 - erf(Math.sqrt(chi2 / 2))
}

function erf(x: number): number {
  // Abramowitz and Stegun formula 7.1.26
  const sign = x >= 0 ? 1 : -1
  const absX = Math.abs(x)
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911
  const t = 1 / (1 + p * absX)
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX))
  return sign * y
}
