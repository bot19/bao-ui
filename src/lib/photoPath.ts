export const REVIEW_PHOTOS_BUCKET = 'review-photos'

/**
 * Widths uploaded per entry, largest first. 1280 covers high-DPR phone heroes
 * and a future tablet gallery; 768 covers panels; 240 covers thumbnails.
 */
export const PHOTO_WIDTHS = [1280, 768, 240] as const

/** Kept so photos created before the 1280px rollout remain usable/deletable. */
const LEGACY_PHOTO_WIDTHS = [768, 360, 120] as const

export type PhotoWidth = (typeof PHOTO_WIDTHS)[number]

/** The variant `photo_url` points at, and the one `srcSet` is derived from. */
export const PRIMARY_PHOTO_WIDTH = PHOTO_WIDTHS[0]

/** `jpg` only where the browser can't encode WebP from a canvas (Safari). */
export const PHOTO_EXTENSIONS = ['webp', 'jpg'] as const

export type PhotoExtension = (typeof PHOTO_EXTENSIONS)[number]

/**
 * `{owner}/{place}.{width}.{ext}` — stable for the life of the entry so replace
 * is an ordinary storage upsert.
 */
export function reviewPhotoObjectPath(
  ownerId: string,
  placeId: string,
  width: PhotoWidth,
  extension: PhotoExtension,
): string {
  return `${ownerId}/${placeId}.${width}.${extension}`
}

/** Original upload, retained for future reprocessing but never rendered. */
export function reviewPhotoSourceObjectPath(
  ownerId: string,
  placeId: string,
): string {
  return `${ownerId}/${placeId}.source`
}

const PUBLIC_URL_MARKER = `/object/public/${REVIEW_PHOTOS_BUCKET}/`

/** Null for anything that isn't a public URL from our own bucket. */
function objectPathFromUrl(photoUrl: string): string | null {
  const markerAt = photoUrl.indexOf(PUBLIC_URL_MARKER)
  if (markerAt === -1) return null
  return photoUrl.slice(markerAt + PUBLIC_URL_MARKER.length)
}

type PhotoVariantSet = {
  base: string
  extension: PhotoExtension
  widths: readonly number[]
}

function splitPrimarySuffix(value: string): PhotoVariantSet | null {
  for (const widths of [PHOTO_WIDTHS, LEGACY_PHOTO_WIDTHS]) {
    for (const extension of PHOTO_EXTENSIONS) {
      const suffix = `.${widths[0]}.${extension}`
      if (value.endsWith(suffix)) {
        return {
          base: value.slice(0, -suffix.length),
          extension,
          widths,
        }
      }
    }
  }
  return null
}

/**
 * Every object backing a stored `photo_url`, for deletion. Works for v2 owner
 * paths and leftover group-scoped URLs until the move script runs. Pre-variant
 * uploads are a single object — the stored URL says how many there are.
 */
export function reviewPhotoObjectPaths(photoUrl: string): string[] {
  const path = objectPathFromUrl(photoUrl)
  if (!path) return []

  const primary = splitPrimarySuffix(path)
  if (!primary) return [path]

  return [
    ...primary.widths.map(
      (width) => `${primary.base}.${width}.${primary.extension}`,
    ),
    `${primary.base}.source`,
  ]
}

export type PhotoSources = {
  src: string
  /** Undefined for pre-variant uploads, which only have the one object. */
  srcSet?: string
}

/** Widen a stored `photo_url` into `srcSet` candidates the browser can pick from. */
export function reviewPhotoSources(photoUrl: string): PhotoSources {
  if (!objectPathFromUrl(photoUrl)) return { src: photoUrl }

  const primary = splitPrimarySuffix(photoUrl)
  if (!primary) return { src: photoUrl }

  return {
    src: photoUrl,
    srcSet: primary.widths
      .map(
        (width) => `${primary.base}.${width}.${primary.extension} ${width}w`,
      )
      .join(', '),
  }
}
