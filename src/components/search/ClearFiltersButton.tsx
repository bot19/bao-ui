import { IconFilterX } from '@tabler/icons-react'

type Props = {
  onClick: () => void
}

/** Map chrome: dismiss active place filters when Search is closed. */
export function ClearFiltersButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-2xl bg-white/95 px-3.5 py-2 text-sm font-medium text-neutral-800 shadow-lg backdrop-blur hover:bg-white"
    >
      <IconFilterX size={18} stroke={1.75} aria-hidden />
      Clear filters
    </button>
  )
}
