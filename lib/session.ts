const COOKIE_NAME = 'escoria_club_user'

export function getStoredUserId(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`),
  )
  return match ? decodeURIComponent(match[1]) : null
}

export function storeUserId(id: string) {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(id)}; path=/; max-age=31536000; samesite=lax`
}

export function clearStoredUserId() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`
}
