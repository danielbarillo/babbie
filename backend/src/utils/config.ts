interface Config {
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  CORS_ORIGIN: string;
  NODE_ENV: 'development' | 'production';
}

function validateConfig(): Config {
  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return {
    PORT: parseInt(process.env.PORT || '5001', 10),
    MONGODB_URI: process.env.MONGODB_URI!,
    JWT_SECRET: process.env.JWT_SECRET!,
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
    NODE_ENV: (process.env.NODE_ENV as Config['NODE_ENV']) || 'development'
  };
}

export const config = validateConfig();