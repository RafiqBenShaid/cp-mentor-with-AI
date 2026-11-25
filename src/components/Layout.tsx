import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useStore } from '../store/useStore'

const navItems = [
  // { to: '/', label: 'Homepage', icon: '🏠', end: true, section: 'Overview' },
  { to: '/', label: 'Homepage', icon: '🏠', end: true, section: 'Overview' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊', end: true, section: 'Overview' },
  { to: '/analytics', label: 'Analytics', icon: '📈', end: false, section: 'Overview' },
  { to: '/skill-graph', label: 'Skill Graph', icon: '🕸️', end: false, section: 'Overview' },
  { to: '/mentor', label: 'AI Mentor', icon: '🧠', end: false, section: 'Overview' },
  { to: '/goals', label: 'Daily Goals', icon: '🎯', end: false, section: 'Practice' },
  { to: '/recommend', label: 'Recommend', icon: '💡', end: false, section: 'Practice' },
  { to: '/contests', label: 'Contests', icon: '🏆', end: false, section: 'Practice' },
  { to: '/mock-contest', label: 'Mock Contest', icon: '⚔️', end: false, section: 'Practice' },
  { to: '/revision', label: 'Revision', icon: '🔁', end: false, section: 'Practice' },
  { to: '/roadmap', label: 'Roadmap', icon: '🗺️', end: false, section: 'Practice' },
  { to: '/progress', label: 'Progress', icon: '🔥', end: false, section: 'Growth' },
  { to: '/resume', label: 'CP Resume', icon: '📄', end: false, section: 'Growth' },
  { to: '/community', label: 'Community', icon: '💬', end: false, section: 'Social' },
  { to: '/profile', label: 'Profile & Settings', icon: '👤', end: false, section: 'Account' },
]

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function Layout() {
  const darkMode = useStore((s) => s.darkMode)
  const toggleDarkMode = useStore((s) => s.toggleDarkMode)
  const notifications = useStore((s) => s.notifications)
  const markAllNotificationsRead = useStore((s) => s.markAllNotificationsRead)
  const profile = useStore((s) => s.profile)
  const logout = useStore((s) => s.logout)
  const [panelOpen, setPanelOpen] = useState(false)

  const unread = notifications.filter((n) => !n.read).length
  let lastSection = ''

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
          <div className="text-lg font-bold">CP Mentor Hub</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Competitive Programming</div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const showSection = item.section !== lastSection
            lastSection = item.section
            return (
              <div key={item.to}>
                {showSection && (
                  <div className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {item.section}
                  </div>
                )}
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </div>
            )
          })}
        </nav>
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <NavLink
              to="/profile"
              // className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white"
              title="Open profile"
            >
              <img
              src={new URL('../data/profile_pic.png', import.meta.url).href}
              alt={`${profile.name}'s profile`}
              className="h-16 w-16 shrink-0 rounded-full object-cover"
            />
            </NavLink>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{profile.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Rating {profile.current_rating}</div>
            </div>
            <button
              onClick={toggleDarkMode}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Toggle dark mode"
            >
              {darkMode ? '🌙' : '☀️'}
            </button>
          </div>
          <button
            onClick={logout}
            className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Log out / Switch account
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="relative z-20 flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <button
            onClick={() => {
              setPanelOpen((v) => !v)
              if (!panelOpen) markAllNotificationsRead()
            }}
            className="relative rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            🔔 Notifications
            {unread > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
          {panelOpen && (
            <div className="absolute right-6 top-14 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5 dark:border-slate-700">
                <span className="text-sm font-semibold">Notifications</span>
                <button onClick={() => setPanelOpen(false)} className="text-xs text-slate-400 hover:text-slate-600">
                  Close
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-sm text-slate-500">Nothing here yet.</div>
                ) : (
                  [...notifications]
                    .reverse()
                    .slice(0, 8)
                    .map((n) => (
                      <div key={n.id} className="border-b border-slate-100 px-4 py-3 last:border-0 dark:border-slate-800">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">
                            {n.kind === 'badge' ? '🏅 ' : n.kind === 'contest' ? '🏆 ' : '🔔 '}
                            {n.title}
                          </span>
                          <span className="shrink-0 text-[10px] text-slate-400">{timeAgo(n.created_at)}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{n.body}</p>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
