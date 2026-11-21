export const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '')
export const AI_BASE = (import.meta.env.VITE_AI_URL || 'http://localhost:8000').replace(/\/$/, '')

export type HealthState = 'checking' | 'online' | 'offline'

export interface ServiceHealth {
  state: HealthState
  detail: string
}

async function ping(url: string): Promise<ServiceHealth> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 2500)
  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) return { state: 'offline', detail: `HTTP ${response.status}` }
    const data = (await response.json()) as { service?: string }
    return { state: 'online', detail: data.service || 'running' }
  } catch {
    return { state: 'offline', detail: 'not reachable' }
  } finally {
    clearTimeout(timer)
  }
}

export function checkApiHealth(): Promise<ServiceHealth> {
  return ping(`${API_BASE}/api/health`)
}

export function checkAiHealth(): Promise<ServiceHealth> {
  return ping(`${AI_BASE}/health`)
}
