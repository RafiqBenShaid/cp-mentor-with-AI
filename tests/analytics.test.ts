import { describe, expect, it } from 'vitest'
import { kmeans1d, predictPerformance } from '../src/lib/analytics'
import type { RatingPoint } from '../src/types'

describe('kmeans1d', () => {
  it('sorts clusters from lowest to highest', () => {
    const result = kmeans1d([0.1, 0.12, 0.5, 0.52, 0.9, 0.92], 3)
    expect(result.centroids).toHaveLength(3)
    expect(result.centroids[0]).toBeLessThan(result.centroids[1])
    expect(result.centroids[1]).toBeLessThan(result.centroids[2])
    expect(result.assignments).toEqual([0, 0, 1, 1, 2, 2])
  })

  it('handles empty input', () => {
    expect(kmeans1d([], 3)).toEqual({ assignments: [], centroids: [] })
  })
})

describe('predictPerformance', () => {
  const linearHistory: RatingPoint[] = Array.from({ length: 6 }, (_, i) => ({
    contest: `C${i}`,
    rating: 1000 + i * 100,
    platform: 'codeforces',
  }))

  it('detects a positive trend and projects forward', () => {
    const prediction = predictPerformance(linearHistory)
    expect(prediction.slope).toBe(100)
    expect(prediction.predictedRating).toBe(1600)
    expect(prediction.low).toBeLessThan(prediction.predictedRating)
    expect(prediction.high).toBeGreaterThan(prediction.predictedRating)
    expect(prediction.nextContests).toHaveLength(3)
  })

  it('reports a flat trend for constant ratings', () => {
    const flat: RatingPoint[] = linearHistory.map((p) => ({ ...p, rating: 1400 }))
    const prediction = predictPerformance(flat)
    expect(prediction.slope).toBe(0)
    expect(prediction.predictedRating).toBe(1400)
  })
})
