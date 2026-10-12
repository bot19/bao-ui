import {
  IconDice,
  IconMenu2,
  IconPlus,
  IconSearch,
  IconSparkles,
} from '@tabler/icons-react'
import { IconButton } from '@/components/ui/IconButton'

type Props = {
  isSearchOpen: boolean
  isActivityOpen: boolean
  isAddOpen: boolean
  isNavOpen: boolean
  /** Total group places for the Search badge. Null while places load. */
  totalPlaceCount: number | null
  onSearch: () => void
  onAdd: () => void
  onActivity: () => void
  onNav: () => void
}

/**
 * Primary map chrome. Rendered outside MapsProvider so a Google Maps load
 * failure can never take the app's only navigation with it.
 */
export function MapNavBar({
  isSearchOpen,
  isActivityOpen,
  isAddOpen,
  isNavOpen,
  totalPlaceCount,
  onSearch,
  onAdd,
  onActivity,
  onNav,
}: Props) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <nav
        aria-label="Primary"
        className="pointer-events-auto flex w-full justify-center"
      >
        <div className="flex w-full items-end justify-between gap-3 rounded-2xl bg-white/95 px-5 py-3 shadow-lg backdrop-blur sm:w-max sm:min-w-[22rem]">
          <IconButton
            aria-label={
              totalPlaceCount == null
                ? 'Search'
                : `Search, ${totalPlaceCount} place${totalPlaceCount === 1 ? '' : 's'}`
            }
            isActive={isSearchOpen}
            statusIndicator={totalPlaceCount}
            className="h-10 w-10"
            onClick={onSearch}
          >
            <IconSearch size={22} stroke={1.75} />
          </IconButton>

          <IconButton
            aria-label="Help me choose"
            disabled
            className="h-10 w-10"
          >
            <IconDice size={22} stroke={1.75} />
          </IconButton>

          <IconButton
            aria-label="Add review"
            isActive={isAddOpen}
            className="h-10 w-10 rounded-full !bg-primary !text-white transition-colors duration-200 hover:!bg-purple-800"
            onClick={onAdd}
          >
            <IconPlus size={22} stroke={2} />
          </IconButton>

          <IconButton
            aria-label="Activity"
            isActive={isActivityOpen}
            className="h-10 w-10"
            onClick={onActivity}
          >
            <IconSparkles size={22} stroke={1.75} />
          </IconButton>

          <IconButton
            aria-label="Nav"
            isActive={isNavOpen}
            className="h-10 w-10"
            onClick={onNav}
          >
            <IconMenu2 size={22} stroke={1.75} />
          </IconButton>
        </div>
      </nav>
    </div>
  )
}
