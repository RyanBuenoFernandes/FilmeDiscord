'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Clapperboard, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Friend } from '@/lib/movies'
import { AVATAR_OPTIONS } from '@/lib/avatars'
import { FriendAvatar } from '@/components/friend-avatar'

export function UserGate({
  users,
  onLogin,
  onCreate,
}: {
  users: Friend[]
  onLogin: (user: Friend) => void
  onCreate: (user: Friend) => void
}) {
  const [mode, setMode] = useState<'choose' | 'create'>(
    users.length > 0 ? 'choose' : 'create',
  )
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(false)

  async function handleCreate() {
    const trimmed = name.trim()
    if (!trimmed || !avatar) return

    setSaving(true)
    setError(false)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed, avatar }),
      })
      if (!res.ok) throw new Error('failed')
      const data: { user: Friend } = await res.json()
      onCreate(data.user)
    } catch {
      setError(true)
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Clapperboard className="size-6" />
          </span>
          <h1 className="font-display text-xl font-bold">Flikz</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            nosso clubinho de filmes
          </p>
        </div>

        {mode === 'choose' ? (
          <>
            <p className="mb-3 text-sm font-semibold text-foreground">
              Quem é você?
            </p>
            <ul className="mb-4 flex flex-col gap-1.5">
              {users.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    onClick={() => onLogin(user)}
                    className="flex w-full items-center gap-3 rounded-2xl p-2 text-left transition hover:bg-secondary/60"
                  >
                    <FriendAvatar friend={user} size="md" />
                    <span className="font-display text-sm font-bold">
                      {user.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setMode('create')}
              className="w-full rounded-xl border border-border py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
            >
              Criar novo usuário
            </button>
          </>
        ) : (
          <>
            <p className="mb-2 text-sm font-semibold text-foreground">
              Seu nome
            </p>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como a Escória te chama?"
              className="mb-4 h-11 w-full rounded-xl border border-border bg-secondary/60 px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/60"
            />

            <p className="mb-2 text-sm font-semibold text-foreground">
              Escolha um avatar
            </p>
            <div className="mb-5 grid grid-cols-6 gap-2">
              {AVATAR_OPTIONS.map((src) => {
                const selected = avatar === src
                return (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setAvatar(src)}
                    className={cn(
                      'relative aspect-square overflow-hidden rounded-full border-2 transition',
                      selected
                        ? 'border-primary'
                        : 'border-transparent hover:border-border',
                    )}
                  >
                    <Image src={src} alt="" fill className="object-cover" />
                    {selected && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Check className="size-4 text-white" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {error && (
              <p className="mb-3 text-center text-xs text-destructive">
                Deu ruim pra criar o usuário. Tenta de novo.
              </p>
            )}

            <button
              type="button"
              onClick={handleCreate}
              disabled={!name.trim() || !avatar || saving}
              className="mb-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              Entrar como {name.trim() || '...'}
            </button>

            {users.length > 0 && (
              <button
                type="button"
                onClick={() => setMode('choose')}
                className="w-full rounded-xl py-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
              >
                Já tenho usuário
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
