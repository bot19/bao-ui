import { IconChevronRight } from '@tabler/icons-react'
import { UserAvatar } from '@/components/user/UserAvatar'

type Props = {
  username: string
  onOpenUser: () => void
  homeLabel: string | null
  reviewCount: number | null
}

export function NavProfile({
  username,
  onOpenUser,
  homeLabel,
  reviewCount,
}: Props) {
  const reviewLabel =
    reviewCount == null
      ? 'Reviews'
      : `${reviewCount} review${reviewCount === 1 ? '' : 's'}`

  return (
    <section aria-labelledby="nav-profile-heading" className="space-y-3">
      <h2
        id="nav-profile-heading"
        className="text-xs font-semibold tracking-wide text-neutral-500 uppercase"
      >
        Profile
      </h2>
      <button
        type="button"
        onClick={onOpenUser}
        className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-left hover:bg-neutral-100"
      >
        <UserAvatar
          username={username}
          className="h-14 w-14 rounded-lg text-xl"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-ink">{username}</p>
          <p className="mt-0.5 truncate text-sm text-neutral-600">
            {homeLabel ?? 'Not set'}
          </p>
          <p className="mt-0.5 text-sm text-neutral-500">{reviewLabel}</p>
        </div>
        <IconChevronRight
          size={18}
          stroke={1.75}
          className="shrink-0 text-neutral-400"
          aria-hidden
        />
      </button>
    </section>
  )
}
