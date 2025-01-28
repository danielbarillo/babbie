import { io } from './socket';
import { Message } from '../models/Message';

export const setupSocketEvents = () => {
  io.on('connection', (socket) => {
    const user = socket.data.user;

    // Join user's room
    socket.join(user._id.toString());

    // Handle user status
    socket.on('status_change', async (status) => {
      io.emit('user_status', {
        userId: user._id,
        status
      });
    });

    // Handle messages
    socket.on('message', async (message) => {
      io.to(message.channelId).emit('message', message);
    });

    // Handle direct messages
    socket.on('direct_message', async (message) => {
      io.to(message.recipient._id).emit('direct_message', message);
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      socket.to(data.channelId).emit('typing', {
        userId: user._id,
        username: user.username,
        channelId: data.channelId
      });
    });

    socket.on('disconnect', () => {
      io.emit('user_status', {
        userId: user._id,
        status: 'offline'
      });
    });
  });
};