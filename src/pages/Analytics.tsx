import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import { predictPerformance, ratingDelta, averageRating } from '../lib/analytics'
import { computeWeaknesses } from '../lib/recommend'
import { useStore } from '../store/useStore'

export default function Analytics() {
  const ratingHistory = useStore((s) => s.ratingHistory)
  const tagStats = useStore((s) => s.tagStats)
  const prediction = predictPerformance(ratingHistory)
  const weaknesses = computeWeaknesses(tagStats)
  const recentDelta = ratingDelta(ratingHistory)
  const avg = averageRating(ratingHistory)

  const chartData: { name: string; rating?: number; projection?: number }[] = ratingHistory.map((p) => ({
    name: p.contest,
    rating: p.rating,
  }))
  if (chartData.length > 0) {
    chartData[chartData.length - 1].projection = ratingHistory[ratingHistory.length - 1].rating
  }
  prediction.nextContests.forEach((value, i) => {
    chartData.push({ name: `Next ${i + 1}`, projection: value })
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Performance Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Regression-based rating projection, consistency and topic-level weaknesses (KMeans clustering).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-slate-500 dark:text-slate-400">Projected rating</div>
          <div className="mt-1 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {prediction.predictedRating}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            likely {prediction.low}–{prediction.high}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-slate-500 dark:text-slate-400">Trend</div>
          <div className={`mt-1 text-3xl font-bold ${prediction.slope >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {prediction.slope >= 0 ? '+' : ''}
            {prediction.slope}
          </div>
          <div className="mt-1 text-xs text-slate-500">rating points / contest</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-slate-500 dark:text-slate-400">Consistency</div>
          <div className="mt-1 text-3xl font-bold">{prediction.consistency}%</div>
          <div className="mt-1 text-xs text-slate-500">R² = {prediction.rSquared}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-slate-500 dark:text-slate-400">Recent form</div>
          <div className={`mt-1 text-3xl font-bold ${recentDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {recentDelta >= 0 ? '+' : ''}
            {recentDelta}
          </div>
          <div className="mt-1 text-xs text-slate-500">avg rating {avg}</div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Rating trend & projection</h2>
          <span className="text-xs text-slate-500">{ratingHistory.length} contests analysed</span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis domain={['dataMin - 60', 'dataMax + 60']} tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="rating"
                name="Actual rating"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="projection"
                name="Projection"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={{ r: 3 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Projection uses an ordinary least-squares fit over your last {ratingHistory.length} contests. The shaded range
          in the cards above is roughly one residual standard deviation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 font-semibold">Weakness clusters</h2>
          <div className="space-y-4">
            {weaknesses.map((w) => {
              const barColor =
                w.level === 'weak' ? 'bg-rose-500' : w.level === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
              const textColor =
                w.level === 'weak'
                  ? 'text-rose-600 dark:text-rose-400'
                  : w.level === 'medium'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
              return (
                <div key={w.tag}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">{w.tag}</span>
                    <span className={`font-semibold ${textColor}`}>
                      {w.level} · {Math.round(w.wrongRatio * 100)}% wrong
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${w.wrongRatio * 100}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 font-semibold">Contest-by-contest</h2>
          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {ratingHistory
              .map((p, i) => ({
                ...p,
                delta: i === 0 ? 0 : p.rating - ratingHistory[i - 1].rating,
              }))
              .reverse()
              .map((p) => (
                <div
                  key={p.contest}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm dark:border-slate-800"
                >
                  <div>
                    <div className="font-medium">{p.contest}</div>
                    <div className="text-xs capitalize text-slate-500">{p.platform}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{p.rating}</div>
                    <div
                      className={`text-xs ${
                        p.delta > 0 ? 'text-emerald-600' : p.delta < 0 ? 'text-rose-600' : 'text-slate-400'
                      }`}
                    >
                      {p.delta > 0 ? '+' : ''}
                      {p.delta}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
