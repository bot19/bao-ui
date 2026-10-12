/** Lowercase kebab slug: "Asian Fusion" → "asian-fusion". */
export function normalizeCategory(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/** True when the slug is letters/hyphens only and at least 3 chars. */
export function isValidCategory(slug: string): boolean {
  return slug.length >= 3 && /^[a-z]+(-[a-z]+)*$/.test(slug)
}

/** Max categories allowed on a single review (DB CHECK + form). */
export const MAX_REVIEW_CATEGORIES = 5

/** Google suffixes most food types with the venue kind; the category precedes it. */
const VENUE_SUFFIXES = new Set(['restaurant', 'shop', 'store'])

/** Google types whose stripped slug is wrong or meaningless. */
const PRIMARY_TYPE_ALIASES: Record<string, string> = {
  meal_takeaway: 'takeaway',
  meal_delivery: 'delivery',
  sandwich_shop: 'sandwiches',
  hamburger_restaurant: 'burgers',
  australian_restaurant: 'aussie',
  fish_and_chips_restaurant: 'fish-n-chips',
  steak_house: 'steak',
  taco_restaurant: 'tacos',
}

/**
 * Google `primaryType` → category slug.
 * `chinese_restaurant` → `chinese`, `ice_cream_shop` → `ice-cream`;
 * no venue suffix → as-is (`cafe` → `cafe`, `bakery` → `bakery`).
 */
export function categoryFromPrimaryType(
  primaryType: string | null | undefined,
): string | null {
  const raw = primaryType?.trim().toLowerCase()
  if (!raw) return null

  const alias = PRIMARY_TYPE_ALIASES[raw]
  if (alias) return alias

  const segments = raw.split('_').filter(Boolean)
  if (segments.length > 1 && VENUE_SUFFIXES.has(segments.at(-1) ?? '')) {
    segments.pop()
  }

  const slug = normalizeCategory(segments.join('-'))
  return slug || null
}

/** Human label: `asian-fusion` → `Asian Fusion`. */
export function formatCategoryLabel(tag: string): string {
  const spaced = tag.replace(/[-_]+/g, ' ').trim()
  if (!spaced) return tag
  return spaced.replace(/\b\w/g, (char) => char.toUpperCase())
}

/**
 * Select options: Google primary type (processed) plus every category
 * already used on places in the group.
 */
export function buildCategoryOptions(params: {
  primaryType: string | null | undefined
  groupTypes: readonly string[]
}): string[] {
  const tags = new Set<string>()

  const fromPrimary = categoryFromPrimaryType(params.primaryType)
  if (fromPrimary) tags.add(fromPrimary)

  for (const tag of params.groupTypes) {
    const slug = normalizeCategory(tag)
    if (slug) tags.add(slug)
  }

  return [...tags].sort((a, b) => a.localeCompare(b))
}

/** Prefill: all place categories (cap 5), else cleaned Google primary. */
export function defaultReviewCategories(params: {
  placeCategories: readonly string[] | null | undefined
  primaryType: string | null | undefined
}): string[] {
  const fromPlace: string[] = []
  const seen = new Set<string>()
  for (const tag of params.placeCategories ?? []) {
    const slug = normalizeCategory(tag)
    if (!slug || seen.has(slug)) continue
    seen.add(slug)
    fromPlace.push(slug)
    if (fromPlace.length >= 5) return fromPlace
  }
  if (fromPlace.length > 0) return fromPlace

  const fromPrimary = categoryFromPrimaryType(params.primaryType)
  return fromPrimary ? [fromPrimary] : []
}
