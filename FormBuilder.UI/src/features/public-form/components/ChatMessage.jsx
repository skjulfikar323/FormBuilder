import { BotAvatar } from './BotAvatar.jsx'

export function BotMessage({ theme, children, showAvatar = true }) {
  return (
    <div className="flex items-start gap-2">
      {showAvatar ? (
        <BotAvatar theme={theme} />
      ) : (
        <div className="w-9 flex-shrink-0" aria-hidden />
      )}
      <div
        className="max-w-[85%] rounded-xl px-4 py-2 text-sm shadow-sm md:max-w-[75%]"
        style={{
          backgroundColor: theme.botBubbleBg,
          color: theme.botBubbleText,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export function BotMediaMessage({ theme, kind, url, showAvatar = true }) {
  const isImage = kind === 'image-bubble' || kind === 'gif-bubble'
  const isVideo = kind === 'video-bubble'
  return (
    <div className="flex items-start gap-2">
      {showAvatar ? (
        <BotAvatar theme={theme} />
      ) : (
        <div className="w-9 flex-shrink-0" aria-hidden />
      )}
      <div
        className="max-w-[85%] overflow-hidden rounded-xl shadow-sm md:max-w-[75%]"
        style={{ backgroundColor: theme.botBubbleBg }}
      >
        {isImage && (
          <img
            src={url}
            alt=""
            className="block max-h-80 w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        )}
        {isVideo && (
          <video src={url} controls className="block max-h-80 w-full" />
        )}
        {!isImage && !isVideo && (
          <p className="px-4 py-2 text-xs" style={{ color: theme.botBubbleText }}>
            {url}
          </p>
        )}
      </div>
    </div>
  )
}

export function UserMessage({ theme, children }) {
  return (
    <div className="flex justify-end">
      <div
        className="max-w-[85%] rounded-xl px-4 py-2 text-sm font-medium shadow-sm md:max-w-[75%]"
        style={{
          backgroundColor: theme.userBubbleBg,
          color: theme.userBubbleText,
        }}
      >
        {children}
      </div>
    </div>
  )
}
