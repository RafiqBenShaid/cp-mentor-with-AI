import { describe, expect, it } from 'vitest'
import { BADGES, evaluateBadges, recordActivity } from '../src/lib/gamification'
import type { BadgeStats, Streak } from '../src/types'

const emptyStats: BadgeStats = {
  totalSolved: 0,
  currentStreak: 0,
  longestStreak: 0,
  goalsCompleted: 0,
  reviewsDone: 0,
  contestsDone: 0,
  rating: 0,
}

describe('recordActivity', () => {
  it('does not change a streak already recorded today', () => {
    const streak: Streak = { current_streak: 4, longest_streak: 9, last_active_date: '2024-01-02' }
    const result = recordActivity(streak, new Date(2024, 0, 2, 12))
    expect(result.current_streak).toBe(4)
    expect(result.last_active_date).toBe('2024-01-02')
  })

  it('increments when the last activity was yesterday', () => {
    const streak: Streak = { current_streak: 4, longest_streak: 4, last_active_date: '2024-01-01' }
    const result = recordActivity(streak, new Date(2024, 0, 2, 12))
    expect(result.current_streak).toBe(5)
    expect(result.longest_streak).toBe(5)
  })

  it('resets after a gap', () => {
    const streak: Streak = { current_streak: 8, longest_streak: 12, last_active_date: '2023-12-01' }
    const result = recordActivity(streak, new Date(2024, 0, 2, 12))
    expect(result.current_streak).toBe(1)
    expect(result.longest_streak).toBe(12)
  })
})

describe('evaluateBadges', () => {
  it('returns nothing for a brand-new user', () => {
    expect(evaluateBadges(emptyStats, [])).toHaveLength(0)
  })

  it('unlocks matching badges and skips already earned ones', () => {
    const stats: BadgeStats = {
      totalSolved: 100,
      currentStreak: 7,
      longestStreak: 7,
      goalsCompleted: 1,
      reviewsDone: 0,
      contestsDone: 1,
      rating: 1500,
    }
    const unlocked = evaluateBadges(stats, []).map((b) => b.id)
    expect(unlocked).toContain('century')
    expect(unlocked).toContain('streak-7')
    expect(unlocked).toContain('goal-1')
    expect(unlocked).toContain('contest-1')
    expect(unlocked).toContain('rating-1500')

    const again = evaluateBadges(stats, unlocked)
    expect(again).toHaveLength(0)
  })

  it('every badge definition has a unique id and a check function', () => {
    const ids = BADGES.map((b) => b.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const badge of BADGES) expect(typeof badge.check).toBe('function')
  })
})
