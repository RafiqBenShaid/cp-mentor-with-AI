import { describe, expect, it } from 'vitest'
import {
  REVIEW_INTERVALS,
  dueItems,
  isDue,
  makeRevisionItem,
  reviewItem,
} from '../src/lib/spacedRepetition'
import type { Problem, RevisionItem } from '../src/types'

const problem: Problem = {
  id: 'test-1',
  platform: 'codeforces',
  name: 'Test Problem',
  rating: 1200,
  tags: ['dp'],
  solved: false,
  url: 'https://example.com',
}

const base: RevisionItem = makeRevisionItem(problem, 0)

describe('spaced repetition', () => {
  it('creates a new item due after one day', () => {
    expect(base.stage).toBe(0)
    expect(base.interval_days).toBe(1)
    expect(base.next_review_at).toBe(24 * 3600 * 1000)
  })

  it('advances through the interval ladder when remembered', () => {
    let item = base
    for (let i = 0; i < REVIEW_INTERVALS.length; i++) {
      item = reviewItem(item, true, 0)
      const expectedStage = Math.min(i + 1, REVIEW_INTERVALS.length - 1)
      expect(item.stage).toBe(expectedStage)
      expect(item.interval_days).toBe(REVIEW_INTERVALS[expectedStage])
    }
  })

  it('resets to one day when forgotten', () => {
    const advanced = reviewItem(base, true, 0)
    const reset = reviewItem(advanced, false, 0)
    expect(reset.stage).toBe(0)
    expect(reset.interval_days).toBe(1)
  })

  it('detects due items', () => {
    const now = 10 * 24 * 3600 * 1000
    expect(isDue(base, now)).toBe(true)
    const future = reviewItem(base, true, now)
    expect(isDue(future, now)).toBe(false)
    expect(dueItems([base, future], now)).toHaveLength(1)
  })
})
