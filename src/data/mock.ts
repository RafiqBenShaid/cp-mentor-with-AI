import type {
  UserProfile,
  RatingPoint,
  Submission,
  Problem,
  DailyGoal,
  Contest,
  SolveStat,
  TagStat,
  MentorChat,
  RevisionItem,
  Roadmap,
  Post,
  Peer,
} from '../types'

export const userProfile: UserProfile = {
  id: 1,
  name: '__RaFiQ__',
  cf_handle: '__RaFiQ__',
  atcoder_handle: '',
  leetcode_handle: '',
  current_rating: 1638,
  joined_at: Date.now() - 3 * 365 * 24 * 3600 * 1000,
}

const day = 24 * 3600 * 1000

export const ratingHistory: RatingPoint[] = [
  { contest: 'CF R900', rating: 1210, platform: 'codeforces', date: Date.now() - 540 * day },
  { contest: 'CF R920', rating: 1285, platform: 'codeforces', date: Date.now() - 420 * day },
  { contest: 'CF R940', rating: 1348, platform: 'codeforces', date: Date.now() - 320 * day },
  { contest: 'CF R960', rating: 1402, platform: 'codeforces', date: Date.now() - 240 * day },
  { contest: 'CF R980', rating: 1475, platform: 'codeforces', date: Date.now() - 170 * day },
  { contest: 'CF R1000', rating: 1536, platform: 'codeforces', date: Date.now() - 110 * day },
  { contest: 'CF R1020', rating: 1588, platform: 'codeforces', date: Date.now() - 60 * day },
  { contest: 'CF R1040', rating: 1638, platform: 'codeforces', date: Date.now() - 14 * day },
]

export const statistics: SolveStat[] = [
  { platform: 'codeforces', solved: 884, label: 'Codeforces', color: '#ef7d57' },
  { platform: 'atcoder', solved: 0, label: 'AtCoder', color: '#22a6b3' },
  { platform: 'leetcode', solved: 0, label: 'LeetCode', color: '#f0b429' },
]

export const submissions: Submission[] = [
  { id: 1, platform: 'codeforces', problem_id: '1843A', problem_name: 'Maximum Rounding', problem_rating: 800, tags: ['greedy'], verdict: 'WA', submitted_at: Date.now() - 3600e3 },
  { id: 2, platform: 'codeforces', problem_id: '1843A', problem_name: 'Maximum Rounding', problem_rating: 800, tags: ['greedy'], verdict: 'AC', submitted_at: Date.now() - 3500e3 },
  { id: 3, platform: 'codeforces', problem_id: '1843B', problem_name: 'Long Long', problem_rating: 900, tags: ['math'], verdict: 'AC', submitted_at: Date.now() - 3000e3 },
  { id: 4, platform: 'atcoder', problem_id: 'abc371_c', problem_name: 'Make Isomorphic', problem_rating: 1200, tags: ['graph'], verdict: 'WA', submitted_at: Date.now() - 2500e3 },
  { id: 5, platform: 'codeforces', problem_id: '1850C', problem_name: 'Word on the Paper', problem_rating: 1000, tags: ['implementation'], verdict: 'AC', submitted_at: Date.now() - 2000e3 },
  { id: 6, platform: 'atcoder', problem_id: 'abc371_d', problem_name: '1D Country', problem_rating: 1300, tags: ['dp'], verdict: 'WA', submitted_at: Date.now() - 1500e3 },
  { id: 7, platform: 'codeforces', problem_id: '1850D', problem_name: 'Balanced Round', problem_rating: 1200, tags: ['dp'], verdict: 'AC', submitted_at: Date.now() - 1000e3 },
  { id: 8, platform: 'codeforces', problem_id: '1847C', problem_name: 'Vampiric Powers', problem_rating: 1400, tags: ['bitmask'], verdict: 'WA', submitted_at: Date.now() - 500e3 },
]

export const problemBank: Problem[] = [
  { id: '1847C', platform: 'codeforces', name: 'Vampiric Powers', rating: 1400, tags: ['bitmask'], solved: false, url: 'https://codeforces.com/problemset/problem/1847/C' },
  { id: '1850F', platform: 'codeforces', name: 'We Were Both Children', rating: 1400, tags: ['math'], solved: false, url: 'https://codeforces.com/problemset/problem/1850/F' },
  { id: '1852A', platform: 'codeforces', name: 'Ntarsis Set', rating: 1600, tags: ['binary search'], solved: false, url: 'https://codeforces.com/problemset/problem/1852/A' },
  { id: '1849C', platform: 'codeforces', name: 'Binary String Copying', rating: 1500, tags: ['string'], solved: false, url: 'https://codeforces.com/problemset/problem/1849/C' },
  { id: '1845D', platform: 'codeforces', name: 'Rating System', rating: 1700, tags: ['dp'], solved: true, url: 'https://codeforces.com/problemset/problem/1845/D' },
  { id: '1853B', platform: 'codeforces', name: 'Fibonaccharsis', rating: 1400, tags: ['math'], solved: false, url: 'https://codeforces.com/problemset/problem/1853/B' },
  { id: '1848C', platform: 'codeforces', name: 'Vika and Price Tags', rating: 1700, tags: ['math'], solved: true, url: 'https://codeforces.com/problemset/problem/1848/C' },
  { id: 'abcf_1', platform: 'atcoder', name: 'abc376_d', rating: 1400, tags: ['graph'], solved: false, url: 'https://atcoder.jp/contests/abc376/tasks/abc376_d' },
  { id: 'abcf_2', platform: 'atcoder', name: 'abc375_d', rating: 1200, tags: ['string'], solved: false, url: 'https://atcoder.jp/contests/abc375/tasks/abc375_d' },
  { id: 'abcf_3', platform: 'atcoder', name: 'abc374_d', rating: 1400, tags: ['brute force'], solved: false, url: 'https://atcoder.jp/contests/abc374/tasks/abc374_d' },
  { id: 'abcf_4', platform: 'atcoder', name: 'abc373_d', rating: 1500, tags: ['graph'], solved: false, url: 'https://atcoder.jp/contests/abc373/tasks/abc373_d' },
  { id: 'lc_1', platform: 'leetcode', name: 'Unique Paths III', rating: 1800, tags: ['dp', 'graph'], solved: false, url: 'https://leetcode.com/problems/unique-paths-iii/' },
  { id: 'lc_2', platform: 'leetcode', name: 'Kth Smallest Prime Fraction', rating: 1750, tags: ['binary search'], solved: true, url: 'https://leetcode.com/problems/kth-smallest-prime-fraction/' },
  { id: '1968A', platform: 'codeforces', name: 'Maximize the Last Element', rating: 800, tags: ['implementation'], solved: false, url: 'https://codeforces.com/problemset/problem/1968/A' },
  { id: '1475A', platform: 'codeforces', name: 'Odd Divisor', rating: 900, tags: ['math', 'number theory'], solved: false, url: 'https://codeforces.com/problemset/problem/1475/A' },
  { id: '617A', platform: 'codeforces', name: 'Elephant', rating: 800, tags: ['math', 'greedy'], solved: false, url: 'https://codeforces.com/problemset/problem/617/A' },
  { id: '1703A', platform: 'codeforces', name: 'YES or YES?', rating: 800, tags: ['implementation', 'strings'], solved: false, url: 'https://codeforces.com/problemset/problem/1703/A' },
  { id: '1973A', platform: 'codeforces', name: 'Chess For Three', rating: 800, tags: ['math', 'brute force'], solved: false, url: 'https://codeforces.com/problemset/problem/1973/A' },
  { id: '1A', platform: 'codeforces', name: 'Theatre Square', rating: 1000, tags: ['math'], solved: false, url: 'https://codeforces.com/problemset/problem/1/A' },
  { id: '1851D', platform: 'codeforces', name: 'Prefix Permutation Sums', rating: 1500, tags: ['math', 'prefix sums'], solved: false, url: 'https://codeforces.com/problemset/problem/1851/D' },
  { id: '1849B', platform: 'codeforces', name: 'Monsters', rating: 1000, tags: ['greedy', 'sorting'], solved: false, url: 'https://codeforces.com/problemset/problem/1849/B' },
  { id: '1843C', platform: 'codeforces', name: 'Sum in Binary Tree', rating: 1100, tags: ['math', 'trees'], solved: false, url: 'https://codeforces.com/problemset/problem/1843/C' },
  { id: '1850E', platform: 'codeforces', name: 'Cardboard for Pictures', rating: 1300, tags: ['binary search', 'math'], solved: false, url: 'https://codeforces.com/problemset/problem/1850/E' },
  { id: '1848B', platform: 'codeforces', name: 'Vika and the Bridge', rating: 1300, tags: ['greedy', 'data structures'], solved: false, url: 'https://codeforces.com/problemset/problem/1848/B' },
  { id: 'abcf_5', platform: 'atcoder', name: 'abc377_d', rating: 1500, tags: ['two pointers'], solved: false, url: 'https://atcoder.jp/contests/abc377/tasks/abc377_d' },
  { id: 'abcf_6', platform: 'atcoder', name: 'abc376_c', rating: 1100, tags: ['sorting', 'binary search'], solved: false, url: 'https://atcoder.jp/contests/abc376/tasks/abc376_c' },
  { id: 'lc_3', platform: 'leetcode', name: 'Course Schedule II', rating: 1600, tags: ['graph', 'trees'], solved: false, url: 'https://leetcode.com/problems/course-schedule-ii/' },
  { id: 'lc_4', platform: 'leetcode', name: 'Coin Change', rating: 1500, tags: ['dp'], solved: false, url: 'https://leetcode.com/problems/coin-change/' },
  { id: 'lc_5', platform: 'leetcode', name: 'Number of Islands', rating: 1400, tags: ['graph'], solved: false, url: 'https://leetcode.com/problems/number-of-islands/' },
]

const today = new Date()
today.setHours(0, 0, 0, 0)

export const initialGoal: DailyGoal = {
  date: today.toISOString().slice(0, 10),
  target_count: 4,
  min_rating: 1200,
  max_rating: 1500,
  completed_count: computeTodayCompleted(),
}

function computeTodayCompleted(): number {
  const start = today.getTime()
  return submissions.filter((s) => s.verdict === 'AC' && s.submitted_at >= start).length
}

const now = Date.now()

export const contests: Contest[] = [
  { id: 'cf1', platform: 'codeforces', name: 'Codeforces Round 1860', start_time: now + 1 * day, duration_min: 135, url: 'https://codeforces.com/contests' },
  { id: 'cf2', platform: 'codeforces', name: 'Codeforces Round 1861', start_time: now + 3 * day, duration_min: 120, url: 'https://codeforces.com/contests' },
  { id: 'abc1', platform: 'atcoder', name: 'AtCoder Beginner Contest 377', start_time: now + 2 * day, duration_min: 100, url: 'https://atcoder.jp/contests/' },
  { id: 'abc2', platform: 'atcoder', name: 'AtCoder Regular Contest 178', start_time: now + 5 * day, duration_min: 110, url: 'https://atcoder.jp/contests/' },
  { id: 'lc1', platform: 'leetcode', name: 'Weekly Contest 402', start_time: now + 4 * day, duration_min: 90, url: 'https://leetcode.com/contest/' },
]

export const tagStats: TagStat[] = [
  { tag: 'greedy', total: 520, solved: 444, wrong: 76, ratio: 0.85 },
  { tag: 'math', total: 430, solved: 350, wrong: 80, ratio: 0.81 },
  { tag: 'implementation', total: 260, solved: 207, wrong: 53, ratio: 0.8 },
  { tag: 'constructive algorithms', total: 250, solved: 207, wrong: 43, ratio: 0.83 },
  { tag: 'brute force', total: 240, solved: 188, wrong: 52, ratio: 0.78 },
  { tag: 'binary search', total: 200, solved: 156, wrong: 44, ratio: 0.78 },
  { tag: 'dp', total: 200, solved: 139, wrong: 61, ratio: 0.7 },
  { tag: 'sorting', total: 160, solved: 124, wrong: 36, ratio: 0.78 },
  { tag: 'data structures', total: 165, solved: 120, wrong: 45, ratio: 0.73 },
  { tag: 'number theory', total: 120, solved: 86, wrong: 34, ratio: 0.72 },
  { tag: 'bitmask', total: 120, solved: 78, wrong: 42, ratio: 0.65 },
  { tag: 'two pointers', total: 100, solved: 73, wrong: 27, ratio: 0.73 },
  { tag: 'string', total: 90, solved: 63, wrong: 27, ratio: 0.7 },
  { tag: 'dfs and similar', total: 85, solved: 56, wrong: 29, ratio: 0.66 },
  { tag: 'graph', total: 75, solved: 47, wrong: 28, ratio: 0.63 },
  { tag: 'combinatorics', total: 60, solved: 43, wrong: 17, ratio: 0.72 },
  { tag: 'trees', total: 60, solved: 38, wrong: 22, ratio: 0.63 },
  { tag: 'games', total: 40, solved: 29, wrong: 11, ratio: 0.73 },
  { tag: 'interactive', total: 40, solved: 28, wrong: 12, ratio: 0.7 },
  { tag: 'dsu', total: 35, solved: 22, wrong: 13, ratio: 0.63 },
]

export const initialChats: MentorChat[] = [
  {
    id: 1,
    role: 'mentor',
    message:
      "Welcome back, __RaFiQ__! You're at 1638 (Expert, max 1638) with 884 problems solved all-time. Strong in greedy and math — want a focused plan to push past Expert into Candidate Master?",
    created_at: Date.now() - 600e3,
  },
]

export const initialRevision: RevisionItem[] = [
  {
    id: 'rev-1847C',
    problem_id: '1847C',
    problem_name: 'Vampiric Powers',
    platform: 'codeforces',
    rating: 1400,
    tags: ['bitmask'],
    url: 'https://codeforces.com/problemset/problem/1847/C',
    stage: 0,
    interval_days: 1,
    next_review_at: Date.now() - 2 * 3600e3,
    added_at: Date.now() - day,
    last_reviewed_at: null,
  },
  {
    id: 'rev-abc371d',
    problem_id: 'abc371_d',
    problem_name: '1D Country',
    platform: 'atcoder',
    rating: 1300,
    tags: ['dp'],
    url: 'https://atcoder.jp/contests/abc371/tasks/abc371_d',
    stage: 1,
    interval_days: 3,
    next_review_at: Date.now() + 2 * day,
    added_at: Date.now() - 3 * day,
    last_reviewed_at: Date.now() - day,
  },
  {
    id: 'rev-abc371c',
    problem_id: 'abc371_c',
    problem_name: 'Make Isomorphic',
    platform: 'atcoder',
    rating: 1200,
    tags: ['graph'],
    url: 'https://atcoder.jp/contests/abc371/tasks/abc371_c',
    stage: 0,
    interval_days: 1,
    next_review_at: Date.now() - 4 * 3600e3,
    added_at: Date.now() - 2 * day,
    last_reviewed_at: null,
  },
]

export const roadmaps: Roadmap[] = [
  {
    id: 'dp',
    title: 'Dynamic Programming',
    description: 'From simple state transitions to knapsack, LIS and digit DP.',
    icon: '🧩',
    stages: [
      {
        name: 'Stage 1: Basics',
        description: 'Understand states, transitions and base cases.',
        problems: [
          { id: 'lc_4', name: 'Coin Change', rating: 1500, platform: 'leetcode', url: 'https://leetcode.com/problems/coin-change/' },
          { id: '1845D', name: 'Rating System', rating: 1700, platform: 'codeforces', url: 'https://codeforces.com/problemset/problem/1845/D' },
        ],
      },
      {
        name: 'Stage 2: Knapsack & Subsets',
        description: '0/1 knapsack, subset sum and bitmask DP.',
        problems: [
          { id: '1847C', name: 'Vampiric Powers', rating: 1400, platform: 'codeforces', url: 'https://codeforces.com/problemset/problem/1847/C' },
          { id: '1853B', name: 'Fibonaccharsis', rating: 1400, platform: 'codeforces', url: 'https://codeforces.com/problemset/problem/1853/B' },
        ],
      },
      {
        name: 'Stage 3: Advanced DP',
        description: 'LIS, interval DP and digit DP patterns.',
        problems: [
          { id: '1850F', name: 'We Were Both Children', rating: 1400, platform: 'codeforces', url: 'https://codeforces.com/problemset/problem/1850/F' },
          { id: 'lc_1', name: 'Unique Paths III', rating: 1800, platform: 'leetcode', url: 'https://leetcode.com/problems/unique-paths-iii/' },
        ],
      },
    ],
  },
  {
    id: 'graph',
    title: 'Graph Theory',
    description: 'Traversal, shortest paths, trees and topological ordering.',
    icon: '🕸️',
    stages: [
      {
        name: 'Stage 1: Traversal',
        description: 'BFS, DFS and connected components.',
        problems: [
          { id: 'lc_5', name: 'Number of Islands', rating: 1400, platform: 'leetcode', url: 'https://leetcode.com/problems/number-of-islands/' },
          { id: 'abcf_1', name: 'abc376_d', rating: 1400, platform: 'atcoder', url: 'https://atcoder.jp/contests/abc376/tasks/abc376_d' },
        ],
      },
      {
        name: 'Stage 2: Shortest Path',
        description: 'Dijkstra, BFS on unweighted graphs, 0-1 BFS.',
        problems: [
          { id: 'abcf_4', name: 'abc373_d', rating: 1500, platform: 'atcoder', url: 'https://atcoder.jp/contests/abc373/tasks/abc373_d' },
        ],
      },
      {
        name: 'Stage 3: DAG & Trees',
        description: 'Topological sort, tree DP and LCA basics.',
        problems: [
          { id: 'lc_3', name: 'Course Schedule II', rating: 1600, platform: 'leetcode', url: 'https://leetcode.com/problems/course-schedule-ii/' },
          { id: '1843C', name: 'Sum in Binary Tree', rating: 1100, platform: 'codeforces', url: 'https://codeforces.com/problemset/problem/1843/C' },
        ],
      },
    ],
  },
  {
    id: 'number-theory',
    title: 'Number Theory',
    description: 'Primes, GCD, modular arithmetic and combinatorics.',
    icon: '🔢',
    stages: [
      {
        name: 'Stage 1: Divisibility',
        description: 'GCD/LCM, divisors and prime factorisation.',
        problems: [
          { id: '1843B', name: 'Long Long', rating: 900, platform: 'codeforces', url: 'https://codeforces.com/problemset/problem/1843/B' },
          { id: '1851D', name: 'Prefix Permutation Sums', rating: 1500, platform: 'codeforces', url: 'https://codeforces.com/problemset/problem/1851/D' },
        ],
      },
      {
        name: 'Stage 2: Modular Arithmetic',
        description: 'Modular inverses, fast exponentiation and counting.',
        problems: [
          { id: '1848C', name: 'Vika and Price Tags', rating: 1700, platform: 'codeforces', url: 'https://codeforces.com/problemset/problem/1848/C' },
        ],
      },
    ],
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    description: 'Search on answer, sorted arrays and monotonic predicates.',
    icon: '🔍',
    stages: [
      {
        name: 'Stage 1: Classic Search',
        description: 'Lower/upper bound and search in rotated arrays.',
        problems: [
          { id: 'abcf_6', name: 'abc376_c', rating: 1100, platform: 'atcoder', url: 'https://atcoder.jp/contests/abc376/tasks/abc376_c' },
          { id: 'lc_2', name: 'Kth Smallest Prime Fraction', rating: 1750, platform: 'leetcode', url: 'https://leetcode.com/problems/kth-smallest-prime-fraction/' },
        ],
      },
      {
        name: 'Stage 2: Search on Answer',
        description: 'Binary search over a monotonic feasibility check.',
        problems: [
          { id: '1850E', name: 'Cardboard for Pictures', rating: 1300, platform: 'codeforces', url: 'https://codeforces.com/problemset/problem/1850/E' },
          { id: '1852A', name: 'Ntarsis Set', rating: 1600, platform: 'codeforces', url: 'https://codeforces.com/problemset/problem/1852/A' },
        ],
      },
    ],
  },
  {
    id: 'greedy',
    title: 'Greedy & Sorting',
    description: 'Exchange arguments, scheduling and sorting tricks.',
    icon: '⚡',
    stages: [
      {
        name: 'Stage 1: Sorting',
        description: 'Sort by custom comparators and sweep.',
        problems: [
          { id: '1849B', name: 'Monsters', rating: 1000, platform: 'codeforces', url: 'https://codeforces.com/problemset/problem/1849/B' },
          { id: '1848B', name: 'Vika and the Bridge', rating: 1300, platform: 'codeforces', url: 'https://codeforces.com/problemset/problem/1848/B' },
        ],
      },
      {
        name: 'Stage 2: Greedy Proofs',
        description: 'Exchange argument and constructive greedy.',
        problems: [
          { id: '1843A', name: 'Maximum Rounding', rating: 800, platform: 'codeforces', url: 'https://codeforces.com/problemset/problem/1843/A' },
          { id: 'abcf_5', name: 'abc377_d', rating: 1500, platform: 'atcoder', url: 'https://atcoder.jp/contests/abc377/tasks/abc377_d' },
        ],
      },
    ],
  },
]

export const initialPosts: Post[] = [
  {
    id: 'p1',
    author: 'Nusrat Jahan',
    handle: 'nusrat_cp',
    content:
      'Finally crossed 1600 on Codeforces! The DP roadmap in this app really helped me stop avoiding state design. Next target: 1800 by December.',
    created_at: Date.now() - 2 * 3600e3,
    likes: 12,
    likedByMe: false,
    comments: [
      { id: 'c1', author: 'Tanvir Hasan', content: 'Huge! Which DP stage are you on?', created_at: Date.now() - 1.5 * 3600e3 },
      { id: 'c2', author: 'Nusrat Jahan', content: 'Stage 3 — interval DP is brutal but fun.', created_at: Date.now() - 1 * 3600e3 },
    ],
  },
  {
    id: 'p2',
    author: 'Tanvir Hasan',
    handle: 'tanvir_13',
    content:
      'Daily goal streak hit 14 days today. The trick for me was setting a tiny minimum (2 problems) so I never break the chain.',
    created_at: Date.now() - 9 * 3600e3,
    likes: 8,
    likedByMe: false,
    comments: [],
  },
  {
    id: 'p3',
    author: 'Sadia Islam',
    handle: 'sadia_codes',
    content:
      'Anyone else use the mock contest generator before a real round? 90 minutes with 4 weak-topic problems is a great warm-up.',
    created_at: Date.now() - 26 * 3600e3,
    likes: 15,
    likedByMe: false,
    comments: [
      { id: 'c3', author: '__RaFiQ__', content: 'Yes! I do it every Friday now.', created_at: Date.now() - 20 * 3600e3 },
    ],
  },
]

export const peers: Peer[] = [
  { name: '__RaFiQ__', handle: '__RaFiQ__', platform: 'codeforces', rating: 1638, solved: 884, streak: 6, isMe: true },
  { name: 'Nusrat Jahan', handle: 'nusrat_cp', platform: 'codeforces', rating: 1608, solved: 742, streak: 21 },
  { name: 'Tanvir Hasan', handle: 'tanvir_13', platform: 'atcoder', rating: 1480, solved: 611, streak: 14 },
  { name: 'Sadia Islam', handle: 'sadia_codes', platform: 'leetcode', rating: 1375, solved: 498, streak: 9 },
  { name: 'Mahin Chowdhury', handle: 'mahin_42', platform: 'codeforces', rating: 1270, solved: 402, streak: 3 },
]
