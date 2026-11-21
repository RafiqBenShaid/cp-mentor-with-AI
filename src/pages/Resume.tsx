import { useMemo, useState } from 'react'
import { predictPerformance } from '../lib/analytics'
import { BADGES } from '../lib/gamification'
import { buildResumeHtml } from '../lib/resume'
import { useStore } from '../store/useStore'

export default function Resume() {
  const profile = useStore((s) => s.profile)
  const badges = useStore((s) => s.badges)
  const streak = useStore((s) => s.streak)
  const ratingHistory = useStore((s) => s.ratingHistory)
  const statistics = useStore((s) => s.statistics)
  const tagStats = useStore((s) => s.tagStats)
  const [copied, setCopied] = useState(false)

  const earnedBadges = BADGES.filter((b) => badges.some((e) => e.id === b.id))
  const prediction = predictPerformance(ratingHistory)

  const html = useMemo(
    () =>
      buildResumeHtml({
        profile,
        statistics,
        tagStats,
        badges: earnedBadges,
        prediction,
        streak: streak.current_streak,
        longestStreak: streak.longest_streak,
      }),
    [profile, earnedBadges, prediction, streak.current_streak, streak.longest_streak],
  )

  const download = () => {
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile.cf_handle}-cp-resume.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const print = () => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 300)
  }

  const copy = async () => {
    const text = `${profile.name} — CP Resume
Rating: ${profile.current_rating} | Solved: ${statistics.reduce((s, x) => s + x.solved, 0)} | Streak: ${streak.current_streak}d
Projected next rating: ${prediction.predictedRating} (${prediction.low}–${prediction.high})
Handles: CF ${profile.cf_handle}, AtCoder ${profile.atcoder_handle}, LeetCode ${profile.leetcode_handle}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">CP Resume Export</h1>
          <p className="text-slate-500 dark:text-slate-400">
            A shareable one-page summary of your rating, solved counts, strengths and badges.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={copy}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            {copied ? 'Copied!' : 'Copy summary'}
          </button>
          <button
            onClick={download}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Download HTML
          </button>
          <button
            onClick={print}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Print / Save PDF
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5 dark:border-slate-800">
          <span className="text-sm font-semibold">Preview</span>
          <span className="text-xs text-slate-500">{earnedBadges.length} badges included</span>
        </div>
        <iframe title="CP Resume preview" srcDoc={html} className="h-[820px] w-full bg-slate-100" />
      </div>
    </div>
  )
}
