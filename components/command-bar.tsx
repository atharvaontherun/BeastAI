'use client'

import type { FormEvent } from 'react'
import { Mic, MicOff, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CommandBar({
  value,
  onChange,
  onSubmit,
  onMicToggle,
  listening,
  micSupported,
  busy,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  onMicToggle: () => void
  listening: boolean
  micSupported: boolean
  busy: boolean
}) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (value.trim()) onSubmit()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-xl border border-primary/25 bg-card/60 p-2 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={onMicToggle}
        disabled={!micSupported}
        aria-label={listening ? 'Stop listening' : 'Start voice input'}
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors',
          listening
            ? 'border-destructive/60 bg-destructive/20 text-destructive'
            : 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/20',
          !micSupported && 'cursor-not-allowed opacity-40',
        )}
      >
        {listening ? (
          <span className="relative flex h-4 w-4 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive/60" />
            <Mic className="relative h-4 w-4" />
          </span>
        ) : micSupported ? (
          <Mic className="h-4 w-4" />
        ) : (
          <MicOff className="h-4 w-4" />
        )}
      </button>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={listening ? 'Listening…' : 'Execute command or ask BEAST…'}
        className="min-w-0 flex-1 bg-transparent px-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
      />

      <button
        type="submit"
        disabled={busy || !value.trim()}
        aria-label="Send command"
        className={cn(
          'flex h-10 shrink-0 items-center gap-2 rounded-lg border border-primary/40 bg-primary/15 px-4 font-mono text-xs tracking-wider text-primary transition-colors hover:bg-primary/25',
          (busy || !value.trim()) && 'cursor-not-allowed opacity-50',
        )}
      >
        <Send className="h-4 w-4" />
        <span className="hidden sm:inline">SEND</span>
      </button>
    </form>
  )
}
