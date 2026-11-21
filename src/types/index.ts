export type Platform = 'codeforces' | 'atcoder' | 'leetcode'

export type Difficulty = 'weak' | 'medium' | 'strong'

export interface UserProfile {
  id: number
  name: string
  cf_handle: string
  atcoder_handle: string
  leetcode_handle: string
  current_rating: number
  joined_at: number
}

export interface RecommendFilter {
  minRating: number
  maxRating: number
  includeTags: string[]
}

export interface AccountState {
  id: string
  email: string
  password: string
  profile: UserProfile
  ratingHistory: RatingPoint[]
  statistics: SolveStat[]
  tagStats: TagStat[]
  submissions: Submission[]
  peers: Peer[]
  goal: DailyGoal | null
  recommendFilters: RecommendFilter
  solvedDuringSession: string[]
  solvedIds: string[]
  chats: MentorChat[]
  streak: Streak
  badges: Badge[]
  goalsCompleted: number
  reviewsDone: number
  contestsDone: number
  revision: RevisionItem[]
  roadmapProgress: string[]
  posts: Post[]
  mockContest: MockContest | null
  notifications: AppNotification[]
  notificationsEnabled: boolean
  contestReminders: string[]
}

export interface RatingPoint {
  contest: string
  rating: number
  platform: Platform
  date?: number
}

export interface SolveStat {
  platform: Platform
  solved: number
  label: string
  color: string
}

export interface Submission {
  id: number
  platform: Platform
  problem_id: string
  problem_name: string
  problem_rating: number
  tags: string[]
  verdict: 'AC' | 'WA' | 'TLE' | 'MLE' | 'RE'
  submitted_at: number
}

export interface Problem {
  id: string
  platform: Platform
  name: string
  rating: number
  tags: string[]
  solved: boolean
  url: string
}

export interface DailyGoal {
  date: string
  target_count: number
  min_rating: number
  max_rating: number
  completed_count: number
}

export interface Contest {
  id: string
  platform: Platform
  name: string
  start_time: number
  duration_min: number
  url: string
  reminder?: boolean
}

export interface TagStat {
  tag: string
  total: number
  solved: number
  wrong: number
  ratio: number
}

export interface Weakness {
  tag: string
  wrongRatio: number
  level: Difficulty
  cluster?: number
}

export interface MentorChat {
  id: number
  role: 'user' | 'mentor'
  message: string
  created_at: number
}

export interface Streak {
  current_streak: number
  longest_streak: number
  last_active_date: string | null
}

export interface BadgeDefinition {
  id: string
  name: string
  description: string
  icon: string
  tier: 'bronze' | 'silver' | 'gold'
  check: (stats: BadgeStats) => boolean
}

export interface Badge {
  id: string
  earned_at: number
}

export interface BadgeStats {
  totalSolved: number
  currentStreak: number
  longestStreak: number
  goalsCompleted: number
  reviewsDone: number
  contestsDone: number
  rating: number
}

export interface RevisionItem {
  id: string
  problem_id: string
  problem_name: string
  platform: Platform
  rating: number
  tags: string[]
  url: string
  stage: number
  interval_days: number
  next_review_at: number
  added_at: number
  last_reviewed_at: number | null
}

export interface SkillNode {
  id: string
  label: string
  category: string
  prereqs: string[]
  mastery: number
  solved: number
  total: number
  x: number
  y: number
}

export interface SkillEdge {
  from: string
  to: string
}

export interface Prediction {
  predictedRating: number
  low: number
  high: number
  slope: number
  rSquared: number
  consistency: number
  nextContests: number[]
}

export interface RoadmapProblem {
  id: string
  name: string
  rating: number
  platform: Platform
  url: string
}

export interface RoadmapStage {
  name: string
  description: string
  problems: RoadmapProblem[]
}

export interface Roadmap {
  id: string
  title: string
  description: string
  icon: string
  stages: RoadmapStage[]
}

export interface MockContestProblem {
  id: string
  name: string
  rating: number
  platform: Platform
  tags: string[]
  url: string
}

export interface MockContest {
  id: string
  started_at: number
  duration_min: number
  problems: MockContestProblem[]
  solved: string[]
  finished: boolean
  finished_at: number | null
}

export interface Comment {
  id: string
  author: string
  content: string
  created_at: number
}

export interface Post {
  id: string
  author: string
  handle: string
  content: string
  created_at: number
  likes: number
  likedByMe: boolean
  comments: Comment[]
}

export interface Peer {
  name: string
  handle: string
  platform: Platform
  rating: number
  solved: number
  streak: number
  isMe?: boolean
}

export interface AppNotification {
  id: string
  title: string
  body: string
  created_at: number
  read: boolean
  kind: 'contest' | 'badge' | 'goal' | 'system'
}
