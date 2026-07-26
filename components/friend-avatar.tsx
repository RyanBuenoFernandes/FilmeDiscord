import Image from 'next/image'
import { cn } from '@/lib/utils'
import { type Friend } from '@/lib/movies'

const SIZES = {
  xs: 'size-5',
  sm: 'size-6',
  md: 'size-8',
}

const SIZE_PX = {
  xs: 20,
  sm: 24,
  md: 32,
}

export function FriendAvatar({
  friend,
  size = 'sm',
  ring = false,
  className,
}: {
  friend: Friend
  size?: keyof typeof SIZES
  ring?: boolean
  className?: string
}) {
  return (
    <span
      title={friend.name}
      className={cn(
        'relative inline-flex shrink-0 overflow-hidden rounded-full select-none',
        SIZES[size],
        ring && 'ring-2 ring-card',
        className,
      )}
    >
      <Image
        src={friend.avatar}
        alt={friend.name}
        fill
        sizes={`${SIZE_PX[size]}px`}
        className="object-cover"
      />
    </span>
  )
}
