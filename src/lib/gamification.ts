import type { BadgeDefinition, BadgeStats, Streak } from '../types'

export const BADGES: BadgeDefinition[] = [
  {
    id: 'first-blood',
    name: 'First Blood',
    description: 'Solve your first tracked problem.',
    icon: '🩸',
    tier: 'bronze',
    check: (s) => s.totalSolved >= 1,
  },
  {
    id: 'problem-solver-50',
    name: 'Problem Solver',
    description: 'Solve 50 problems.',
    icon: '✏️',
    tier: 'bronze',
    check: (s) => s.totalSolved >= 50,
  },
  {
    id: 'century',
    name: 'Century',
    description: 'Solve 100 problems.',
    icon: '💯',
    tier: 'silver',
    check: (s) => s.totalSolved >= 100,
  },
  {
    id: 'half-k',
    name: 'Half Millennium',
    description: 'Solve 500 problems.',
    icon: '🏅',
    tier: 'gold',
    check: (s) => s.totalSolved >= 500,
  },
  {
    id: 'streak-3',
    name: 'Warming Up',
    description: 'Maintain a 3-day streak.',
    icon: '🔥',
    tier: 'bronze',
    check: (s) => s.currentStreak >= 3 || s.longestStreak >= 3,
  },
  {
    id: 'streak-7',
    name: 'On Fire',
    description: 'Maintain a 7-day streak.',
    icon: '🔥',
    tier: 'silver',
    check: (s) => s.currentStreak >= 7 || s.longestStreak >= 7,
  },
  {
    id: 'streak-30',
    name: 'Unstoppable',
    description: 'Maintain a 30-day streak.',
    icon: '🌋',
    tier: 'gold',
    check: (s) => s.currentStreak >= 30 || s.longestStreak >= 30,
  },
  {
    id: 'goal-1',
    name: 'Goal Getter',
    description: 'Complete a daily goal.',
    icon: '🎯',
    tier: 'bronze',
    check: (s) => s.goalsCompleted >= 1,
  },
  {
    id: 'goal-10',
    name: 'Consistent',
    description: 'Complete 10 daily goals.',
    icon: '📅',
    tier: 'silver',
    check: (s) => s.goalsCompleted >= 10,
  },
  {
    id: 'review-10',
    name: 'Revisionist',
    description: 'Review 10 problems with spaced repetition.',
    icon: '🔁',
    tier: 'bronze',
    check: (s) => s.reviewsDone >= 10,
  },
  {
    id: 'contest-1',
    name: 'Mock Warrior',
    description: 'Finish your first mock contest.',
    icon: '⚔️',
    tier: 'bronze',
    check: (s) => s.contestsDone >= 1,
  },
  {
    id: 'contest-5',
    name: 'Battle Tested',
    description: 'Finish 5 mock contests.',
    icon: '🛡️',
    tier: 'silver',
    check: (s) => s.contestsDone >= 5,
  },
  {
    id: 'rating-1500',
    name: 'Specialist',
    description: 'Reach a rating of 1500.',
    icon: '⭐',
    tier: 'silver',
    check: (s) => s.rating >= 1500,
  },
  {
    id: 'rating-1800',
    name: 'Expert',
    description: 'Reach a rating of 1800.',
    icon: '🌟',
    tier: 'gold',
    check: (s) => s.rating >= 1800,
  },
]

export function evaluateBadges(stats: BadgeStats, earnedIds: string[]): BadgeDefinition[] {
  const earned = new Set(earnedIds)
  return BADGES.filter((b) => !earned.has(b.id) && b.check(stats))
}

function localDateKey(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayKey(now = new Date()): string {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  return localDateKey(d)
}

export function yesterdayKey(now = new Date()): string {
  const d = new Date(now)
  d.setDate(d.getDate() - 1)
  d.setHours(0, 0, 0, 0)
  return localDateKey(d)
}

export function recordActivity(streak: Streak, now = new Date()): Streak {
  const today = todayKey(now)
  if (streak.last_active_date === today) return streak
  const current = streak.last_active_date === yesterdayKey(now) ? streak.current_streak + 1 : 1
  return {
    current_streak: current,
    longest_streak: Math.max(streak.longest_streak, current),
    last_active_date: today,
  }
}
