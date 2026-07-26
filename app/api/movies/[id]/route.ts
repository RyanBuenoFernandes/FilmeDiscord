import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import type { Movie } from '@/lib/movies'

const UPDATABLE_FIELDS: (keyof Movie)[] = [
  'status',
  'watchedBy',
  'reactions',
  'rating',
  'note',
]

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await request.json()

  const updates: Record<string, unknown> = {}
  for (const field of UPDATABLE_FIELDS) {
    if (field in body) updates[field] = body[field]
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Nada para atualizar' }, { status: 400 })
  }

  await db.collection('movies').doc(id).update(updates)

  return NextResponse.json({ ok: true })
}
