import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function Auth() {
  const login = useStore((s) => s.login)
  const register = useStore((s) => s.register)
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState<'login' | 'register'>(
    searchParams.get('mode') === 'register' ? 'register' : 'login',
  )
  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (mode === 'login') {
      const err = login(email.trim(), password)
      if (err) setError(err)
      return
    }
    if (!name.trim() || !handle.trim() || !email.trim() || password.length < 4) {
      setError('Fill all fields (password min 4 chars).')
      return
    }
    const err = register({ name: name.trim(), cf_handle: handle.trim(), email: email.trim(), password })
    if (err) setError(err)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          ← Back to home
        </Link>
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">CP Mentor Hub</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {mode === 'login' ? 'Login to your account' : 'Create a new account'}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Display name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Codeforces handle</label>
                <input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          {error && <div className="rounded-lg bg-rose-50 p-2 text-sm text-rose-600 dark:bg-rose-900/30 dark:text-rose-300">{error}</div>}
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          {mode === 'login' ? (
            <>
              No account?{' '}
              <button onClick={() => { setMode('register'); setError('') }} className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                Register
              </button>
            </>
          ) : (
            <>
              Have an account?{' '}
              <button onClick={() => { setMode('login'); setError('') }} className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                Login
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
