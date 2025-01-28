import { Server } from 'socket.io';
import { verifyToken } from './middleware/auth';
import { app, httpServer } from './app';

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Rest of your socket code...

export { io };