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
export default function ChatPage() {
  // Auth and state
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeRoom, setActiveRoom] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Data hooks
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

  // Responsive layout
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

  // Auth guard
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


  // Handlers
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
    <div className="flex h-screen relative backdrop-blur-sm">
      {/* Sidebar - unchanged */}
      <RoomList 
        rooms={rooms}
        activeRoom={activeRoom}
        isMobileView={isMobileView}
        showSidebar={showSidebar}
        onSelectRoom={handleRoomSelect}
        onCloseSidebar={() => setShowSidebar(false)}
      />
      
      {/* Main content area - fixed structure */}
      <main className="flex-1 flex flex-col">
        {/* Header for mobile */}
        {isMobileView && !showSidebar && (
          <header className="p-3 border-b border-slate-700/50 flex items-center bg-slate-800/80">
            <button 
              onClick={() => setShowSidebar(true)}
              className="p-2 mr-2 text-white hover:bg-slate-700/50 rounded-full"
            >
              <MenuIcon />
            </button>
            <h2 className="font-bold text-white truncate">
              {room?.name || 'Select conversation'}
            </h2>
          </header>
        )}
        
        {/* Scrollable message area */}
        <div className="flex-1 overflow-y-auto">
          <MessageList 
            messages={messages}
            user={user}
            typingUsers={typingUsers}
            markSeen={markSeen}
            room={room}
            isMobileView={isMobileView}
            onOpenSidebar={() => setShowSidebar(true)}
          />

        </div>
        
        {/* Fixed input at bottom */}
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