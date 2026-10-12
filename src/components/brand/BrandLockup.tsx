export const BRAND_NAME = 'FoodLocket'
export const BRAND_TAGLINE = 'Where your friends eat'

type WordmarkProps = {
  className?: string
  /** Heading level wrapper — omit for a plain span (e.g. inside another heading). */
  as?: 'p' | 'h1' | 'span'
  id?: string
}

/** App wordmark: “Food” in ink, “Locket” in primary. */
export function BrandWordmark({
  className = '',
  as: Tag = 'span',
  id,
}: WordmarkProps) {
  return (
    <Tag id={id} className={`font-display tracking-tight text-ink ${className}`}>
      Food<span className="text-primary">Locket</span>
    </Tag>
  )
}

type LockupProps = {
  className?: string
  titleClassName?: string
  titleAs?: 'p' | 'h1'
  titleId?: string
  /** Landing is centered; nav drawer is start-aligned. */
  align?: 'start' | 'center'
}

/** Logo + slogan lockup — landing chrome and brand nav header. */
export function BrandLockup({
  className = '',
  titleClassName = 'text-2xl',
  titleAs = 'p',
  titleId,
  align = 'start',
}: LockupProps) {
  return (
    <div
      className={[align === 'center' ? 'text-center' : null, className]
        .filter(Boolean)
        .join(' ')}
    >
      <BrandWordmark as={titleAs} id={titleId} className={titleClassName} />
      <p className="mt-0.5 text-sm text-neutral-600">{BRAND_TAGLINE}</p>
    </div>
  )
}
