import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import routes from './routes';
import cors from 'cors';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

// Parse JSON bodies
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://chappy-frontend.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging middleware (AFTER body parsing)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    headers: req.headers
  });
  next();
});

// Basic health check route
app.get('/health', (_, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Mount all routes under /api prefix
app.use('/api', routes);

// 404 handler - must be before error handler
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.path);
  res.status(404).json({ message: 'Not Found' });
});

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