
# CP Mentor Hub — সম্পূর্ণ ৫-মাসের ডেভেলপমেন্ট রোডম্যাপ
### (প্রপোজালের সব ফিচার সহ Full-Scope প্ল্যান — Basic থেকে Advanced)

যেহেতু হাতে ৫ মাস (~২০ সপ্তাহ) সময় আছে, এখন আর MVP-তে সীমাবদ্ধ থাকার দরকার নেই। এই গাইডে প্রপোজালের **সবগুলো ফিচার** (Core ৮টা + Extra AI-enhanced ফিচারগুলো) সম্পূর্ণভাবে বানানোর ধাপ দেওয়া হলো, মাস-ভিত্তিক ভাগে।

---

## ০. চূড়ান্ত Tech Stack (Full Version)

| স্তর | ভাষা / টুল | ব্যবহার |
|---|---|---|
| Desktop Shell | **Electron** | ক্রস-প্ল্যাটফর্ম ডেস্কটপ অ্যাপ |
| Frontend | **React + TypeScript** | বড় প্রজেক্ট বলে TypeScript ব্যবহার করাই ভালো — bug কম হবে |
| Styling / UI Kit | **Tailwind CSS + shadcn/ui** | প্রফেশনাল লুক দ্রুত বানানো যায় |
| Charts | **Recharts / Chart.js** | রেটিং গ্রাফ, প্রোগ্রেস চার্ট |
| State Management | **Zustand** (হালকা) বা Redux Toolkit | অ্যাপ বড় হলে state ম্যানেজ করা সহজ হবে |
| Backend / Local Server | **Node.js + Express** (Electron-এর ভেতরে local server হিসেবে চলবে) | API route গুলো গুছিয়ে রাখার জন্য |
| Database | **SQLite (better-sqlite3)** | Local desktop storage; ভবিষ্যতে PostgreSQL-এ মাইগ্রেট করা যাবে যদি cloud sync লাগে |
| AI / Analytics Engine | **Python (pandas, scikit-learn, networkx)** | Weakness clustering, skill graph, performance prediction |
| Node ↔ Python Bridge | **Local REST API (FastAPI)** চালিয়ে Node থেকে HTTP কল করা | বড় প্রজেক্টে child_process এর চেয়ে FastAPI বেশি স্কেলেবল ও ডিবাগযোগ্য |
| AI Mentor Chat | **Claude API / OpenAI API** | কনভারসেশনাল ফিডব্যাক জেনারেশন |
| Community/Social Module | **Node.js + Express + SQLite (বা lightweight Firebase)** | পোস্ট, কমেন্ট সেভ করার জন্য ছোট backend |
| Auth (community-এর জন্য) | **JWT + bcrypt** | সাধারণ লগইন সিস্টেম |
| Testing | **Jest (JS) + Pytest (Python)** | ইউনিট টেস্ট |
| Packaging | **electron-builder** | `.exe`/`.AppImage`/`.deb` |
| Version Control | **Git + GitHub (Projects/Issues বোর্ড সহ)** | টাস্ক ট্র্যাকিং |

---

## ১. IDE ও টুলিং

- **VS Code** — মূল IDE (Extensions: ESLint, Prettier, Python, SQLite Viewer, GitLens, Thunder Client, Tailwind CSS IntelliSense, Error Lens)
- **DBeaver** বা SQLite Viewer — ডেটাবেস ভিজুয়ালি দেখার জন্য
- **Figma** (ঐচ্ছিক) — UI ডিজাইন আগে থেকে প্ল্যান করার জন্য, কোড লেখার আগে
- **GitHub Projects** — Kanban বোর্ড বানিয়ে টাস্ক ট্র্যাক করবে (To Do / In Progress / Done)
- **Postman বা Thunder Client** — নিজেদের API টেস্ট করার জন্য

---

## ২. পুরো সিস্টেম আর্কিটেকচার (Full Version)

```
                    ┌─────────────────────────────┐
                    │   External CP Platforms      │
                    │ (Codeforces, AtCoder, LeetCode)│
                    └───────────────┬───────────────┘
                                    │ REST API
                    ┌───────────────▼───────────────┐
                    │  Data Collection Service (Node) │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │   SQLite Database (Local)       │
                    │ users, submissions, goals,       │
                    │ roadmaps, badges, posts, ratings │
                    └──────┬─────────────────┬────────┘
                           │                 │
             ┌─────────────▼───────┐ ┌───────▼────────────┐
             │  Node/Express API    │ │ Python AI Engine     │
             │ (goals, reminders,   │ │ (FastAPI):            │
             │  roadmap, community) │ │ weakness clustering,   │
             └─────────────┬───────┘ │ skill graph, prediction│
                           │          └───────┬────────────┘
                           └──────────┬───────┘
                                      │
                    ┌─────────────────▼─────────────────┐
                    │   React + Electron Desktop UI       │
                    │ Dashboard | Goals | Mentor | Roadmap │
                    │ Community | Reminders | Profile      │
                    └───────────────────────────────────┘
```

---

## ৩. পূর্ণাঙ্গ ডেটাবেস স্কিমা (সব ফিচারের জন্য)

```sql
-- ইউজার প্রোফাইল
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT,
  cf_handle TEXT,
  atcoder_handle TEXT,
  current_rating INTEGER,
  joined_at INTEGER
);

-- সব প্ল্যাটফর্মের সাবমিশন একসাথে (normalized)
CREATE TABLE submissions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  platform TEXT,           -- 'codeforces' / 'atcoder' / 'leetcode'
  problem_id TEXT,
  problem_rating INTEGER,
  tags TEXT,                -- comma-separated
  verdict TEXT,
  submitted_at INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- দৈনিক গোল
CREATE TABLE goals (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  date TEXT,
  target_count INTEGER,
  min_rating INTEGER,
  max_rating INTEGER,
  completed_count INTEGER DEFAULT 0
);

-- লার্নিং রোডম্যাপ
CREATE TABLE roadmaps (
  id INTEGER PRIMARY KEY,
  title TEXT,               -- e.g. "Dynamic Programming"
  stage_order INTEGER
);
CREATE TABLE roadmap_problems (
  id INTEGER PRIMARY KEY,
  roadmap_id INTEGER,
  problem_id TEXT,
  stage_order INTEGER,
  FOREIGN KEY(roadmap_id) REFERENCES roadmaps(id)
);
CREATE TABLE user_roadmap_progress (
  user_id INTEGER,
  roadmap_problem_id INTEGER,
  is_done BOOLEAN DEFAULT 0,
  PRIMARY KEY (user_id, roadmap_problem_id)
);

-- কনটেস্ট রিমাইন্ডার (ক্যাশ করা তথ্য)
CREATE TABLE contests (
  id INTEGER PRIMARY KEY,
  platform TEXT,
  name TEXT,
  start_time INTEGER,
  duration_min INTEGER
);

-- গেমিফিকেশন
CREATE TABLE streaks (
  user_id INTEGER PRIMARY KEY,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date TEXT
);
CREATE TABLE badges (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  badge_name TEXT,
  earned_at INTEGER
);

-- স্পেসড রিপিটিশন রিভিশন লিস্ট
CREATE TABLE revision_queue (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  problem_id TEXT,
  next_review_at INTEGER,
  interval_days INTEGER DEFAULT 1
);

-- কমিউনিটি / সোশ্যাল
CREATE TABLE posts (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  content TEXT,
  created_at INTEGER
);
CREATE TABLE comments (
  id INTEGER PRIMARY KEY,
  post_id INTEGER,
  user_id INTEGER,
  content TEXT,
  created_at INTEGER
);

-- মেন্টর চ্যাট হিস্টোরি
CREATE TABLE mentor_chats (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  role TEXT,          -- 'user' / 'mentor'
  message TEXT,
  created_at INTEGER
);
```

---

## ৪. ৫-মাসের রোডম্যাপ (মাস অনুযায়ী ভাগ করা)

---

### 📅 মাস ১ — ফাউন্ডেশন (Weeks 1–4)

**লক্ষ্য:** পুরো প্রজেক্টের ভিত্তি — স্ক্যাফোল্ডিং, ডেটাবেস, মাল্টি-প্ল্যাটফর্ম ডেটা কালেকশন।

| সপ্তাহ | কাজ | ভাষা/টুল |
|---|---|---|
| ১ | Requirement finalize, DB schema ডিজাইন, GitHub repo + Projects বোর্ড সেটআপ, Figma-তে ওয়্যারফ্রেম | Markdown, Figma |
| ২ | Electron + React + TypeScript স্ক্যাফোল্ডিং, Tailwind সেটআপ, বেসিক নেভিগেশন (Sidebar + Routes) | JS/TS |
| ৩ | Codeforces API ইন্টিগ্রেশন (submissions, rating, problemset) | Node.js |
| ৪ | AtCoder API ইন্টিগ্রেশন (Kenkoooo API), ডেটা normalize করে SQLite-এ সেভ করা | Node.js + SQL |

**চেকপয়েন্ট:** দুইটা প্ল্যাটফর্ম থেকে ডেটা এনে একটা ইউনিফাইড টেবিলে সেভ হচ্ছে।

---

### 📅 মাস ২ — কোর প্রোডাক্টিভিটি ফিচার (Weeks 5–8)

**লক্ষ্য:** Dashboard, Goal Tracking, Recommendation, Contest Reminder — যেগুলো প্রতিদিন ব্যবহার হবে।

| সপ্তাহ | কাজ | ভাষা/টুল |
|---|---|---|
| ৫ | Dashboard UI: রেটিং গ্রাফ, সলভ স্ট্যাটস, ক্রস-প্ল্যাটফর্ম সামারি কার্ড | React + Recharts |
| ৬ | Daily Goal ফিচার: গোল সেট করা, প্রতিদিন সাবমিশন চেক করে অটো-ট্র্যাক করা (cron-like polling) | Node.js |
| ৭ | Rating-range Recommendation ইঞ্জিন: unsolved + রেঞ্জ ফিল্টার + tag ভ্যারাইটি | Node.js |
| ৮ | Contest Reminder: Codeforces `contest.list` + AtCoder কনটেস্ট এপিআই, Electron Notification | Node.js |

**চেকপয়েন্ট:** ইউজার গোল সেট করলে অ্যাপ নিজে থেকে বলে দিচ্ছে আজকে পূরণ হয়েছে কিনা, এবং রেটিং রেঞ্জ দিলে প্রবলেম সাজেস্ট করছে।

---

### 📅 মাস ৩ — AI / Analytics ইঞ্জিন (Weeks 9–12)

**লক্ষ্য:** এই মাসেই আসল "AI-enhanced" অংশ — Weakness Detection, Skill Graph, Performance Prediction, AI Mentor।

| সপ্তাহ | কাজ | ভাষা/টুল |
|---|---|---|
| ৯ | Python + FastAPI সার্ভিস সেটআপ, Node থেকে HTTP দিয়ে কানেক্ট করা | Python (FastAPI) |
| ১০ | Weakness Detection: tag-wise wrong-ratio হিসাব + **KMeans clustering** দিয়ে "দুর্বল/মাঝারি/শক্তিশালী" টপিক গ্রুপ করা | Python (pandas, scikit-learn) |
| ১১ | Skill/Knowledge Graph: টপিকগুলোর prerequisite সম্পর্ক গ্রাফ আকারে বানানো (networkx), ইউজারের gap হাইলাইট করা | Python (networkx) + React (গ্রাফ ভিজুয়ালাইজেশন: react-flow বা vis.js) |
| ১২ | Contest Performance Prediction: সাম্প্রতিক ফর্মের ভিত্তিতে সাধারণ রিগ্রেশন মডেল (Linear Regression/Random Forest) দিয়ে সম্ভাব্য রেটিং পরিবর্তনের রেঞ্জ অনুমান করা | Python (scikit-learn) |

**AI Mentor Chat (এই মাসেই সমান্তরালে):**
```python
# python-engine/mentor.py (উদাহরণ — Claude API ব্যবহার করে)
import anthropic

def get_mentor_feedback(user_stats):
    client = anthropic.Anthropic()
    prompt = f"""
    ইউজারের গত ৭ দিনের ডেটা:
    - সলভ রেট: {user_stats['solve_rate']}
    - দুর্বল টপিক: {user_stats['weak_tags']}
    - সাম্প্রতিক রেটিং ট্রেন্ড: {user_stats['rating_trend']}

    একজন বন্ধুত্বপূর্ণ প্রতিযোগিতামূলক প্রোগ্রামিং মেন্টর হিসেবে
    ৩-৪ লাইনে গঠনমূলক পরামর্শ দাও।
    """
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.content
```

**চেকপয়েন্ট:** ড্যাশবোর্ডে "তোমার দুর্বল টপিক: DP, Graph" এবং একটা স্কিল গ্রাফ ছবি দেখা যাচ্ছে, আর মেন্টর ট্যাবে টেক্সট ফিডব্যাক আসছে।

---

### 📅 মাস ৪ — লার্নিং ও এনগেজমেন্ট ফিচার (Weeks 13–16)

**লক্ষ্য:** ইউজারকে ধরে রাখার ফিচারগুলো — Roadmap, Gamification, Spaced Repetition, Mock Contest।

| সপ্তাহ | কাজ | ভাষা/টুল |
|---|---|---|
| ১৩ | Learning Roadmap মডিউল: টপিক অনুযায়ী স্টেজ-বাই-স্টেজ প্রবলেম লিস্ট (DP, Graph, Number Theory ইত্যাদির জন্য ৩-৪টা রোডম্যাপ ম্যানুয়ালি কিউরেট করবে) + checklist UI | React + SQLite |
| ১৪ | Gamification: Streak কাউন্টার (প্রতিদিন অ্যাক্টিভিটি চেক), Badge সিস্টেম (যেমন "৭ দিন স্ট্রিক", "১০০ প্রবলেম সলভ") | Node.js |
| ১৫ | Spaced Repetition: ভুল হওয়া প্রবলেমগুলো বাড়তে থাকা ইন্টারভ্যালে (১, ৩, ৭, ১৪ দিন) আবার সাজেস্ট করা (SM-2 অ্যালগরিদমের সরলীকৃত ভার্সন) | Node.js |
| ১৬ | Mock Contest Generator: ইউজারের দুর্বল টপিক থেকে ৪-৫টা প্রবলেম বেছে টাইমার সহ প্র্যাকটিস কনটেস্ট বানানো | React + Node.js |

**Bonus (সময় থাকলে এই মাসেই):** CP রেজুমে এক্সপোর্ট — ইউজারের রেটিং, সলভ কাউন্ট, ব্যাজ দিয়ে একটা শেয়ারযোগ্য PDF জেনারেট করা (`pdf` স্কিল/লাইব্রেরি ব্যবহার করে, Node থেকে `pdfkit` বা Python `reportlab`)।

**চেকপয়েন্ট:** ইউজার রোডম্যাপ অনুসরণ করে প্রবলেম সলভ করলে checklist আপডেট হচ্ছে, স্ট্রিক বাড়ছে, এবং ভুল হওয়া প্রবলেম কিছুদিন পর আবার "রিভিশন" ট্যাবে ফিরে আসছে।

---

### 📅 মাস ৫ — কমিউনিটি, পলিশ, টেস্টিং ও ডেমো (Weeks 17–20)

**লক্ষ্য:** সোশ্যাল মডিউল, পুরো অ্যাপ পলিশ করা, টেস্টিং, ডকুমেন্টেশন, ডেমো।

| সপ্তাহ | কাজ | ভাষা/টুল |
|---|---|---|
| ১৭ | Community মডিউল: পোস্ট করা, কমেন্ট করা, নিজের ও বন্ধুর প্রোগ্রেস দেখা (peer comparison) — সাধারণ Express + SQLite CRUD API | Node.js + Express |
| ১৮ | UI/UX পলিশ: লোডিং স্টেট, এরর হ্যান্ডলিং, ডার্ক মোড, রেসপন্সিভ লেআউট, অ্যানিমেশন (Framer Motion) | React |
| ১৯ | টেস্টিং: Jest দিয়ে ইউনিট টেস্ট (recommendation logic, goal tracking), Pytest দিয়ে Python মডিউল টেস্ট, ম্যানুয়াল end-to-end টেস্ট (একাধিক real handle দিয়ে) | Jest, Pytest |
| ২০ | electron-builder দিয়ে প্যাকেজিং, ফাইনাল রিপোর্ট/ডকুমেন্টেশন লেখা, ডেমো স্ক্রিপ্ট রিহার্সেল, প্রেজেন্টেশন স্লাইড বানানো | electron-builder |

**চেকপয়েন্ট:** পুরো অ্যাপ একটা ইনস্টলযোগ্য ফাইলে (`.AppImage`/`.deb`) প্যাকেজ হয়ে যাচ্ছে এবং সব ফিচার একসাথে ডেমোতে দেখানো যাচ্ছে।

---

## ৫. ফিচার-ভিত্তিক সারসংক্ষেপ টেবিল (কোনটা কখন হবে)

| ফিচার | মাস | Status marker রিপোর্টে |
|---|---|---|
| মাল্টি-প্ল্যাটফর্ম ডেটা কালেকশন | ১ | Core |
| Dashboard / Analytics | ২ | Core |
| Daily Goal Tracking | ২ | Core |
| Rating-range Recommendation | ২ | Core |
| Contest Reminder | ২ | Core |
| Weakness Detection (ML clustering) | ৩ | AI-Enhanced |
| Skill/Knowledge Graph | ৩ | AI-Enhanced |
| Performance Prediction | ৩ | AI-Enhanced |
| AI Mentor Chat | ৩ | AI-Enhanced |
| Learning Roadmap | ৪ | Core |
| Gamification (Streak/Badge) | ৪ | AI-Enhanced (engagement) |
| Spaced Repetition | ৪ | AI-Enhanced |
| Mock Contest Generator | ৪ | AI-Enhanced |
| CP Resume Export | ৪ (bonus) | Extra |
| Community/Social Module | ৫ | Core |
| Testing, Packaging, Docs | ৫ | — |

---

## ৬. দুইজনের মধ্যে কাজ ভাগ করার সাজেশন

যেহেতু পুরো ৫ মাস ধরে কাজ চলবে, শুরু থেকেই একটা স্পষ্ট ভাগ রাখলে ভালো:

- **মেম্বার ১ (Frontend + Product দিক):** React UI, Dashboard, Roadmap UI, Gamification UI, Community UI, ডিজাইন সিদ্ধান্ত
- **মেম্বার ২ (Backend + AI দিক):** Node/Express API, ডেটা কালেকশন, Python AI ইঞ্জিন (weakness detection, prediction, mentor), ডেটাবেস

প্রতি সপ্তাহে ছোট একটা sync মিটিং (৩০ মিনিট) রাখবে যেখানে GitHub Projects বোর্ড দেখে দুইজনেই আপডেট দেবে — এতে ৫ মাস পরেও কাজ ট্র্যাকে থাকবে।

---

## ৭. গুরুত্বপূর্ণ পরামর্শ (৫ মাসের প্রজেক্টের জন্য)

- **প্রতি মাসের শেষে একটা "milestone demo"** নিজেদের মধ্যে করো — এতে বোঝা যাবে সময়মতো এগোচ্ছে কিনা।
- **README.md নিয়মিত আপডেট করো** — কোন ফিচার কবে শেষ হলো তার লগ রাখলে ফাইনাল রিপোর্ট লেখা সহজ হবে।
- **API key/secret কখনো commit করবে না** — `.env` + `.gitignore`।
- **Python ও Node আলাদা ভার্চুয়াল এনভায়রনমেন্টে রাখবে** (`venv` Python-এর জন্য) যাতে ডিপেন্ডেন্সি জট না পাকায়।
- **শেষ ২ সপ্তাহ বাফার হিসেবে রাখা হয়েছে** (২০ সপ্তাহের মধ্যে ১৮ সপ্তাহেই মূল কাজ শেষ) — অপ্রত্যাশিত bug বা exam-এর চাপ সামলানোর জন্য এই বাফার ব্যবহার করবে, একদম শেষ মুহূর্তে না ফেলে।


- __RaFiQ__: soton017964658@gmail.com / rafiq123 — Expert 1638, 884 solved.
- JAHID_UL: jahid_ul@cpmentor.local / jahid123 

can you write lab report for this project in latex file..... this project all heading text size 14 and others 12. add images or figure if needed.and also give me latex file and images an folder

oc_sk_e44672f5e994_jPXNWMF6HWHy81RdhIpfM3pMRc4vcK0A


