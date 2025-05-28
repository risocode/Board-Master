import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export class RateLimiter {
  private static instance: RateLimiter;
  private config: RateLimitConfig;

  private constructor() {
    this.config = {
      maxRequests: 5, // Maximum 5 requests
      windowMs: 60 * 60 * 1000, // Per hour
    };
  }

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  public async checkRateLimit(identifier: string): Promise<{
    success: boolean;
    remaining: number;
    reset: number;
  }> {
    const key = `rate-limit:${identifier}`;
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    try {
      // Get all requests in the current window
      const requests = await redis.zrangebyscore(key, windowStart, now);
      
      // Count requests
      const requestCount = requests.length;

      if (requestCount >= this.config.maxRequests) {
        return {
          success: false,
          remaining: 0,
          reset: windowStart + this.config.windowMs,
        };
      }

      // Add new request
      await redis.zadd(key, now, now.toString());
      // Set expiry on the key
      await redis.expire(key, Math.ceil(this.config.windowMs / 1000));

      return {
        success: true,
        remaining: this.config.maxRequests - (requestCount + 1),
        reset: windowStart + this.config.windowMs,
      };
    } catch (error) {
      console.error('Rate limit check failed:', error);
      // Fail open in case of Redis errors
      return {
        success: true,
        remaining: this.config.maxRequests,
        reset: now + this.config.windowMs,
      };
    }
  }
}

// Helper function to get client IP
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return 'unknown';
}

// Helper function to generate a unique identifier for rate limiting
export function generateRateLimitKey(request: Request): string {
  const ip = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  return `${ip}:${userAgent}`;
} 