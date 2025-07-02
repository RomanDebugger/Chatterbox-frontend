import { io } from 'socket.io-client';
import { SOCKET_URL } from './constants';

let socket = null;

export const initializeSocket = (token) => {
  if (socket) {
    if (socket.auth.token === token) {
      return socket;
    }
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    auth: { token },
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });


  socket.on('disconnect', (reason) => console.warn('⚠️ Socket disconnected:', reason));
  socket.on('connect_error', (err) => console.error('❌ Socket connection error:', err.message));
  socket.on('reconnect_failed', () => console.error('❌ Reconnect failed'));

  return socket;
};

export const getSocket = () => {
  if (!socket) throw new Error('Socket not initialized');
  return socket;
};

export const destroySocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const socketEvents = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',

  // Client → Server
  CREATE_ROOM: 'create-room',
  JOIN_ROOM: 'join-room',
  SEND_MESSAGE: 'send-message',
  TYPING: 'typing',
  STOP_TYPING: 'stop-typing',
  MESSAGE_DELIVERED: 'message-delivered',
  MESSAGE_SEEN: 'message-seen',
  LEAVE_ROOM: 'leave-room',

  // Server → Client
  NEW_ROOM: 'new-room',
  RECEIVE_MESSAGE: 'receive-message',
  MESSAGE_DELIVERED: 'message-delivered',
  MESSAGE_SEEN: 'message-seen',
};

