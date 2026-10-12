import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { IconX } from '@tabler/icons-react'

type Props = {
  children: ReactNode
  onRemove: () => void
  /** Accessible label for the remove control. */
  removeLabel?: string
  className?: string
  removeButtonProps?: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'onClick' | 'type' | 'aria-label'
  >
}

const DEFAULT_PILL =
  'inline-flex max-w-full items-center gap-1 rounded-full bg-purple-100 py-1 pr-1 pl-2.5 text-sm font-medium text-purple-900'

const DEFAULT_REMOVE =
  'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-primary hover:bg-purple-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary'

/**
 * Removable tag chip. Default purple; pass `className` to restyle the pill
 * (and optionally `removeButtonProps.className` for the X).
 */
export function RemovablePill({
  children,
  onRemove,
  removeLabel = 'Remove',
  className = '',
  removeButtonProps,
}: Props) {
  const { className: removeClassName = '', ...restRemove } =
    removeButtonProps ?? {}

  return (
    <span className={`${DEFAULT_PILL} ${className}`.trim()}>
      <span className="min-w-0 truncate">{children}</span>
      <button
        {...restRemove}
        type="button"
        aria-label={removeLabel}
        className={`${DEFAULT_REMOVE} ${removeClassName}`.trim()}
        onClick={onRemove}
      >
        <IconX size={14} stroke={2} aria-hidden />
      </button>
    </span>
  )
}
