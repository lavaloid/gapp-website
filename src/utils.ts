/**
 * Get all integers from `from` to `to` inclusive
 */
export const range = (from: number, to: number) =>
  Array.from({
    length: to - from + 1,
  }).map((_, i) => i + from);

export const formatISODate = (date: Date) => {
  // using .toLocaleDateString("sv") will output the date formatted
  // as ISO 8601. thank you sweden
  return date.toLocaleDateString("sv");
};
