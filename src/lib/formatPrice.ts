/** Price levels stored as 1–3; labels are per-person spend bands. */
export const PRICE_LEVELS = [
  { value: 1, label: '<$25' },
  { value: 2, label: '$25-50' },
  { value: 3, label: '$50+' },
] as const

export type PriceLevel = (typeof PRICE_LEVELS)[number]['value']

/** Format a 1–3 price level as `<$25` / `$25-50` / `$50+`. */
export function formatPriceLevel(
  price: number | null | undefined,
): string | null {
  if (price == null || !Number.isFinite(price)) return null
  const level = Math.min(3, Math.max(1, Math.round(price)))
  return PRICE_LEVELS.find((entry) => entry.value === level)?.label ?? null
}
