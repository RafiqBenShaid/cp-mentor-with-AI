import type { BadgeDefinition, Prediction, SolveStat, TagStat, UserProfile } from '../types'

export interface ResumeData {
  profile: UserProfile
  statistics: SolveStat[]
  tagStats: TagStat[]
  badges: BadgeDefinition[]
  prediction: Prediction
  streak: number
  longestStreak: number
}

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildResumeHtml(data: ResumeData): string {
  const { profile, statistics, tagStats, badges, prediction, streak, longestStreak } = data
  const totalSolved = statistics.reduce((sum, s) => sum + s.solved, 0)
  const strongTags = [...tagStats].sort((a, b) => b.ratio - a.ratio).slice(0, 4)
  const weakTags = [...tagStats].sort((a, b) => a.ratio - b.ratio).slice(0, 4)

  const platformRows = statistics
    .map(
      (s) => `<tr>
        <td>${esc(s.label)}</td>
        <td class="num">${s.solved}</td>
        <td><div class="bar"><span style="width:${Math.min(100, (s.solved / Math.max(1, totalSolved)) * 100)}%"></span></div></td>
      </tr>`,
    )
    .join('')

  const badgeItems = badges
    .map((b) => `<span class="badge">${b.icon} ${esc(b.name)}</span>`)
    .join('')

  const tagItems = (tags: TagStat[]) =>
    tags
      .map((t) => `<span class="tag">${esc(t.tag)} <b>${Math.round(t.ratio * 100)}%</b></span>`)
      .join('')

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(profile.name)} — CP Resume</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 40px; color: #0f172a; background: #f8fafc; }
  .sheet { max-width: 820px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(15,23,42,.08); }
  h1 { margin: 0; font-size: 32px; }
  .sub { color: #64748b; margin-top: 4px; }
  .handles { color: #4f46e5; font-size: 13px; margin-top: 6px; }
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 24px 0; }
  .stat { background: #f1f5f9; border-radius: 12px; padding: 14px; }
  .stat .label { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #64748b; }
  .stat .value { font-size: 24px; font-weight: 700; margin-top: 4px; }
  h2 { font-size: 15px; text-transform: uppercase; letter-spacing: .08em; color: #475569; margin: 26px 0 10px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  td { padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
  td.num { font-weight: 700; width: 60px; text-align: right; }
  .bar { background: #e2e8f0; height: 8px; border-radius: 99px; overflow: hidden; width: 100%; }
  .bar span { display: block; height: 100%; background: #6366f1; border-radius: 99px; }
  .badge { display: inline-block; background: #eef2ff; color: #4338ca; border-radius: 99px; padding: 5px 12px; font-size: 12px; margin: 0 6px 6px 0; }
  .tag { display: inline-block; background: #f1f5f9; border-radius: 8px; padding: 5px 10px; font-size: 12px; margin: 0 6px 6px 0; }
  .two { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .prediction { background: linear-gradient(135deg, #eef2ff, #ecfeff); border-radius: 12px; padding: 16px; font-size: 14px; }
  .prediction b { font-size: 22px; color: #4338ca; }
  .footer { margin-top: 28px; font-size: 11px; color: #94a3b8; text-align: center; }
  @media print { body { background: #fff; padding: 0; } .sheet { box-shadow: none; border-radius: 0; } }
</style>
</head>
<body>
  <div class="sheet">
    <h1>${esc(profile.name)}</h1>
    <div class="sub">Competitive Programmer · ${esc(profile.cf_handle)} / ${esc(profile.atcoder_handle)}</div>
    <div class="handles">Codeforces: ${esc(profile.cf_handle)} · AtCoder: ${esc(profile.atcoder_handle)} · LeetCode: ${esc(profile.leetcode_handle)}</div>

    <div class="stats">
      <div class="stat"><div class="label">Rating</div><div class="value">${profile.current_rating}</div></div>
      <div class="stat"><div class="label">Solved</div><div class="value">${totalSolved}</div></div>
      <div class="stat"><div class="label">Streak</div><div class="value">${streak}d</div></div>
      <div class="stat"><div class="label">Best Streak</div><div class="value">${longestStreak}d</div></div>
    </div>

    <div class="two">
      <div>
        <h2>Platform Breakdown</h2>
        <table><tbody>${platformRows}</tbody></table>
      </div>
      <div>
        <h2>Rating Outlook</h2>
        <div class="prediction">
          Projected next rating: <b>${prediction.predictedRating}</b><br/>
          Likely range: ${prediction.low} – ${prediction.high}<br/>
          Trend: ${prediction.slope >= 0 ? '+' : ''}${prediction.slope} / contest · consistency ${prediction.consistency}%
        </div>
      </div>
    </div>

    <div class="two">
      <div>
        <h2>Strengths</h2>
        ${tagItems(strongTags)}
      </div>
      <div>
        <h2>Focus Areas</h2>
        ${tagItems(weakTags)}
      </div>
    </div>

    <h2>Achievements</h2>
    <div>${badgeItems || '<span class="sub">No badges yet — keep solving!</span>'}</div>

    <div class="footer">Generated by CP Mentor Hub · ${new Date().toLocaleDateString()}</div>
  </div>
</body>
</html>`
}
