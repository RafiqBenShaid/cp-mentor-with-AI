# CP Mentor Hub

An AI-enhanced competitive programming mentor app — built to cover the **full 5-month scope** in `CP_Mentor_Hub_5Month_FullPlan.md`.

The app is a **React + TypeScript + Vite + Tailwind + Recharts + Zustand** desktop-style UI, wrapped by an **Electron** shell, with a **Python/FastAPI AI engine** and a **Node/Express + SQLite** API included in the repo.

> The UI runs completely offline with realistic mock data and localStorage persistence. The Python and Node services are ready to wire in when you want live data/API keys.

## ✨ Features (all months)

| Feature | Month | Route |
|---|---|---|
| Cross-platform profile (CF / AtCoder / LeetCode) | 1 | `#/profile` |
| Profile & settings (handles, dark mode, service health) | 1 | `#/profile` |
| Dashboard: rating graph, solve stats, AI insight | 2 | `#/` |
| Daily Goal: target + rating range, auto-track | 2 | `#/goals` |
| Rating-range Recommendation (unsolved + tag variety) | 2 | `#/recommend` |
| Contest Reminder (live countdown + desktop notifications) | 2 | `#/contests` |
| Performance Analytics: regression projection, consistency | 3 | `#/analytics` |
| Weakness Detection (KMeans clustering) | 3 | `#/analytics` |
| Skill / Knowledge Graph with prerequisite gaps | 3 | `#/skill-graph` |
| AI Mentor chat (rule-based offline, Claude wiring included) | 3 | `#/mentor` |
| Learning Roadmap (5 curated topic tracks) | 4 | `#/roadmap` |
| Gamification: streak + 14 badges | 4 | `#/progress` |
| Spaced Repetition (1→3→7→14→30 days) | 4 | `#/revision` |
| Mock Contest Generator with live timer | 4 | `#/mock-contest` |
| CP Resume Export (preview + print/PDF + HTML download) | 4 | `#/resume` |
| Community feed: posts, comments, likes, peer comparison | 5 | `#/community` |
| Dark mode, notifications, responsive layout, loading/empty states | 5 | Global |

## 🚀 Run the web app

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npm run preview    # serve production build
npm test           # 24 unit tests (Vitest)
npm run test:python # Pytest suite for the AI engine (skips ML tests if deps missing)
npm run typecheck  # TypeScript only
```

## 🖥️ Run the Electron desktop app

```bash
npm run electron:dev    # build + launch Electron
npm run electron:pack   # unpacked app in release/
npm run electron:dist   # AppImage / deb / nsis / dmg via electron-builder
```

Electron exposes a safe `window.cpMentor` bridge (`electron/preload.cjs`) for native notifications. Contest reminders and mock-contest time-up events use it automatically; in the browser they fall back to the Web Notification API.

## 🧠 Run the Python AI engine

```bash
cd python-engine
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Endpoints: `POST /weakness`, `POST /skill-graph`, `POST /predict`, `POST /mentor` (see `python-engine/README.md`). Set `ANTHROPIC_API_KEY` to enable real Claude mentor replies.

The Profile page shows live health for both local services. Override their URLs with `VITE_API_URL` (default `http://localhost:4000`) and `VITE_AI_URL` (default `http://localhost:8000`). The app falls back to the offline demo when they are not running.

## 🗄️ Run the Node/Express API

```bash
npm run server   # http://localhost:4000
```

Uses Node's built-in `node:sqlite` (no native build). Includes JWT auth (`/api/auth/register`, `/api/auth/login`), submissions, goals, contests, community posts/comments/likes, revision queue, leaderboard and mentor chat. Set `JWT_SECRET`, `PORT`, and `CP_MENTOR_DB` as needed.

## 📁 Structure

```
src/
  components/  Layout (sidebar, notifications, dark mode)
  data/        mock profile, submissions, problems, roadmaps, community
  lib/         analytics, recommendation, skill graph, spaced repetition,
               gamification, mock contest, resume, desktop bridge
  pages/       Dashboard, Analytics, SkillGraph, Goals, Recommend, Contests,
               MockContest, Revision, Roadmap, Progress, Resume, Community,
               Mentor, Profile
  store/       Zustand store (persisted to localStorage)
  types/       TypeScript types + Electron bridge typings
electron/      main process + preload bridge
python-engine/ FastAPI AI/analytics service + mentor
server/        Express + SQLite API
tests/         Vitest unit tests
```

## 🔌 Wiring live data (optional)

The UI currently reads from `src/data/mock.ts`. To switch to live data:

1. Start `python-engine` and `server`.
2. Replace the mock imports in `src/lib/*` and `src/data/mock.ts` with `fetch()` calls to the services.
3. Fetch Codeforces (`user.status`, `contest.list`, `problemset.problems`) and AtCoder (Kenkoooo) from the Node data-collection layer, normalise into the `submissions` table, and expose it through the API.

> No API keys are required for the demo. Never commit `.env` or secrets.
