import { FieldValue } from 'firebase-admin/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import type { Movie } from '@/lib/movies'

export async function GET() {
  const snapshot = await db
    .collection('movies')
    .orderBy('createdAt', 'desc')
    .get()

  const movies: Movie[] = snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      title: data.title,
      year: data.year,
      genre: data.genre,
      poster: data.poster,
      status: data.status,
      suggestedBy: data.suggestedBy,
      watchedBy: data.watchedBy ?? [],
      rating: data.rating,
      reactions: data.reactions ?? {},
      note: data.note,
    }
  })

  return NextResponse.json({ movies })
}

export async function POST(request: NextRequest) {
  const body: Omit<Movie, 'id'> = await request.json()

  const docRef = await db.collection('movies').add({
    title: body.title,
    year: body.year,
    genre: body.genre,
    poster: body.poster,
    status: body.status,
    suggestedBy: body.suggestedBy,
    watchedBy: body.watchedBy ?? [],
    reactions: body.reactions ?? {},
    createdAt: FieldValue.serverTimestamp(),
  })

  const movie: Movie = { id: docRef.id, ...body }
  return NextResponse.json({ movie }, { status: 201 })
}
