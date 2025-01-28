import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI must be defined in environment variables');
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables');
}

export const config = {
  port: process.env.PORT || 5001,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
  nodeEnv: process.env.NODE_ENV || 'development'
} as const;

// Add type for the config
export type Config = typeof config;