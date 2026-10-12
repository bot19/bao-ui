import {
  IconArrowLeft,
  IconBookmark,
  IconLogout,
  IconPlus,
  IconSearch,
  IconX,
} from '@tabler/icons-react'
import { useRef, useState, type ReactNode } from 'react'
import { BrandLockup, BrandWordmark } from '@/components/brand/BrandLockup'
import { SheetHeader } from '@/components/layout/SheetHeader'
import { MapControlsRail } from '@/components/nav/MapControlsRail'
import { MapNavBar } from '@/components/nav/MapNavBar'
import { NavFooter } from '@/components/nav/NavFooter'
import { NavFriendCode } from '@/components/nav/NavFriendCode'
import { NavProfile } from '@/components/nav/NavProfile'
import { LocatePlaceButton } from '@/components/place/LocatePlaceButton'
import { PlaceStatusField } from '@/components/review/PlaceStatusField'
import { PriceInput } from '@/components/review/PriceInput'
import { ReviewThumb } from '@/components/review/ReviewThumb'
import { StarRatingInput } from '@/components/review/StarRatingInput'
import { ClearFiltersButton } from '@/components/search/ClearFiltersButton'
import { CategoryTags } from '@/components/ui/CategoryTags'
import { Combobox } from '@/components/ui/Combobox'
import { IconButton } from '@/components/ui/IconButton'
import { InfoBox } from '@/components/ui/InfoBox'
import { RemovablePill } from '@/components/ui/RemovablePill'
import {
  SkeletonCover,
  SkeletonListRows,
  SkeletonPlacePanel,
  SkeletonRatingPill,
} from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/user/UserAvatar'
import { ratingToCssColor } from '@/lib/ratingColor'
import type { PlaceStatus } from '@/lib/placeStatus'

const SECTIONS = [
  ['type', 'Type & colour'],
  ['icon-buttons', 'Icon buttons'],
  ['buttons', 'Text buttons'],
  ['fields', 'Fields'],
  ['choices', 'Choices'],
  ['feedback', 'Feedback'],
  ['chips', 'Chips & tags'],
  ['people', 'Avatars & thumbs'],
  ['chrome', 'Chrome'],
  ['loading', 'Loading'],
] as const

const PHOTO =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="112" height="112"><rect width="112" height="112" fill="#d6d3d1"/><circle cx="56" cy="44" r="16" fill="#fafaf9"/><rect x="24" y="72" width="64" height="16" rx="4" fill="#fafaf9"/></svg>`,
  )

export function Catalog() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Bao UI</p>
        <h1 className="mt-1 font-display text-3xl text-ink">
          Food Friends baseline
        </h1>
        <p className="mt-3 text-neutral-700">
          Shared components are the files copied from Food Friends. Everything
          else is the one-off markup still living in that app, grouped with
          the control it duplicates. Labels name the source file.
        </p>
      </header>

      <nav
        aria-label="Catalog sections"
        className="mt-6 flex flex-wrap gap-2"
      >
        {SECTIONS.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className="rounded-full bg-white px-3 py-1 text-sm text-neutral-700 shadow-sm hover:text-ink"
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-14">
        <TypeAndColour />
        <IconButtons />
        <TextButtons />
        <Fields />
        <Choices />
        <Feedback />
        <Chips />
        <People />
        <Chrome />
        <Loading />
      </div>
    </div>
  )
}

function TypeAndColour() {
  const swatches = [
    ['primary', 'bg-primary', 'purple-700'],
    ['coral', 'bg-coral', 'red-400'],
    ['green-soft', 'bg-green-soft', 'green-300'],
    ['celadon', 'bg-celadon', 'green-200'],
    ['ink', 'bg-ink', 'neutral-950'],
  ] as const

  return (
    <Section id="type" title="Type & colour">
      <div className="grid gap-6 sm:grid-cols-2">
        <Specimen name="Display" source="index.css">
          <BrandWordmark as="p" className="text-3xl" />
          <p className="mt-2 text-sm text-neutral-600">
            Fraunces for wordmark and sheet titles.
          </p>
        </Specimen>
        <Specimen name="Body" source="index.css">
          <p className="text-base text-ink">Source Sans 3 for UI text.</p>
          <p className="mt-1 text-sm text-neutral-600">
            Where your friends eat
          </p>
        </Specimen>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {swatches.map(([name, bg, note]) => (
          <div key={name} className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className={`h-16 ${bg}`} />
            <p className="px-3 py-2 text-sm font-medium text-ink">{name}</p>
            <p className="px-3 pb-3 text-xs text-neutral-500">{note}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

function IconButtons() {
  return (
    <Section
      id="icon-buttons"
      title="Icon buttons"
      note="IconButton is the shared control. Auth screens still draw their own back button, and the map add button overrides the colours."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Specimen name="Surface" source="components/ui/IconButton.tsx">
          <Row>
            <IconButton aria-label="Close">
              <IconX size={20} stroke={1.75} />
            </IconButton>
            <IconButton aria-label="Search" isActive>
              <IconSearch size={20} stroke={1.75} />
            </IconButton>
            <IconButton aria-label="Add" disabled>
              <IconPlus size={20} stroke={1.75} />
            </IconButton>
            <IconButton aria-label="Search with count" statusIndicator={12}>
              <IconSearch size={20} stroke={1.75} />
            </IconButton>
          </Row>
        </Specimen>
        <Specimen name="Elevated" source="components/place/LocatePlaceButton.tsx">
          <LocatePlaceButton onClick={() => undefined} />
        </Specimen>
        <Specimen
          name="Map size, h-10 w-10"
          source="components/nav/MapNavBar.tsx"
        >
          <IconButton aria-label="Search" className="h-10 w-10">
            <IconSearch size={22} stroke={1.75} />
          </IconButton>
        </Specimen>
        <Specimen
          name="Add override"
          source="components/nav/MapNavBar.tsx"
        >
          <IconButton
            aria-label="Add review"
            className="h-10 w-10 rounded-full !bg-primary !text-white hover:!bg-purple-800"
          >
            <IconPlus size={22} stroke={2} />
          </IconButton>
        </Specimen>
        <Specimen
          name="Auth back, not IconButton"
          source="components/auth/SignupForm.tsx"
        >
          <button
            type="button"
            aria-label="Back"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100 hover:text-ink"
          >
            <IconArrowLeft size={20} stroke={1.75} />
          </button>
          <p className="mt-2 text-xs text-neutral-500">
            Hover is neutral-100. IconButton surface hover is neutral-300.
          </p>
        </Specimen>
      </div>
    </Section>
  )
}

function TextButtons() {
  const filled = [
    [
      'Search submit',
      'components/search/SearchBar.tsx',
      'cursor-pointer rounded-md bg-ink px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800',
    ],
    [
      'Sheet action',
      'components/place/PlaceDetail.tsx',
      'rounded-md bg-ink px-3 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60',
    ],
    [
      'Signup',
      'components/auth/SignupForm.tsx',
      'rounded-md bg-ink px-3 py-2.5 text-sm font-medium text-white enabled:hover:bg-neutral-800 disabled:opacity-60',
    ],
    [
      'Retry',
      'components/app/ProfileLoadError.tsx',
      'rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800',
    ],
    [
      'Accept friend',
      'components/nav/NavFriends.tsx',
      'rounded-md bg-ink px-2.5 py-1 text-xs font-medium text-white hover:bg-neutral-800',
    ],
    [
      'Add category',
      'components/review/CategoryField.tsx',
      'rounded-md bg-ink px-3 py-2 text-sm font-medium text-white disabled:opacity-50',
    ],
  ] as const

  const quiet = [
    [
      'Outline, no fill',
      'components/nav/NavFooter.tsx',
      'rounded-md border border-neutral-200 px-3 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50',
    ],
    [
      'Outline, white fill',
      'components/nav/NavAddFriends.tsx',
      'rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50',
    ],
    [
      'Ghost',
      'components/landing/LandingChrome.tsx',
      'rounded-md px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-ink',
    ],
    [
      'Map chip',
      'components/search/ClearFiltersButton.tsx',
      'inline-flex items-center gap-1.5 rounded-2xl bg-white/95 px-3.5 py-2 text-sm font-medium text-neutral-800 shadow-lg',
    ],
  ] as const

  return (
    <Section
      id="buttons"
      title="Text buttons"
      note="Same ink button, six paddings. Disabled opacity is 60 in most places and 50 on the category action, which also has no hover style."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {filled.map(([name, source, className]) => (
          <Specimen key={source + name} name={name} source={source}>
            <button type="button" className={className}>
              {name}
            </button>
          </Specimen>
        ))}
        {quiet.map(([name, source, className]) => (
          <Specimen key={source + name} name={name} source={source}>
            <button type="button" className={className}>
              {name === 'Outline, no fill' ? (
                <span className="inline-flex items-center gap-1.5">
                  <IconLogout size={18} stroke={1.75} aria-hidden />
                  Sign out
                </span>
              ) : (
                name
              )}
            </button>
          </Specimen>
        ))}
        <Specimen name="Clear filters" source="components/search/ClearFiltersButton.tsx">
          <ClearFiltersButton onClick={() => undefined} />
        </Specimen>
      </div>
    </Section>
  )
}

function Fields() {
  const fields = [
    [
      'Auth and review forms',
      'components/auth/SignupForm.tsx',
      'block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-base text-ink shadow-sm outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-400/40',
      'text-base, shadow, neutral-300 border',
    ],
    [
      'Search query',
      'components/search/SearchBar.tsx',
      'block w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-base text-ink placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300',
      'text-base, no shadow, neutral-200 border',
    ],
    [
      'Search filters',
      'components/search/SearchBar.tsx',
      'block w-full rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-base text-ink focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300',
      'tighter padding',
    ],
    [
      'Inline email and password',
      'components/user/EmailUpdateForm.tsx',
      'block w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none',
      'text-sm, no focus ring',
    ],
    [
      'Friend code',
      'components/nav/NavAddFriends.tsx',
      'block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 font-mono text-sm tracking-[0.15em] text-ink uppercase placeholder:font-sans placeholder:tracking-normal placeholder:normal-case placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none',
      'rounded-lg, mono, no focus ring',
    ],
  ] as const

  return (
    <Section
      id="fields"
      title="Fields"
      note="Inputs under 16px get zoomed by iOS. The email and friend-code fields are written as text-sm. Global CSS forces 16px, so the utility and the rendered size disagree."
    >
      <div className="grid gap-4">
        {fields.map(([name, source, className, detail]) => (
          <Specimen key={name} name={name} source={source}>
            <label className="block text-sm font-medium text-neutral-800">
              {name}
              <input className={`mt-1.5 ${className}`} placeholder={detail} />
            </label>
          </Specimen>
        ))}
        <ComboboxSpecimen />
      </div>
    </Section>
  )
}

function ComboboxSpecimen() {
  const [value, setValue] = useState('')
  return (
    <Specimen name="Combobox" source="components/ui/Combobox.tsx">
      <Combobox
        label="Category"
        value={value}
        onChange={setValue}
        onSubmit={setValue}
        placeholder="Search or add"
        options={[
          { value: 'ramen', label: 'Ramen' },
          { value: 'dumplings', label: 'Dumplings' },
          { value: 'noodles', label: 'Noodles' },
        ]}
      />
    </Specimen>
  )
}

function Choices() {
  return (
    <Section
      id="choices"
      title="Choices"
      note="Price and status share one selected style. Activity and profile tabs are the same segmented control copied twice."
    >
      <div className="grid gap-4">
        <StarSpecimen />
        <PriceSpecimen />
        <StatusSpecimen />
        <SegmentedSpecimen />
      </div>
    </Section>
  )
}

function StarSpecimen() {
  const [rating, setRating] = useState<number | undefined>(3.5)
  return (
    <Specimen name="Star rating" source="components/review/StarRatingInput.tsx">
      <StarRatingInput value={rating} onChange={setRating} />
    </Specimen>
  )
}

function PriceSpecimen() {
  const [price, setPrice] = useState<number | null>(2)
  return (
    <Specimen name="Price" source="components/review/PriceInput.tsx">
      <PriceInput value={price} onChange={setPrice} />
    </Specimen>
  )
}

function StatusSpecimen() {
  const [status, setStatus] = useState<PlaceStatus>('active')
  return (
    <Specimen name="Place status" source="components/review/PlaceStatusField.tsx">
      <PlaceStatusField value={status} onChange={setStatus} />
    </Specimen>
  )
}

function SegmentedSpecimen() {
  const [tab, setTab] = useState('new')
  const tabs = [
    ['new', 'New'],
    ['leaderboard', 'Leaderboard'],
  ] as const
  return (
    <Specimen
      name="Segmented tabs"
      source="components/activity/ActivityPanel.tsx and components/user/UserProfilePanel.tsx"
    >
      <div role="tablist" aria-label="Example tabs" className="flex rounded-lg bg-neutral-100 p-1">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={
              tab === id
                ? 'flex-1 rounded-md bg-white px-3 py-2 text-sm font-medium text-ink shadow-sm'
                : 'flex-1 rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:text-ink'
            }
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </Specimen>
  )
}

function Feedback() {
  return (
    <Section id="feedback" title="Feedback">
      <div className="grid gap-3">
        <InfoBox variant="error">Couldn&apos;t save that review.</InfoBox>
        <InfoBox variant="warning">This place may already be in the group.</InfoBox>
        <InfoBox variant="info">Share your friend code to connect.</InfoBox>
        <InfoBox variant="neutral">No reviews yet.</InfoBox>
        <InfoBox variant="success">Password updated.</InfoBox>
        <Specimen
          name="Amber note, not InfoBox"
          source="components/review/ReviewForm.tsx"
        >
          <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-950">
            You already reviewed this place. Saving will replace it.
          </p>
        </Specimen>
        <Specimen name="Field error" source="components/review/PriceInput.tsx">
          <p className="text-sm text-red-700" role="alert">
            Choose a price.
          </p>
        </Specimen>
      </div>
    </Section>
  )
}

function Chips() {
  const [tags, setTags] = useState(['ramen', 'late-night'])
  return (
    <Section id="chips" title="Chips & tags">
      <div className="grid gap-4 sm:grid-cols-2">
        <Specimen name="Removable pill" source="components/ui/RemovablePill.tsx">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <RemovablePill
                key={tag}
                removeLabel={`Remove ${tag}`}
                onRemove={() => setTags((current) => current.filter((item) => item !== tag))}
              >
                {tag}
              </RemovablePill>
            ))}
          </div>
        </Specimen>
        <Specimen name="Category line" source="components/ui/CategoryTags.tsx">
          <CategoryTags categories={['ramen', 'dumplings', 'noodles']} />
          <CategoryTags
            categories={['a very long category', 'another long category name', 'supper']}
            truncate
            className="mt-2"
          />
        </Specimen>
        <Specimen name="Rating pill" source="components/review/ExistingPlaceCard.tsx">
          <span
            className="rounded-full px-2.5 py-1 text-sm font-semibold text-white"
            style={{ backgroundColor: ratingToCssColor(4.2) }}
          >
            4.2
          </span>
        </Specimen>
      </div>
    </Section>
  )
}

function People() {
  return (
    <Section
      id="people"
      title="Avatars & thumbs"
      note="UserAvatar defaults to a rounded square. Friend rows and the leaderboard pass rounded-full. Review thumbs are always rounded-lg."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Specimen name="Default avatar" source="components/user/UserAvatar.tsx">
          <UserAvatar username="Ada Lovelace" />
        </Specimen>
        <Specimen name="Profile row" source="components/nav/NavProfile.tsx">
          <UserAvatar username="Ada Lovelace" className="h-14 w-14 rounded-lg text-xl" />
        </Specimen>
        <Specimen name="Friend row" source="components/nav/NavFriends.tsx">
          <UserAvatar username="grace-hopper" className="h-9 w-9 rounded-full text-xs" />
        </Specimen>
        <Specimen name="Leaderboard" source="components/activity/LeaderboardList.tsx">
          <UserAvatar username="linus" className="h-8 w-8 rounded-full text-xs" />
        </Specimen>
        <Specimen name="Review thumbs" source="components/review/ReviewThumb.tsx">
          <Row>
            <ReviewThumb photoUrl={PHOTO} rating={4} />
            <ReviewThumb photoUrl={null} rating={4.5} />
            <ReviewThumb photoUrl={null} rating={null} />
            <ReviewThumb photoUrl={null} rating={2} status="closed" />
            <ReviewThumb photoUrl={null} rating={1} status="avoid" />
          </Row>
        </Specimen>
      </div>
    </Section>
  )
}

function Chrome() {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [nav, setNav] = useState<
    'search' | 'add' | 'activity' | 'menu' | null
  >('search')
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')

  return (
    <Section id="chrome" title="Chrome">
      <div className="grid gap-4">
        <Specimen name="Brand lockup" source="components/brand/BrandLockup.tsx">
          <BrandLockup align="center" />
        </Specimen>
        <Specimen name="Sheet header" source="components/layout/SheetHeader.tsx">
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            <SheetHeader
              titleId="catalog-sheet-title"
              title="Place"
              closeRef={closeRef}
              onClose={() => undefined}
              dragHandlers={{
                onPointerDown: () => undefined,
                onPointerMove: () => undefined,
                onPointerUp: () => undefined,
                onPointerCancel: () => undefined,
              }}
            />
            <div className="px-4 py-6 text-sm text-neutral-600">Sheet body</div>
          </div>
        </Specimen>
        <Specimen name="Profile row" source="components/nav/NavProfile.tsx">
          <NavProfile
            username="ada"
            homeLabel="Fitzroy"
            reviewCount={12}
            onOpenUser={() => undefined}
          />
        </Specimen>
        <Specimen name="Friend code" source="components/nav/NavFriendCode.tsx">
          <NavFriendCode
            friendCode="BAO-14"
            copyState={copyState}
            onCopyCode={() =>
              setCopyState((current) => (current === 'copied' ? 'idle' : 'copied'))
            }
          />
        </Specimen>
        <Specimen name="Nav footer" source="components/nav/NavFooter.tsx">
          <NavFooter
            onSignOut={() => undefined}
            isSigningOut={false}
            onClose={() => undefined}
          />
        </Specimen>
        <Specimen name="Place card" source="components/review/ExistingPlaceCard.tsx">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-display text-lg text-ink">ShanDong MaMa</h2>
                <p className="mt-1 text-sm text-neutral-500">Brunswick St, Fitzroy</p>
                <CategoryTags categories={['dumplings', 'noodles']} className="mt-2" />
                <p className="mt-1 text-sm text-neutral-600">
                  Group average <span className="font-semibold text-ink">4.2</span>
                  {' · '}3 visits{' · '}2 saves
                </p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span
                  className="rounded-full px-2.5 py-1 text-sm font-semibold text-white"
                  style={{ backgroundColor: ratingToCssColor(4.2) }}
                >
                  4.2
                </span>
                <LocatePlaceButton onClick={() => undefined} />
              </div>
            </div>
          </div>
        </Specimen>
        <Specimen
          name="Empty card"
          source="components/place/PlaceDetail.tsx"
        >
          <p className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-700">
            Nobody has reviewed this place yet.
          </p>
        </Specimen>
        <Specimen name="List row" source="components/place/PlaceSaversList.tsx">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg border-y border-neutral-200 py-3 text-left hover:bg-neutral-50"
          >
            <UserAvatar username="grace" className="h-10 w-10 rounded-lg text-sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-ink">grace</span>
              <span className="block text-sm text-neutral-500">Saved 2 days ago</span>
            </span>
            <IconBookmark size={18} stroke={1.75} className="text-neutral-400" />
          </button>
        </Specimen>
        <Specimen name="Map chrome" source="components/nav/MapNavBar.tsx">
          <div className="relative h-[22rem] overflow-hidden rounded-2xl bg-neutral-200">
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <div className="rounded-2xl bg-white/95 px-5 py-3 shadow-lg backdrop-blur">
                <BrandLockup align="center" />
              </div>
            </div>
            <MapNavBar
              isSearchOpen={nav === 'search'}
              isAddOpen={nav === 'add'}
              isActivityOpen={nav === 'activity'}
              isNavOpen={nav === 'menu'}
              totalPlaceCount={18}
              onSearch={() => setNav('search')}
              onAdd={() => setNav('add')}
              onActivity={() => setNav('activity')}
              onNav={() => setNav('menu')}
            />
            <MapControlsRail
              hasHome
              isLocating={false}
              onHome={() => undefined}
              onLocate={() => undefined}
              onZoomIn={() => undefined}
              onZoomOut={() => undefined}
            />
          </div>
        </Specimen>
        <Specimen name="Logged-out bar" source="components/landing/LandingChrome.tsx">
          <div className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-3 py-3 shadow-lg sm:w-max">
            <span className="inline-flex items-center justify-center rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-white sm:w-32">
              Sign up
            </span>
            <span className="inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium text-neutral-700 sm:w-32">
              Log in
            </span>
          </div>
        </Specimen>
      </div>
    </Section>
  )
}

function Loading() {
  return (
    <Section id="loading" title="Loading" note="Skeleton shapes follow the real covers, rows, and rating pill.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Specimen name="Place panel" source="components/ui/skeleton/Skeleton.tsx">
          <SkeletonPlacePanel />
        </Specimen>
        <Specimen name="Cover and pill" source="components/ui/skeleton/Skeleton.tsx">
          <SkeletonCover size="fallback" />
          <div className="mt-3">
            <SkeletonRatingPill />
          </div>
        </Specimen>
        <Specimen name="Review rows" source="components/ui/skeleton/Skeleton.tsx">
          <SkeletonListRows count={3} />
        </Specimen>
        <Specimen name="Friend rows" source="components/activity/ActivityPanel.tsx">
          <SkeletonListRows
            count={3}
            thumbClassName="h-8 w-8 rounded-full"
            showSubline={false}
          />
        </Specimen>
      </div>
    </Section>
  )
}

function Section({
  id,
  title,
  note,
  children,
}: {
  id: string
  title: string
  note?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-6">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      {note ? <p className="mt-2 max-w-2xl text-sm text-neutral-600">{note}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Specimen({
  name,
  source,
  children,
}: {
  name: string
  source: string
  children: ReactNode
}) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-sm font-medium text-ink">{name}</h3>
        <p className="font-mono text-[11px] text-neutral-500">{source}</p>
      </div>
      {children}
    </div>
  )
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>
}
