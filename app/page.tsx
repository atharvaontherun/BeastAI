'use client'
import { think } from "@/lib/brain";
import { openWebsite } from "@/lib/browser";
import { useCallback, useMemo, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { useEffect } from "react";
import { DefaultChatTransport, type UIMessage } from 'ai'
import { Activity, Cpu, Volume2, VolumeX, Wifi } from 'lucide-react'
import { CommandBar } from '@/components/command-bar'
import { ConversationLog } from '@/components/conversation-log'
import { JarvisCore, type CoreState } from '@/components/jarvis-core'
import { Waveform } from '@/components/waveform'
import { useJarvisVoice } from '@/hooks/use-jarvis-voice'
import { useSpeechRecognition } from '@/hooks/use-speech-recognition'
import { cn } from '@/lib/utils'
import { openDesktopApp } from "@/lib/desktop";

function extractText(message: UIMessage): string {
  return message.parts
    .filter((p) => p.type === 'text')
    .map((p: any) => p.text)
    .join('')
}

export default function Page() {
  const [input, setInput] = useState('')
  const [voiceEnabled, setVoiceEnabled] = useState(true)

  const { speak, stop: stopVoice, speaking } = useJarvisVoice({ enabled: voiceEnabled })

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onFinish: ({ message }) => {
      const text = extractText(message)
      if (text) speak(text)
    },
  })

  const thinking = status === 'submitted' || status === 'streaming'

  const [wakeWordEnabled, setWakeWordEnabled] = useState(false);
const [assistantState, setAssistantState] = useState<
  "idle" | "listening" | "thinking" | "speaking"
>("idle");


const submit = useCallback(
  async (text: string) => {
    const value = text.trim();
    if (!value) return;

    stopVoice();

    const decision = think(value);

    const lower = value.toLowerCase();

if (lower.includes("open vscode") || lower.includes("open visual studio code")) {
  await openDesktopApp("vscode");
  setInput("");
  return;
}

if (lower.includes("open spotify")) {
  await openDesktopApp("spotify");
  setInput("");
  return;
}

if (lower.includes("open discord")) {
  await openDesktopApp("discord");
  setInput("");
  return;
}

if (lower.includes("open calculator")) {
  await openDesktopApp("calculator");
  setInput("");
  return;
}
    switch (decision.action) {
      case "OPEN_WEBSITE":
        if (decision.target) {
          openWebsite(decision.target);
        }
        setInput("");
        return;

      case "SEARCH_WEB":
        window.open(
          `https://www.google.com/search?q=${encodeURIComponent(
            decision.query ?? ""
          )}`,
          "_blank"
        );
        setInput("");
        return;

      case "CHAT":
      default:
        sendMessage({ text: value });
        setInput("");
    }
  },
  [sendMessage, stopVoice]
);
const {
  supported: micSupported,
  listening,
  interim,
  start,
  stop,
} = useSpeechRecognition({
  onFinalResult: (text) => submit(text),
  wakeWordEnabled,
})

  const coreState: CoreState = useMemo(() => {
    if (listening) return 'listening'
    if (thinking) return 'thinking'
    if (speaking) return 'speaking'
    return 'idle'
  }, [listening, thinking, speaking])

  const handleMicToggle = () => {
    if (listening) {
      stop()
    } else {
      stopVoice()
      start()
    }
  }
useEffect(() => {
  if (!wakeWordEnabled) {
    stop();
    return;
  }

  stopVoice();
  start();
}, [wakeWordEnabled, start, stop, stopVoice]);
  const toggleVoice = () => {
    if (voiceEnabled) stopVoice()
    setVoiceEnabled((v) => !v)
  }

  return (
    <main className="relative flex h-dvh flex-col overflow-hidden bg-background">
      {/* HUD background */}
      <div className="hud-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,var(--background)_95%)]"
        aria-hidden
      />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between border-b border-primary/15 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/40 bg-primary/10 text-primary">
            <Cpu className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-sm font-bold tracking-[0.25em] text-primary text-glow">
              B.E.A.S.T  
            </div>
            <div className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
              ATHARVA · v.OMEGA
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 font-mono text-[10px] tracking-widest text-muted-foreground">
                    <button
    onClick={() => setWakeWordEnabled(!wakeWordEnabled)}
    className={`px-4 py-2 rounded-full transition ${
      wakeWordEnabled
        ? "bg-cyan-500 text-white"
        : "bg-gray-700 text-gray-300"
    }`}
  >
    {wakeWordEnabled ? "👀" : "⏻"}
  </button>
  <span className="hidden items-center gap-1.5 sm:flex">
            <Wifi className="h-3.5 w-3.5 text-primary" /> ONLINE
          </span>

          <span className="hidden items-center gap-1.5 sm:flex">
            <Activity className="h-3.5 w-3.5 text-accent" /> {coreState.toUpperCase()}
          </span>
          <button
            type="button"
            onClick={toggleVoice}
            aria-label={voiceEnabled ? 'Mute voice' : 'Enable voice'}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-md border transition-colors',
              voiceEnabled
                ? 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/20'
                : 'border-border bg-muted/40 text-muted-foreground hover:text-foreground',
            )}
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Core / visualizer */}
        <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 p-4 sm:p-8">
          <JarvisCore state={coreState} />

          <div className="w-full max-w-md">
            <Waveform state={coreState} />
          </div>

          <div className="h-6 max-w-md text-center font-mono text-xs tracking-wide text-muted-foreground">
            {listening && interim ? (
              <span className="text-foreground">{interim}</span>
            ) : listening ? (
              <span className="animate-flicker text-primary">
  {wakeWordEnabled
    ? "Say 'BEAST'..."
    : "Listening for your command..."}
</span>
            ) : speaking ? (
              <span className="text-accent">Responding…</span>
            ) : thinking ? (
              <span className="text-primary">Analyzing request…</span>
            ) : (
              <span className="opacity-70">Awaiting input</span>
            )}
          </div>
        </section>

        {/* Console */}
        <section className="flex min-h-0 w-full flex-col border-t border-primary/15 bg-card/30 backdrop-blur-sm lg:w-[440px] lg:border-l lg:border-t-0">
          <div className="flex items-center justify-between border-b border-primary/15 px-4 py-3">
            <span className="font-mono text-xs tracking-[0.3em] text-primary">CONSOLE LOG</span>
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
              {messages.length} ENTRIES
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
            <ConversationLog messages={messages} thinking={thinking && status === 'submitted'} />
            <div className="pt-3">
              <CommandBar
                value={input}
                onChange={setInput}
                onSubmit={() => submit(input)}
                onMicToggle={handleMicToggle}
                listening={listening}
                micSupported={micSupported}
                busy={thinking}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
