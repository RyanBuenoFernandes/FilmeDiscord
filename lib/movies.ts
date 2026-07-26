export type Friend = {
  id: string
  name: string
  avatar: string // path under /public, e.g. /avatars/avatar-3.jpg
}

export type MovieStatus = 'want' | 'watched' | 'soon'

export type Movie = {
  id: string
  title: string
  year: number
  genre: string
  poster: string
  status: MovieStatus
  suggestedBy: string // friend id
  watchedBy: string[] // friend ids
  rating?: number // group average 0-10
  reactions: Record<string, number> // emoji -> count
  note?: { author: string; emojis: string }
}

export function findFriend(friends: Friend[], id: string) {
  return friends.find((f) => f.id === id)
}

export const STATUS_LABEL: Record<MovieStatus, string> = {
  want: 'Quero ver',
  watched: 'Assistido',
  soon: 'Em breve',
}

export const REACTION_PALETTE = ['🔥', '🍿', '😂', '🥹', '😱', '🤯', '👀', '🚀']
