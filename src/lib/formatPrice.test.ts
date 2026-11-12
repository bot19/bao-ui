import { describe, expect, it } from 'vitest'
import { PRICE_LEVELS, formatPriceLevel } from './formatPrice'

describe('formatPriceLevel', () => {
  it('returns null for a missing or non-finite price', () => {
    expect(formatPriceLevel(null)).toBeNull()
    expect(formatPriceLevel(undefined)).toBeNull()
    expect(formatPriceLevel(Number.NaN)).toBeNull()
    expect(formatPriceLevel(Number.POSITIVE_INFINITY)).toBeNull()
  })

  it('labels each of the three levels', () => {
    expect(formatPriceLevel(1)).toBe('<$25')
    expect(formatPriceLevel(2)).toBe('$25-50')
    expect(formatPriceLevel(3)).toBe('$50+')
  })

  it('clamps and rounds into 1-3', () => {
    expect(formatPriceLevel(0)).toBe('<$25')
    expect(formatPriceLevel(7)).toBe('$50+')
    expect(formatPriceLevel(2.4)).toBe('$25-50')
  })
})

describe('PRICE_LEVELS', () => {
  it('stays in ascending order with no gaps', () => {
    expect(PRICE_LEVELS.map((entry) => entry.value)).toEqual([1, 2, 3])
  })
})
