'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Friend } from '@/lib/movies'
import { AVATAR_OPTIONS } from '@/lib/avatars'
import { FriendAvatar } from '@/components/friend-avatar'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

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
  const [avatar, setAvatar] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [error, setError] = useState(false)

  async function handleGoogleLogin() {
    setLoadingGoogle(true)
    setError(false)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const gUser = result.user

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: gUser.uid,
          name: gUser.displayName || 'Usuário Sem Nome',
          avatar: gUser.photoURL || '/placeholder.svg',
          email: gUser.email,
        }),
      })
      if (!res.ok) throw new Error('failed to save user')
      const data: { user: Friend } = await res.json()
      onLogin(data.user)
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setLoadingGoogle(false)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(false)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      setAvatar(data.url)
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setUploading(false)
    }
  }

  async function handleCreate() {
    if (!avatar) return

    setSaving(true)
    setError(false)

    // Nome gerado automaticamente com base no avatar
    let resolvedName = ''
    if (avatar.includes('/avatars/avatar-')) {
      const match = avatar.match(/avatar-(\d+)/)
      const index = match ? match[1] : 'Local'
      resolvedName = `Escória ${index}`
    } else {
      const randomNum = Math.floor(100 + Math.random() * 900)
      resolvedName = `Escória ${randomNum}`
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: resolvedName, avatar }),
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
          <div className="relative mb-3 size-12 overflow-hidden rounded-2xl border border-border bg-secondary/30">
            <Image
              src="/LogoProjeto.png"
              alt="Logo"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="font-display text-xl font-bold">Escória Club</h1>
        </div>

        {/* Botão de login com Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loadingGoogle || saving || uploading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-background py-3 font-display text-sm font-semibold text-foreground transition hover:bg-secondary/60 active:scale-[0.98] disabled:opacity-50"
        >
          {loadingGoogle ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <svg className="size-5 text-current" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          Entrar com o Google
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-card px-2 text-muted-foreground font-semibold">
              Ou use uma conta local
            </span>
          </div>
        </div>

        {error && (
          <p className="mb-3 text-center text-xs text-destructive">
            Deu ruim na autenticação ou upload. Tenta de novo.
          </p>
        )}

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
              Criar novo usuário local
            </button>
          </>
        ) : (
          <>
            {/* Seção de Upload de Imagem no Cloudinary */}
            <div className="mb-4">
              <p className="mb-2 text-sm font-semibold text-foreground">
                Foto de Perfil Personalizada
              </p>
              <div className="flex items-center gap-4">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-border bg-secondary/30">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      Sem foto
                    </span>
                  )}
                  {uploading && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <Loader2 className="size-4 animate-spin text-white" />
                    </span>
                  )}
                </div>

                <label className="flex cursor-pointer items-center justify-center rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground transition hover:bg-secondary/60 active:scale-[0.98] disabled:opacity-50">
                  {uploading ? 'Enviando…' : 'Subir foto personalizada'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading || saving}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              Ou escolha um dos avatares padrão:
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

            <button
              type="button"
              onClick={handleCreate}
              disabled={!avatar || saving || uploading}
              className="mb-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              {avatar ? (
                avatar.includes('/avatars/avatar-') ? (
                  `Entrar como Escória ${avatar.match(/avatar-(\d+)/)?.[1] || ''}`
                ) : (
                  'Entrar com foto personalizada'
                )
              ) : (
                'Escolha um avatar para entrar'
              )}
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
