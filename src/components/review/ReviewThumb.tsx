import { IconBuildingOff, IconThumbDown } from '@tabler/icons-react'
import { reviewPhotoSources } from '@/lib/photoPath'
import { formatRating, ratingToCssColor } from '@/lib/ratingColor'

const SIZE = 56

type Props = {
  photoUrl: string | null
  /** Drives the colour-block fallback when there's no photo; null when unrated. */
  rating: number | null
  /** Closed and avoid use the pin colours and icon, in this thumbnail's shape. */
  status?: 'active' | 'closed' | 'avoid'
}

/** 56px review thumbnail, or a rating swatch. Shared by every review list. */
export function ReviewThumb({ photoUrl, rating, status = 'active' }: Props) {
  if (status === 'closed' || status === 'avoid') {
    const Icon = status === 'closed' ? IconBuildingOff : IconThumbDown
    return (
      <span
        aria-hidden
        className={[
          'flex h-14 w-14 shrink-0 items-center justify-center rounded-lg',
          status === 'closed'
            ? 'bg-neutral-100 text-neutral-400'
            : 'bg-red-100 text-red-700',
        ].join(' ')}
      >
        <Icon size={22} stroke={2} />
      </span>
    )
  }

  if (!photoUrl) {
    return (
      <span
        aria-hidden
        className={[
          'flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white',
          rating == null ? 'bg-neutral-500' : null,
        ]
          .filter(Boolean)
          .join(' ')}
        style={
          rating != null
            ? { backgroundColor: ratingToCssColor(rating) }
            : undefined
        }
      >
        {formatRating(rating)}
      </span>
    )
  }

  const { src, srcSet } = reviewPhotoSources(photoUrl)

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={`${SIZE}px`}
      width={SIZE}
      height={SIZE}
      alt=""
      loading="lazy"
      decoding="async"
      className="h-14 w-14 shrink-0 rounded-lg object-cover"
    />
  )
}
