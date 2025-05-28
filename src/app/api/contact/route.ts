import { NextResponse } from 'next/server';
import { RateLimiter, generateRateLimitKey } from '@/lib/rateLimiter';
import { isValidEmail } from '@/lib/utils';

// Honeypot field name
const HONEYPOT_FIELD = 'website';

export async function POST(request: Request) {
  try {
    // Check rate limit
    const rateLimiter = RateLimiter.getInstance();
    const rateLimitKey = generateRateLimitKey(request);
    const rateLimitResult = await rateLimiter.checkRateLimit(rateLimitKey);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          reset: rateLimitResult.reset,
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Check honeypot
    if (body[HONEYPOT_FIELD]) {
      // Silently reject spam
      return NextResponse.json({ success: true });
    }

    // Validate required fields
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length < 10 || message.length > 1000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 1000 characters' },
        { status: 400 }
      );
    }

    // Here you would typically send the email or store the message
    // For example, using a service like SendGrid, AWS SES, etc.
    
    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      remaining: rateLimitResult.remaining,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 