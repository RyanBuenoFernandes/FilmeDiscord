const TMDB_API_BASE = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w342'

// TMDB's genre list is stable and rarely changes, so we hardcode it
// instead of making an extra network call on every search.
const GENRE_NAMES: Record<number, string> = {
  28: 'Ação',
  12: 'Aventura',
  16: 'Animação',
  35: 'Comédia',
  80: 'Crime',
  99: 'Documentário',
  18: 'Drama',
  10751: 'Família',
  14: 'Fantasia',
  36: 'História',
  27: 'Terror',
  10402: 'Música',
  9648: 'Mistério',
  10749: 'Romance',
  878: 'Ficção',
  10770: 'Cinema TV',
  53: 'Suspense',
  10752: 'Guerra',
  37: 'Faroeste',
}

export type TmdbSearchResult = {
  tmdbId: number
  title: string
  year: number | null
  genre: string
  poster: string | null
  overview: string
}

type TmdbApiMovie = {
  id: number
  title: string
  release_date: string
  genre_ids: number[]
  poster_path: string | null
  overview: string
}

export async function searchMovies(query: string): Promise<TmdbSearchResult[]> {
  const token = process.env.TMDB_READ_ACCESS_TOKEN
  if (!token) {
    throw new Error('TMDB_READ_ACCESS_TOKEN não configurado')
  }

  const url = new URL(`${TMDB_API_BASE}/search/movie`)
  url.searchParams.set('query', query)
  url.searchParams.set('language', 'pt-BR')
  url.searchParams.set('include_adult', 'false')

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`TMDB respondeu ${res.status}`)
  }

  const data: { results: TmdbApiMovie[] } = await res.json()

  return data.results.map((m) => ({
    tmdbId: m.id,
    title: m.title,
    year: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
    genre: GENRE_NAMES[m.genre_ids[0]] ?? 'Sem gênero',
    poster: m.poster_path ? `${TMDB_IMAGE_BASE}${m.poster_path}` : null,
    overview: m.overview,
  }))
}
