import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import type { Platform, UserProfile } from '../types'

const platforms: { key: Platform; label: string; handleField: keyof UserProfile; url: (handle: string) => string; color: string }[] = [
  {
    key: 'codeforces',
    label: 'Codeforces',
    handleField: 'cf_handle',
    url: (handle) => `https://codeforces.com/profile/${handle}`,
    color: 'text-orange-600 dark:text-orange-400',
  },
  {
    key: 'atcoder',
    label: 'AtCoder',
    handleField: 'atcoder_handle',
    url: (handle) => `https://atcoder.jp/users/${handle}`,
    color: 'text-teal-600 dark:text-teal-400',
  },
  {
    key: 'leetcode',
    label: 'LeetCode',
    handleField: 'leetcode_handle',
    url: (handle) => `https://leetcode.com/${handle}`,
    color: 'text-amber-600 dark:text-amber-400',
  },
]

export default function Profile() {
  const profile = useStore((s) => s.profile)
  const updateProfile = useStore((s) => s.updateProfile)
  const darkMode = useStore((s) => s.darkMode)
  const toggleDarkMode = useStore((s) => s.toggleDarkMode)
  const notificationsEnabled = useStore((s) => s.notificationsEnabled)
  const toggleNotifications = useStore((s) => s.toggleNotifications)
  const solvedIds = useStore((s) => s.solvedIds)
  const statistics = useStore((s) => s.statistics)
  const email = useStore((s) => s.email)
  const goalsCompleted = useStore((s) => s.goalsCompleted)
  const reviewsDone = useStore((s) => s.reviewsDone)
  const contestsDone = useStore((s) => s.contestsDone)
  const resetDemo = useStore((s) => s.resetDemo)
  const logout = useStore((s) => s.logout)

  const [form, setForm] = useState(profile)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm(profile)
  }, [profile])

  const totalSolved = statistics.reduce((sum, s) => sum + s.solved, 0) + solvedIds.length

  const save = () => {
    updateProfile({
      ...form,
      current_rating: Number(form.current_rating) || 0,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const field = (key: keyof UserProfile, label: string, type: 'text' | 'number' = 'text') => (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">{label}</label>
      <input
        type={type}
        value={String(form[key])}
        onChange={(e) =>
          setForm({
            ...form,
            [key]: type === 'number' ? Number(e.target.value) : e.target.value,
          })
        }
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
      />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile & Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your cross-platform handles and local app preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <img
              src={new URL('../data/profile_pic.png', import.meta.url).href}
              alt={`${profile.name}'s profile`}
              className="h-16 w-16 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0">
              <div className="truncate text-lg font-bold">{profile.name}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Joined {new Date(profile.joined_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-center">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
              <div className="text-2xl font-bold">{profile.current_rating}</div>
              <div className="text-xs text-slate-500">Current rating</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
              <div className="text-2xl font-bold">{totalSolved}</div>
              <div className="text-xs text-slate-500">Total solved</div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {platforms.map((p) => {
              const handle = String(profile[p.handleField] || '')
              return (
                <div key={p.key} className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">{p.label}</span>
                  {handle ? (
                    <a
                      href={p.url(handle)}
                      target="_blank"
                      rel="noreferrer"
                      className={`font-medium hover:underline ${p.color}`}
                    >
                      @{handle}
                    </a>
                  ) : (
                    <span className="text-slate-400">not linked</span>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center dark:border-slate-800">
            <div>
              <div className="text-sm font-bold">{goalsCompleted}</div>
              <div className="text-[10px] uppercase text-slate-400">goals</div>
            </div>
            <div>
              <div className="text-sm font-bold">{reviewsDone}</div>
              <div className="text-[10px] uppercase text-slate-400">reviews</div>
            </div>
            <div>
              <div className="text-sm font-bold">{contestsDone}</div>
              <div className="text-[10px] uppercase text-slate-400">contests</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 xl:col-span-2 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold">Cross-platform profile</h2>
          <p className="mt-1 text-xs text-slate-500">
            Handles are saved locally and used across the resume, dashboard and community views.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {field('name', 'Display name')}
            {field('current_rating', 'Current rating', 'number')}
            {field('cf_handle', 'Codeforces handle')}
            {field('atcoder_handle', 'AtCoder handle')}
            {field('leetcode_handle', 'LeetCode handle')}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={save}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Save profile
            </button>
            {saved && <span className="text-sm text-emerald-600 dark:text-emerald-400">Saved ✓</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold">Preferences</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5 dark:border-slate-800">
              <div className="min-w-0">
                <div className="text-sm font-medium">Signed in</div>
                <div className="truncate text-xs text-slate-500">
                  {profile.name} · {email}
                </div>
              </div>
              <button
                onClick={logout}
                className="shrink-0 rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Log out
              </button>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5 dark:border-slate-800">
              <div>
                <div className="text-sm font-medium">Dark mode</div>
                <div className="text-xs text-slate-500">Switch the whole app theme.</div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  darkMode ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200'
                }`}
              >
                {darkMode ? 'On' : 'Off'}
              </button>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5 dark:border-slate-800">
              <div>
                <div className="text-sm font-medium">Desktop notifications</div>
                <div className="text-xs text-slate-500">Contest reminders and contest time-up alerts.</div>
              </div>
              <button
                onClick={toggleNotifications}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  notificationsEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200'
                }`}
              >
                {notificationsEnabled ? 'On' : 'Off'}
              </button>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-rose-200 px-3 py-2.5 dark:border-rose-900">
              <div>
                <div className="text-sm font-medium">Reset demo data</div>
                <div className="text-xs text-slate-500">Clears goals, revisions, chats, badges and posts.</div>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Reset all demo progress? This clears saved state.')) resetDemo()
                }}
                className="rounded-lg border border-rose-300 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-900/30"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Local services</h2>
            <button
              onClick={refreshServices}
              className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Recheck
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Optional Node API and Python AI engine. The app works offline without them.
          </p>
          <div className="mt-4 space-y-3">
            {[
              { label: 'Node / Express API', base: API_BASE, health: api },
              { label: 'Python AI engine', base: AI_BASE, health: ai },
            ].map((service) => (
              <div
                key={service.label}
                className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5 dark:border-slate-800"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium">{service.label}</div>
                  <div className="truncate text-xs text-slate-500">{service.base}</div>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyle(service.health.state)}`}>
                  {service.health.state}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800/60">
            <div className="font-medium text-slate-600 dark:text-slate-300">Start the services</div>
            <code className="mt-1 block">npm run server</code>
            <code className="block">cd python-engine && uvicorn app:app --port 8000</code>
            <p className="mt-1">Override URLs with VITE_API_URL and VITE_AI_URL.</p>
          </div>
        </div> */}
      </div>
    </div>
  )
}
