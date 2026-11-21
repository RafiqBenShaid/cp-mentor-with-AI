import { useMemo, useState } from 'react'
import { buildSkillGraph, knowledgeGaps, masteryColor, masteryLevel } from '../lib/skillGraph'
import { useStore } from '../store/useStore'

export default function SkillGraph() {
  const tagStats = useStore((s) => s.tagStats)
  const { nodes, edges } = useMemo(() => buildSkillGraph(tagStats), [tagStats])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = nodes.find((n) => n.id === selectedId) ?? null
  const gaps = knowledgeGaps(nodes)
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Skill / Knowledge Graph</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Topic prerequisites and your mastery. Red nodes are knowledge gaps blocking higher-level topics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 xl:col-span-2 dark:border-slate-800 dark:bg-slate-900">
          <svg viewBox="0 0 880 600" className="h-auto w-full">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
              </marker>
            </defs>
            {edges.map((e) => {
              const from = nodeMap.get(e.from)
              const to = nodeMap.get(e.to)
              if (!from || !to) return null
              const active = selectedId === e.from || selectedId === e.to
              return (
                <line
                  key={`${e.from}-${e.to}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={active ? '#6366f1' : '#cbd5e1'}
                  strokeWidth={active ? 2.5 : 1.5}
                  strokeDasharray={active ? undefined : '4 3'}
                  markerEnd="url(#arrow)"
                />
              )
            })}
            {nodes.map((n) => {
              const isSelected = n.id === selectedId
              const isGap = n.mastery < 0.6
              const color = masteryColor(n.mastery)
              return (
                <g
                  key={n.id}
                  onClick={() => setSelectedId(n.id)}
                  className="cursor-pointer"
                  transform={`translate(${n.x}, ${n.y})`}
                >
                  {isGap && (
                    <circle r={34} fill={color} opacity={0.15} className="animate-pulse" />
                  )}
                  <circle
                    r={isSelected ? 30 : 26}
                    fill={color}
                    stroke={isSelected ? '#312e81' : '#ffffff'}
                    strokeWidth={isSelected ? 4 : 2}
                    opacity={0.95}
                  />
                  <text textAnchor="middle" dy="5" fill="#ffffff" fontSize="12" fontWeight="700">
                    {Math.round(n.mastery * 100)}
                  </text>
                  <text
                    textAnchor="middle"
                    y={46}
                    fill={isSelected ? '#4f46e5' : '#64748b'}
                    fontSize="11"
                    fontWeight={isSelected ? 700 : 500}
                  >
                    {n.label}
                  </text>
                </g>
              )
            })}
          </svg>
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500" /> weak (&lt;60%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-amber-500" /> medium (60–74%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-emerald-500" /> strong (75%+)
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-semibold">Selected topic</h2>
            {selected ? (
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">{selected.label}</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                    style={{ background: masteryColor(selected.mastery) }}
                  >
                    {masteryLevel(selected.mastery)}
                  </span>
                </div>
                <div className="text-sm text-slate-500">{selected.category}</div>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>Mastery</span>
                    <span>{Math.round(selected.mastery * 100)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${selected.mastery * 100}%`, background: masteryColor(selected.mastery) }}
                    />
                  </div>
                </div>
                <div className="text-sm">
                  Solved <span className="font-semibold">{selected.solved}</span> / {selected.total} tracked
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Prerequisites</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {selected.prereqs.length === 0 ? (
                      <span className="text-sm text-slate-500">None — start here.</span>
                    ) : (
                      selected.prereqs.map((p) => {
                        const prereq = nodeMap.get(p)
                        return (
                          <button
                            key={p}
                            onClick={() => setSelectedId(p)}
                            className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-indigo-900/40"
                          >
                            {prereq?.label ?? p}
                          </button>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Click any node in the graph to inspect it.</p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-semibold">Knowledge gaps ({gaps.length})</h2>
            <div className="mt-3 space-y-2">
              {gaps.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedId(g.id)}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-left text-sm hover:border-rose-300 dark:border-slate-800"
                >
                  <span className="font-medium">{g.label}</span>
                  <span className="text-xs font-semibold text-rose-600">{Math.round(g.mastery * 100)}%</span>
                </button>
              ))}
              {gaps.length === 0 && <p className="text-sm text-slate-500">No gaps — impressive balance!</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
