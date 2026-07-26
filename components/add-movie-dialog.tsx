'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X, Search, Plus, Check, Loader2 } from 'lucide-react'
import { type Friend, type Movie } from '@/lib/movies'
import { FriendAvatar } from '@/components/friend-avatar'
import type { TmdbSearchResult } from '@/lib/tmdb'

export function AddMovieDialog({
  open,
  onClose,
  onAdd,
  currentUser,
}: {
  open: boolean
  onClose: () => void
  onAdd: (movie: Omit<Movie, 'id'>) => void
  currentUser: Friend
}) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<TmdbSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [added, setAdded] = useState<number[]>([])

  useEffect(() => {
    if (!open || !q.trim()) {
      setResults([])
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setError(false)

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/tmdb/search?q=${encodeURIComponent(q)}`,
          { signal: controller.signal },
        )
        if (!res.ok) throw new Error('search failed')
        const data: { results: TmdbSearchResult[] } = await res.json()
        setResults(data.results)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') setError(true)
      } finally {
        setLoading(false)
      }
    }, 350)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [q, open])

  if (!open) return null

  function handleAdd(item: TmdbSearchResult) {
    onAdd({
      title: item.title,
      year: item.year ?? 0,
      genre: item.genre,
      poster: item.poster ?? '/placeholder.svg',
      status: 'want',
      suggestedBy: currentUser.id,
      watchedBy: [],
      reactions: {},
    })
    setAdded((a) => [...a, item.tmdbId])
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-border bg-card sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h2 className="font-display text-base font-bold">Adicionar filme</h2>
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              vai entrar como sugestão de
              <FriendAvatar friend={currentUser} size="xs" />
              <span className="font-semibold text-foreground">
                {currentUser.name}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="border-b border-border p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar no catálogo (TMDB)…"
              className="h-11 w-full rounded-xl border border-border bg-secondary/60 pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/60"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {!q.trim() ? (
            <p className="p-8 text-center text-sm text-muted-foreground">
              Digite o nome de um filme pra buscar no TMDB 🔎
            </p>
          ) : loading ? (
            <div className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Buscando…
            </div>
          ) : error ? (
            <p className="p-8 text-center text-sm text-muted-foreground">
              Deu ruim pra buscar no TMDB. Tenta de novo 🙏
            </p>
          ) : results.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">
              Nada encontrado com esse nome… 👀
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {results.map((item) => {
                const isAdded = added.includes(item.tmdbId)
                return (
                  <li
                    key={item.tmdbId}
                    className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-secondary/50"
                  >
                    <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={item.poster || '/placeholder.svg'}
                        alt=""
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-bold">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.year} • {item.genre}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAdd(item)}
                      disabled={isAdded}
                      className={
                        isAdded
                          ? 'inline-flex items-center gap-1.5 rounded-full bg-status-watched px-3 py-2 text-xs font-semibold text-status-watched-foreground'
                          : 'inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90 active:scale-95'
                      }
                    >
                      {isAdded ? (
                        <>
                          <Check className="size-3.5" /> Na lista
                        </>
                      ) : (
                        <>
                          <Plus className="size-3.5" /> Add
                        </>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
