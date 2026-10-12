import {
  IconCurrentLocation,
  IconHome,
  IconMinus,
  IconPlus,
} from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { IconButton } from '@/components/ui/IconButton'

type Props = {
  hasHome: boolean
  isLocating: boolean
  /**
   * Mobile only: when true, the rail slides off the right edge (any panel
   * open). Desktop ignores this — the rail stays put.
   */
  isHidden?: boolean
  onHome: () => void
  onLocate: () => void
  onZoomIn: () => void
  onZoomOut: () => void
}

/**
 * Right-side map tools. Flush to the right edge; left corners rounded.
 * Mobile: under floating panels (z-30), centre at 60% viewport height;
 * slides away while any overlay panel is open.
 * Desktop: above floating panels, under the nav drawer; vertically centred
 * and always visible.
 */
export function MapControlsRail({
  hasHome,
  isLocating,
  isHidden = false,
  onHome,
  onLocate,
  onZoomIn,
  onZoomOut,
}: Props) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(max-width: 639px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const slidAway = isHidden && isMobile

  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 z-30 sm:z-[45]">
      <div
        className={[
          'absolute top-[60%] right-0 -translate-y-1/2 sm:top-1/2',
          'motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out',
          slidAway ? 'translate-x-full' : 'translate-x-0',
          slidAway ? 'pointer-events-none' : 'pointer-events-auto',
        ].join(' ')}
      >
        <nav
          aria-label="Map controls"
          aria-hidden={slidAway || undefined}
          className="flex flex-col items-center gap-1.5 rounded-l-2xl bg-white/95 py-1.5 pr-[max(0.375rem,env(safe-area-inset-right))] pl-1.5 shadow-lg backdrop-blur"
        >
          <IconButton
            aria-label="Go to home location"
            disabled={!hasHome || slidAway}
            tabIndex={slidAway ? -1 : undefined}
            className="h-10 w-10"
            onClick={onHome}
          >
            <IconHome size={22} stroke={1.75} />
          </IconButton>

          <IconButton
            aria-label={
              isLocating ? 'Finding your location' : 'Go to my location'
            }
            disabled={isLocating || slidAway}
            tabIndex={slidAway ? -1 : undefined}
            className="h-10 w-10 disabled:cursor-wait"
            onClick={onLocate}
          >
            <IconCurrentLocation
              size={22}
              stroke={1.75}
              className={isLocating ? 'animate-pulse' : undefined}
            />
          </IconButton>

          <IconButton
            aria-label="Zoom in"
            disabled={slidAway}
            tabIndex={slidAway ? -1 : undefined}
            className="h-10 w-10"
            onClick={onZoomIn}
          >
            <IconPlus size={22} stroke={1.75} />
          </IconButton>

          <IconButton
            aria-label="Zoom out"
            disabled={slidAway}
            tabIndex={slidAway ? -1 : undefined}
            className="h-10 w-10"
            onClick={onZoomOut}
          >
            <IconMinus size={22} stroke={1.75} />
          </IconButton>
        </nav>
      </div>
    </div>
  )
}
