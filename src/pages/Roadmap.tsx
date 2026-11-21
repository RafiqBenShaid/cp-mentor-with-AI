import { useState } from 'react'
import { roadmaps } from '../data/mock'
import { useStore } from '../store/useStore'

export default function Roadmap() {
  const [selected, setSelected] = useState(roadmaps[0].id)
  const roadmapProgress = useStore((s) => s.roadmapProgress)
  const toggleRoadmapProblem = useStore((s) => s.toggleRoadmapProblem)
  const addToRevision = useStore((s) => s.addToRevision)

  const roadmap = roadmaps.find((r) => r.id === selected) ?? roadmaps[0]
  const allProblems = roadmap.stages.flatMap((s) => s.problems)
  const totalDone = allProblems.filter((p) => roadmapProgress.includes(p.id)).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Learning Roadmap</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Curated, stage-by-stage problem lists. Check items off as you solve them.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {roadmaps.map((r) => {
          const problems = r.stages.flatMap((s) => s.problems)
          const done = problems.filter((p) => roadmapProgress.includes(p.id)).length
          const pct = problems.length ? Math.round((done / problems.length) * 100) : 0
          const active = r.id === selected
          return (
            <button
              key={r.id}
              onClick={() => setSelected(r.id)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                active
                  ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-900/30'
                  : 'border-slate-200 bg-white hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{r.icon}</span>
                <span className="text-xs font-semibold text-slate-500">{pct}%</span>
              </div>
              <div className="mt-2 text-sm font-semibold">{r.title}</div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
              </div>
            </button>
          )
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold">
            {roadmap.icon} {roadmap.title}
          </span>
          <span className="text-slate-500">
            {totalDone}/{allProblems.length} problems completed
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500">{roadmap.description}</p>
      </div>

      <div className="space-y-4">
        {roadmap.stages.map((stage, i) => {
          const stageDone = stage.problems.filter((p) => roadmapProgress.includes(p.id)).length
          return (
            <div
              key={stage.name}
              className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-semibold">{stage.name}</div>
                    <div className="text-xs text-slate-500">{stage.description}</div>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-slate-500">
                  {stageDone}/{stage.problems.length}
                </span>
              </div>
              <div className="space-y-2">
                {stage.problems.map((p) => {
                  const isDone = roadmapProgress.includes(p.id)
                  return (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 ${
                        isDone
                          ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <button onClick={() => toggleRoadmapProblem(p.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-xs ${
                            isDone ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isDone ? '✓' : ''}
                        </span>
                        <span className="min-w-0">
                          <span className={`block truncate text-sm font-medium ${isDone ? 'text-slate-400 line-through' : ''}`}>
                            {p.name}
                          </span>
                          <span className="text-xs capitalize text-slate-500">
                            {p.platform} · rating {p.rating}
                          </span>
                        </span>
                      </button>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          onClick={() =>
                            addToRevision({
                              id: p.id,
                              name: p.name,
                              platform: p.platform,
                              rating: p.rating,
                              tags: [],
                              solved: false,
                              url: p.url,
                            })
                          }
                          className="rounded border border-slate-300 px-2 py-1 text-xs font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                          title="Add to revision queue"
                        >
                          Revise
                        </button>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded border border-slate-300 px-2 py-1 text-xs font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                        >
                          Open
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
