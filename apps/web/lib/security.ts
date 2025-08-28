import { createHash, randomBytes } from "crypto"
import { headers } from "next/headers"

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
}

export async function rateLimit(identifier: string, config: RateLimitConfig): Promise<boolean> {
  const now = Date.now()
  const key = `rate_limit:${identifier}`

  const current = rateLimitStore.get(key)

  if (!current || now > current.resetTime) {
    // Reset or initialize
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return true
  }

  if (current.count >= config.maxRequests) {
    return false
  }

  current.count++
  return true
}

export function getClientIP(): string {
  const headersList = headers()
  return (
    headersList.get("x-forwarded-for")?.split(",")[0] ||
    headersList.get("x-real-ip") ||
    headersList.get("cf-connecting-ip") ||
    "unknown"
  )
}

export function getUserAgent(): string {
  const headersList = headers()
  return headersList.get("user-agent") || "unknown"
}

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || randomBytes(32).toString("hex")
  const hash = createHash("sha256")
    .update(password + actualSalt)
    .digest("hex")

  return { hash, salt: actualSalt }
}

function timingSafeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i]
  }

  return result === 0
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const { hash: computedHash } = hashPassword(password, salt)
  return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(computedHash, "hex"))
}

export function generateSecureToken(length = 32): string {
  return randomBytes(length).toString("hex")
}

export function validateInput(input: string, type: "email" | "password" | "name" | "url"): boolean {
  switch (type) {
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
    case "password":
      return input.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(input)
    case "name":
      return input.length >= 1 && input.length <= 100 && /^[a-zA-Z0-9\s\-_]+$/.test(input)
    case "url":
      try {
        new URL(input)
        return true
      } catch {
        return false
      }
    default:
      return false
  }
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/['"]/g, "") // Remove quotes
    .trim()
}

export interface SecurityEvent {
  type: "failed_login" | "suspicious_activity" | "rate_limit_exceeded" | "unauthorized_access"
  severity: "low" | "medium" | "high" | "critical"
  details: Record<string, any>
  ip?: string
  userAgent?: string
  userId?: string
}

export async function logSecurityEvent(event: SecurityEvent) {
  // In production, send to security monitoring service
  console.warn(`[SECURITY] ${event.type}:`, {
    severity: event.severity,
    details: event.details,
    ip: event.ip,
    userAgent: event.userAgent,
    userId: event.userId,
    timestamp: new Date().toISOString(),
  })

  // Could integrate with services like:
  // - Sentry for error tracking
  // - DataDog for monitoring
  // - Custom webhook for alerts
}
