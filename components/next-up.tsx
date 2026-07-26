'use client'

import Image from 'next/image'
import { Trophy, ThumbsUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Movie } from '@/lib/movies'

export function NextUp({
  candidates,
  votes,
  onVote,
  votedIds,
}: {
  candidates: Movie[]
  votes: Record<string, number>
  onVote: (id: string) => void
  votedIds: string[]
}) {
  if (candidates.length === 0) return null

  const ranked = [...candidates].sort(
    (a, b) => (votes[b.id] ?? 0) - (votes[a.id] ?? 0),
  )
  const top = ranked.slice(0, 3)
  const maxVotes = Math.max(1, ...top.map((m) => votes[m.id] ?? 0))

  return (
    <section className="rounded-3xl border border-border bg-card/60 p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-status-soon/20 text-status-soon">
          <Trophy className="size-4" />
        </span>
        <div>
          <h2 className="font-display text-base font-bold">
            Qual o próximo da Escória?
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Vota aí pra desencalhar a decisão
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-2.5">
        {top.map((movie, i) => {
          const count = votes[movie.id] ?? 0
          const voted = votedIds.includes(movie.id)
          const pct = Math.round((count / maxVotes) * 100)
          return (
            <li
              key={movie.id}
              className="flex items-center gap-3 rounded-2xl bg-secondary/40 p-2 pr-3"
            >
              <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={movie.poster || '/placeholder.svg'}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
                {i === 0 && (
                  <span className="absolute inset-x-0 bottom-0 bg-status-soon py-0.5 text-center text-[9px] font-bold text-status-soon-foreground">
                    LÍDER
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-bold">
                  {movie.title}
                </p>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-background/70">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => onVote(movie.id)}
                aria-pressed={voted}
                className={cn(
                  'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition active:scale-95',
                  voted
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background/70 text-foreground hover:bg-background',
                )}
              >
                <ThumbsUp className="size-3.5" />
                {count}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
