import { IconCheck, IconCopy } from '@tabler/icons-react'
import { IconButton } from '@/components/ui/IconButton'

type Props = {
  friendCode: string | null
  onCopyCode: () => void
  copyState: 'idle' | 'copied' | 'failed'
}

export function NavFriendCode({ friendCode, onCopyCode, copyState }: Props) {
  return (
    <section aria-labelledby="nav-friend-code-heading" className="space-y-3">
      <div className="space-y-1">
        <h2
          id="nav-friend-code-heading"
          className="text-xs font-semibold tracking-wide text-neutral-500 uppercase"
        >
          Your friend code
        </h2>
        <p className="text-sm text-neutral-600">
          Share this code so friends can connect with you.
        </p>
      </div>
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
        <div className="flex items-center gap-1.5">
          <p
            className="font-mono text-xl tracking-[0.2em] text-ink"
            aria-label={`Friend code ${friendCode ?? ''}`}
          >
            {friendCode ?? '—'}
          </p>
          {friendCode ? (
            <IconButton
              onClick={onCopyCode}
              aria-label={
                copyState === 'copied'
                  ? 'Copied'
                  : copyState === 'failed'
                    ? 'Copy failed'
                    : 'Copy friend code'
              }
              className="h-8 w-8"
            >
              {copyState === 'copied' ? (
                <IconCheck size={18} stroke={1.75} />
              ) : (
                <IconCopy size={18} stroke={1.75} />
              )}
            </IconButton>
          ) : null}
        </div>
      </div>
    </section>
  )
}
