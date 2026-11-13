import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { FullRow, SPECIMEN_GRID } from './layout'

describe('catalog layout', () => {
  it('stacks items below md and puts two per row from md', () => {
    const classes = SPECIMEN_GRID.split(' ')
    expect(classes).toContain('grid')
    expect(classes).toContain('md:grid-cols-2')
    expect(classes.some((c) => c.startsWith('sm:'))).toBe(false)
  })

  it('lets an item opt in to the whole row', () => {
    const html = renderToStaticMarkup(
      <div className={SPECIMEN_GRID}>
        <FullRow>
          <p>wide</p>
        </FullRow>
      </div>,
    )
    expect(html).toContain('<div class="md:col-span-2"><p>wide</p></div>')
  })
})
