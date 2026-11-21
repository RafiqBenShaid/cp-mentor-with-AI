import { dueItems, formatDue, isDue, REVIEW_INTERVALS } from '../lib/spacedRepetition'
import { useStore } from '../store/useStore'

const platformBadge: Record<string, string> = {
  codeforces: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  atcoder: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  leetcode: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
}

export default function Revision() {
  const revision = useStore((s) => s.revision)
  const reviewRevision = useStore((s) => s.reviewRevision)
  const due = dueItems(revision)
  const upcoming = [...revision].filter((r) => !isDue(r)).sort((a, b) => a.next_review_at - b.next_review_at)
  const reviewsDone = useStore((s) => s.reviewsDone)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Spaced Repetition</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Problems you got wrong come back at 1, 3, 7, 14 and 30-day intervals (simplified SM-2).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-900 dark:bg-rose-950/30">
          <div className="text-sm text-slate-500 dark:text-slate-400">Due now</div>
          <div className="mt-1 text-3xl font-bold text-rose-600 dark:text-rose-400">{due.length}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-slate-500 dark:text-slate-400">Scheduled</div>
          <div className="mt-1 text-3xl font-bold">{upcoming.length}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-slate-500 dark:text-slate-400">Reviews completed</div>
          <div className="mt-1 text-3xl font-bold">{reviewsDone}</div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 font-semibold">Due for review</h2>
        {due.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">
            Nothing due right now. Missed mock-contest problems will land here automatically.
          </div>
        ) : (
          <div className="space-y-3">
            {due.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${platformBadge[item.platform]}`}>
                      {item.platform}
                    </span>
                    <a href={item.url} target="_blank" rel="noreferrer" className="font-semibold hover:text-indigo-600">
                      {item.problem_name}
                    </a>
                    <span className="text-xs text-slate-500">Rating {item.rating}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">
                      stage {item.stage + 1}/{REVIEW_INTERVALS.length}
                    </span>
                    <span className="text-rose-500">{formatDue(item.next_review_at)}</span>
                    {item.tags.map((t) => (
                      <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => reviewRevision(item.id, false)}
                    className="rounded-lg border border-rose-300 px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-900/30"
                  >
                    Forgot
                  </button>
                  <button
                    onClick={() => reviewRevision(item.id, true)}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    Remembered
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 font-semibold">Upcoming queue</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-500">No scheduled reviews yet.</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {upcoming.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${platformBadge[item.platform]}`}>
                    {item.platform}
                  </span>
                  <span className="truncate font-medium">{item.problem_name}</span>
                </div>
                <span className="shrink-0 text-xs text-slate-500">{formatDue(item.next_review_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500 dark:border-slate-700">
        Intervals: {REVIEW_INTERVALS.map((d) => `${d}d`).join(' → ')}. “Remembered” advances a stage; “Forgot” resets to
        1 day.
      </div>
    </div>
  )
}
