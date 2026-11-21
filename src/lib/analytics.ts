import type { Prediction, RatingPoint } from '../types'

export interface KMeansResult {
  assignments: number[]
  centroids: number[]
}

export function kmeans1d(values: number[], k = 3, maxIter = 100): KMeansResult {
  if (values.length === 0) return { assignments: [], centroids: [] }
  const safeK = Math.min(k, values.length)
  const sorted = [...values].sort((a, b) => a - b)
  let centroids = Array.from({ length: safeK }, (_, i) => sorted[Math.floor(((i + 0.5) * sorted.length) / safeK)])
  let assignments = new Array(values.length).fill(0)

  for (let iter = 0; iter < maxIter; iter++) {
    const nextAssignments = values.map((v) => {
      let best = 0
      let bestDist = Infinity
      centroids.forEach((c, i) => {
        const d = Math.abs(v - c)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      return best
    })

    const sums = new Array(safeK).fill(0)
    const counts = new Array(safeK).fill(0)
    nextAssignments.forEach((a, i) => {
      sums[a] += values[i]
      counts[a] += 1
    })

    const nextCentroids = centroids.map((c, i) => (counts[i] === 0 ? c : sums[i] / counts[i]))
    const converged =
      nextAssignments.every((a, i) => a === assignments[i]) &&
      nextCentroids.every((c, i) => Math.abs(c - centroids[i]) < 1e-9)

    assignments = nextAssignments
    centroids = nextCentroids
    if (converged) break
  }

  const order = centroids.map((_, i) => i).sort((a, b) => centroids[a] - centroids[b])
  const rank = new Map(order.map((original, next) => [original, next]))
  return {
    assignments: assignments.map((a) => rank.get(a) ?? a),
    centroids: order.map((i) => centroids[i]),
  }
}

interface Regression {
  slope: number
  intercept: number
  rSquared: number
  residualStd: number
}

function linearRegression(values: number[]): Regression {
  const n = values.length
  if (n < 2) return { slope: 0, intercept: values[0] ?? 0, rSquared: 0, residualStd: 0 }
  const meanX = (n - 1) / 2
  const meanY = values.reduce((a, b) => a + b, 0) / n
  let num = 0
  let den = 0
  for (let i = 0; i < n; i++) {
    num += (i - meanX) * (values[i] - meanY)
    den += (i - meanX) ** 2
  }
  const slope = den === 0 ? 0 : num / den
  const intercept = meanY - slope * meanX
  let ssRes = 0
  let ssTot = 0
  for (let i = 0; i < n; i++) {
    const predicted = intercept + slope * i
    ssRes += (values[i] - predicted) ** 2
    ssTot += (values[i] - meanY) ** 2
  }
  const rSquared = ssTot === 0 ? 0 : 1 - ssRes / ssTot
  const residualStd = Math.sqrt(ssRes / n)
  return { slope, intercept, rSquared, residualStd }
}

export function predictPerformance(history: RatingPoint[]): Prediction {
  const values = history.map((p) => p.rating)
  const { slope, intercept, rSquared, residualStd } = linearRegression(values)
  const n = values.length
  const predictedRating = Math.round(intercept + slope * n)
  const spread = Math.max(20, Math.round(residualStd))
  const consistency = Math.max(0, Math.min(100, Math.round(100 - residualStd)))
  return {
    predictedRating,
    low: Math.round(predictedRating - spread),
    high: Math.round(predictedRating + spread),
    slope: Math.round(slope * 10) / 10,
    rSquared: Math.round(rSquared * 100) / 100,
    consistency,
    nextContests: [1, 2, 3].map((step) => Math.round(intercept + slope * (n - 1 + step))),
  }
}

export function averageRating(history: RatingPoint[], lastN = 5): number {
  const recent = history.slice(-lastN)
  if (recent.length === 0) return 0
  return Math.round(recent.reduce((sum, p) => sum + p.rating, 0) / recent.length)
}

export function ratingDelta(history: RatingPoint[], lastN = 5): number {
  const recent = history.slice(-lastN)
  if (recent.length < 2) return 0
  return recent[recent.length - 1].rating - recent[0].rating
}
