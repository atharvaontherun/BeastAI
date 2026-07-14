'use client'

import { useEffect, useRef } from 'react'
import type { UIMessage } from 'ai'
import { Globe, Loader2, Search, User } from 'lucide-react'
import { cn } from '@/lib/utils'

function extractText(message: UIMessage): string {
  return message.parts
    .filter((p) => p.type === 'text')
    .map((p: any) => p.text)
    .join('')
}

function SearchPart({ part }: { part: any }) {
  const running = part.state === 'input-streaming' || part.state === 'input-available'
  const query = part.input?.query as string | undefined
  const results = part.output?.results as
    | Array<{ title: string; source: string; url: string }>
    | undefined

  return (
    <div className="my-2 rounded-lg border border-primary/25 bg-primary/5 p-3 font-mono text-xs">
      <div className="flex items-center gap-2 text-primary">
        {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
        <span className="tracking-wider">
          {running ? 'SEARCHING WEB' : 'WEB SEARCH'}
          {query ? `: ${query}` : ''}
        </span>
      </div>
      {results && results.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {results.slice(0, 3).map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-muted-foreground">
              <Globe className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:text-foreground hover:underline"
                title={r.title}
              >
                {r.source}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function ConversationLog({
  messages,
  thinking,
}: {
  messages: UIMessage[]
  thinking: boolean
}) {
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  return (
    <div className="flex-1 space-y-5 overflow-y-auto px-1 py-2">
      {messages.length === 0 && (
        <div className="mt-6 space-y-2 font-mono text-xs text-muted-foreground">
          <p className="text-primary">{'> SYSTEM ONLINE'}</p>
          <p>All systems nominal. Awaiting your command, Sir.</p>
          <p className="opacity-70">Try: &quot;What&apos;s the use of BEAST?&quot;</p>
        </div>
      )}

      {messages.map((message) => {
        const isUser = message.role === 'user'
        const text = extractText(message)
        return (
          <div key={message.id} className="space-y-1.5">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em]">
              {isUser ? (
                <>
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Operator</span>
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span className="text-accent">BEAST</span>
                </>
              )}
            </div>

            {message.parts.map((part, i) => {
              if (part.type === 'tool-searchWeb') {
                return <SearchPart key={i} part={part} />
              }
              return null
            })}

            {text && (
              <p
                className={cn(
                  'text-pretty text-sm leading-relaxed',
                  isUser ? 'text-foreground/90' : 'text-foreground',
                )}
              >
                {text}
              </p>
            )}
          </div>
        )
      })}

      {thinking && (
        <div className="flex items-center gap-2 font-mono text-xs text-primary">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span className="animate-flicker tracking-wider">BEAST is thinking…</span>
        </div>
      )}

      <div ref={endRef} />
    </div>
  )
}
