import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = process.env.CP_MENTOR_DB || path.join(__dirname, 'cp-mentor.db')

export const db = new DatabaseSync(dbPath)

export function initDb() {
  db.exec('PRAGMA foreign_keys = ON;')

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      cf_handle TEXT,
      atcoder_handle TEXT,
      leetcode_handle TEXT,
      current_rating INTEGER DEFAULT 0,
      joined_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      platform TEXT NOT NULL,
      problem_id TEXT NOT NULL,
      problem_name TEXT,
      problem_rating INTEGER,
      tags TEXT,
      verdict TEXT,
      submitted_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      target_count INTEGER NOT NULL,
      min_rating INTEGER,
      max_rating INTEGER,
      completed_count INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS roadmaps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      stage_order INTEGER
    );

    CREATE TABLE IF NOT EXISTS roadmap_problems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      roadmap_id INTEGER NOT NULL,
      problem_id TEXT NOT NULL,
      problem_name TEXT,
      platform TEXT,
      rating INTEGER,
      url TEXT,
      stage_order INTEGER,
      FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_roadmap_progress (
      user_id INTEGER NOT NULL,
      roadmap_problem_id INTEGER NOT NULL,
      is_done INTEGER DEFAULT 0,
      PRIMARY KEY (user_id, roadmap_problem_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS contests (
      id TEXT PRIMARY KEY,
      platform TEXT NOT NULL,
      name TEXT NOT NULL,
      start_time INTEGER NOT NULL,
      duration_min INTEGER,
      url TEXT
    );

    CREATE TABLE IF NOT EXISTS streaks (
      user_id INTEGER PRIMARY KEY,
      current_streak INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0,
      last_active_date TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      badge_name TEXT NOT NULL,
      earned_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS revision_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      problem_id TEXT NOT NULL,
      problem_name TEXT,
      platform TEXT,
      rating INTEGER,
      url TEXT,
      stage INTEGER DEFAULT 0,
      interval_days INTEGER DEFAULT 1,
      next_review_at INTEGER NOT NULL,
      added_at INTEGER NOT NULL,
      last_reviewed_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS post_likes (
      post_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      PRIMARY KEY (post_id, user_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS mentor_chats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      role TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_submissions_unique
      ON submissions(user_id, platform, problem_id, submitted_at, verdict);
  `)

  seedContests()
  seedRoadmaps()
}

function seedRoadmaps() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM roadmaps').get().n
  if (count > 0) return

  const roadmaps = [
    {
      title: 'Dynamic Programming',
      description: 'From simple state transitions to knapsack, LIS and digit DP.',
      problems: [
        { id: 'lc_4', name: 'Coin Change', platform: 'leetcode', rating: 1500, url: 'https://leetcode.com/problems/coin-change/' },
        { id: '1845D', name: 'Rating System', platform: 'codeforces', rating: 1700, url: 'https://codeforces.com/problemset/problem/1845/D' },
        { id: '1847C', name: 'Vampiric Powers', platform: 'codeforces', rating: 1400, url: 'https://codeforces.com/problemset/problem/1847/C' },
        { id: '1853B', name: 'Fibonaccharsis', platform: 'codeforces', rating: 1400, url: 'https://codeforces.com/problemset/problem/1853/B' },
        { id: '1850F', name: 'We Were Both Children', platform: 'codeforces', rating: 1400, url: 'https://codeforces.com/problemset/problem/1850/F' },
        { id: 'lc_1', name: 'Unique Paths III', platform: 'leetcode', rating: 1800, url: 'https://leetcode.com/problems/unique-paths-iii/' },
      ],
    },
    {
      title: 'Graph Theory',
      description: 'Traversal, shortest paths, trees and topological ordering.',
      problems: [
        { id: 'lc_5', name: 'Number of Islands', platform: 'leetcode', rating: 1400, url: 'https://leetcode.com/problems/number-of-islands/' },
        { id: 'abcf_1', name: 'abc376_d', platform: 'atcoder', rating: 1400, url: 'https://atcoder.jp/contests/abc376/tasks/abc376_d' },
        { id: 'abcf_4', name: 'abc373_d', platform: 'atcoder', rating: 1500, url: 'https://atcoder.jp/contests/abc373/tasks/abc373_d' },
        { id: 'lc_3', name: 'Course Schedule II', platform: 'leetcode', rating: 1600, url: 'https://leetcode.com/problems/course-schedule-ii/' },
        { id: '1843C', name: 'Sum in Binary Tree', platform: 'codeforces', rating: 1100, url: 'https://codeforces.com/problemset/problem/1843/C' },
      ],
    },
    {
      title: 'Number Theory',
      description: 'Primes, GCD, modular arithmetic and combinatorics.',
      problems: [
        { id: '1843B', name: 'Long Long', platform: 'codeforces', rating: 900, url: 'https://codeforces.com/problemset/problem/1843/B' },
        { id: '1851D', name: 'Prefix Permutation Sums', platform: 'codeforces', rating: 1500, url: 'https://codeforces.com/problemset/problem/1851/D' },
        { id: '1848C', name: 'Vika and Price Tags', platform: 'codeforces', rating: 1700, url: 'https://codeforces.com/problemset/problem/1848/C' },
      ],
    },
    {
      title: 'Binary Search',
      description: 'Search on answer, sorted arrays and monotonic predicates.',
      problems: [
        { id: 'abcf_6', name: 'abc376_c', platform: 'atcoder', rating: 1100, url: 'https://atcoder.jp/contests/abc376/tasks/abc376_c' },
        { id: 'lc_2', name: 'Kth Smallest Prime Fraction', platform: 'leetcode', rating: 1750, url: 'https://leetcode.com/problems/kth-smallest-prime-fraction/' },
        { id: '1850E', name: 'Cardboard for Pictures', platform: 'codeforces', rating: 1300, url: 'https://codeforces.com/problemset/problem/1850/E' },
        { id: '1852A', name: 'Ntarsis Set', platform: 'codeforces', rating: 1600, url: 'https://codeforces.com/problemset/problem/1852/A' },
      ],
    },
    {
      title: 'Greedy & Sorting',
      description: 'Exchange arguments, scheduling and sorting tricks.',
      problems: [
        { id: '1849B', name: 'Monsters', platform: 'codeforces', rating: 1000, url: 'https://codeforces.com/problemset/problem/1849/B' },
        { id: '1848B', name: 'Vika and the Bridge', platform: 'codeforces', rating: 1300, url: 'https://codeforces.com/problemset/problem/1848/B' },
        { id: '1843A', name: 'Maximum Rounding', platform: 'codeforces', rating: 800, url: 'https://codeforces.com/problemset/problem/1843/A' },
        { id: 'abcf_5', name: 'abc377_d', platform: 'atcoder', rating: 1500, url: 'https://atcoder.jp/contests/abc377/tasks/abc377_d' },
      ],
    },
  ]

  const insertRoadmap = db.prepare('INSERT INTO roadmaps (title, description, stage_order) VALUES (?, ?, ?)')
  const insertProblem = db.prepare(
    `INSERT INTO roadmap_problems (roadmap_id, problem_id, problem_name, platform, rating, url, stage_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )

  db.exec('BEGIN')
  try {
    roadmaps.forEach((roadmap, roadmapIndex) => {
      const result = insertRoadmap.run(roadmap.title, roadmap.description, roadmapIndex)
      const roadmapId = Number(result.lastInsertRowid)
      roadmap.problems.forEach((problem, problemIndex) => {
        insertProblem.run(
          roadmapId,
          problem.id,
          problem.name,
          problem.platform,
          problem.rating,
          problem.url,
          problemIndex,
        )
      })
    })
    db.exec('COMMIT')
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}

function seedContests() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM contests').get().n
  if (count > 0) return
  const now = Date.now()
  const day = 24 * 3600 * 1000
  const insert = db.prepare(
    'INSERT INTO contests (id, platform, name, start_time, duration_min, url) VALUES (?, ?, ?, ?, ?, ?)',
  )
  insert.run('cf1', 'codeforces', 'Codeforces Round 1860', now + day, 135, 'https://codeforces.com/contests')
  insert.run('abc1', 'atcoder', 'AtCoder Beginner Contest 377', now + 2 * day, 100, 'https://atcoder.jp/contests/')
  insert.run('lc1', 'leetcode', 'Weekly Contest 402', now + 4 * day, 90, 'https://leetcode.com/contest/')
}

export function closeDb() {
  db.close()
}
