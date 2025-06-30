import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '@/app/lib/api';
import { useSocket } from '@/app/contexts/SocketContext';
import { socketEvents } from '@/app/lib/socket';

export function useRoom(roomId) {
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const prevRoomId = useRef(null);
  const typingTimeout = useRef(null);
  const { socket, emit, on, off } = useSocket();

  const loadRoomData = useCallback(async () => {
    try {
      const [roomData, messagesData] = await Promise.all([
        api.getRooms(roomId),
        api.getMessages(roomId),
      ]);
      
      setRoom(roomData);
      setMessages(Array.isArray(messagesData?.messages) ? messagesData.messages : []);
    } catch (err) {
      console.error('Failed to load room:', err);
    }
  }, [roomId]);

  const handleStatusUpdate = useCallback(({ messageId, userId, type }) => {
    setMessages(prev => prev.map(msg => 
      msg._id === messageId ? {
        ...msg,
        deliveredTo: type === 'delivered' 
          ? [...new Set([...(msg.deliveredTo || []), userId])]
          : msg.deliveredTo,
        seenBy: type === 'seen'
          ? [...new Set([...(msg.seenBy || []), userId])]
          : msg.seenBy
      } : msg
    ));
  }, []);

  // Socket event handlers
  const handleNewMessage = useCallback((message) => {
    setMessages(prev => [...prev.slice(-99), message]);
  }, []);

  const handleTypingEvent = useCallback(({ userId, username }) => {
    setTypingUsers(prev => 
      prev.some(u => u.userId === userId) 
        ? prev 
        : [...prev, { userId, username }]
    );
  }, []);

  const handleStopTyping = useCallback(({ userId }) => {
    setTypingUsers(prev => prev.filter(u => u.userId !== userId));
  }, []);

  useEffect(() => {
    if (roomId) loadRoomData();
  }, [roomId, loadRoomData]);

  useEffect(() => {
    if (!socket || !roomId) return;

    // Room switching logic
    if (prevRoomId.current !== roomId) {
      if (prevRoomId.current) {
        emit(socketEvents.LEAVE_ROOM, prevRoomId.current);
      }
      emit(socketEvents.JOIN_ROOM, roomId);
      prevRoomId.current = roomId;
    }

    // Event listeners
    const handlers = {
      [socketEvents.RECEIVE_MESSAGE]: handleNewMessage,
      [socketEvents.TYPING]: handleTypingEvent,
      [socketEvents.STOP_TYPING]: handleStopTyping,
      [socketEvents.MESSAGE_DELIVERED]: (data) => handleStatusUpdate({ ...data, type: 'delivered' }),
      [socketEvents.MESSAGE_SEEN]: (data) => handleStatusUpdate({ ...data, type: 'seen' })
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      on(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        off(event, handler);
      });
      if (roomId) emit(socketEvents.LEAVE_ROOM, roomId);
    };
  }, [socket, roomId, emit, on, off, handleNewMessage, handleTypingEvent, handleStopTyping, handleStatusUpdate]);

  const sendMessage = useCallback((content) => {
    if (socket && roomId) {
      emit(socketEvents.SEND_MESSAGE, { roomId, content });
    }
  }, [socket, roomId, emit]);

  const sendTyping = useCallback(() => {
    if (!socket || !roomId) return;
    emit(socketEvents.TYPING, roomId);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      emit(socketEvents.STOP_TYPING, roomId);
    }, 2000);
  }, [socket, roomId, emit]);

  return {
    room,
    messages,
    typingUsers,
    sendMessage,
    sendTyping,
    markDelivered: useCallback((messageId) => {
      if (socket && roomId) emit(socketEvents.MESSAGE_DELIVERED, { roomId, messageId });
    }, [socket, roomId, emit]),
    markSeen: useCallback((messageId) => {
      if (socket && roomId) emit(socketEvents.MESSAGE_SEEN, { roomId, messageId });
    }, [socket, roomId, emit])
  };
}