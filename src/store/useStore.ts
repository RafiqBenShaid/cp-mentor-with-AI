import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  AccountState,
  DailyGoal,
  Problem,
  BadgeStats,
  RecommendFilter,
  UserProfile,
} from '../types'
import { recommendProblems } from '../lib/recommend'
import { buildMentorReply } from '../lib/mentor'
import { evaluateBadges, recordActivity } from '../lib/gamification'
import { makeRevisionItem, reviewItem } from '../lib/spacedRepetition'
import { generateMockContest, type MockContestOptions } from '../lib/mockContest'
import { createAccount, seedAccounts } from '../data/accounts'

export type RecommendFilterState = RecommendFilter

export interface CPMentorState extends AccountState {
  recommendations: Problem[]
  darkMode: boolean
  sessionUserId: string | null
  accounts: Record<string, AccountState>

  updateProfile: (patch: Partial<UserProfile>) => void
  setGoal: (g: DailyGoal) => void
  updateRecommendFilters: (f: RecommendFilterState) => void
  regenerateRecommendations: () => void
  markSolved: (id: string) => void
  addChat: (role: 'user' | 'mentor', message: string) => void
  sendMentorMessage: (message: string) => void
  toggleDarkMode: () => void
  addToRevision: (problem: Problem) => void
  reviewRevision: (id: string, remembered: boolean) => void
  toggleRoadmapProblem: (id: string) => void
  addPost: (content: string) => void
  addComment: (postId: string, content: string) => void
  toggleLike: (postId: string) => void
  startMockContest: (options: MockContestOptions) => void
  toggleMockSolved: (id: string) => void
  finishMockContest: () => void
  toggleNotifications: () => void
  markAllNotificationsRead: () => void
  toggleContestReminder: (id: string) => void
  resetDemo: () => void
  enterDemo: () => void
  login: (email: string, password: string) => string | null
  register: (input: { name: string; cf_handle: string; email: string; password: string }) => string | null
  logout: () => void
}

const seededAccounts = seedAccounts()
const activeSeed = seededAccounts.rafiq

function statsFor(state: CPMentorState): BadgeStats {
  const baseSolved = state.statistics.reduce((sum, s) => sum + s.solved, 0)
  return {
    totalSolved: baseSolved + state.solvedIds.length,
    currentStreak: state.streak.current_streak,
    longestStreak: state.streak.longest_streak,
    goalsCompleted: state.goalsCompleted,
    reviewsDone: state.reviewsDone,
    contestsDone: state.contestsDone,
    rating: state.profile.current_rating,
  }
}

function grantBadges(state: CPMentorState): Partial<CPMentorState> {
  const earnedIds = state.badges.map((b) => b.id)
  const newly = evaluateBadges(statsFor(state), earnedIds)
  if (newly.length === 0) return {}
  const now = Date.now()
  return {
    badges: [...state.badges, ...newly.map((b) => ({ id: b.id, earned_at: now }))],
    notifications: [
      ...state.notifications,
      ...newly.map((b) => ({
        id: `notif-${b.id}-${now}`,
        title: `Badge unlocked: ${b.name}`,
        body: b.description,
        created_at: now,
        read: false,
        kind: 'badge' as const,
      })),
    ],
  }
}

function extractAccountState(state: CPMentorState): AccountState {
  return {
    id: state.sessionUserId ?? state.id,
    email: state.email,
    password: state.password,
    profile: state.profile,
    ratingHistory: state.ratingHistory,
    statistics: state.statistics,
    tagStats: state.tagStats,
    submissions: state.submissions,
    peers: state.peers,
    goal: state.goal,
    recommendFilters: state.recommendFilters,
    solvedDuringSession: state.solvedDuringSession,
    solvedIds: state.solvedIds,
    chats: state.chats,
    streak: state.streak,
    badges: state.badges,
    goalsCompleted: state.goalsCompleted,
    reviewsDone: state.reviewsDone,
    contestsDone: state.contestsDone,
    revision: state.revision,
    roadmapProgress: state.roadmapProgress,
    posts: state.posts,
    mockContest: state.mockContest,
    notifications: state.notifications,
    notificationsEnabled: state.notificationsEnabled,
    contestReminders: state.contestReminders,
  }
}

function freshRecommendations(account: AccountState): Problem[] {
  return recommendProblems(account.recommendFilters, new Set(account.solvedIds))
}


export const useStore = create<CPMentorState>()(
  persist(
    (set, get) => ({
      ...activeSeed,
      recommendations: freshRecommendations(activeSeed),
      darkMode: false,
      sessionUserId: null,
      accounts: seededAccounts,

      updateProfile: (patch) => {
        const s = get()
        const profile = { ...s.profile, ...patch }
        const merged = { ...s, profile }
        set({ profile, ...grantBadges(merged) })
      },

      setGoal: (g) => set({ goal: g }),

      updateRecommendFilters: (f) => set({ recommendFilters: f }),

      regenerateRecommendations: () => {
        const { recommendFilters, solvedIds } = get()
        set({ recommendations: recommendProblems(recommendFilters, new Set(solvedIds)) })
      },

      markSolved: (id) => {
        const s = get()
        if (s.solvedIds.includes(id)) return

        let goal = s.goal
        let goalsCompleted = s.goalsCompleted
        if (goal) {
          const wasDone = goal.completed_count >= goal.target_count
          const completed = Math.min(goal.target_count, goal.completed_count + 1)
          const justDone = !wasDone && completed >= goal.target_count
          if (justDone) goalsCompleted += 1
          goal = { ...goal, completed_count: completed }
        }

        const streak = recordActivity(s.streak)
        const update = {
          solvedIds: [...s.solvedIds, id],
          solvedDuringSession: [...s.solvedDuringSession, id],
          recommendations: s.recommendations.filter((r) => r.id !== id),
          goal,
          goalsCompleted,
          streak,
        }
        const merged = { ...s, ...update }
        set({ ...update, ...grantBadges(merged) })
      },

      addChat: (role, message) =>
        set((s) => ({
          chats: [...s.chats, { id: Date.now() + Math.random(), role, message, created_at: Date.now() }],
        })),

      sendMentorMessage: (message) => {
        get().addChat('user', message)
        const s = get()
        const reply = buildMentorReply(message, s.ratingHistory, s.tagStats)
        setTimeout(() => get().addChat('mentor', reply), 400)
      },

      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      addToRevision: (problem) => {
        const s = get()
        if (s.revision.some((r) => r.problem_id === problem.id)) return
        set({ revision: [makeRevisionItem(problem), ...s.revision] })
      },

      reviewRevision: (id, remembered) => {
        const s = get()
        const item = s.revision.find((r) => r.id === id)
        if (!item) return
        const nextItem = reviewItem(item, remembered)
        const revision = s.revision.map((r) => (r.id === id ? nextItem : r))
        const streak = recordActivity(s.streak)
        const reviewsDone = s.reviewsDone + 1
        const merged = { ...s, revision, streak, reviewsDone }
        set({ revision, streak, reviewsDone, ...grantBadges(merged) })
      },

      toggleRoadmapProblem: (id) =>
        set((s) => ({
          roadmapProgress: s.roadmapProgress.includes(id)
            ? s.roadmapProgress.filter((p) => p !== id)
            : [...s.roadmapProgress, id],
        })),

      addPost: (content) => {
        const text = content.trim()
        if (!text) return
        set((s) => ({
          posts: [
            {
              id: `post-${Date.now()}`,
              author: s.profile.name,
              handle: s.profile.cf_handle,
              content: text,
              created_at: Date.now(),
              likes: 0,
              likedByMe: false,
              comments: [],
            },
            ...s.posts,
          ],
        }))
      },

      addComment: (postId, content) => {
        const text = content.trim()
        if (!text) return
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  comments: [
                    ...p.comments,
                    {
                      id: `comment-${Date.now()}`,
                      author: s.profile.name,
                      content: text,
                      created_at: Date.now(),
                    },
                  ],
                }
              : p,
          ),
        }))
      },

      toggleLike: (postId) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === postId
              ? { ...p, likedByMe: !p.likedByMe, likes: p.likes + (p.likedByMe ? -1 : 1) }
              : p,
          ),
        })),

      startMockContest: (options) => set({ mockContest: generateMockContest(options) }),

      toggleMockSolved: (id) =>
        set((s) => {
          if (!s.mockContest || s.mockContest.finished) return {}
          const solved = s.mockContest.solved.includes(id)
            ? s.mockContest.solved.filter((p) => p !== id)
            : [...s.mockContest.solved, id]
          return { mockContest: { ...s.mockContest, solved } }
        }),

      finishMockContest: () => {
        const s = get()
        if (!s.mockContest || s.mockContest.finished) return
        const contest = { ...s.mockContest, finished: true, finished_at: Date.now() }

        const newlySolved = contest.solved.filter((id) => !s.solvedIds.includes(id))
        const revisionIds = new Set(s.revision.map((r) => r.problem_id))
        const missed = contest.problems.filter((p) => !contest.solved.includes(p.id) && !revisionIds.has(p.id))
        const newRevision = missed.map((p) =>
          makeRevisionItem({
            id: p.id,
            name: p.name,
            platform: p.platform,
            rating: p.rating,
            tags: p.tags,
            solved: false,
            url: p.url,
          }),
        )

        const streak = recordActivity(s.streak)
        const contestsDone = s.contestsDone + 1
        const update = {
          mockContest: contest,
          solvedIds: [...s.solvedIds, ...newlySolved],
          revision: [...newRevision, ...s.revision],
          streak,
          contestsDone,
        }
        const merged = { ...s, ...update }
        set({ ...update, ...grantBadges(merged) })
      },

      toggleNotifications: () => set((s) => ({ notificationsEnabled: !s.notificationsEnabled })),

      markAllNotificationsRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

      toggleContestReminder: (id) =>
        set((s) => ({
          contestReminders: s.contestReminders.includes(id)
            ? s.contestReminders.filter((c) => c !== id)
            : [...s.contestReminders, id],
        })),

      resetDemo: () => {
        const s = get()
        const id = s.sessionUserId
        const seeded = seedAccounts()
        const fresh =
          (id && seeded[id]) ||
          createAccount({
            id: id || `acct-${Date.now()}`,
            name: s.profile.name,
            cf_handle: s.profile.cf_handle,
            email: s.email,
            password: s.password,
          })
        const accounts = id ? { ...s.accounts, [id]: fresh } : s.accounts
        set({ ...fresh, accounts, recommendations: freshRecommendations(fresh) })
      },

      enterDemo: () => {
        const s = get()
        const accounts = s.sessionUserId
          ? { ...s.accounts, [s.sessionUserId]: extractAccountState(s) }
          : s.accounts
        const demo = accounts.rafiq ?? seedAccounts().rafiq
        set({
          accounts,
          sessionUserId: demo.id,
          ...demo,
          recommendations: freshRecommendations(demo),
        })
      },

      login: (email, password) => {
        const s = get()
        const accounts = s.sessionUserId
          ? { ...s.accounts, [s.sessionUserId]: extractAccountState(s) }
          : s.accounts
        const normalized = email.trim().toLowerCase()
        const account = Object.values(accounts).find((a) => a.email.toLowerCase() === normalized)
        if (!account) return 'No account found with that email.'
        if (account.password !== password) return 'Incorrect password.'
        set({
          accounts,
          sessionUserId: account.id,
          ...account,
          recommendations: freshRecommendations(account),
        })
        return null
      },

      register: (input) => {
        const s = get()
        const normalized = input.email.trim().toLowerCase()
        if (Object.values(s.accounts).some((a) => a.email.toLowerCase() === normalized)) {
          return 'Email already registered.'
        }
        const id = `acct-${Date.now()}`
        const account = createAccount({
          id,
          name: input.name,
          cf_handle: input.cf_handle,
          email: input.email.trim(),
          password: input.password,
        })
        const accounts = s.sessionUserId
          ? { ...s.accounts, [s.sessionUserId]: extractAccountState(s), [id]: account }
          : { ...s.accounts, [id]: account }
        set({
          accounts,
          sessionUserId: id,
          ...account,
          recommendations: freshRecommendations(account),
        })
        return null
      },

      logout: () => {
        const s = get()
        const accounts = s.sessionUserId
          ? { ...s.accounts, [s.sessionUserId]: extractAccountState(s) }
          : s.accounts
        set({ accounts, sessionUserId: null })
      },
    }),
    {
      name: 'cp-mentor-hub',
      partialize: (s) => {
        const { recommendations: _recommendations, ...rest } = s
        return rest
      },
      merge: (persisted, current) => {
        const p = persisted as Partial<CPMentorState> | undefined
        const merged = { ...current, ...(p ?? {}) }
        const persistedHadAccounts = Boolean(p && (p as Partial<CPMentorState>).accounts)

        if (!persistedHadAccounts) {
          const seeds = seedAccounts()
          const migrated = extractAccountState(merged)
          merged.accounts = {
            ...seeds,
            rafiq: {
              ...seeds.rafiq,
              ...migrated,
              id: 'rafiq',
              email: seeds.rafiq.email,
              password: seeds.rafiq.password,
            },
          }
        } else {
          merged.accounts = { ...seedAccounts(), ...merged.accounts }
        }

        merged.recommendations = recommendProblems(merged.recommendFilters, new Set(merged.solvedIds))
        return merged
      },
    },
  ),
)
