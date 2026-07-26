import { NextRequest, NextResponse } from 'next/server'
import { searchMovies } from '@/lib/tmdb'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim()

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  try {
    const results = await searchMovies(query)
    return NextResponse.json({ results })
  } catch (error) {
    console.error('TMDB search failed', error)
    return NextResponse.json(
      { error: 'Falha ao buscar filmes no TMDB' },
      { status: 502 },
    )
  }
}
