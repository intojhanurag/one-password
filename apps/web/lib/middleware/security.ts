import { type NextRequest, NextResponse } from "next/server"
import { rateLimit, getClientIP, logSecurityEvent } from "@/lib/security"

export async function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add security headers
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  // HSTS for HTTPS
  if (request.nextUrl.protocol === "https:") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
  }

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = getClientIP()
    const isAllowed = await rateLimit(ip, {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100, // 100 requests per 15 minutes
    })

    if (!isAllowed) {
      await logSecurityEvent({
        type: "rate_limit_exceeded",
        severity: "medium",
        details: {
          path: request.nextUrl.pathname,
          method: request.method,
        },
        ip,
      })

      return new NextResponse("Rate limit exceeded", { status: 429 })
    }
  }

  // Enhanced rate limiting for sensitive endpoints
  const sensitiveEndpoints = ["/api/keys", "/api/auth", "/api/decrypt"]
  if (sensitiveEndpoints.some((endpoint) => request.nextUrl.pathname.startsWith(endpoint))) {
    const ip = getClientIP()
    const isAllowed = await rateLimit(`sensitive:${ip}`, {
      windowMs: 5 * 60 * 1000, // 5 minutes
      maxRequests: 20, // 20 requests per 5 minutes
    })

    if (!isAllowed) {
      await logSecurityEvent({
        type: "rate_limit_exceeded",
        severity: "high",
        details: {
          path: request.nextUrl.pathname,
          method: request.method,
          endpoint_type: "sensitive",
        },
        ip,
      })

      return new NextResponse("Rate limit exceeded for sensitive endpoint", { status: 429 })
    }
  }

  return response
}
