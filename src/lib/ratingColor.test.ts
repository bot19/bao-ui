import { describe, expect, it } from 'vitest'
import { formatRating, ratingToCssColor, ratingToHue } from './ratingColor'

const PLACEHOLDER = '–'

describe('formatRating', () => {
  it('shows the placeholder for a missing rating', () => {
    expect(formatRating(null)).toBe(PLACEHOLDER)
    expect(formatRating(undefined)).toBe(PLACEHOLDER)
  })

  it('shows the placeholder for a non-finite rating', () => {
    expect(formatRating(Number.NaN)).toBe(PLACEHOLDER)
    expect(formatRating(Number.POSITIVE_INFINITY)).toBe(PLACEHOLDER)
    expect(formatRating(Number.NEGATIVE_INFINITY)).toBe(PLACEHOLDER)
  })

  it('formats a finite rating to one decimal', () => {
    expect(formatRating(4.25)).toBe('4.3')
    expect(formatRating(5)).toBe('5.0')
    expect(formatRating(1)).toBe('1.0')
  })
})

describe('ratingToHue', () => {
  it('maps 1 to red and 5 to green', () => {
    expect(ratingToHue(1)).toBe(0)
    expect(ratingToHue(5)).toBe(120)
  })

  it('clamps outside 1-5', () => {
    expect(ratingToHue(0)).toBe(0)
    expect(ratingToHue(9)).toBe(120)
  })

  it('is linear in between', () => {
    expect(ratingToHue(3)).toBe(60)
  })
})

describe('ratingToCssColor', () => {
  it('returns an hsl colour for the rating hue', () => {
    expect(ratingToCssColor(1)).toBe('hsl(0 65% 38%)')
    expect(ratingToCssColor(5)).toBe('hsl(120 65% 38%)')
  })
})
