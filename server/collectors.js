import { db } from './db.js'

const CF_API = 'https://codeforces.com/api'
const KENKOO_API = 'https://kenkoooo.com/atcoder'
const ATCODER = 'https://atcoder.jp'

function mapCodeforcesVerdict(verdict) {
  switch (verdict) {
    case 'OK':
      return 'AC'
    case 'WRONG_ANSWER':
      return 'WA'
    case 'TIME_LIMIT_EXCEEDED':
      return 'TLE'
    case 'MEMORY_LIMIT_EXCEEDED':
      return 'MLE'
    default:
      return 'RE'
  }
}

function mapAtCoderVerdict(result) {
  if (result === 'AC') return 'AC'
  if (result === 'WA') return 'WA'
  if (result === 'TLE') return 'TLE'
  if (result === 'MLE') return 'MLE'
  return 'RE'
}

async function getJson(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'CP-Mentor-Hub/1.0 (educational project)' },
  })
  if (!response.ok) throw new Error(`Request failed ${response.status}: ${url}`)
  return response.json()
}

let codeforcesProblemsCache = null

async function loadCodeforcesProblems() {
  if (codeforcesProblemsCache) return codeforcesProblemsCache
  const data = await getJson(`${CF_API}/problemset.problems`)
  const map = new Map()
  for (const problem of data.result.problems) {
    map.set(`${problem.contestId}${problem.index}`, {
      name: problem.name,
      rating: problem.rating ?? null,
      tags: problem.tags ?? [],
    })
  }
  codeforcesProblemsCache = map
  return map
}

export async function collectCodeforces(userId, handle) {
  if (!handle) throw new Error('A Codeforces handle is required')

  const [info, status, problems] = await Promise.all([
    getJson(`${CF_API}/user.info?handles=${encodeURIComponent(handle)}`),
    getJson(`${CF_API}/user.status?handle=${encodeURIComponent(handle)}&from=1&count=10000`),
    loadCodeforcesProblems(),
  ])

  const cfUser = info.result?.[0]
  if (!cfUser) throw new Error('Codeforces user not found')

  const insert = db.prepare(
    `INSERT OR IGNORE INTO submissions
      (user_id, platform, problem_id, problem_name, problem_rating, tags, verdict, submitted_at)
     VALUES (?, 'codeforces', ?, ?, ?, ?, ?, ?)`,
  )

  let inserted = 0
  db.exec('BEGIN')
  try {
    for (const sub of status.result) {
      if (!sub.problem?.contestId) continue
      const problemId = `${sub.problem.contestId}${sub.problem.index}`
      const meta = problems.get(problemId)
      const result = insert.run(
        userId,
        problemId,
        meta?.name || sub.problem.name,
        meta?.rating ?? sub.problem.rating ?? null,
        (meta?.tags || sub.problem.tags || []).join(','),
        mapCodeforcesVerdict(sub.verdict),
        sub.creationTimeSeconds * 1000,
      )
      inserted += Number(result.changes)
    }
    db.prepare('UPDATE users SET cf_handle = ?, current_rating = ? WHERE id = ?').run(
      handle,
      cfUser.rating ?? 0,
      userId,
    )
    db.exec('COMMIT')
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }

  return {
    platform: 'codeforces',
    handle,
    rating: cfUser.rating ?? 0,
    fetched: status.result.length,
    inserted,
  }
}

let atCoderModelsCache = null

async function loadAtCoderModels() {
  if (atCoderModelsCache) return atCoderModelsCache
  const data = await getJson(`${KENKOO_API}/resources/problem-models.json`)
  atCoderModelsCache = data
  return data
}

export async function collectAtCoder(userId, handle) {
  if (!handle) throw new Error('An AtCoder handle is required')

  const fromSecond = 0
  const [history, submissions, models] = await Promise.all([
    getJson(`${ATCODER}/users/${encodeURIComponent(handle)}/history/json`),
    getJson(`${KENKOO_API}/atcoder-api/v3/user/submissions?user=${encodeURIComponent(handle)}&from_second=${fromSecond}`),
    loadAtCoderModels().catch(() => ({})),
  ])

  const latestRating = history.length ? history[history.length - 1].NewRating : 0

  const insert = db.prepare(
    `INSERT OR IGNORE INTO submissions
      (user_id, platform, problem_id, problem_name, problem_rating, tags, verdict, submitted_at)
     VALUES (?, 'atcoder', ?, ?, ?, ?, ?, ?)`,
  )

  let inserted = 0
  db.exec('BEGIN')
  try {
    for (const sub of submissions) {
      const model = models[sub.problem_id]
      const difficulty = model?.difficulty ? Math.round(model.difficulty) : null
      const result = insert.run(
        userId,
        sub.problem_id,
        sub.problem_id,
        difficulty,
        '',
        mapAtCoderVerdict(sub.result),
        sub.epoch_second * 1000,
      )
      inserted += Number(result.changes)
    }
    db.prepare('UPDATE users SET atcoder_handle = ?, current_rating = ? WHERE id = ?').run(
      handle,
      latestRating,
      userId,
    )
    db.exec('COMMIT')
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }

  return {
    platform: 'atcoder',
    handle,
    rating: latestRating,
    fetched: submissions.length,
    inserted,
  }
}
