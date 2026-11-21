import { useState } from 'react'
import { useStore } from '../store/useStore'
import type { DailyGoal } from '../types'

export default function Goals() {
  const goal = useStore((s) => s.goal)
  const setGoal = useStore((s) => s.setGoal)
  const submissions = useStore((s) => s.submissions)

  const [target, setTarget] = useState(goal?.target_count ?? 4)
  const [minRating, setMinRating] = useState(goal?.min_rating ?? 1200)
  const [maxRating, setMaxRating] = useState(goal?.max_rating ?? 1500)

  const todayAC = submissions.filter((s) => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return s.verdict === 'AC' && s.submitted_at >= d.getTime()
  }).length

  const completed = Math.max(goal?.completed_count ?? 0, todayAC)
  const percent = goal && goal.target_count > 0 ? Math.min(100, (completed / goal.target_count) * 100) : 0
  const isDone = goal ? completed >= goal.target_count : false

  const save = () => {
    const g: DailyGoal = {
      date: new Date().toISOString().slice(0, 10),
      target_count: target,
      min_rating: minRating,
      max_rating: maxRating,
      completed_count: completed,
    }
    setGoal(g)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Daily Goal</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Set a target and we'll auto-track your submissions against it.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Problems to solve today
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                Min rating
              </label>
              <input
                type="number"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                Max rating
              </label>
              <input
                type="number"
                value={maxRating}
                onChange={(e) => setMaxRating(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>
          <button
            onClick={save}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Save Daily Goal
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 flex flex-col justify-center items-center text-center">
          {isDone ? (
            <>
              <div className="text-5xl mb-3">🎉</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                Goal Complete!
              </div>
              <p className="text-sm text-slate-500 mt-1">
                You've solved {completed} out of {goal?.target_count} target problems today. Great job!
              </p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-3">📈</div>
              <div className="text-xl font-bold">
                {completed} / {goal?.target_count} solved
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {goal?.target_count ? goal.target_count - completed : 0} more to go in the{' '}
                {goal?.min_rating}-{goal?.max_rating} range.
              </p>
            </>
          )}
          <div className="mt-6 h-3 w-full max-w-xs rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isDone ? 'bg-emerald-500' : 'bg-indigo-500'}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">{Math.round(percent)}% complete</p>
        </div>
      </div>
    </div>
  )
}
