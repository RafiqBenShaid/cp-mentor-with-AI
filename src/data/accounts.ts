import type {
  AccountState,
  Badge,
  DailyGoal,
  MentorChat,
  Peer,
  Post,
  RatingPoint,
  RecommendFilter,
  RevisionItem,
  SolveStat,
  Streak,
  Submission,
  TagStat,
  UserProfile,
} from '../types'
import {
  initialChats,
  initialGoal,
  initialPosts,
  initialRevision,
  peers,
  ratingHistory,
  statistics,
  submissions,
  tagStats,
  userProfile,
} from './mock'

const day = 24 * 3600 * 1000

export const jahidProfile: UserProfile = {
  id: 2,
  name: 'JAHID_UL',
  cf_handle: 'JAHID_UL',
  atcoder_handle: '',
  leetcode_handle: '',
  current_rating: 601,
  joined_at: Date.now() - 3 * 365 * day,
}

export const jahidRatingHistory: RatingPoint[] = [
  { contest: 'CF Contest 1', rating: 380, platform: 'codeforces', date: Date.now() - 900 * day },
  { contest: 'CF Contest 2', rating: 450, platform: 'codeforces', date: Date.now() - 870 * day },
  { contest: 'CF Contest 3', rating: 520, platform: 'codeforces', date: Date.now() - 850 * day },
  { contest: 'CF Contest 4', rating: 601, platform: 'codeforces', date: Date.now() - 830 * day },
]

export const jahidStatistics: SolveStat[] = [
  { platform: 'codeforces', solved: 50, label: 'Codeforces', color: '#ef7d57' },
  { platform: 'atcoder', solved: 0, label: 'AtCoder', color: '#22a6b3' },
  { platform: 'leetcode', solved: 0, label: 'LeetCode', color: '#f0b429' },
]

export const jahidTagStats: TagStat[] = [
  { tag: 'implementation', total: 35, solved: 25, wrong: 10, ratio: 0.71 },
  { tag: 'math', total: 30, solved: 22, wrong: 8, ratio: 0.73 },
  { tag: 'brute force', total: 12, solved: 8, wrong: 4, ratio: 0.67 },
  { tag: 'greedy', total: 10, solved: 7, wrong: 3, ratio: 0.7 },
  { tag: 'sorting', total: 8, solved: 6, wrong: 2, ratio: 0.75 },
  { tag: 'string', total: 5, solved: 3, wrong: 2, ratio: 0.6 },
  { tag: 'constructive algorithms', total: 4, solved: 2, wrong: 2, ratio: 0.5 },
  { tag: 'bitmask', total: 2, solved: 1, wrong: 1, ratio: 0.5 },
  { tag: 'data structures', total: 2, solved: 1, wrong: 1, ratio: 0.5 },
  { tag: 'games', total: 2, solved: 1, wrong: 1, ratio: 0.5 },
  { tag: 'geometry', total: 2, solved: 1, wrong: 1, ratio: 0.5 },
  { tag: 'binary search', total: 2, solved: 1, wrong: 1, ratio: 0.5 },
]

export const jahidChats: MentorChat[] = [
  {
    id: 1,
    role: 'mentor',
    message:
      "Welcome, JAHID_UL! You're at 601 (Newbie, max 601) with 50 problems solved. Let's build consistency and aim for Pupil — want a beginner-friendly plan?",
    created_at: Date.now() - 600e3,
  },
]

export const jahidStreak: Streak = {
  current_streak: 0,
  longest_streak: 17,
  last_active_date: null,
}

export const jahidBadges: Badge[] = [
  { id: 'first-blood', earned_at: Date.now() - 80 * day },
  { id: 'problem-solver-50', earned_at: Date.now() - 30 * day },
]

export const jahidGoal: DailyGoal = {
  date: new Date().toISOString().slice(0, 10),
  target_count: 2,
  min_rating: 800,
  max_rating: 1000,
  completed_count: 0,
}

export const jahidSubmissions: Submission[] = []

export const jahidRevision: RevisionItem[] = [
  {
    id: 'rev-1A',
    problem_id: '1A',
    problem_name: 'Theatre Square',
    platform: 'codeforces',
    rating: 1000,
    tags: ['math'],
    url: 'https://codeforces.com/problemset/problem/1/A',
    stage: 0,
    interval_days: 1,
    next_review_at: Date.now() - 3600e3,
    added_at: Date.now() - day,
    last_reviewed_at: null,
  },
]

const jahidPeerNames = new Set(['__RaFiQ__', 'JAHID_UL', 'Nusrat Jahan', 'Tanvir Hasan'])

export const jahidPeers: Peer[] = peers
  .filter((p) => jahidPeerNames.has(p.name))
  .map((p) => ({
    ...p,
    isMe: p.name === 'JAHID_UL',
    rating: p.name === 'JAHID_UL' ? jahidProfile.current_rating : p.rating,
    solved: p.name === 'JAHID_UL' ? 50 : p.solved,
    streak: p.name === 'JAHID_UL' ? 0 : p.streak,
    handle: p.name === 'JAHID_UL' ? jahidProfile.cf_handle : p.handle,
  }))

const rafiqFilter: RecommendFilter = {
  minRating: 1200,
  maxRating: 1500,
  includeTags: ['dp', 'graph', 'bitmask'],
}

const jahidFilter: RecommendFilter = {
  minRating: 800,
  maxRating: 1100,
  includeTags: ['implementation', 'math', 'brute force'],
}

function clonePosts(posts: Post[]): Post[] {
  return posts.map((p) => ({ ...p, comments: p.comments.map((c) => ({ ...c })) }))
}

export function makeRafiqAccount(): AccountState {
  return {
    id: 'rafiq',
    email: 'soton017964658@gmail.com',
    password: 'rafiq123',
    profile: { ...userProfile },
    ratingHistory: ratingHistory.map((p) => ({ ...p })),
    statistics: statistics.map((s) => ({ ...s })),
    tagStats: tagStats.map((t) => ({ ...t })),
    submissions: submissions.map((s) => ({ ...s })),
    peers: peers.map((p) => ({ ...p })),
    goal: { ...initialGoal },
    recommendFilters: { ...rafiqFilter, includeTags: [...rafiqFilter.includeTags] },
    solvedDuringSession: [],
    solvedIds: [],
    chats: initialChats.map((c) => ({ ...c })),
    streak: { current_streak: 3, longest_streak: 17, last_active_date: new Date().toISOString().slice(0, 10) },
    badges: [
      { id: 'first-blood', earned_at: Date.now() - 80 * day },
      { id: 'problem-solver-50', earned_at: Date.now() - 60 * day },
      { id: 'century', earned_at: Date.now() - 40 * day },
      { id: 'half-k', earned_at: Date.now() - 15 * day },
      { id: 'rating-1500', earned_at: Date.now() - 20 * day },
      { id: 'streak-3', earned_at: Date.now() - 10 * day },
      { id: 'goal-1', earned_at: Date.now() - 8 * day },
    ],
    goalsCompleted: 7,
    reviewsDone: 3,
    contestsDone: 1,
    revision: initialRevision.map((r) => ({ ...r })),
    roadmapProgress: ['1843A', '1845D'],
    posts: clonePosts(initialPosts),
    mockContest: null,
    notifications: [
      {
        id: 'welcome',
        title: 'Welcome to CP Mentor Hub',
        body: 'Your dashboard, goals and recommendations are ready. Start with today’s goal!',
        created_at: Date.now() - 3600e3,
        read: false,
        kind: 'system',
      },
      {
        id: 'contest-soon',
        title: 'Contest reminder',
        body: 'Codeforces Round 1860 starts in less than 24 hours.',
        created_at: Date.now() - 1800e3,
        read: false,
        kind: 'contest',
      },
    ],
    notificationsEnabled: true,
    contestReminders: [],
  }
}

export function makeJahidAccount(): AccountState {
  return {
    id: 'jahid',
    email: 'jahid_ul@cpmentor.local',
    password: 'jahid123',
    profile: { ...jahidProfile },
    ratingHistory: jahidRatingHistory.map((p) => ({ ...p })),
    statistics: jahidStatistics.map((s) => ({ ...s })),
    tagStats: jahidTagStats.map((t) => ({ ...t })),
    submissions: jahidSubmissions.map((s) => ({ ...s })),
    peers: jahidPeers.map((p) => ({ ...p })),
    goal: { ...jahidGoal },
    recommendFilters: { ...jahidFilter, includeTags: [...jahidFilter.includeTags] },
    solvedDuringSession: [],
    solvedIds: [],
    chats: jahidChats.map((c) => ({ ...c })),
    streak: { ...jahidStreak },
    badges: jahidBadges.map((b) => ({ ...b })),
    goalsCompleted: 0,
    reviewsDone: 0,
    contestsDone: 0,
    revision: jahidRevision.map((r) => ({ ...r })),
    roadmapProgress: [],
    posts: clonePosts(initialPosts),
    mockContest: null,
    notifications: [
      {
        id: 'welcome-jahid',
        title: 'Welcome to CP Mentor Hub',
        body: 'Set a small daily goal (2 problems) and keep the streak alive. You can do it!',
        created_at: Date.now() - 3600e3,
        read: false,
        kind: 'system',
      },
    ],
    notificationsEnabled: true,
    contestReminders: [],
  }
}

export function seedAccounts(): Record<string, AccountState> {
  return {
    rafiq: makeRafiqAccount(),
    jahid: makeJahidAccount(),
  }
}

export function createAccount(input: {
  id: string
  name: string
  cf_handle: string
  email: string
  password: string
}): AccountState {
  const rating: RecommendFilter = {
    minRating: 800,
    maxRating: 1200,
    includeTags: ['implementation', 'math', 'greedy'],
  }
  return {
    id: input.id,
    email: input.email,
    password: input.password,
    profile: {
      id: Date.now(),
      name: input.name,
      cf_handle: input.cf_handle,
      atcoder_handle: '',
      leetcode_handle: '',
      current_rating: 0,
      joined_at: Date.now(),
    },
    ratingHistory: [],
    statistics: [
      { platform: 'codeforces', solved: 0, label: 'Codeforces', color: '#ef7d57' },
      { platform: 'atcoder', solved: 0, label: 'AtCoder', color: '#22a6b3' },
      { platform: 'leetcode', solved: 0, label: 'LeetCode', color: '#f0b429' },
    ],
    tagStats: [],
    submissions: [],
    peers: seedAccounts().rafiq.peers.map((p) => ({ ...p, isMe: p.name === input.name })),
    goal: {
      date: new Date().toISOString().slice(0, 10),
      target_count: 2,
      min_rating: 800,
      max_rating: 1200,
      completed_count: 0,
    },
    recommendFilters: { ...rating, includeTags: [...rating.includeTags] },
    solvedDuringSession: [],
    solvedIds: [],
    chats: [
      {
        id: 1,
        role: 'mentor',
        message: `Welcome, ${input.name}! Start with the 800-1000 range and keep a small daily goal. Ask me for a beginner plan anytime.`,
        created_at: Date.now(),
      },
    ],
    streak: { current_streak: 0, longest_streak: 0, last_active_date: null },
    badges: [],
    goalsCompleted: 0,
    reviewsDone: 0,
    contestsDone: 0,
    revision: [],
    roadmapProgress: [],
    posts: clonePosts(initialPosts),
    mockContest: null,
    notifications: [
      {
        id: `welcome-${input.id}`,
        title: 'Welcome to CP Mentor Hub',
        body: 'Your account is ready. Set a daily goal and start solving!',
        created_at: Date.now(),
        read: false,
        kind: 'system',
      },
    ],
    notificationsEnabled: true,
    contestReminders: [],
  }
}
