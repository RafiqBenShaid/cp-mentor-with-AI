import { useState, useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import { computeWeaknesses } from '../lib/recommend'
import { generateSuggestedPrompts } from '../lib/mentor'

export default function Mentor() {
  const chats = useStore((s) => s.chats)
  const tagStats = useStore((s) => s.tagStats)
  const sendMentorMessage = useStore((s) => s.sendMentorMessage)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const weaknesses = computeWeaknesses(tagStats)
  const suggested = generateSuggestedPrompts()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chats])

  const send = () => {
    const msg = input.trim()
    if (!msg) return
    sendMentorMessage(msg)
    setInput('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Mentor</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Conversational feedback based on your performance data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weakness panel */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-5 h-fit">
          <h2 className="font-semibold mb-4">Topic Breakdown</h2>
          <div className="space-y-4">
            {weaknesses.map((w) => {
              const color =
                w.level === 'weak'
                  ? 'text-rose-600 dark:text-rose-400'
                  : w.level === 'medium'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
              const barColor =
                w.level === 'weak'
                  ? 'bg-rose-500'
                  : w.level === 'medium'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
              return (
                <div key={w.tag}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium capitalize">{w.tag}</span>
                    <span className={`font-semibold ${color}`}>
                      {w.level} • {Math.round(w.wrongRatio * 100)}% wrong
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor}`}
                      style={{ width: `${w.wrongRatio * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Chat panel */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col">
          <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[480px]">
            {chats.map((c) => (
              <div key={c.id} className={`flex ${c.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${
                    c.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-sm'
                      : 'bg-slate-100 dark:bg-slate-800 dark:text-slate-100 rounded-bl-sm'
                  }`}
                >
                  {c.message}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {suggested.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMentorMessage(s)}
                  className="rounded-full border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask your mentor about weaknesses, rating, or plans..."
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
              <button
                onClick={send}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
