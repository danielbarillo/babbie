import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketService } from './services/WebSocketService';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/auth';
import channelRoutes from './routes/channels';
import messageRoutes from './routes/messages';
import userRoutes from './routes/users';
import dmRoutes from './routes/directMessages';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const httpServer = createServer(app);
let wsService: WebSocketService;

// Parse JSON bodies
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Rate limiting
app.use(apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dm', dmRoutes);

// Add this after other routes but before error handlers
app.get('/api/test/db', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const status = {
      mongodb: dbStatus === 1 ? 'connected' : 'disconnected',
      server: 'running'
    };
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Database connection test failed' });
  }
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and WebSocket service
export const initializeServer = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Initialize WebSocket after DB connection
    wsService = new WebSocketService(httpServer);
    console.log('WebSocket service initialized');
  } catch (err) {
    console.error('Failed to initialize server:', err);
    throw err;
  }
};

export { app, httpServer, wsService };