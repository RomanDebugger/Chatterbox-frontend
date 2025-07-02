'use client';
import { useEffect, useRef } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import { debounce } from 'lodash-es';

export default function MessageList({ 
  messages, 
  user, 
  typingUsers, 
  markSeen
}) {
  const messagesEndRef = useRef(null);
  const listRef = useRef();
  const seenBuffer = useRef(new Set());
  const debouncedFlushSeen = useRef();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    debouncedFlushSeen.current = debounce(() => {
      const ids = Array.from(seenBuffer.current);
      if (ids.length > 0) {
        markSeen(ids);
        seenBuffer.current.clear();
      }
    }, 400); 

    return () => debouncedFlushSeen.current.cancel?.();
  }, [markSeen]);

  useEffect(() => {
    if (!listRef.current || !user) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        const seenBy = JSON.parse(el.getAttribute('data-seen-by') || '[]');
        const msgId = el.getAttribute('data-msg-id');

        if (entry.isIntersecting && msgId && !seenBy.includes(user._id)) {
          seenBuffer.current.add(msgId);
          debouncedFlushSeen.current?.();
        }
      });
    }, { threshold: 1 });

    const messageEls = listRef.current.querySelectorAll('[data-msg-id]');
    messageEls.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [messages, user]);

  return (
    <div className="flex-1 flex flex-col">
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={listRef}>
        {messages.map(msg => (
          <Message 
            key={msg._id}
            msg={msg}
            isMine={user?._id === msg.sender?._id}
            isSystem={msg.system}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {typingUsers.length > 0 && <TypingIndicator typingUsers={typingUsers} />}
    </div>
  );
}
