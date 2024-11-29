import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';
import cors from 'cors';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

app.use(express.json());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://chappy-frontend.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));

// Pre-flight requests
app.options('*', cors());

// API routes
app.use('/api', routes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    details: err
  });

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const startServer = async () => {
  try {
    await connectDB();

    if (mongoose.connection.readyState === 1) {
      const PORT = process.env.PORT || 5001;
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`MongoDB connected: ${mongoose.connection.host}`);
        console.log(`CORS origin: ${process.env.CORS_ORIGIN || 'https://chappy-frontend.onrender.com'}`);
      });
    } else {
      console.error('Failed to connect to MongoDB. Server not started.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;