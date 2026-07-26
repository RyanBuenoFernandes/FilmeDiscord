'use client'

import { cn } from '@/lib/utils'
import { type Friend } from '@/lib/movies'
import { FriendAvatar } from '@/components/friend-avatar'

export type TabKey = 'want' | 'watched' | 'all'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'want', label: 'Pra assistir' },
  { key: 'watched', label: 'Já vimos' },
  { key: 'all', label: 'Todos' },
]

export function FilterTabs({
  tab,
  onTab,
  suggester,
  onSuggester,
  counts,
  friends,
}: {
  tab: TabKey
  onTab: (t: TabKey) => void
  suggester: string | null
  onSuggester: (id: string | null) => void
  counts: Record<TabKey, number>
  friends: Friend[]
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const active = tab === t.key
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onTab(t.key)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              {t.label}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px]',
                  active ? 'bg-black/20' : 'bg-background/60',
                )}
              >
                {counts[t.key]}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
          Sugeridos por:
        </span>
        <FriendChip
          active={suggester === null}
          onClick={() => onSuggester(null)}
          label="Todos"
        />
        {friends.map((f) => (
          <FriendChip
            key={f.id}
            active={suggester === f.id}
            onClick={() => onSuggester(suggester === f.id ? null : f.id)}
            label={f.name}
            friend={f}
          />
        ))}
      </div>
    </div>
  )
}

function FriendChip({
  active,
  onClick,
  label,
  friend,
}: {
  active: boolean
  onClick: () => void
  label: string
  friend?: Friend
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition',
        active
          ? 'border-primary/60 bg-primary/15 text-foreground'
          : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground',
      )}
    >
      {friend && <FriendAvatar friend={friend} size="xs" />}
      {label}
    </button>
  )
}
