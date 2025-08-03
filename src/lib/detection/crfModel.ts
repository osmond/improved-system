/**
 * Simple CRF-inspired classifier trained on binary sequences.
 * Returns 1 when majority of sequence values are 1, else 0.
 */
export function predictFocus(sequence: number[]): 0 | 1 {
  const ones = sequence.reduce((a, b) => a + (b > 0 ? 1 : 0), 0);
  return ones > sequence.length / 2 ? 1 : 0;
}
