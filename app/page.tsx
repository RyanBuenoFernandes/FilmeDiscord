'use client'

import { useEffect, useMemo, useState } from 'react'
import { PopcornIcon as Popcorn } from 'lucide-react'
import { type Movie, type Friend } from '@/lib/movies'
import { getStoredUserId, storeUserId, clearStoredUserId } from '@/lib/session'
import { SiteHeader } from '@/components/site-header'
import { FilterTabs, type TabKey } from '@/components/filter-tabs'
import { NextUp } from '@/components/next-up'
import { MovieCard } from '@/components/movie-card'
import { AddMovieDialog } from '@/components/add-movie-dialog'
import { UserGate } from '@/components/user-gate'

export default function Page() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [users, setUsers] = useState<Friend[]>([])
  const [currentUser, setCurrentUser] = useState<Friend | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<TabKey>('want')
  const [suggester, setSuggester] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [votes, setVotes] = useState<Record<string, number>>({})
  const [votedIds, setVotedIds] = useState<string[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/movies').then((res) => res.json()),
      fetch('/api/users').then((res) => res.json()),
    ]).then(([moviesData, usersData]: [{ movies: Movie[] }, { users: Friend[] }]) => {
      setMovies(moviesData.movies)
      setUsers(usersData.users)

      const storedId = getStoredUserId()
      const resolved = usersData.users.find((u) => u.id === storedId)
      if (resolved) setCurrentUser(resolved)

      setLoading(false)
    })
  }, [])

  function handleLogin(user: Friend) {
    storeUserId(user.id)
    setCurrentUser(user)
  }

  function handleCreateUser(user: Friend) {
    setUsers((prev) => [...prev, user])
    storeUserId(user.id)
    setCurrentUser(user)
  }

  function handleSwitchUser() {
    clearStoredUserId()
    setCurrentUser(null)
  }

  const counts = useMemo(
    () => ({
      want: movies.filter((m) => m.status !== 'watched').length,
      watched: movies.filter((m) => m.status === 'watched').length,
      all: movies.length,
    }),
    [movies],
  )

  const filtered = useMemo(() => {
    return movies.filter((m) => {
      if (tab === 'want' && m.status === 'watched') return false
      if (tab === 'watched' && m.status !== 'watched') return false
      if (suggester && m.suggestedBy !== suggester) return false
      if (query && !m.title.toLowerCase().includes(query.toLowerCase()))
        return false
      return true
    })
  }, [movies, tab, suggester, query])

  const wantCandidates = useMemo(
    () => movies.filter((m) => m.status !== 'watched'),
    [movies],
  )

  function toggleWatched(id: string) {
    if (!currentUser) return
    const target = movies.find((m) => m.id === id)
    if (!target) return

    const status = target.status === 'watched' ? 'want' : 'watched'
    const watchedBy =
      target.status === 'watched'
        ? target.watchedBy.filter((f) => f !== currentUser.id)
        : [...new Set([...target.watchedBy, currentUser.id])]

    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status, watchedBy } : m)),
    )

    fetch(`/api/movies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, watchedBy }),
    })
  }

  function handleVote(id: string) {
    if (votedIds.includes(id)) {
      setVotedIds((v) => v.filter((x) => x !== id))
      setVotes((v) => ({ ...v, [id]: Math.max(0, (v[id] ?? 0) - 1) }))
    } else {
      setVotedIds((v) => [...v, id])
      setVotes((v) => ({ ...v, [id]: (v[id] ?? 0) + 1 }))
    }
  }

  async function handleAdd(movie: Omit<Movie, 'id'>) {
    const res = await fetch('/api/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
    })
    const data: { movie: Movie } = await res.json()
    setMovies((prev) => [data.movie, ...prev])
  }

  if (loading) {
    return (
      <p className="py-24 text-center text-sm text-muted-foreground">
        Carregando…
      </p>
    )
  }

  if (!currentUser) {
    return (
      <UserGate
        users={users}
        onLogin={handleLogin}
        onCreate={handleCreateUser}
      />
    )
  }

  return (
    <div className="min-h-screen">
      <SiteHeader
        query={query}
        onQuery={setQuery}
        onAdd={() => setAddOpen(true)}
        users={users}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
      />

      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
        <div className="mb-6">
          <NextUp
            candidates={wantCandidates}
            votes={votes}
            onVote={handleVote}
            votedIds={votedIds}
          />
        </div>

        <div className="mb-5">
          <FilterTabs
            tab={tab}
            onTab={setTab}
            suggester={suggester}
            onSuggester={setSuggester}
            counts={counts}
            friends={users}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                friends={users}
                onToggleWatched={toggleWatched}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-4 text-center sm:px-6">
        <p className="text-[11px] text-muted-foreground">
          feito pra Escória 🍿 — sem crítico de cinema chato aqui
        </p>
      </footer>

      <AddMovieDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
        currentUser={currentUser}
      />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
      <span className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
        <Popcorn className="size-7" />
      </span>
      <h3 className="font-display text-lg font-bold">
        Nenhum filme por aqui ainda… 👀
      </h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground text-pretty">
        Bora resolver isso? Manda uma sugestão no botão de adicionar aí em cima.
      </p>
    </div>
  )
}
