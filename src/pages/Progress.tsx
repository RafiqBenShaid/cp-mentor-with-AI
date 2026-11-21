import { BADGES, todayKey } from '../lib/gamification'
import { useStore } from '../store/useStore'

const tierStyles: Record<string, string> = {
  bronze: 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20',
  silver: 'border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800/60',
  gold: 'border-yellow-400 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900/20',
}

function last14Days(): string[] {
  const days: string[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    d.setHours(0, 0, 0, 0)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

export default function Progress() {
  const profile = useStore((s) => s.profile)
  const streak = useStore((s) => s.streak)
  const badges = useStore((s) => s.badges)
  const solvedIds = useStore((s) => s.solvedIds)
  const statistics = useStore((s) => s.statistics)
  const goalsCompleted = useStore((s) => s.goalsCompleted)
  const reviewsDone = useStore((s) => s.reviewsDone)
  const contestsDone = useStore((s) => s.contestsDone)
  const notificationsEnabled = useStore((s) => s.notificationsEnabled)
  const toggleNotifications = useStore((s) => s.toggleNotifications)
  const resetDemo = useStore((s) => s.resetDemo)

  const earned = new Set(badges.map((b) => b.id))
  const totalSolved = statistics.reduce((sum, s) => sum + s.solved, 0) + solvedIds.length
  const days = last14Days()
  const today = todayKey()

  const activeDays = new Set<string>()
  if (streak.last_active_date) {
    const start = new Date(streak.last_active_date)
    for (let i = 0; i < streak.current_streak; i++) {
      const d = new Date(start)
      d.setDate(d.getDate() - i)
      d.setHours(0, 0, 0, 0)
      activeDays.add(d.toISOString().slice(0, 10))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Progress & Gamification</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Streaks, badges and milestones that keep the habit alive.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleNotifications}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              notificationsEnabled
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                : 'border-slate-300 text-slate-500 dark:border-slate-700'
            }`}
          >
            {notificationsEnabled ? '🔔 Notifications on' : '🔕 Notifications off'}
          </button>
          <button
            onClick={() => {
              if (window.confirm('Reset all demo progress? This clears saved state.')) resetDemo()
            }}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Reset demo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-5 dark:border-orange-900 dark:from-orange-950/40 dark:to-slate-900">
          <div className="text-sm text-slate-500 dark:text-slate-400">Current streak</div>
          <div className="mt-1 text-4xl font-bold">🔥 {streak.current_streak}</div>
          <div className="mt-1 text-xs text-slate-500">best {streak.longest_streak} days</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-slate-500 dark:text-slate-400">Problems solved</div>
          <div className="mt-1 text-4xl font-bold">{totalSolved}</div>
          <div className="mt-1 text-xs text-slate-500">all platforms</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-slate-500 dark:text-slate-400">Badges</div>
          <div className="mt-1 text-4xl font-bold">
            {badges.length}
            <span className="text-lg text-slate-400">/{BADGES.length}</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">unlocked</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-slate-500 dark:text-slate-400">Rating</div>
          <div className="mt-1 text-4xl font-bold">{profile.current_rating}</div>
          <div className="mt-1 text-xs text-slate-500">goal 1500 next</div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Last 14 days</h2>
          <span className="text-xs text-slate-500">goals {goalsCompleted} · reviews {reviewsDone} · mock contests {contestsDone}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {days.map((day) => {
            const active = activeDays.has(day)
            return (
              <div
                key={day}
                title={day}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-[10px] font-medium ${
                  active
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                }`}
              >
                {day.slice(8)}
              </div>
            )
          })}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          {streak.last_active_date === today
            ? 'You already logged activity today — streak safe.'
            : 'Solve or review one problem today to keep the streak alive.'}
        </p>
      </div>

      <div>
        <h2 className="mb-3 font-semibold">Badge collection</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {BADGES.map((badge) => {
            const isEarned = earned.has(badge.id)
            const earnedAt = badges.find((b) => b.id === badge.id)?.earned_at
            return (
              <div
                key={badge.id}
                className={`rounded-xl border p-4 transition-opacity ${
                  isEarned ? tierStyles[badge.tier] : 'border-dashed border-slate-200 opacity-60 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="text-3xl">{isEarned ? badge.icon : '🔒'}</div>
                  <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-900/50">
                    {badge.tier}
                  </span>
                </div>
                <div className="mt-2 font-semibold">{badge.name}</div>
                <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{badge.description}</div>
                {isEarned && earnedAt && (
                  <div className="mt-2 text-[10px] text-slate-400">
                    Earned {new Date(earnedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
