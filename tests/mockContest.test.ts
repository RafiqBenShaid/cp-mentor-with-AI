import { describe, expect, it } from 'vitest'
import { contestMaxScore, contestScore, generateMockContest } from '../src/lib/mockContest'

describe('generateMockContest', () => {
  it('builds a contest with the requested number of unique problems', () => {
    const contest = generateMockContest({ topics: ['dp', 'graph'], count: 4, duration: 90, solvedIds: [] })
    expect(contest.problems).toHaveLength(4)
    expect(new Set(contest.problems.map((p) => p.id)).size).toBe(4)
    expect(contest.duration_min).toBe(90)
    expect(contest.finished).toBe(false)
    expect(contest.solved).toEqual([])
  })

  it('prefers problems from the selected topics', () => {
    const contest = generateMockContest({ topics: ['graph'], count: 3, duration: 60, solvedIds: [] })
    expect(contest.problems.some((p) => p.tags.includes('graph'))).toBe(true)
  })

  it('does not reuse already solved problems', () => {
    const contest = generateMockContest({ topics: ['dp'], count: 4, duration: 60, solvedIds: ['lc_4', '1847C'] })
    expect(contest.problems.some((p) => p.id === 'lc_4' || p.id === '1847C')).toBe(false)
  })
})

describe('contest scoring', () => {
  it('scores solved problems above the max when all are solved', () => {
    const contest = generateMockContest({ topics: ['dp'], count: 3, duration: 60, solvedIds: [] })
    const solvedContest = { ...contest, solved: contest.problems.map((p) => p.id) }
    expect(contestScore(solvedContest)).toBe(contestMaxScore(contest))
    expect(contestScore(solvedContest)).toBeGreaterThan(0)
  })

  it('scores zero when nothing is solved', () => {
    const contest = generateMockContest({ topics: ['dp'], count: 3, duration: 60, solvedIds: [] })
    expect(contestScore(contest)).toBe(0)
  })
})
