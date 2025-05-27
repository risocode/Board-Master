import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clerkMiddleware } from "@clerk/nextjs/server";

// Simple in-memory store for rate limiting
const ipRequestCounts = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // Maximum requests per window

function customSecurityMiddleware(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';
  const now = Date.now();

  // Rate limiting
  const requestData = ipRequestCounts.get(ip);
  if (requestData) {
    if (now - requestData.timestamp > RATE_LIMIT_WINDOW) {
      // Reset if window has passed
      ipRequestCounts.set(ip, { count: 1, timestamp: now });
    } else if (requestData.count >= MAX_REQUESTS) {
      // Rate limit exceeded
      return new NextResponse('Too Many Requests', { status: 429 });
    } else {
      // Increment count
      requestData.count++;
      ipRequestCounts.set(ip, requestData);
    }
  } else {
    // First request from this IP
    ipRequestCounts.set(ip, { count: 1, timestamp: now });
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Cache control for static assets
  if (request.nextUrl.pathname.startsWith('/_next/static')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return response;
}

export default clerkMiddleware((auth, request) => {
  // After Clerk runs, run your custom security logic
  return customSecurityMiddleware(request);
});

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and Clerk auth routes
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)|sign-in|sign-up).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};