import rateLimit from 'express-rate-limit';

export const messageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many messages sent, please try again later'
});