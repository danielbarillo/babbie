// Base URLs for API and WebSocket connections
export const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Socket.IO URL (always use HTTP/HTTPS)
export const SOCKET_IO_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';