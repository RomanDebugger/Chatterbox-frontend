import { useEffect, useState, useCallback } from 'react';
import { api } from '@/app/lib/api';
import { useSocket } from '@/app/contexts/SocketContext';
import { socketEvents } from '@/app/lib/socket';
export function useRooms(user) {
  const { socket, on, off } = useSocket();
  const [rooms, setRooms] = useState([]);

  const sortRooms = useCallback((rooms) => {
    return [...rooms].sort((a, b) => 
      new Date(b?.lastActivityAt || 0) - new Date(a?.lastActivityAt || 0)
    );
  }, []);

  const loadRooms = useCallback(async () => {
    if (!user) return;
    try {
      const { rooms } = await api.getRooms();
      setRooms(sortRooms(rooms));
    } catch (err) {
      console.error('Failed to load rooms:', err);
    }
  }, [user, sortRooms]);

  const createNewRoomWithUser = useCallback(async (username) => {
    try {
      const { users } = await api.getUserIdsByUsernames([username]);
      if (!users.length) throw new Error('User not found');
      
      const { room } = await api.createRoom(users.map(u => u._id));
      setRooms(prev => sortRooms([...prev, room]));
      return room;
    } catch (err) {
      console.error(err);
      throw err;  
    }
  }, [sortRooms]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  useEffect(() => {
    if (!socket) return;
    
    const handleMessage = (msg) => {
      setRooms(prev => sortRooms(prev.map(r => 
        r._id === msg.room ? { ...r, lastActivityAt: msg.createdAt } : r
      )));
    };

    on(socketEvents.RECEIVE_MESSAGE, handleMessage);
    return () => off(socketEvents.RECEIVE_MESSAGE, handleMessage);
  }, [socket, on, off, sortRooms]);

  return { rooms, loadRooms, createNewRoomWithUser };
}