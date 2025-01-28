import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyToken } from '../middleware/auth';
import { Message } from '../models/Message';
import { Channel } from '../models/Channel';
import { httpServer } from '../app';

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const user = await verifyToken(token);
    socket.data.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', {
    id: socket.id,
    auth: socket.handshake.auth,
    headers: socket.handshake.headers,
  });

  // Join channel room
  socket.on('join_channel', (channelId) => {
    console.log(`User ${socket.id} joining channel: ${channelId}`);
    socket.join(channelId);
  });

  // Leave channel room
  socket.on('leave_channel', (channelId) => {
    console.log(`User ${socket.id} leaving channel: ${channelId}`);
    socket.leave(channelId);
  });

  // Handle new message
  socket.on('message', async (data) => {
    try {
      const { channelId, content, guestName } = data;
      console.log('New message:', data);

      // Verify channel exists
      const channel = await Channel.findById(channelId);
      if (!channel) {
        socket.emit('error', 'Channel not found');
        return;
      }

      // Check channel restrictions
      if (channel.isRestricted && socket.data.user.type !== 'authenticated') {
        socket.emit('error', 'Only authenticated users can send messages in restricted channels');
        return;
      }

      // Create message
      const message = new Message({
        content: content.trim(),
        channel: channelId,
        sender: socket.data.user.type === 'authenticated' ? {
          _id: socket.data.user._id,
          username: socket.data.user.username,
          type: 'authenticated'
        } : {
          type: 'guest',
          username: guestName || 'Guest'
        }
      });

      await message.save();
      console.log('Message saved:', message);

      // Broadcast to channel
      io.to(channelId).emit('message', message);
    } catch (error) {
      console.error('Socket message error:', error);
      socket.emit('error', 'Failed to send message');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

export { io };