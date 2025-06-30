'use client';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useRoom } from '../hooks/useRoom';
import { useRooms } from '../hooks/useRooms';
import React from 'react';

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeRoom, setActiveRoom] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  
  const messagesEndRef = useRef(null);
  const roomsContainerRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const [isMobileView, setIsMobileView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
  const checkMobile = () => {
    setIsMobileView(window.innerWidth < 768); 
    if (window.innerWidth >= 768) setShowSidebar(true);
  };
  
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);

  const { room, messages = [], typingUsers, sendMessage, sendTyping } = useRoom(activeRoom);
  const { rooms, loadRooms, createNewRoomWithUser } = useRooms(user);

  const sortedRooms = useMemo(() => {
    return [...rooms].sort((a, b) => 
      new Date(b?.lastActivityAt || 0) - new Date(a?.lastActivityAt || 0)
    );
  }, [rooms]);

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom('auto');
    }
  }, [activeRoom, messages, scrollToBottom]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [loading, user, router]);

  const handleSend = useCallback(() => {
    if (!newMessage.trim()) return;
    sendMessage(newMessage.trim());
    setNewMessage('');
    setTimeout(() => scrollToBottom('smooth'), 0);
  }, [newMessage, sendMessage, scrollToBottom]);

  const handleRoomSelect = useCallback((roomId) => {
  setActiveRoom(roomId);
  if (isMobileView) setShowSidebar(false);
}, [isMobileView]);

  const handleNewChat = useCallback(async () => {
    const username = prompt('Enter username to chat with:');
    if (!username) return;
    const room = await createNewRoomWithUser(username);
    if (room) {
      setActiveRoom(room._id);
      setTimeout(() => {
        roomsContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [createNewRoomWithUser]);

  useEffect(() => {
    const handler = () => handleNewChat();
    window.addEventListener('newChatTriggered', handler);
    return () => window.removeEventListener('newChatTriggered', handler);
  }, [handleNewChat]);

  return (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      {showSidebar && (
    <div className={`${isMobileView ? 'fixed inset-0 z-20 w-3/4' : 'w-80'} 
      bg-slate-800/90 backdrop-blur-md border-r border-slate-700/50 flex flex-col
      transition-transform duration-300 ease-in-out
      ${!showSidebar && isMobileView ? '-translate-x-full' : ''}`}>
        <div className="p-4 border-b border-slate-700/50">
          <h2 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
            Conversations
          </h2>
        </div>
        
        {/* Room list */}
        <div className="flex-1 overflow-y-auto" ref={roomsContainerRef}>
          {sortedRooms.map(r => (
            <RoomItem 
              key={r._id}
              room={r}
              isActive={activeRoom === r._id}
              onClick={() => handleRoomSelect(r._id)}
            />
          ))}
        </div>
      </div>)}

      {isMobileView && showSidebar && (
    <div 
      className="fixed inset-0 bg-black/50 z-10"
      onClick={() => setShowSidebar(false)}
    />
  )}

      {/* Chat area */}
      <div className={`flex-1 flex flex-col bg-slate-800/30 backdrop-blur-sm
    ${isMobileView ? 'w-full' : ''}`}>
        {isMobileView && !showSidebar && (
        <div className="p-2 border-b border-slate-700/50 flex items-center">
          <button 
            onClick={() => setShowSidebar(true)}
            className="p-2 mr-2 text-white"
          >
            ≡
          </button>
          <h2 className="font-bold text-white">
            {room ? (room.name || 'Chat') : 'Select conversation'}
          </h2>
        </div>
      )}
        {/* Messages container */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-4" 
          ref={messagesContainerRef}
        >
          {messages.map((msg, idx) => (
            <Message 
              key={msg._id}
              msg={msg}
              isMine={user && msg.sender?._id === user._id}
              isSystem={msg.system}
              isLast={idx === messages.length - 1}
              innerRef={idx === messages.length - 1 ? messagesEndRef : null}
            />
          ))}
        </div>

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <TypingIndicator typingUsers={typingUsers} />
        )}

        {/* Message input */}
        {room && (
          <MessageInput
            value={newMessage}
            onChange={setNewMessage}
            onSend={handleSend}
            onTyping={sendTyping}
          />
        )}
      </div>
    </div>
  );
}
const RoomItem = React.memo(({ room, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`p-3 border-b border-slate-700/50 hover:bg-slate-700/30 cursor-pointer transition-colors ${
      isActive ? 'bg-slate-700/30' : ''
    }`}
  >
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 flex items-center justify-center text-white font-bold mr-3">
        {(room.name || 'R').charAt(0).toUpperCase()}
      </div>
      <div className="text-white truncate">
        {room.name || room.participants.map(p => p.username).join(', ')}
      </div>
    </div>
  </div>
));

const Message = React.memo(({ msg, isMine, isSystem, isLast, innerRef }) => (
  <div
    ref={innerRef}
    className={`flex ${
      isSystem ? 'justify-center' : isMine ? 'justify-end' : 'justify-start'
    }`}
  >
    <div
      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isSystem
          ? 'bg-slate-600 text-white'
          : isMine
          ? 'bg-gradient-to-r from-amber-400 to-rose-400 text-black'
          : 'bg-slate-700/50 text-white'
      }`}
    >
      <span className="font-semibold">
        {isSystem ? 'System' : msg.sender?.username || 'unknown user'}
      </span>
      <p>{msg.content}</p>
      <p className="text-xs opacity-70 text-right mt-1">
        {new Date(msg.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
    </div>
  </div>
));

const TypingIndicator = React.memo(({ typingUsers }) => (
  <div className="p-2 text-sm text-slate-300 italic">
    {typingUsers.length === 1
      ? `${typingUsers[0].username} is typing...`
      : `${typingUsers.map(u => u.username).join(', ')} are typing...`}
  </div>
));

const MessageInput = React.memo(({ value, onChange, onSend, onTyping }) => (
  <div className="p-4 border-t border-slate-700/50">
    <div className="flex items-center bg-slate-700/50 rounded-lg p-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          onTyping();
          if (e.key === 'Enter') onSend();
        }}
        placeholder="Type a message..."
        className="flex-1 bg-transparent text-white px-3 py-2 outline-none"
      />
      <button
        onClick={onSend}
        className="p-2 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 text-white hover:shadow-md transition-all"
      >
        ↑
      </button>
    </div>
  </div>
));