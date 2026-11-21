import type { Problem, RevisionItem } from '../types'

export const REVIEW_INTERVALS = [1, 3, 7, 14, 30]

export function isDue(item: RevisionItem, now = Date.now()): boolean {
  return item.next_review_at <= now
}

export function dueItems(items: RevisionItem[], now = Date.now()): RevisionItem[] {
  return items.filter((i) => isDue(i, now)).sort((a, b) => a.next_review_at - b.next_review_at)
}

export function reviewItem(item: RevisionItem, remembered: boolean, now = Date.now()): RevisionItem {
  const stage = remembered
    ? Math.min(item.stage + 1, REVIEW_INTERVALS.length - 1)
    : 0
  const interval_days = REVIEW_INTERVALS[stage]
  return {
    ...item,
    stage,
    interval_days,
    next_review_at: now + interval_days * 24 * 3600 * 1000,
    last_reviewed_at: now,
  }
}

export function makeRevisionItem(problem: Problem, now = Date.now()): RevisionItem {
  return {
    id: `rev-${problem.id}`,
    problem_id: problem.id,
    problem_name: problem.name,
    platform: problem.platform,
    rating: problem.rating,
    tags: problem.tags,
    url: problem.url,
    stage: 0,
    interval_days: REVIEW_INTERVALS[0],
    next_review_at: now + REVIEW_INTERVALS[0] * 24 * 3600 * 1000,
    added_at: now,
    last_reviewed_at: null,
  }
}

export function formatDue(ts: number, now = Date.now()): string {
  const diff = ts - now
  const abs = Math.abs(diff)
  const days = Math.floor(abs / (24 * 3600 * 1000))
  const hours = Math.floor((abs % (24 * 3600 * 1000)) / (3600 * 1000))
  const label = days > 0 ? `${days}d` : hours > 0 ? `${hours}h` : 'moments'
  return diff <= 0 ? `due ${label} ago` : `in ${label}`
}
