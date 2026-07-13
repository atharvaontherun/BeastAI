'use client'

import { cn } from '@/lib/utils'

export type CoreState = 'idle' | 'listening' | 'thinking' | 'speaking'

const STATE_LABEL: Record<CoreState, string> = {
  idle: 'STANDBY',
  listening: 'LISTENING',
  thinking: 'PROCESSING',
  speaking: 'RESPONDING',
}

function Ticks({ count, radius, length }: { count: number; radius: number; length: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 360
        return (
          <line
            key={i}
            x1="100"
            y1={100 - radius}
            x2="100"
            y2={100 - radius + length}
            transform={`rotate(${angle} 100 100)`}
            stroke="currentColor"
            strokeWidth="1"
          />
        )
      })}
    </>
  )
}

export function JarvisCore({ state }: { state: CoreState }) {
  const active = state !== 'idle'
  const accent = state === 'speaking'

  return (
    <div className="relative flex aspect-square w-full max-w-[520px] items-center justify-center">
      {/* Outer glow */}
      <div
        className={cn(
          'absolute inset-8 rounded-full blur-3xl transition-opacity duration-700',
          accent ? 'bg-accent/20 opacity-100' : 'bg-primary/15',
          active ? 'opacity-100' : 'opacity-60',
        )}
        aria-hidden
      />

      {/* Rotating ring systems */}
      <svg
        viewBox="0 0 200 200"
        className={cn(
          'absolute inset-0 h-full w-full animate-spin-slow',
          accent ? 'text-accent' : 'text-primary',
        )}
        aria-hidden
      >
        <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.5" />
        <g opacity="0.5">
          <Ticks count={60} radius={92} length={4} />
        </g>
        <circle
          cx="100"
          cy="100"
          r="84"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.6"
          strokeWidth="1"
          strokeDasharray="6 60 20 40"
        />
      </svg>

      <svg
        viewBox="0 0 200 200"
        className={cn(
          'absolute inset-6 h-[calc(100%-3rem)] w-[calc(100%-3rem)] animate-spin-slower',
          accent ? 'text-accent' : 'text-primary',
        )}
        aria-hidden
      >
        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.75" />
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.7"
          strokeWidth="1.5"
          strokeDasharray="2 20"
        />
        <g opacity="0.35">
          <Ticks count={24} radius={80} length={8} />
        </g>
      </svg>

      <svg
        viewBox="0 0 200 200"
        className={cn(
          'absolute inset-16 h-[calc(100%-8rem)] w-[calc(100%-8rem)]',
          active ? 'animate-spin-med' : 'animate-spin-slow',
          accent ? 'text-accent' : 'text-primary',
        )}
        aria-hidden
      >
        <circle
          cx="100"
          cy="100"
          r="60"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="2"
          strokeDasharray="90 30 40 30"
          strokeLinecap="round"
        />
      </svg>

      {/* Core */}
      <div className="relative flex h-[38%] w-[38%] items-center justify-center">
        <div
          className={cn(
            'absolute inset-0 rounded-full blur-md transition-colors duration-500',
            accent ? 'bg-accent/40' : 'bg-primary/30',
            'animate-core-pulse',
          )}
          aria-hidden
        />
        <div
          className={cn(
            'relative flex h-full w-full flex-col items-center justify-center rounded-full border text-center backdrop-blur-sm transition-colors duration-500',
            accent ? 'border-accent/60 bg-accent/10' : 'border-primary/50 bg-primary/10',
          )}
        >
          <div
            className={cn(
              'font-display text-lg font-bold tracking-[0.3em] text-glow sm:text-2xl',
              accent ? 'text-accent' : 'text-primary',
            )}
          >
            B.E.A.S.T
          </div>
          <div
            className={cn(
              'mt-1 font-mono text-[10px] tracking-[0.35em] sm:text-xs',
              active ? 'text-foreground animate-flicker' : 'text-muted-foreground',
            )}
          >
            {STATE_LABEL[state]}
          </div>
        </div>
      </div>
    </div>
  )
}
