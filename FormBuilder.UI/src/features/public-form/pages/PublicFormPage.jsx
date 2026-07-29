import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useThemeStore } from '@features/theme/themeStore.js'
import { getTheme } from '@features/form-builder/themes.js'
import { usePublicForm, useSubmitPublicForm } from '../hooks/usePublicForm.js'
import { publicFormApi } from '../api/publicFormApi.js'
import {
  BotMessage,
  BotMediaMessage,
  UserMessage,
} from '../components/ChatMessage.jsx'
import { ChatInput } from '../components/ChatInput.jsx'

export function PublicFormPage() {
  const { formId } = useParams()
  const { data: form, isLoading, error } = usePublicForm(formId)
  const submitMutation = useSubmitPublicForm(formId)

  const themeId = useThemeStore((s) => s.themeId)
  const theme = getTheme(form?.themeId || themeId)

  const blocks = useMemo(() => form?.blocks || [], [form?.blocks])
  const [step, setStep] = useState(0)
  const [messages, setMessages] = useState([])
  const [answers, setAnswers] = useState({})
  const [awaitingInput, setAwaitingInput] = useState(false)
  const [finished, setFinished] = useState(false)
  const [startTracked, setStartTracked] = useState(false)
  const bottomRef = useRef(null)
  const viewedRef = useRef(false)

  useEffect(() => {
    if (form && !viewedRef.current) {
      publicFormApi.incrementView(form.id)
      viewedRef.current = true
    }
  }, [form])

  useEffect(() => {
    if (!form || blocks.length === 0) return
    if (finished) return
    if (step >= blocks.length) {
      handleComplete()
      return
    }
    const block = blocks[step]
    if (block.type.endsWith('-bubble')) {
      const t = setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'bot', block }])
        setStep((s) => s + 1)
      }, 400)
      return () => clearTimeout(t)
    }
    if (block.type.endsWith('-input')) {
      setAwaitingInput(true)
    }
  }, [step, blocks, form, finished])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, awaitingInput, finished])

  const handleAnswer = (value) => {
    if (!startTracked && form) {
      publicFormApi.incrementStart(form.id)
      setStartTracked(true)
    }
    const block = blocks[step]
    setMessages((prev) => [...prev, { role: 'user', block, value }])
    setAnswers((prev) => ({ ...prev, [block.id]: value }))
    setAwaitingInput(false)
    setStep((s) => s + 1)
  }

  const handleComplete = () => {
    if (finished) return
    submitMutation.mutate(answers, {
      onSuccess: () => {
        setFinished(true)
        setMessages((prev) => [
          ...prev,
          { role: 'bot', synthetic: true, text: 'Thanks for your submission! 🎉' },
        ])
      },
      onError: () => {
        setFinished(true)
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            synthetic: true,
            text: "Sorry, we couldn't record your submission. Please try again later.",
          },
        ])
      },
    })
  }

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4 text-center"
        style={{ backgroundColor: theme.background, color: theme.text }}
      >
        <p className="text-sm opacity-70">Loading form…</p>
      </div>
    )
  }

  if (error || !form) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
        style={{ backgroundColor: theme.background, color: theme.text }}
      >
        <h1 className="text-3xl font-bold">Form not found</h1>
        <p className="mt-2 text-sm opacity-70">
          The form you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>
        <Link
          to="/"
          className="mt-6 rounded-md bg-[#1A5FFF] px-5 py-2.5 text-sm font-medium text-white"
        >
          Go home
        </Link>
      </div>
    )
  }

  if (blocks.length === 0) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
        style={{ backgroundColor: theme.background, color: theme.text }}
      >
        <h1 className="text-2xl font-semibold">This form is empty</h1>
        <p className="mt-2 text-sm opacity-70">
          The owner hasn&apos;t added any blocks yet.
        </p>
      </div>
    )
  }

  const currentInputBlock =
    awaitingInput && step < blocks.length ? blocks[step] : null

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: theme.background }}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-3 pb-4 pt-5 sm:px-4 md:py-10">
          <div className="space-y-3 md:space-y-4">
            {messages.map((m, i) => {
              const prev = messages[i - 1]
              const isBot = m.role === 'bot'
              const hideAvatar =
                isBot && prev?.role === 'bot' && !m.synthetic && !prev.synthetic
              if (m.synthetic) {
                return (
                  <BotMessage key={i} theme={theme} showAvatar={!hideAvatar}>
                    {m.text}
                  </BotMessage>
                )
              }
              if (m.role === 'bot') {
                const b = m.block
                if (b.type === 'text-bubble') {
                  return (
                    <BotMessage key={i} theme={theme} showAvatar={!hideAvatar}>
                      {b.data?.content || <em style={{ opacity: 0.6 }}>(empty)</em>}
                    </BotMessage>
                  )
                }
                return (
                  <BotMediaMessage
                    key={i}
                    theme={theme}
                    kind={b.type}
                    url={b.data?.url}
                    showAvatar={!hideAvatar}
                  />
                )
              }
              return (
                <UserMessage key={i} theme={theme}>
                  {formatUserAnswer(m.block, m.value)}
                </UserMessage>
              )
            })}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>

      {currentInputBlock && (
        <div
          className="sticky bottom-0 border-t px-3 py-3 backdrop-blur sm:px-4 sm:py-4"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.botBubbleBg,
          }}
        >
          <div className="mx-auto max-w-2xl">
            <ChatInput
              theme={theme}
              block={currentInputBlock}
              onSubmit={handleAnswer}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function formatUserAnswer(block, value) {
  if (block.type === 'rating-input') {
    return `${value} ★`
  }
  return String(value)
}
