import { tagStats, problemBank } from '../data/mock'
import type { Weakness, TagStat, Problem, Difficulty } from '../types'
import { kmeans1d } from './analytics'

const LEVEL_BY_CLUSTER: Difficulty[] = ['strong', 'medium', 'weak']

export function computeWeaknesses(stats: TagStat[] = tagStats): Weakness[] {
  const order: Record<Difficulty, number> = { weak: 0, medium: 1, strong: 2 }
  const wrongRatios = stats.map((t) => 1 - t.ratio)
  const { assignments } = kmeans1d(wrongRatios, 3)

  return stats
    .map((t, i) => {
      const cluster = assignments[i] ?? 1
      const level: Difficulty = LEVEL_BY_CLUSTER[cluster] ?? 'medium'
      return { tag: t.tag, wrongRatio: 1 - t.ratio, level, cluster }
    })
    .sort((a, b) => order[a.level] - order[b.level] || b.wrongRatio - a.wrongRatio)
}

export interface RecommendFilters {
  minRating: number
  maxRating: number
  includeTags: string[]
}

export function recommendProblems(filters: RecommendFilters, solvedIds: Set<string>): Problem[] {
  const { minRating, maxRating, includeTags } = filters
  const candidates = problemBank.filter(
    (p) =>
      !p.solved &&
      !solvedIds.has(p.id) &&
      p.rating >= minRating &&
      p.rating <= maxRating &&
      (includeTags.length === 0 || includeTags.some((t) => p.tags.includes(t))),
  )
  const picked: Problem[] = []
  const usedTags = new Set<string>()
  for (const p of candidates) {
    if (picked.length >= 5) break
    const tag = p.tags.find((t) => !usedTags.has(t))
    if (tag) {
      usedTags.add(tag)
      picked.push(p)
    }
  }
  for (const p of candidates) {
    if (picked.length >= 5) break
    if (!picked.includes(p)) picked.push(p)
  }
  return picked
}

export function allTags(): string[] {
  return Array.from(new Set(problemBank.flatMap((p) => p.tags))).sort()
}

export function weakTags(limit = 3): string[] {
  return computeWeaknesses()
    .filter((w) => w.level === 'weak')
    .slice(0, limit)
    .map((w) => w.tag)
}
