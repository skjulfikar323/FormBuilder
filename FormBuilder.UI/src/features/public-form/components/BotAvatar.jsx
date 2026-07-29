export function BotAvatar({ theme, size = 36 }) {
  return (
    <div
      className="grid flex-shrink-0 place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: theme.avatarBg,
      }}
    >
      <svg
        width={Math.round(size * 0.55)}
        height={Math.round(size * 0.55)}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 3 C 6 3 3 8 4 13 C 5 18 10 21 12 21 C 14 21 20 18 20 13 C 20 8 17 3 12 3 Z"
          fill={theme.avatarText}
          opacity="0.95"
        />
        <circle cx="9" cy="12" r="1.2" fill={theme.avatarBg} />
        <circle cx="15" cy="12" r="1.2" fill={theme.avatarBg} />
        <path
          d="M14 8 L 20 4 L 18 10 Z"
          fill="#FF8B1A"
        />
      </svg>
    </div>
  )
}
