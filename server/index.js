import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db, initDb } from './db.js'
import { collectAtCoder, collectCodeforces } from './collectors.js'

initDb()

const app = express()
const PORT = Number(process.env.PORT || 4000)
const JWT_SECRET = process.env.JWT_SECRET || 'cp-mentor-hub-dev-secret-change-me'
const TOKEN_TTL = '7d'

app.use(cors())
app.use(express.json({ limit: '1mb' }))

function publicUser(user) {
  if (!user) return null
  const { password_hash: _password, ...rest } = user
  return rest
}

function sign(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: TOKEN_TTL })
}

function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Missing authorization token' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'cp-mentor-hub-api', time: Date.now() })
})

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, cf_handle, atcoder_handle, leetcode_handle } = req.body || {}
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' })
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: 'password must be at least 6 characters' })
  }
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (exists) return res.status(409).json({ error: 'Email already registered' })

  const password_hash = bcrypt.hashSync(String(password), 10)
  const result = db
    .prepare(
      `INSERT INTO users (name, email, password_hash, cf_handle, atcoder_handle, leetcode_handle, current_rating, joined_at)
       VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
    )
    .run(name, email, password_hash, cf_handle || null, atcoder_handle || null, leetcode_handle || null, Date.now())

  const id = Number(result.lastInsertRowid)
  db.prepare('INSERT OR IGNORE INTO streaks (user_id, current_streak, longest_streak, last_active_date) VALUES (?, 0, 0, NULL)').run(id)
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
  res.status(201).json({ token: sign(user), user: publicUser(user) })
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' })
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!user || !bcrypt.compareSync(String(password), user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  res.json({ token: sign(user), user: publicUser(user) })
})

app.get('/api/me', auth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ user: publicUser(user) })
})

app.get('/api/users/:id/profile', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(req.params.id))
  if (!user) return res.status(404).json({ error: 'User not found' })
  const submissions = db
    .prepare('SELECT COUNT(*) AS total, SUM(CASE WHEN verdict = ? THEN 1 ELSE 0 END) AS solved FROM submissions WHERE user_id = ?')
    .get('AC', user.id)
  const streak = db.prepare('SELECT * FROM streaks WHERE user_id = ?').get(user.id)
  res.json({ user: publicUser(user), submissions, streak: streak || null })
})

app.get('/api/submissions', auth, (req, res) => {
  const rows = db
    .prepare('SELECT * FROM submissions WHERE user_id = ? ORDER BY submitted_at DESC LIMIT 200')
    .all(req.user.id)
  res.json({ submissions: rows })
})

app.post('/api/submissions', auth, (req, res) => {
  const { platform, problem_id, problem_name, problem_rating, tags, verdict, submitted_at } = req.body || {}
  if (!platform || !problem_id || !verdict) {
    return res.status(400).json({ error: 'platform, problem_id and verdict are required' })
  }
  const result = db
    .prepare(
      `INSERT INTO submissions (user_id, platform, problem_id, problem_name, problem_rating, tags, verdict, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      req.user.id,
      platform,
      problem_id,
      problem_name || null,
      problem_rating || null,
      Array.isArray(tags) ? tags.join(',') : tags || null,
      verdict,
      submitted_at || Date.now(),
    )
  res.status(201).json({ id: Number(result.lastInsertRowid) })
})

app.post('/api/collect/codeforces', auth, async (req, res, next) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)
    const handle = String(req.body?.handle || user.cf_handle || '').trim()
    if (!handle) return res.status(400).json({ error: 'Codeforces handle is required' })
    const result = await collectCodeforces(req.user.id, handle)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

app.post('/api/collect/atcoder', auth, async (req, res, next) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)
    const handle = String(req.body?.handle || user.atcoder_handle || '').trim()
    if (!handle) return res.status(400).json({ error: 'AtCoder handle is required' })
    const result = await collectAtCoder(req.user.id, handle)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

app.get('/api/goals', auth, (req, res) => {
  const rows = db.prepare('SELECT * FROM goals WHERE user_id = ? ORDER BY date DESC LIMIT 60').all(req.user.id)
  res.json({ goals: rows })
})

app.post('/api/goals', auth, (req, res) => {
  const { date, target_count, min_rating, max_rating, completed_count } = req.body || {}
  if (!date || !target_count) return res.status(400).json({ error: 'date and target_count are required' })
  const result = db
    .prepare(
      `INSERT INTO goals (user_id, date, target_count, min_rating, max_rating, completed_count)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(req.user.id, date, target_count, min_rating || null, max_rating || null, completed_count || 0)
  res.status(201).json({ id: Number(result.lastInsertRowid) })
})

app.get('/api/roadmaps', (_req, res) => {
  const roadmaps = db.prepare('SELECT * FROM roadmaps ORDER BY stage_order').all()
  const problems = db.prepare('SELECT * FROM roadmap_problems ORDER BY stage_order').all()
  res.json({
    roadmaps: roadmaps.map((r) => ({ ...r, problems: problems.filter((p) => p.roadmap_id === r.id) })),
  })
})

app.get('/api/roadmaps/progress', auth, (req, res) => {
  const rows = db
    .prepare('SELECT roadmap_problem_id FROM user_roadmap_progress WHERE user_id = ? AND is_done = 1')
    .all(req.user.id)
  res.json({ done: rows.map((r) => r.roadmap_problem_id) })
})

app.post('/api/roadmaps/problems/:id/toggle', auth, (req, res) => {
  const problemId = Number(req.params.id)
  const problem = db.prepare('SELECT id FROM roadmap_problems WHERE id = ?').get(problemId)
  if (!problem) return res.status(404).json({ error: 'Roadmap problem not found' })
  const existing = db
    .prepare('SELECT is_done FROM user_roadmap_progress WHERE user_id = ? AND roadmap_problem_id = ?')
    .get(req.user.id, problemId)
  const done = !existing || !existing.is_done
  db.prepare(
    `INSERT INTO user_roadmap_progress (user_id, roadmap_problem_id, is_done) VALUES (?, ?, ?)
     ON CONFLICT(user_id, roadmap_problem_id) DO UPDATE SET is_done = excluded.is_done`,
  ).run(req.user.id, problemId, done ? 1 : 0)
  res.json({ roadmap_problem_id: problemId, done })
})

app.get('/api/contests', (_req, res) => {
  const rows = db.prepare('SELECT * FROM contests ORDER BY start_time').all()
  res.json({ contests: rows })
})

app.get('/api/leaderboard', (_req, res) => {
  const rows = db
    .prepare(
      `SELECT u.id, u.name, u.cf_handle, u.current_rating,
              (SELECT COUNT(*) FROM submissions s WHERE s.user_id = u.id AND s.verdict = 'AC') AS solved,
              COALESCE(st.current_streak, 0) AS streak
       FROM users u LEFT JOIN streaks st ON st.user_id = u.id
       ORDER BY u.current_rating DESC, solved DESC LIMIT 50`,
    )
    .all()
  res.json({ leaderboard: rows })
})

app.get('/api/community/posts', (_req, res) => {
  const posts = db
    .prepare(
      `SELECT p.id, p.content, p.created_at, u.id AS user_id, u.name AS author, u.cf_handle AS handle,
              (SELECT COUNT(*) FROM post_likes l WHERE l.post_id = p.id) AS likes
       FROM posts p JOIN users u ON u.id = p.user_id
       ORDER BY p.created_at DESC LIMIT 50`,
    )
    .all()
  const commentStmt = db.prepare(
    `SELECT c.id, c.content, c.created_at, u.name AS author
     FROM comments c JOIN users u ON u.id = c.user_id
     WHERE c.post_id = ? ORDER BY c.created_at ASC`,
  )
  res.json({ posts: posts.map((p) => ({ ...p, comments: commentStmt.all(p.id) })) })
})

app.post('/api/community/posts', auth, (req, res) => {
  const content = String(req.body?.content || '').trim()
  if (!content) return res.status(400).json({ error: 'content is required' })
  if (content.length > 280) return res.status(400).json({ error: 'content must be 280 characters or fewer' })
  const result = db
    .prepare('INSERT INTO posts (user_id, content, created_at) VALUES (?, ?, ?)')
    .run(req.user.id, content, Date.now())
  res.status(201).json({ id: Number(result.lastInsertRowid) })
})

app.post('/api/community/posts/:id/comments', auth, (req, res) => {
  const content = String(req.body?.content || '').trim()
  if (!content) return res.status(400).json({ error: 'content is required' })
  const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(Number(req.params.id))
  if (!post) return res.status(404).json({ error: 'Post not found' })
  const result = db
    .prepare('INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, ?)')
    .run(post.id, req.user.id, content, Date.now())
  res.status(201).json({ id: Number(result.lastInsertRowid) })
})

app.post('/api/community/posts/:id/like', auth, (req, res) => {
  const postId = Number(req.params.id)
  const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(postId)
  if (!post) return res.status(404).json({ error: 'Post not found' })
  const existing = db.prepare('SELECT 1 FROM post_likes WHERE post_id = ? AND user_id = ?').get(postId, req.user.id)
  if (existing) {
    db.prepare('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?').run(postId, req.user.id)
    return res.json({ liked: false })
  }
  db.prepare('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)').run(postId, req.user.id)
  res.json({ liked: true })
})

app.get('/api/revision', auth, (req, res) => {
  const rows = db.prepare('SELECT * FROM revision_queue WHERE user_id = ? ORDER BY next_review_at').all(req.user.id)
  res.json({ revision: rows })
})

app.post('/api/revision/:id/review', auth, (req, res) => {
  const id = Number(req.params.id)
  const item = db.prepare('SELECT * FROM revision_queue WHERE id = ? AND user_id = ?').get(id, req.user.id)
  if (!item) return res.status(404).json({ error: 'Revision item not found' })
  const remembered = Boolean(req.body?.remembered)
  const intervals = [1, 3, 7, 14, 30]
  const stage = remembered ? Math.min(item.stage + 1, intervals.length - 1) : 0
  const interval = intervals[stage]
  db.prepare(
    'UPDATE revision_queue SET stage = ?, interval_days = ?, next_review_at = ?, last_reviewed_at = ? WHERE id = ?',
  ).run(stage, interval, Date.now() + interval * 24 * 3600 * 1000, Date.now(), id)
  res.json({ stage, interval_days: interval })
})

app.get('/api/mentor/chats', auth, (req, res) => {
  const rows = db.prepare('SELECT * FROM mentor_chats WHERE user_id = ? ORDER BY created_at').all(req.user.id)
  res.json({ chats: rows })
})

app.post('/api/mentor/chat', auth, (req, res) => {
  const message = String(req.body?.message || '').trim()
  if (!message) return res.status(400).json({ error: 'message is required' })
  const insert = db.prepare('INSERT INTO mentor_chats (user_id, role, message, created_at) VALUES (?, ?, ?, ?)')
  insert.run(req.user.id, 'user', message, Date.now())
  const lower = message.toLowerCase()
  const reply = lower.includes('weak')
    ? 'Your weakest topics are DP, Graph and Bitmask. Drill 1200-1400 problems in those tags for the next 3 days.'
    : lower.includes('rating')
      ? 'Your recent trend is positive. Keep solving and you should cross 1500 within 3-4 contests.'
      : 'Set a daily goal, review your revision queue and run one mock contest this week. Consistency beats intensity.'
  insert.run(req.user.id, 'mentor', reply, Date.now())
  res.json({ reply })
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`CP Mentor Hub API listening on http://localhost:${PORT}`)
})
