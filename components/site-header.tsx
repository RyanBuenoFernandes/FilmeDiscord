'use client'

import { Search, Plus, Clapperboard, LogOut } from 'lucide-react'
import { type Friend } from '@/lib/movies'
import { FriendAvatar } from '@/components/friend-avatar'

export function SiteHeader({
  query,
  onQuery,
  onAdd,
  users,
  currentUser,
  onSwitchUser,
}: {
  query: string
  onQuery: (v: string) => void
  onAdd: () => void
  users: Friend[]
  currentUser: Friend
  onSwitchUser: () => void
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Clapperboard className="size-5" />
            </span>
            <div className="leading-none">
              <h1 className="font-display text-lg font-bold tracking-tight">
                Flikz
              </h1>
              <p className="mt-1 text-[11px] text-muted-foreground">
                nosso clubinho de filmes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex -space-x-2">
                {users.map((f) => (
                  <FriendAvatar key={f.id} friend={f} size="sm" ring />
                ))}
              </div>
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="size-2 rounded-full bg-status-watched" />
                {users.length} na Escória
              </span>
            </div>

            <button
              type="button"
              onClick={onSwitchUser}
              className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 py-1 pl-1 pr-2.5 text-xs text-muted-foreground transition hover:text-foreground"
              title="Trocar de usuário"
            >
              <FriendAvatar friend={currentUser} size="xs" />
              <span className="hidden sm:inline">{currentUser.name}</span>
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Buscar na lista ou adicionar filme novo…"
              className="h-11 w-full rounded-xl border border-border bg-secondary/60 pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:bg-secondary"
            />
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-primary px-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-95 sm:px-4"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Adicionar</span>
          </button>
        </div>
      </div>
    </header>
  )
}
