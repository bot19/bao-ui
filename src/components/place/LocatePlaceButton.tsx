import { IconCurrentLocation } from '@tabler/icons-react'
import { IconButton } from '@/components/ui/IconButton'

type Props = {
  onClick: () => void
  className?: string
}

/** Square control that centers the map on a place. Shared by the place hero. */
export function LocatePlaceButton({ onClick, className }: Props) {
  return (
    <IconButton
      aria-label="Center map on this place"
      onClick={onClick}
      variant="elevated"
      className={className}
    >
      <IconCurrentLocation size={18} stroke={1.75} aria-hidden />
    </IconButton>
  )
}
