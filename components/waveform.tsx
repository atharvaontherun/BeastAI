'use client'

import { useEffect, useRef } from 'react'
import type { CoreState } from './jarvis-core'

export function Waveform({ state }: { state: CoreState }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const stateRef = useRef<CoreState>(state)
  stateRef.current = state

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let t = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const readCssVar = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim()

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      ctx.clearRect(0, 0, w, h)

      const s = stateRef.current
      const intensity = s === 'speaking' ? 1 : s === 'listening' ? 0.75 : s === 'thinking' ? 0.4 : 0.12
      const speed = s === 'speaking' ? 0.09 : s === 'listening' ? 0.07 : 0.04
      t += speed

      const bars = 48
      const gap = 3
      const barWidth = (w - gap * (bars - 1)) / bars
      const mid = h / 2
      const color = s === 'speaking' ? readCssVar('--accent') : readCssVar('--primary')

      for (let i = 0; i < bars; i++) {
        const n =
          Math.sin(i * 0.5 + t) * 0.5 +
          Math.sin(i * 0.13 + t * 1.7) * 0.3 +
          Math.sin(i * 0.9 + t * 0.6) * 0.2
        const envelope = Math.sin((i / bars) * Math.PI)
        const amp = Math.abs(n) * envelope * intensity
        const barHeight = Math.max(2, amp * (h * 0.9))
        const x = i * (barWidth + gap)

        ctx.fillStyle = `oklch(${color} / ${0.35 + amp * 0.65})`
        ctx.beginPath()
        const r = Math.min(barWidth / 2, 2)
        const y = mid - barHeight / 2
        // rounded rect
        ctx.moveTo(x + r, y)
        ctx.arcTo(x + barWidth, y, x + barWidth, y + barHeight, r)
        ctx.arcTo(x + barWidth, y + barHeight, x, y + barHeight, r)
        ctx.arcTo(x, y + barHeight, x, y, r)
        ctx.arcTo(x, y, x + barWidth, y, r)
        ctx.closePath()
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="h-16 w-full" aria-hidden />
}
