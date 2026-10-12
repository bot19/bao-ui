/**
 * Map a 1–5 average rating onto a red→green hue for pin badges.
 * Colour alone never carries meaning — pins also show the number.
 */
export function ratingToHue(rating: number): number {
  const clamped = Math.min(5, Math.max(1, rating))
  // 1 → 0° (red), 5 → 120° (green)
  return ((clamped - 1) / 4) * 120
}

/** Calculated red→green swatch for a 1–5 rating. Null/unrated → use `bg-neutral-500`. */
export function ratingToCssColor(rating: number): string {
  const hue = ratingToHue(rating)
  return `hsl(${hue} 65% 38%)`
}

export function formatRating(rating: number | null): string {
  if (rating == null) return '–'
  return rating.toFixed(1)
}
