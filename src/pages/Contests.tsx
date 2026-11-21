import { useEffect, useRef, useState } from 'react'
import { contests } from '../data/mock'
import { notifyDesktop, requestNotificationPermission } from '../lib/desktop'
import { useStore } from '../store/useStore'

const platformColor: Record<string, string> = {
  codeforces: '#ef7d57',
  atcoder: '#22a6b3',
  leetcode: '#f0b429',
}

const platformLabel: Record<string, string> = {
  codeforces: 'Codeforces',
  atcoder: 'AtCoder',
  leetcode: 'LeetCode',
}

function formatCountdown(ms: number) {
  const total = Math.max(0, ms)
  const days = Math.floor(total / (24 * 3600 * 1000))
  const hours = Math.floor((total % (24 * 3600 * 1000)) / (3600 * 1000))
  const mins = Math.floor((total % (3600 * 1000)) / (60 * 1000))
  if (days > 0) return `${days}d ${hours}h ${mins}m`
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
}

const filters = ['all', 'codeforces', 'atcoder', 'leetcode'] as const

const REMINDER_LEAD_MS = 15 * 60 * 1000

export default function Contests() {
  const [now, setNow] = useState(Date.now())
  const [filter, setFilter] = useState<(typeof filters)[number]>('all')
  const reminders = useStore((s) => s.contestReminders)
  const toggleContestReminder = useStore((s) => s.toggleContestReminder)
  const notificationsEnabled = useStore((s) => s.notificationsEnabled)
  const notifiedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000)
    void requestNotificationPermission()
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const checkReminders = () => {
      const current = Date.now()
      for (const id of reminders) {
        const contest = contests.find((c) => c.id === id)
        if (!contest || notifiedRef.current.has(id)) continue
        const remaining = contest.start_time - current
        if (remaining > 0 && remaining <= REMINDER_LEAD_MS) {
          notifiedRef.current.add(id)
          if (notificationsEnabled) {
            notifyDesktop('Contest starting soon', `${contest.name} starts in ${formatCountdown(remaining)}.`)
          }
        }
      }
    }
    checkReminders()
    const timer = setInterval(checkReminders, 30000)
    return () => clearInterval(timer)
  }, [reminders, notificationsEnabled])

  const sorted = [...contests]
    .filter((c) => filter === 'all' || c.platform === filter)
    .sort((a, b) => a.start_time - b.start_time)

  const toggleReminder = (id: string) => {
    const isSet = reminders.includes(id)
    toggleContestReminder(id)
    notifiedRef.current.delete(id)
    if (!isSet && notificationsEnabled) {
      const contest = contests.find((c) => c.id === id)
      if (contest) {
        notifyDesktop('Contest reminder set', `${contest.name} starts in ${formatCountdown(contest.start_time - Date.now())}.`)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upcoming Contests</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Contest reminders cached from Codeforces, AtCoder and LeetCode.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-indigo-600 text-white'
                : 'border border-slate-300 text-slate-600 hover:border-indigo-400 dark:border-slate-700 dark:text-slate-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {sorted.map((c) => {
          const isSoon = c.start_time - now < 2 * 24 * 3600 * 1000
          const reminderSet = reminders.includes(c.id)
          return (
            <div
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: platformColor[c.platform] }} />
                  <span className="font-semibold">{c.name}</span>
                  {isSoon && (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                      Soon
                    </span>
                  )}
                  {reminderSet && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      Reminder on
                    </span>
                  )}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {platformLabel[c.platform]} • {c.duration_min} min • starts in{' '}
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {formatCountdown(c.start_time - now)}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Open
                </a>
                <button
                  onClick={() => toggleReminder(c.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    reminderSet
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {reminderSet ? 'Reminder set ✓' : 'Set Reminder'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700">
        💡 The countdown refreshes live. In the packaged Electron build, reminders fire native desktop
        notifications before the contest starts.
      </div>
    </div>
  )
}
