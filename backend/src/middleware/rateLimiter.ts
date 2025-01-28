import rateLimit from 'express-rate-limit';

export const messageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 messages per minute
  message: 'Too many messages sent, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200, // Limit each IP to 200 requests per minute
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Special limiter for status updates
export const statusLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 10, // Limit each IP to 10 status updates per 10 seconds
  message: 'Too many status updates, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});