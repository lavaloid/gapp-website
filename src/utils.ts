/**
 * Get all integers from `from` to `to` inclusive
 */
export const range = (from: number, to: number) =>
  Array.from({
    length: to - from + 1,
  }).map((_, i) => i + from);
