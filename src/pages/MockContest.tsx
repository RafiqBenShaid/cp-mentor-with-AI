import { useEffect, useMemo, useState } from 'react'
import { allTags, computeWeaknesses } from '../lib/recommend'
import { contestMaxScore, contestScore } from '../lib/mockContest'
import { notifyDesktop } from '../lib/desktop'
import { useStore } from '../store/useStore'

const platformBadge: Record<string, string> = {
  codeforces: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  atcoder: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  leetcode: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
}

function formatClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function MockContest() {
  const mockContest = useStore((s) => s.mockContest)
  const solvedIds = useStore((s) => s.solvedIds)
  const startMockContest = useStore((s) => s.startMockContest)
  const toggleMockSolved = useStore((s) => s.toggleMockSolved)
  const finishMockContest = useStore((s) => s.finishMockContest)

  const weak = useMemo(() => computeWeaknesses().filter((w) => w.level === 'weak').map((w) => w.tag), [])
  const [topics, setTopics] = useState<string[]>(weak.length ? weak : allTags().slice(0, 3))
  const [count, setCount] = useState(4)
  const [duration, setDuration] = useState(90)
  const [now, setNow] = useState(Date.now())

  const active = mockContest && !mockContest.finished
  const remaining = mockContest
    ? mockContest.started_at + mockContest.duration_min * 60000 - now
    : 0

  useEffect(() => {
    if (!active) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [active])

  useEffect(() => {
    if (active && remaining <= 0) {
      notifyDesktop('Time is up!', 'Your mock contest has ended. Review the missed problems.')
      finishMockContest()
    }
  }, [active, remaining, finishMockContest])

  const toggleTopic = (tag: string) => {
    setTopics((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const start = () => {
    startMockContest({ topics, count, duration, solvedIds })
    setNow(Date.now())
  }

  if (active && mockContest) {
    const pct = Math.max(0, Math.min(100, (remaining / (mockContest.duration_min * 60000)) * 100))
    const urgent = remaining < 5 * 60000
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Mock Contest</h1>
            <p className="text-slate-500 dark:text-slate-400">
              {mockContest.problems.length} problems · {mockContest.duration_min} minutes
            </p>
          </div>
          <div
            className={`rounded-xl px-5 py-2 text-center font-mono text-2xl font-bold ${
              urgent ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300' : 'bg-slate-900 text-white dark:bg-slate-800'
            }`}
          >
            {formatClock(remaining)}
          </div>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className={`h-full rounded-full transition-all ${urgent ? 'bg-rose-500' : 'bg-indigo-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="space-y-3">
          {mockContest.problems.map((p, i) => {
            const isSolved = mockContest.solved.includes(p.id)
            return (
              <div
                key={p.id}
                className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
                  isSolved
                    ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold dark:bg-slate-700">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${platformBadge[p.platform]}`}>
                      {p.platform}
                    </span>
                    <a href={p.url} target="_blank" rel="noreferrer" className="font-semibold hover:text-indigo-600">
                      {p.name}
                    </a>
                    <span className="text-xs text-slate-500">Rating {p.rating}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    Solve
                  </a>
                  <button
                    onClick={() => toggleMockSolved(p.id)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      isSolved
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'border border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                    }`}
                  >
                    {isSolved ? '✓ Solved' : 'Mark solved'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-slate-500">
            Score{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{contestScore(mockContest)}</span> /{' '}
            {contestMaxScore(mockContest)}
          </div>
          <button
            onClick={finishMockContest}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Finish contest
          </button>
        </div>
      </div>
    )
  }

  if (mockContest && mockContest.finished) {
    const score = contestScore(mockContest)
    const max = contestMaxScore(mockContest)
    const solved = mockContest.solved.length
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Contest Result</h1>
          <p className="text-slate-500 dark:text-slate-400">Review the problems you missed — they were queued for revision.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-sm text-slate-500">Solved</div>
            <div className="mt-1 text-3xl font-bold">
              {solved}/{mockContest.problems.length}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-sm text-slate-500">Score</div>
            <div className="mt-1 text-3xl font-bold">
              {score}
              <span className="text-lg text-slate-400">/{max}</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-sm text-slate-500">Duration</div>
            <div className="mt-1 text-3xl font-bold">{mockContest.duration_min}m</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 font-semibold">Problems</h2>
          <div className="space-y-2">
            {mockContest.problems.map((p) => {
              const isSolved = mockContest.solved.includes(p.id)
              return (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span>{isSolved ? '✅' : '❌'}</span>
                    <a href={p.url} target="_blank" rel="noreferrer" className="font-medium hover:text-indigo-600">
                      {p.name}
                    </a>
                    <span className="text-xs text-slate-500">Rating {p.rating}</span>
                  </div>
                  <span className="text-xs capitalize text-slate-500">{p.platform}</span>
                </div>
              )
            })}
          </div>
        </div>

        <button
          onClick={() => useStore.setState({ mockContest: null })}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          New contest
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mock Contest Generator</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Build a timed practice contest from your weak topics and unsolved problem bank.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Topics</label>
            <div className="flex flex-wrap gap-2">
              {allTags().map((tag) => {
                const active = topics.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTopic(tag)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300 text-slate-600 hover:border-indigo-400 dark:border-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Problems</label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              >
                {[3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} problems
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              >
                {[60, 90, 120].map((n) => (
                  <option key={n} value={n}>
                    {n} minutes
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={start}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Generate & start
          </button>
          <p className="text-xs text-slate-500">
            Problems are picked from your unsolved bank, preferring the selected weak topics.
          </p>
        </div>
      </div>
    </div>
  )
}
