export const PLACE_STATUSES = ['active', 'closed', 'avoid'] as const

export type PlaceStatus = (typeof PLACE_STATUSES)[number]

export function isPlaceStatus(value: string): value is PlaceStatus {
  return (PLACE_STATUSES as readonly string[]).includes(value)
}

/** Closed beats avoid. Active is the absence of both. */
export function winningPlaceStatus(
  statuses: ReadonlyArray<string | null | undefined>,
): 'closed' | 'avoid' | null {
  if (statuses.some((status) => status === 'closed')) return 'closed'
  if (statuses.some((status) => status === 'avoid')) return 'avoid'
  return null
}

export function statusTitle(status: 'closed' | 'avoid', name: string): string {
  return status === 'closed' ? `Closed: ${name}` : `Avoid: ${name}`
}

export function statusFallbackComment(status: 'closed' | 'avoid'): string {
  return status === 'closed'
    ? 'Set place as closed.'
    : 'Set place as avoid.'
}
