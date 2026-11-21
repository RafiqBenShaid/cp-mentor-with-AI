import { tagStats } from '../data/mock'
import type { SkillEdge, SkillNode, TagStat } from '../types'

interface NodeSpec {
  id: string
  label: string
  category: string
  prereqs: string[]
  x: number
  y: number
  fallbackMastery: number
}

const SPECS: NodeSpec[] = [
  { id: 'arrays', label: 'Arrays', category: 'Fundamentals', prereqs: [], x: 90, y: 110, fallbackMastery: 0.85 },
  { id: 'implementation', label: 'Implementation', category: 'Fundamentals', prereqs: [], x: 90, y: 250, fallbackMastery: 0.81 },
  { id: 'math', label: 'Math', category: 'Fundamentals', prereqs: [], x: 90, y: 390, fallbackMastery: 0.76 },
  { id: 'strings', label: 'Strings', category: 'Fundamentals', prereqs: [], x: 90, y: 510, fallbackMastery: 0.71 },
  { id: 'sorting', label: 'Sorting', category: 'Techniques', prereqs: ['arrays'], x: 260, y: 110, fallbackMastery: 0.82 },
  { id: 'greedy', label: 'Greedy', category: 'Techniques', prereqs: ['sorting'], x: 260, y: 250, fallbackMastery: 0.79 },
  { id: 'binary search', label: 'Binary Search', category: 'Techniques', prereqs: ['sorting', 'arrays'], x: 260, y: 390, fallbackMastery: 0.75 },
  { id: 'prefix sums', label: 'Prefix Sums', category: 'Techniques', prereqs: ['arrays'], x: 260, y: 510, fallbackMastery: 0.75 },
  { id: 'two pointers', label: 'Two Pointers', category: 'Techniques', prereqs: ['arrays', 'sorting'], x: 430, y: 110, fallbackMastery: 0.56 },
  { id: 'data structures', label: 'Data Structures', category: 'Techniques', prereqs: ['implementation'], x: 430, y: 250, fallbackMastery: 0.67 },
  { id: 'number theory', label: 'Number Theory', category: 'Techniques', prereqs: ['math'], x: 430, y: 390, fallbackMastery: 0.6 },
  { id: 'bitmask', label: 'Bitmask', category: 'Techniques', prereqs: ['math', 'arrays'], x: 430, y: 510, fallbackMastery: 0.43 },
  { id: 'dp', label: 'Dynamic Programming', category: 'Advanced', prereqs: ['prefix sums', 'greedy'], x: 620, y: 180, fallbackMastery: 0.58 },
  { id: 'graph', label: 'Graphs', category: 'Advanced', prereqs: ['data structures', 'arrays'], x: 620, y: 380, fallbackMastery: 0.5 },
  { id: 'trees', label: 'Trees', category: 'Advanced', prereqs: ['graph', 'data structures'], x: 790, y: 180, fallbackMastery: 0.6 },
  { id: 'advanced dp', label: 'Advanced DP', category: 'Advanced', prereqs: ['dp', 'bitmask'], x: 790, y: 380, fallbackMastery: 0.48 },
]

function masteryFor(
  tag: string,
  fallback: number,
  stats: TagStat[],
): { mastery: number; solved: number; total: number } {
  const stat = stats.find((t) => t.tag === tag)
  if (!stat) {
    return { mastery: fallback, solved: Math.round(fallback * 20), total: 20 }
  }
  return { mastery: stat.ratio, solved: stat.solved, total: stat.total }
}

export function buildSkillGraph(stats: TagStat[] = tagStats): { nodes: SkillNode[]; edges: SkillEdge[] } {
  const nodes: SkillNode[] = SPECS.map((spec) => {
    const { mastery, solved, total } = masteryFor(spec.id, spec.fallbackMastery, stats)
    return {
      id: spec.id,
      label: spec.label,
      category: spec.category,
      prereqs: spec.prereqs,
      mastery,
      solved,
      total,
      x: spec.x,
      y: spec.y,
    }
  })
  const edges: SkillEdge[] = SPECS.flatMap((spec) => spec.prereqs.map((p) => ({ from: p, to: spec.id })))
  return { nodes, edges }
}

export function masteryLevel(mastery: number): 'weak' | 'medium' | 'strong' {
  if (mastery < 0.6) return 'weak'
  if (mastery < 0.75) return 'medium'
  return 'strong'
}

export function masteryColor(mastery: number): string {
  const level = masteryLevel(mastery)
  if (level === 'weak') return '#f43f5e'
  if (level === 'medium') return '#f59e0b'
  return '#10b981'
}

export function knowledgeGaps(nodes: SkillNode[]): SkillNode[] {
  return nodes.filter((n) => n.mastery < 0.6).sort((a, b) => a.mastery - b.mastery)
}
