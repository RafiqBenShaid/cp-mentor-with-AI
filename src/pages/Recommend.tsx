import { useStore } from '../store/useStore'
import { allTags } from '../lib/recommend'

export default function Recommend() {
  const filters = useStore((s) => s.recommendFilters)
  const updateFilters = useStore((s) => s.updateRecommendFilters)
  const regenerate = useStore((s) => s.regenerateRecommendations)
  const recommendations = useStore((s) => s.recommendations)
  const markSolved = useStore((s) => s.markSolved)
  const addToRevision = useStore((s) => s.addToRevision)

  const toggleTag = (tag: string) => {
    const include = filters.includeTags.includes(tag)
      ? filters.includeTags.filter((t) => t !== tag)
      : [...filters.includeTags, tag]
    updateFilters({ ...filters, includeTags: include })
  }

  const apply = () => {
    updateFilters(filters)
    regenerate()
  }

  const platformBadge: Record<string, string> = {
    codeforces: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    atcoder: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    leetcode: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Problem Recommendation</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Unsolved problems filtered by your rating range with topic variety.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Min rating
            </label>
            <input
              type="number"
              value={filters.minRating}
              onChange={(e) => updateFilters({ ...filters, minRating: Number(e.target.value) })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Max rating
            </label>
            <input
              type="number"
              value={filters.maxRating}
              onChange={(e) => updateFilters({ ...filters, maxRating: Number(e.target.value) })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            Topics (select variety)
          </label>
          <div className="flex flex-wrap gap-2">
            {allTags().map((tag) => {
              const active = filters.includeTags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
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

        <button
          onClick={apply}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          Generate Recommendations
        </button>
      </div>

      {recommendations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-10 text-center text-slate-500">
          No problems match your filters. Try widening the rating range or selecting more topics.
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-5 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${platformBadge[p.platform]}`}>
                    {p.platform}
                  </span>
                  <span className="text-sm font-semibold">{p.name}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <span>Rating: {p.rating}</span>
                  <span>•</span>
                  <div className="flex gap-1">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Open
                </a>
                <button
                  onClick={() => addToRevision(p)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  title="Add to spaced repetition queue"
                >
                  Revise
                </button>
                <button
                  onClick={() => markSolved(p.id)}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                >
                  Mark Solved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
