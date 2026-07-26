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
  const body: { id?: string; name?: string; avatar?: string; email?: string } = await request.json()
  const id = body.id?.trim()
  const name = body.name?.trim()
  const avatar = body.avatar?.trim()
  const email = body.email?.trim()

  if (!name) {
    return NextResponse.json(
      { error: 'Nome é obrigatório' },
      { status: 400 },
    )
  }

  // Se houver um ID (UID do Google), tentamos buscar ou criar o documento com esse ID
  if (id) {
    const userDoc = await db.collection('users').doc(id).get()
    if (userDoc.exists) {
      const existingData = userDoc.data()!
      const user: Friend = {
        id,
        name: existingData.name || name,
        avatar: existingData.avatar || avatar || '/placeholder.svg',
      }
      return NextResponse.json({ user }, { status: 200 })
    } else {
      await db.collection('users').doc(id).set({
        name,
        avatar: avatar || '/placeholder.svg',
        email: email || '',
        createdAt: FieldValue.serverTimestamp(),
      })
      const user: Friend = { id, name, avatar: avatar || '/placeholder.svg' }
      return NextResponse.json({ user }, { status: 201 })
    }
  }

  // Criação legada/manual sem ID específico (gera ID aleatório)
  if (!body.avatar) {
    return NextResponse.json(
      { error: 'Avatar é obrigatório para cadastro manual' },
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

