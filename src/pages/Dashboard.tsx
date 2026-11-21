import { Link } from 'react-router-dom'
import { XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { computeWeaknesses } from '../lib/recommend'
import { predictPerformance } from '../lib/analytics'
import { dueItems } from '../lib/spacedRepetition'
import { useStore } from '../store/useStore'

export default function Dashboard() {
  const profile = useStore((s) => s.profile)
  const goal = useStore((s) => s.goal)
  const streak = useStore((s) => s.streak)
  const revision = useStore((s) => s.revision)
  const badges = useStore((s) => s.badges)
  const ratingHistory = useStore((s) => s.ratingHistory)
  const statistics = useStore((s) => s.statistics)
  const tagStats = useStore((s) => s.tagStats)
  const weaknesses = computeWeaknesses(tagStats)
  const weakTags = weaknesses.filter((w) => w.level === 'weak').map((w) => w.tag)
  const prediction = predictPerformance(ratingHistory)
  const due = dueItems(revision)
  const chartData = ratingHistory.map((p) => ({
    name: p.contest,
    rating: p.rating,
  }))

  const progress =
    goal && goal.target_count > 0 ? Math.min(100, (goal.completed_count / goal.target_count) * 100) : 0
  const goalDone = goal ? goal.completed_count >= goal.target_count : false

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Welcome back, {profile.name.split(' ')[0]} — here's your competitive programming overview.
          </p>
        </div>
        <Link
          to="/mock-contest"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Start Mock Contest
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-slate-500 dark:text-slate-400">Current Rating</div>
          <div className="mt-1 text-3xl font-bold">{profile.current_rating}</div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
            projected {prediction.predictedRating} next contest
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-slate-500 dark:text-slate-400">Total Solved</div>
          <div className="mt-1 text-3xl font-bold">{statistics.reduce((sum, s) => sum + s.solved, 0)}</div>
          <div className="mt-1 text-xs text-slate-500">across 3 platforms</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-slate-500 dark:text-slate-400">Today's Goal</div>
          <div className="mt-1 text-3xl font-bold">
            {goal ? goal.completed_count : 0}
            <span className="text-lg text-slate-400">/{goal ? goal.target_count : 0}</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full rounded-full transition-all ${goalDone ? 'bg-emerald-500' : 'bg-indigo-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-slate-500 dark:text-slate-400">Streak</div>
          <div className="mt-1 text-3xl font-bold">🔥 {streak.current_streak}</div>
          <div className="mt-1 text-xs text-slate-500">
            best {streak.longest_streak} days · {badges.length} badges
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 xl:col-span-2 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Rating Progression</h2>
            <div className="flex gap-3 text-xs text-slate-500">
              {statistics.map((s) => (
                <span key={s.platform} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  {s.label}
                </span>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis domain={['dataMin - 50', 'dataMax + 50']} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="rating" stroke="#6366f1" fill="url(#ratingGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">AI Insight</h2>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                LIVE
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Weak topics:{' '}
              {weakTags.length > 0 ? (
                weakTags.map((t) => (
                  <span
                    key={t}
                    className="mr-1 inline-block rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                  >
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-emerald-600">looking strong 💪</span>
              )}
            </p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Projected next rating <span className="font-bold text-indigo-600 dark:text-indigo-400">{prediction.predictedRating}</span>{' '}
              (range {prediction.low}–{prediction.high}).
            </p>
            <div className="mt-4 flex gap-2">
              <Link
                to="/mentor"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-center text-xs font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Ask Mentor
              </Link>
              <Link
                to="/analytics"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-center text-xs font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Full Analysis
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-semibold">Revision due</h2>
            <div className="mt-2 text-3xl font-bold">{due.length}</div>
            <p className="mt-1 text-xs text-slate-500">
              {due.length > 0 ? 'problems waiting for a quick re-solve' : 'all caught up — nice work'}
            </p>
            <Link
              to="/revision"
              className="mt-3 inline-block rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              Open Revision
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {statistics.map((s) => (
          <div key={s.platform} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ background: s.color }} />
              <span className="font-medium">{s.label}</span>
            </div>
            <div className="mt-2 text-3xl font-bold">{s.solved}</div>
            <div className="mt-1 text-xs text-slate-500">problems solved</div>
          </div>
        ))}
      </div>
    </div>
  )
}
