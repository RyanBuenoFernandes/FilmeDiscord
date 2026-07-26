import { FieldValue } from 'firebase-admin/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import type { Friend } from '@/lib/movies'

export async function GET() {
  const snapshot = await db
    .collection('users')
    .orderBy('createdAt', 'asc')
    .get()

  const users: Friend[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    avatar: doc.data().avatar,
  }))

  return NextResponse.json({ users })
}

export async function POST(request: NextRequest) {
  const body: { name?: string; avatar?: string } = await request.json()
  const name = body.name?.trim()

  if (!name || !body.avatar) {
    return NextResponse.json(
      { error: 'Nome e avatar são obrigatórios' },
      { status: 400 },
    )
  }

  const docRef = await db.collection('users').add({
    name,
    avatar: body.avatar,
    createdAt: FieldValue.serverTimestamp(),
  })

  const user: Friend = { id: docRef.id, name, avatar: body.avatar }
  return NextResponse.json({ user }, { status: 201 })
}
