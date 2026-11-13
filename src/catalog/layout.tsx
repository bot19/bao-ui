import type { ReactNode } from 'react'

/**
 * The default layout for a section's items: one per row, then two per row
 * (half the content width) from md. A section that needs something else keeps
 * its own classes; an item that needs the whole row wraps itself in FullRow.
 */
export const SPECIMEN_GRID = 'grid gap-4 md:grid-cols-2'

/** Opts one item in a SPECIMEN_GRID out of the half-width default and across the whole row. */
export function FullRow({ children }: { children: ReactNode }) {
  return <div className="md:col-span-2">{children}</div>
}
