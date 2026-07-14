'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: any) => void) | null
  onerror: ((event: any) => void) | null
  onend: (() => void) | null
}

export function useSpeechRecognition({
  onFinalResult,
  wakeWordEnabled = false,
  wakeWord = "beast",
}: {
  onFinalResult: (text: string) => void
  wakeWordEnabled?: boolean
  wakeWord?: string
}) {
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const finalRef = useRef('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      setSupported(false)
      return
    }
    setSupported(true)
    const recognition: SpeechRecognitionLike = new SR()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onresult = (event: any) => {
  let interimText = ""
  let finalText = ""

  for (let i = event.resultIndex; i < event.results.length; i++) {
    const transcript = event.results[i][0].transcript

    if (event.results[i].isFinal) {
      finalText += transcript
    } else {
      interimText += transcript
    }
  }

  setInterim(interimText)

  if (!finalText) return

  const spoken = finalText.trim().toLowerCase()

  if (wakeWordEnabled) {
    if (spoken.startsWith(wakeWord.toLowerCase())) {
      const command = spoken.replace(wakeWord.toLowerCase(), "").trim()

      if (command.length > 0) {
        onFinalResult(command)
      }
    }
  } else {
    onFinalResult(finalText.trim())
  }
}

    recognition.onerror = () => {
      setListening(false)
    }

    recognition.onend = () => {
  setListening(false)
  setInterim("")
}
    recognitionRef.current = recognition

    return () => {
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
      try {
        recognition.abort()
      } catch {
        /* noop */
      }
    }
  }, [onFinalResult, wakeWordEnabled, wakeWord])

 
const start = useCallback(async () => {
  const rec = recognitionRef.current
  if (!rec || listening) return

  finalRef.current = ""
  setInterim("")

  try {
    await navigator.mediaDevices.getUserMedia({ audio: true })

    console.log("Starting recognition")

    rec.start()
    setListening(true)
  } catch (err) {
    console.error(err)
  }
}, [listening])

const stop = useCallback(() => {
  const rec = recognitionRef.current
  if (!rec) return

  setListening(false)
  setInterim("")

  try {
    rec.stop()
  } catch {
    /* noop */
  }
}, [])

  return { supported, listening, interim, start, stop }
}
