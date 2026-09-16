// Simple in-memory rate limiter for serverless environments.
// Note: On Vercel, this state resets on cold starts. For strict rate limiting across instances, use Redis (e.g. @upstash/ratelimit).

type RateLimitStore = {
  count: number
  lastReset: number
}

const store = new Map<string, RateLimitStore>()

const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS = 5 // 5 requests per window

export function rateLimit(identifier: string): { success: boolean, retryAfter: number } {
  const now = Date.now()
  const record = store.get(identifier)

  if (!record) {
    store.set(identifier, { count: 1, lastReset: now })
    return { success: true, retryAfter: 0 }
  }

  if (now - record.lastReset > WINDOW_MS) {
    store.set(identifier, { count: 1, lastReset: now })
    return { success: true, retryAfter: 0 }
  }

  if (record.count >= MAX_REQUESTS) {
    return { success: false, retryAfter: Math.ceil((WINDOW_MS - (now - record.lastReset)) / 1000) }
  }

  record.count += 1
  return { success: true, retryAfter: 0 }
}
