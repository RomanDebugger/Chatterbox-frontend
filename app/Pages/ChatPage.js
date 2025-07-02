'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRoom } from '../hooks/useRoom';
import { useRooms } from '../hooks/useRooms';
import { debounce } from 'lodash-es';

import RoomList from '../components/chat/RoomList';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import { MenuIcon } from '../components/chat/Icons';
import Sidebar from '../components/SideBar';

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeRoom, setActiveRoom] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const {
    room,
    messages = [],
    typingUsers,
    sendMessage,
    sendTyping,
    markDelivered,
    markSeen,
  } = useRoom(activeRoom);
  
  const { rooms } = useRooms(user);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (!mobile) setShowSidebar(true);
    };

    const debouncedCheck = debounce(checkMobile, 200);
    checkMobile();
    window.addEventListener('resize', debouncedCheck);
    return () => window.removeEventListener('resize', debouncedCheck);
  }, []);

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [loading, user, router]);

  useEffect(() => {
    if (!messages.length || !user) return;
    messages.forEach(msg => {
      if (
        msg.sender?._id !== user._id &&
        !(msg.deliveredTo || []).includes(user._id)
      ) {
        markDelivered(msg._id);
      }
    });
  }, [messages, user, markDelivered]);

  const handleRoomSelect = useCallback((roomId) => {
    setActiveRoom(roomId);
    if (isMobileView) setShowSidebar(false);
  }, [isMobileView]);

  const handleSend = useCallback(() => {
    if (!newMessage.trim()) return;
    sendMessage(newMessage.trim());
    setNewMessage('');
  }, [newMessage, sendMessage]);

  return (
    <div className="flex h-screen relative backdrop-blur-sm overflow-hidden">
      {(!isMobileView || showSidebar) && (
        <div className="flex flex-row w-80 bg-slate-800/80 border-r border-slate-700/50 z-30">
          <Sidebar isMobileView={isMobileView} />
          <RoomList
            rooms={rooms}
            activeRoom={activeRoom}
            isMobileView={isMobileView}
            showSidebar={showSidebar}
            onSelectRoom={handleRoomSelect}
            setShowSidebar={setShowSidebar}
          />
        </div>
      )}

     <main className="flex-1 flex flex-col">
  {isMobileView && !showSidebar && (
    <header className="px-3 py-2 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/80 space-x-3">
      <button
        onClick={() => setShowSidebar(true)}
        className="p-2 text-white hover:bg-slate-700/50 rounded-full"
      >
        <MenuIcon />
      </button>
      <Sidebar isMobileView={true} />
    </header>
  )}


        <div className="flex-1 overflow-y-auto">
          <MessageList
            messages={messages}
            user={user}
            typingUsers={typingUsers}
            markSeen={markSeen}
          />
        </div>

        {room && (
          <div className="sticky bottom-0 bg-slate-800/80 backdrop-blur-sm">
            <MessageInput
              value={newMessage}
              onChange={setNewMessage}
              onSend={handleSend}
              onTyping={sendTyping}
            />
          </div>
        )}
      </main>
    </div>
  );
}