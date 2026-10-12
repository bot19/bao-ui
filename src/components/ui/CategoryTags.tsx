import { IconTag } from '@tabler/icons-react'
import { formatCategoryLabel } from '@/lib/category'

type Props = {
  categories: readonly string[]
  className?: string
  /** Single-line truncate (default: 2-line clamp). */
  truncate?: boolean
}

/** Read-only category line with a tag icon — not for form field labels. */
export function CategoryTags({
  categories,
  className,
  truncate = false,
}: Props) {
  const label = categories
    .map((tag) => formatCategoryLabel(tag))
    .filter(Boolean)
    .join(', ')
  if (!label) return null

  return (
    <p
      className={[
        'flex min-w-0 items-start gap-1 text-sm leading-tight text-neutral-700',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <IconTag
        size={14}
        stroke={1.75}
        aria-hidden
        className="mt-0.5 shrink-0"
      />
      <span
        className={
          truncate ? 'min-w-0 truncate' : 'min-w-0 line-clamp-2'
        }
      >
        {label}
      </span>
    </p>
  )
}
