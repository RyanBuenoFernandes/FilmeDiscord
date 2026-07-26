export const AVATAR_COUNT = 24

export const AVATAR_OPTIONS: string[] = Array.from(
  { length: AVATAR_COUNT },
  (_, i) => `/avatars/avatar-${i + 1}.jpg`,
)
