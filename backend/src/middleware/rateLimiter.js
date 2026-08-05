import rateLimit from 'express-rate-limit';

// Limit 30 failed login attempts per 15 minutes per IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 attempts per 15 minutes
  message: {
    error: 'Too many login attempts',
    message: 'Too many login attempts from this network. Please try again after a few minutes.'
  },
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limiter - 500 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    error: 'Rate limit exceeded',
    message: 'Too many requests from this network. Please try again in a few moments.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
