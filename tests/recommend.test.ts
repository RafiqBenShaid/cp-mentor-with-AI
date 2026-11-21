import { describe, expect, it } from 'vitest'
import { allTags, computeWeaknesses, recommendProblems } from '../src/lib/recommend'
import { tagStats } from '../src/data/mock'

describe('computeWeaknesses', () => {
  it('returns a level for every tracked tag and sorts weak first', () => {
    const weaknesses = computeWeaknesses()
    expect(weaknesses).toHaveLength(tagStats.length)
    expect(weaknesses[0].level).toBe('weak')
    const levels = weaknesses.map((w) => w.level)
    const lastWeak = levels.lastIndexOf('weak')
    const firstStrong = levels.indexOf('strong')
    if (firstStrong !== -1) expect(lastWeak).toBeLessThan(firstStrong)
  })

  it('marks the highest wrong-ratio tags as weak', () => {
    const weaknesses = computeWeaknesses()
    const weakestTags = weaknesses.filter((w) => w.level === 'weak').map((w) => w.tag)
    expect(weakestTags).toContain('bitmask')
    expect(weakestTags).toContain('graph')
  })
})

describe('recommendProblems', () => {
  it('only returns unsolved problems inside the rating range', () => {
    const result = recommendProblems({ minRating: 1200, maxRating: 1500, includeTags: ['dp', 'graph'] }, new Set())
    expect(result.length).toBeGreaterThan(0)
    for (const problem of result) {
      expect(problem.solved).toBe(false)
      expect(problem.rating).toBeGreaterThanOrEqual(1200)
      expect(problem.rating).toBeLessThanOrEqual(1500)
      expect(problem.tags.some((t) => ['dp', 'graph'].includes(t))).toBe(true)
    }
  })

  it('excludes already solved ids and caps results at five', () => {
    const result = recommendProblems({ minRating: 800, maxRating: 2000, includeTags: [] }, new Set(['1847C']))
    expect(result.length).toBeLessThanOrEqual(5)
    expect(result.some((p) => p.id === '1847C')).toBe(false)
  })
})

describe('allTags', () => {
  it('returns a sorted unique list', () => {
    const tags = allTags()
    expect(new Set(tags).size).toBe(tags.length)
    expect([...tags].sort()).toEqual(tags)
  })
})
