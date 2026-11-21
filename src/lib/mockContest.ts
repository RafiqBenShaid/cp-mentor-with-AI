import { problemBank } from '../data/mock'
import type { MockContest, MockContestProblem } from '../types'

export interface MockContestOptions {
  topics: string[]
  count: number
  duration: number
  solvedIds: string[]
}

export function generateMockContest(options: MockContestOptions): MockContest {
  const { topics, count, duration, solvedIds } = options
  const solved = new Set(solvedIds)
  const pool = problemBank.filter((p) => !p.solved && !solved.has(p.id))
  const preferred = pool.filter((p) => p.tags.some((t) => topics.includes(t)))
  const rest = pool.filter((p) => !preferred.includes(p))

  const picked: MockContestProblem[] = []
  const used = new Set<string>()
  for (const p of [...preferred, ...rest]) {
    if (picked.length >= count) break
    if (used.has(p.id)) continue
    used.add(p.id)
    picked.push({
      id: p.id,
      name: p.name,
      rating: p.rating,
      platform: p.platform,
      tags: p.tags,
      url: p.url,
    })
  }

  return {
    id: `mock-${Date.now()}`,
    started_at: Date.now(),
    duration_min: duration,
    problems: picked,
    solved: [],
    finished: false,
    finished_at: null,
  }
}

export function contestScore(contest: MockContest): number {
  const solvedPoints = contest.problems
    .filter((p) => contest.solved.includes(p.id))
    .reduce((sum, p) => sum + Math.max(100, p.rating - 800), 0)
  return solvedPoints
}

export function contestMaxScore(contest: MockContest): number {
  return contest.problems.reduce((sum, p) => sum + Math.max(100, p.rating - 800), 0)
}
