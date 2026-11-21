import { computeWeaknesses, allTags } from './recommend'
import { predictPerformance } from './analytics'
import { ratingHistory, tagStats } from '../data/mock'
import type { RatingPoint, TagStat } from '../types'

export function buildMentorReply(
  userMessage: string,
  history: RatingPoint[] = ratingHistory,
  stats: TagStat[] = tagStats,
): string {
  const weak = computeWeaknesses(stats)
  const weakest = weak.filter((w) => w.level === 'weak')
  const prediction = predictPerformance(history)
  const msg = userMessage.toLowerCase()

  if (msg.includes('weak') || msg.includes('durbol') || msg.includes('improve') || msg.includes('focus')) {
    if (weakest.length === 0) {
      return "You're actually doing great — no clear weak spots in your tag breakdown right now. Keep maintaining that balance and start pushing toward 1500+ rated problems."
    }
    const list = weakest.map((w) => w.tag).join(', ')
    return `Your weakest topics right now are: ${list}. I'd suggest spending the next 3-4 days drilling these at rating 1200-1400 before moving up. Open the Skill Graph tab to see the prerequisite gaps behind them, and queue a few problems in Revision.`
  }

  if (msg.includes('rating') || msg.includes('predict') || msg.includes('will')) {
    return `Based on your last ${history.length} contests, your rating trend is ${prediction.slope >= 0 ? 'climbing' : 'slipping'} at about ${Math.abs(prediction.slope)} points per contest. My projection for your next contest is ${prediction.predictedRating} (likely range ${prediction.low}–${prediction.high}). Keep fixing your weakest tags and you'll keep climbing.`
  }

  if (msg.includes('plan') || msg.includes('today') || msg.includes('schedule') || msg.includes('practice')) {
    return `Here's today's recommended plan:\n1. Solve 2-3 problems in the 1200-1400 range (focus on your weak tags).\n2. Review 1-2 due problems in the Revision tab.\n3. Run a 90-minute mock contest from your weak topics.\nYou can set this as a daily goal from the Goals tab!`
  }

  if (msg.includes('contest') || msg.includes('mock')) {
    return `Mock contests are the fastest way to simulate pressure. Open Mock Contest, pick your weak topics, and choose 90 minutes with 4 problems. After finishing, add every problem you missed to the Revision queue.`
  }

  return `Got it. I'll help you improve as a competitive programmer. You can ask me about your weaknesses, rating predictions, revision plans, or mock contests. What would you like to work on today?`
}

export function generateSuggestedPrompts(): string[] {
  return [
    'What are my weakest topics?',
    'Predict my next rating change',
    'Give me a practice plan for today',
    'How should I use mock contests?',
  ]
}

export const TAG_CHOICES = allTags()
