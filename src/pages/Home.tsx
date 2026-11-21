import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

type IconName =
  | 'trophy'
  | 'chart'
  | 'brain'
  | 'graph'
  | 'target'
  | 'file'
  | 'link'
  | 'search'
  | 'rocket'
  | 'flame'
  | 'spark'
  | 'check'
  | 'arrow'
  | 'sun'
  | 'moon'

function Icon({ name, className = 'h-5 w-5' }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    trophy: (
      <>
        <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
        <path d="M8 5H5a3 3 0 0 0 3 5M16 5h3a3 3 0 0 1-3 5" />
        <path d="M12 12v4M9 20h6M10 16h4v4h-4z" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V5M4 19h16" />
        <path d="M8 16v-5M12 16V8M16 16v-3" />
      </>
    ),
    brain: (
      <>
        <path d="M9 3a3 3 0 0 0-3 3v1a3 3 0 0 0 0 6v2a3 3 0 0 0 5 2.2" />
        <path d="M15 3a3 3 0 0 1 3 3v1a3 3 0 0 1 0 6v2a3 3 0 0 1-5 2.2" />
        <path d="M12 5v14" />
      </>
    ),
    graph: (
      <>
        <circle cx="5" cy="6" r="2" />
        <circle cx="19" cy="6" r="2" />
        <circle cx="12" cy="18" r="2" />
        <path d="M7 6h10M6.5 7.5l4.5 8.5M17.5 7.5 13 16" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    file: (
      <>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
        <path d="M14 3v5h5M9 13h6M9 17h4" />
      </>
    ),
    link: (
      <>
        <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
        <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    rocket: (
      <>
        <path d="M5 15c-1 2-1 5-1 5s3 0 5-1" />
        <path d="M14 4c4 0 6 2 6 6l-7 7-4-4 5-5" />
        <circle cx="15" cy="9" r="1" />
      </>
    ),
    flame: <path d="M12 3s4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3 0-2 0-5-2-7Z" />,
    spark: (
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    ),
    check: <path d="m5 13 4 4L19 7" />,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
      </>
    ),
    moon: <path d="M20 14.5A8 8 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />,
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

const navLinks = [
  { label: 'Features', target: 'features' },
  { label: 'How it works', target: 'how-it-works' },
  { label: 'Demo', target: 'demo' },
]

const features: {
  icon: IconName
  title: string
  desc: string
  path: string
  accent: string
}[] = [
  {
    icon: 'chart',
    title: 'Performance analytics',
    desc: 'Rating trends, a projected next-contest rating and consistency scores from your real submissions.',
    path: '/analytics',
    accent: 'from-indigo-500 to-blue-500',
  },
  {
    icon: 'brain',
    title: 'AI mentor',
    desc: 'Ask for a plan, a hint or an explanation. Every answer adapts to your weakest topics.',
    path: '/mentor',
    accent: 'from-violet-500 to-fuchsia-500',
  },
  {
    icon: 'graph',
    title: 'Skill graph',
    desc: 'See how topics connect and which prerequisites are quietly holding your rating back.',
    path: '/skill-graph',
    accent: 'from-sky-500 to-cyan-500',
  },
  {
    icon: 'target',
    title: 'Goals & revision',
    desc: 'Small daily targets plus spaced repetition, so the problems you learn actually stay learned.',
    path: '/goals',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    icon: 'trophy',
    title: 'Contests & mock rounds',
    desc: 'Live reminders and timed mock contests with automatic revision for the problems you miss.',
    path: '/mock-contest',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    icon: 'file',
    title: 'Resume & community',
    desc: 'Export a competitive programming resume and compare your progress with peers.',
    path: '/resume',
    accent: 'from-rose-500 to-pink-500',
  },
]

const steps: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: 'link',
    title: 'Connect your profiles',
    desc: 'Link Codeforces, AtCoder and LeetCode to pull your public stats automatically.',
  },
  {
    icon: 'search',
    title: 'Get your analysis',
    desc: 'The mentor finds weak tags, predicts your next rating and builds a focus plan.',
  },
  {
    icon: 'rocket',
    title: 'Practice with purpose',
    desc: 'Solve recommended problems, revise on schedule and watch your rating climb.',
  },
]

const tips = [
  'Start with a 30-minute daily goal. Consistency beats marathon sessions.',
  'After every contest, add the problems you missed to revision.',
  'Solve problems 100–200 above your rating to grow the fastest.',
  'Rotate tags weekly so one weak topic cannot hide behind another.',
]

const platforms = ['Codeforces', 'AtCoder', 'LeetCode']

function useCountUp(target: number, start: boolean, duration = 1200) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start) return
    let frame = 0
    const startedAt = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, start, duration])

  return value
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, inView }
}

function Stat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const current = useCountUp(value, inView)

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl font-bold text-slate-900 dark:text-white">
        {current}
        {suffix ?? ''}
      </div>
      <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const darkMode = useStore((s) => s.darkMode)
  const toggleDarkMode = useStore((s) => s.toggleDarkMode)
  const enterDemo = useStore((s) => s.enterDemo)
  const sessionUserId = useStore((s) => s.sessionUserId)

  const [goalSolved, setGoalSolved] = useState(3)
  const [tipIndex, setTipIndex] = useState(0)
  const goalDone = goalSolved >= 4

  useEffect(() => {
    const id = setInterval(() => setTipIndex((i) => (i + 1) % tips.length), 4500)
    return () => clearInterval(id)
  }, [])

  const scrollTo = (target: string) => {
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const openDemo = (path: string) => {
    if (!sessionUserId) enterDemo()
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => scrollTo('top')}
            className="flex items-center gap-2.5 text-left"
            aria-label="CP Mentor Hub home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
              <Icon name="trophy" className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-base font-bold leading-tight">CP Mentor Hub</span>
              <span className="block text-[10px] font-medium uppercase tracking-widest text-slate-400">
                Competitive programming
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <button
                key={link.target}
                onClick={() => scrollTo(link.target)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              title="Toggle dark mode"
              aria-label="Toggle dark mode"
            >
              <Icon name={darkMode ? 'moon' : 'sun'} className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate(sessionUserId ? '/' : '/login')}
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:block"
            >
              {sessionUserId ? 'Dashboard' : 'Log in'}
            </button>
            <button
              onClick={() => navigate(sessionUserId ? '/' : '/login?mode=register')}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-700"
            >
              {sessionUserId ? 'Open dashboard' : 'Get started'}
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section id="demo" className="relative scroll-mt-20 overflow-hidden">
          <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl dark:bg-indigo-900/20" />
          <div className="pointer-events-none absolute -right-24 top-32 h-80 w-80 rounded-full bg-violet-200/50 blur-3xl dark:bg-violet-900/20" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
                </span>
                AI-powered mentor for competitive programming
              </div>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Competitive programming,{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-300">
                  with a plan.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                CP Mentor Hub studies your Codeforces, AtCoder and LeetCode history, finds your weak
                topics, and gives you a daily practice plan — like having a coach in your corner.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate(sessionUserId ? '/' : '/login?mode=register')}
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-600/25 transition-transform hover:-translate-y-0.5 hover:bg-indigo-700"
                >
                  {sessionUserId ? 'Open your dashboard' : 'Start learning free'}
                </button>
                <button
                  onClick={() => openDemo('/')}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-600 dark:hover:text-indigo-400"
                >
                  Try the live demo
                  <Icon name="arrow" className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="check" className="h-4 w-4 text-emerald-500" />
                  No setup required
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="check" className="h-4 w-4 text-emerald-500" />
                  Works offline
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="check" className="h-4 w-4 text-emerald-500" />
                  3 platforms
                </span>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Built for
                </span>
                {platforms.map((platform) => (
                  <span
                    key={platform}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md animate-fade-up lg:max-w-lg">
              <div className="animate-float absolute -left-3 top-24 z-10 hidden rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900 sm:block">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">
                    <Icon name="flame" className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm font-bold leading-none">12 days</div>
                    <div className="mt-1 text-[10px] text-slate-500">current streak</div>
                  </div>
                </div>
              </div>

              <div
                className="animate-float absolute -right-2 bottom-20 z-10 hidden rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900 sm:block"
                style={{ animationDelay: '1.2s' }}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300">
                    <Icon name="trophy" className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm font-bold leading-none">7 badges</div>
                    <div className="mt-1 text-[10px] text-slate-500">earned so far</div>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">Mentor snapshot</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Live demo · Codeforces</div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Live
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Current rating
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold tracking-tight">1638</span>
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                        Expert
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">next contest</div>
                    <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      ~1720
                    </div>
                  </div>
                </div>

                <svg viewBox="0 0 240 80" className="mt-3 h-20 w-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="homeSpark" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <linearGradient id="homeSparkFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 66 L30 58 L60 60 L90 46 L120 50 L150 34 L180 38 L210 20 L240 14 L240 80 L0 80 Z"
                    fill="url(#homeSparkFill)"
                  />
                  <path
                    d="M0 66 L30 58 L60 60 L90 46 L120 50 L150 34 L180 38 L210 20 L240 14"
                    fill="none"
                    stroke="url(#homeSpark)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="400"
                    className="animate-draw"
                  />
                </svg>

                <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">Today's goal</span>
                    <span className="text-slate-500 dark:text-slate-400">{goalSolved}/4 problems</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        goalDone ? 'bg-emerald-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${(goalSolved / 4) * 100}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-white p-3 dark:bg-slate-900">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">Vampiric Powers</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        1400 · bitmask · recommended
                      </div>
                    </div>
                    <button
                      onClick={() => setGoalSolved((n) => Math.min(4, n + 1))}
                      disabled={goalDone}
                      className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        goalDone
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {goalDone ? (
                        <span className="inline-flex items-center gap-1">
                          <Icon name="check" className="h-3.5 w-3.5" /> Done
                        </span>
                      ) : (
                        'Solve'
                      )}
                    </button>
                  </div>
                  {goalDone && (
                    <button
                      onClick={() => setGoalSolved(3)}
                      className="mt-2 text-[11px] font-medium text-slate-400 underline-offset-2 hover:text-indigo-500 hover:underline"
                    >
                      Reset demo
                    </button>
                  )}
                </div>

                <div className="mt-3 flex items-start gap-2 rounded-xl bg-indigo-50 p-3 text-xs leading-relaxed text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                  <Icon name="spark" className="mt-0.5 h-4 w-4 shrink-0" />
                  <span key={tipIndex} className="animate-fade-up">
                    {tips[tipIndex]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
            <Stat value={14} suffix="+" label="Smart tools" />
            <Stat value={3} label="Platforms connected" />
            <Stat value={5} suffix=" mo" label="Guided roadmap" />
            <Stat value={24} suffix="/7" label="Mentor access" />
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Everything you need to level up
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              One place for practice, analysis and growth — no spreadsheets, no guesswork.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <button
                key={feature.title}
                onClick={() => openDemo(feature.path)}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.accent} text-white shadow-lg`}
                >
                  <Icon name={feature.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold">{feature.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {feature.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  Open demo
                  <Icon
                    name="arrow"
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </button>
            ))}
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-20 border-y border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                How it works
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300">
                From your first login to your next rating jump in three simple steps.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-300">
                      <Icon name={step.icon} className="h-5 w-5" />
                    </span>
                    <span className="text-2xl font-extrabold text-slate-200 dark:text-slate-800">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-14 text-center shadow-2xl shadow-indigo-500/25 sm:px-12">
            <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Your next rating jump starts today
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-indigo-100">
                Set a daily goal, follow your plan, and let the mentor handle the analysis.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => navigate(sessionUserId ? '/' : '/login?mode=register')}
                  className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  {sessionUserId ? 'Open dashboard' : 'Create free account'}
                </button>
                <button
                  onClick={() => openDemo('/')}
                  className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Explore the demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
              <Icon name="trophy" className="h-4 w-4" />
            </span>
            <div>
              <div className="text-sm font-bold">CP Mentor Hub</div>
              <div className="text-xs text-slate-500">Practice smarter. Rate higher.</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            {navLinks.map((link) => (
              <button
                key={link.target}
                onClick={() => scrollTo(link.target)}
                className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => navigate(sessionUserId ? '/' : '/login')}
              className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {sessionUserId ? 'Dashboard' : 'Log in'}
            </button>
            <span className="text-xs">© {new Date().getFullYear()} CP Mentor Hub</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
