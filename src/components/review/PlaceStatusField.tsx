import { IconBuildingOff, IconCircleCheck, IconThumbDown } from '@tabler/icons-react'
import type { PlaceStatus } from '@/lib/placeStatus'

type Props = {
  value: PlaceStatus
  onChange: (status: PlaceStatus) => void
}

const OPTIONS: {
  status: PlaceStatus
  label: string
  icon: typeof IconCircleCheck
}[] = [
  { status: 'active', label: 'Active', icon: IconCircleCheck },
  { status: 'closed', label: 'Closed', icon: IconBuildingOff },
  { status: 'avoid', label: 'Avoid', icon: IconThumbDown },
]

export function PlaceStatusField({ value, onChange }: Props) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-neutral-800">Status</legend>
      <div
        role="radiogroup"
        aria-label="Status"
        className="mt-2 grid grid-cols-3 gap-2"
      >
        {OPTIONS.map((option) => {
          const selected = value === option.status
          const Icon = option.icon
          return (
            <button
              key={option.status}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.status)}
              className={[
                'flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 py-2 text-sm font-medium',
                selected
                  ? 'bg-ink text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
              ].join(' ')}
            >
              <Icon size={16} stroke={1.75} aria-hidden />
              {option.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
