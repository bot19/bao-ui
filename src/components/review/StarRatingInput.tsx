import { IconStarFilled } from '@tabler/icons-react'
import { useRef, useState } from 'react'

type Props = {
  value: number | undefined
  onChange: (rating: number) => void
  error?: string
}

const STARS = [1, 2, 3, 4, 5] as const
const STEP = 0.5
const MAX_RATING = 5
// An icon, not the ★ character: the glyph sits high in its line box, so it
// never looks centred in the chip, and it renders as an emoji on some phones.
const STAR_SIZE = 34
// Inset offset: the star clips overflow to draw the half fill.
const RING = 'outline outline-2 -outline-offset-2 outline-neutral-500'
const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neutral-500'

function formatRatingLabel(rating: number): string {
  const amount = Number.isInteger(rating) ? String(rating) : rating.toFixed(1)
  return `${amount} star${rating === 1 ? '' : 's'}`
}

export function StarRatingInput({ value, onChange, error }: Props) {
  const errorId = 'rating-error'
  const groupRef = useRef<HTMLDivElement>(null)
  const [preview, setPreview] = useState<number | null>(null)
  const [arrowing, setArrowing] = useState(false)

  function step(direction: 1 | -1) {
    const from = value ?? 0
    const next = Math.min(MAX_RATING, Math.max(STEP, from + direction * STEP))
    onChange(next)
    setArrowing(true)
    // The pointer may still rest on a star hovered earlier, which would
    // otherwise keep drawing that score over the one just chosen.
    setPreview(null)
    // Focus follows the selection, as a radiogroup is expected to — otherwise
    // a screen reader never hears the option the arrow key just checked.
    groupRef.current
      ?.querySelector<HTMLButtonElement>(`[data-rating="${next}"]`)
      ?.focus()
  }

  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="text-sm font-medium text-neutral-800">Rating</legend>
      <div className="mt-2 flex items-center gap-3">
        <div
          ref={groupRef}
          role="radiogroup"
          aria-label="Rating"
          // Five 56px stars and their gaps, shrinking together on narrow phones.
          className="flex min-w-0 max-w-[296px] flex-1 gap-1"
          onMouseLeave={() => setPreview(null)}
          onPointerDown={() => setArrowing(false)}
          onBlur={() => setArrowing(false)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
              event.preventDefault()
              step(1)
            }
            if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
              event.preventDefault()
              step(-1)
            }
          }}
        >
          {STARS.map((star) => (
            <Star
              key={star}
              star={star}
              value={value}
              fillTo={preview ?? value}
              ringedRating={arrowing ? value : undefined}
              onChange={onChange}
              onPreview={setPreview}
            />
          ))}
        </div>
        <span aria-hidden className="text-sm tabular-nums text-neutral-500">
          {value == null ? '' : value.toFixed(1)}
        </span>
      </div>
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}

type StarProps = {
  star: number
  value: number | undefined
  /** Rating the stars are drawn to — the hovered half, or the current value. */
  fillTo: number | undefined
  /** Rating to ring while arrow keys are driving the group. */
  ringedRating: number | undefined
  onChange: (rating: number) => void
  onPreview: (rating: number | null) => void
}

/**
 * One star, two hit targets: the left half scores x.5, the right half scores x.
 * The glyph is drawn twice and the purple copy clipped to the fill width, so a
 * half score reads as half a star rather than as a different icon.
 */
function Star({
  star,
  value,
  fillTo,
  ringedRating,
  onChange,
  onPreview,
}: StarProps) {
  const fill =
    fillTo == null ? 0 : Math.min(1, Math.max(0, fillTo - (star - 1)))

  return (
    <div className="relative h-11 min-w-0 flex-1 overflow-hidden rounded-md bg-neutral-100 transition hover:bg-neutral-200">
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 bg-purple-100"
        style={{ width: `${fill * 100}%` }}
      />
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center text-neutral-400"
      >
        <IconStarFilled size={STAR_SIZE} />
      </span>
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center text-purple-900"
        style={{ clipPath: `inset(0 ${100 - fill * 100}% 0 0)` }}
      >
        <IconStarFilled size={STAR_SIZE} />
      </span>
      <StarHalf
        rating={star - STEP}
        value={value}
        ringed={ringedRating === star - STEP}
        onChange={onChange}
        onPreview={onPreview}
        className="left-0"
      />
      <StarHalf
        rating={star}
        value={value}
        ringed={ringedRating === star}
        onChange={onChange}
        onPreview={onPreview}
        className="right-0"
      />
    </div>
  )
}

type StarHalfProps = {
  rating: number
  value: number | undefined
  ringed: boolean
  onChange: (rating: number) => void
  onPreview: (rating: number | null) => void
  className: string
}

function StarHalf({
  rating,
  value,
  ringed,
  onChange,
  onPreview,
  className,
}: StarHalfProps) {
  const selected = value === rating

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={formatRatingLabel(rating)}
      data-rating={rating}
      // Roving tabindex: ten options, one tab stop. Arrows move between them.
      tabIndex={selected || (value == null && rating === STEP) ? 0 : -1}
      // Ringed while arrowing because focus moved by script doesn't satisfy
      // :focus-visible, which would leave keyboard users with no focus ring.
      className={`absolute inset-y-0 w-1/2 cursor-pointer ${className} ${
        ringed ? RING : FOCUS_RING
      }`}
      onClick={() => onChange(rating)}
      onMouseEnter={() => onPreview(rating)}
    />
  )
}
