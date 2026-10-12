import { PRICE_LEVELS } from '@/lib/formatPrice'

type Props = {
  value: number | null | undefined
  onChange: (price: number) => void
  error?: string
}

export function PriceInput({ value, onChange, error }: Props) {
  const errorId = 'price-error'

  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="text-sm font-medium text-neutral-800">Price</legend>
      <div
        role="radiogroup"
        aria-label="Price"
        className="mt-2 flex gap-2"
        onKeyDown={(event) => {
          if (value == null) return
          if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            event.preventDefault()
            onChange(Math.min(3, value + 1))
          }
          if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            event.preventDefault()
            onChange(Math.max(1, value - 1))
          }
        }}
      >
        {PRICE_LEVELS.map((price) => {
          const selected = value === price.value
          return (
            <button
              key={price.value}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={price.label}
              className={`min-w-0 flex-1 rounded-md px-2 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 ${
                selected
                  ? 'bg-ink text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              onClick={() => onChange(price.value)}
            >
              {price.label}
            </button>
          )
        })}
      </div>
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}
