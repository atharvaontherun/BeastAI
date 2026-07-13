'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export function useJarvisVoice({ enabled }: { enabled: boolean }) {
  const [speaking, setSpeaking] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const urlRef = useRef<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const cleanupUrl = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current)
      urlRef.current = null
    }
  }, [])

  const stop = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
    cleanupUrl()
    setSpeaking(false)
  }, [cleanupUrl])

  const speak = useCallback(
    async (text: string) => {
      if (!enabled || !text.trim()) return
      stop()
      const controller = new AbortController()
      abortRef.current = controller
      try {
        const res = await fetch('/api/speak', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ text }),
          signal: controller.signal,
        })
        if (!res.ok) {
          setSpeaking(false)
          return
        }
        const blob = await res.blob()
        if (controller.signal.aborted) return
        const url = URL.createObjectURL(blob)
        urlRef.current = url

        let audio = audioRef.current
        if (!audio) {
          audio = new Audio()
          audioRef.current = audio
        }
        audio.src = url
        audio.onended = () => {
          setSpeaking(false)
          cleanupUrl()
        }
        audio.onerror = () => {
          setSpeaking(false)
          cleanupUrl()
        }
        setSpeaking(true)
        await audio.play()
      } catch {
        setSpeaking(false)
      }
    },
    [enabled, stop, cleanupUrl],
  )

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      cleanupUrl()
    }
  }, [cleanupUrl])

  return { speak, stop, speaking }
}
