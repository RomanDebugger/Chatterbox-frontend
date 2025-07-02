'use client';
import { useCallback } from 'react';

export default function MessageInput({ value, onChange, onSend, onTyping }) {
  const handleKeyDown = useCallback((e) => {
    onTyping();
    if (e.key === 'Enter') onSend();
  }, [onTyping, onSend]);

  return (
    <div className="p-3 sm:p-4 border-t border-slate-700/50 bg-slate-800/80 sticky">
      <div className="flex items-center bg-slate-700/50 rounded-lg px-2 sm:px-3 py-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-transparent text-white px-3 py-2 outline-none"
          aria-label="Type your message"
        />
        <button
          onClick={onSend}
          className="p-2 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 text-white hover:shadow-md transition-all"
          aria-label="Send message"
        >
          ↑
        </button>
      </div>
    </div>
  );
}