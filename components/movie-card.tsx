'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, Plus, Star, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  type Movie,
  type Friend,
  STATUS_LABEL,
  findFriend,
} from '@/lib/movies'
import { FriendAvatar } from '@/components/friend-avatar'

const STATUS_STYLES: Record<Movie['status'], string> = {
  want: 'bg-status-want text-status-want-foreground',
  watched: 'bg-status-watched text-status-watched-foreground',
  soon: 'bg-status-soon text-status-soon-foreground',
}

export function MovieCard({
  movie,
  friends,
  onToggleWatched,
}: {
  movie: Movie
  friends: Friend[]
  onToggleWatched: (id: string) => void
}) {
  const [burst, setBurst] = useState(false)
  const suggester = findFriend(friends, movie.suggestedBy)
  const watchers = movie.watchedBy
    .map((id) => findFriend(friends, id))
    .filter(Boolean)
  const isWatched = movie.status === 'watched'

  function handleToggle() {
    if (!isWatched) {
      setBurst(true)
      window.setTimeout(() => setBurst(false), 700)
    }
    onToggleWatched(movie.id)
  }

  return (
    <div className="group relative">
      <div
        className={cn(
          'relative aspect-[2/3] overflow-hidden rounded-2xl border border-border bg-card',
          'transition-transform duration-300 ease-out',
          'group-hover:-translate-y-1 group-hover:rotate-[-0.6deg] group-hover:shadow-2xl group-hover:shadow-black/50',
        )}
      >
        <Image
          src={movie.poster || '/placeholder.svg'}
          alt={`Pôster de ${movie.title}`}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* base gradient for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/40" />

        {/* status badge */}
        <span
          className={cn(
            'absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm',
            STATUS_STYLES[movie.status],
          )}
        >
          {movie.status === 'watched' && <Check className="size-3" />}
          {STATUS_LABEL[movie.status]}
        </span>

        {/* quick toggle */}
        <button
          type="button"
          onClick={handleToggle}
          aria-pressed={isWatched}
          aria-label={
            isWatched ? 'Desmarcar como assistido' : 'Marcar como assistido'
          }
          className={cn(
            'absolute right-2.5 top-2.5 inline-flex size-9 items-center justify-center rounded-full border backdrop-blur-sm transition-all active:scale-90',
            isWatched
              ? 'border-status-watched/40 bg-status-watched text-status-watched-foreground'
              : 'border-white/20 bg-black/40 text-white hover:bg-black/60',
          )}
        >
          {isWatched ? <Check className="size-4" /> : <Plus className="size-4" />}
        </button>

        {/* confetti-lite burst */}
        {burst && (
          <span className="pointer-events-none absolute right-4 top-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Sparkles
                key={i}
                className="absolute size-3 text-status-watched animate-ping"
                style={{
                  transform: `rotate(${i * 45}deg) translateX(14px)`,
                  animationDuration: '0.7s',
                  color: ['#3ba55d', '#faa61a', '#5865f2', '#eb459e'][i % 4],
                }}
              />
            ))}
          </span>
        )}

        {/* bottom info always visible */}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-white/60">
            <span>{movie.year}</span>
            <span aria-hidden>•</span>
            <span>{movie.genre}</span>
          </div>
          <h3 className="mt-0.5 font-display text-[15px] font-bold leading-tight text-balance text-white">
            {movie.title}
          </h3>

          {suggester && (
            <div className="mt-2 flex items-center gap-1.5">
              <FriendAvatar friend={suggester} size="xs" />
              <span className="text-[11px] text-white/70">
                sugestão de{' '}
                <span className="font-semibold text-white/90">
                  {suggester.name}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* hover / focus detail panel */}
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black to-black/85 p-3 pt-4',
            'transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0',
          )}
        >
          {isWatched && typeof movie.rating === 'number' && (
            <div className="mb-2 flex items-center gap-1.5">
              <Star className="size-4 fill-status-soon text-status-soon" />
              <span className="text-sm font-bold text-white">
                {movie.rating.toFixed(1)}
              </span>
              <span className="text-[11px] text-white/50">média da Escória</span>
            </div>
          )}

          <div className="mb-2 flex items-center gap-2">
            {watchers.length > 0 ? (
              <div className="flex -space-x-2">
                {watchers.map(
                  (f) => f && <FriendAvatar key={f.id} friend={f} size="sm" ring />,
                )}
              </div>
            ) : (
              <span className="text-[11px] text-white/50">ninguém viu ainda</span>
            )}
            <span className="text-[11px] text-white/60">
              {movie.watchedBy.length} de {friends.length} viram
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {Object.entries(movie.reactions).map(([emoji, count]) => (
              <span
                key={emoji}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/80"
              >
                <span>{emoji}</span>
                <span className="font-semibold">{count}</span>
              </span>
            ))}
          </div>

          {movie.note && (
            <p className="mt-2 border-t border-white/10 pt-2 text-[11px] leading-relaxed text-white/70">
              <span className="font-semibold text-white/90">
                {findFriend(friends, movie.note.author)?.name}:
              </span>{' '}
              {movie.note.emojis}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
