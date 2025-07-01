'use client';
import React from 'react';

const Message = React.memo(function Message({ msg, isMine, isSystem }) {
  const timeString = new Date(msg.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Calculate status based on message properties
  const getStatus = () => {
    if (!isMine || isSystem) return null;
    
    if (msg.seenBy && msg.seenBy.length > 0) {
      return '👀 Seen';
    } else if (msg.deliveredTo && msg.deliveredTo.length > 0) {
      return '✓✓ Delivered';
    }
    return '✓ Sent';
  };

  const status = getStatus();

  return (
    <div
      className={`flex ${
        isSystem ? 'justify-center' : isMine ? 'justify-end' : 'justify-start'
      }`}
      data-msg-id={msg._id}
      data-seen-by={JSON.stringify(msg.seenBy || [])}
    >
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isSystem
          ? 'bg-slate-600 text-white'
          : isMine
          ? 'bg-gradient-to-r from-amber-400 to-rose-400 text-black'
          : 'bg-slate-700/50 text-white'
      }`}>
        <span className="font-semibold">
          {isSystem ? 'System' : msg.sender?.username || 'unknown user'}
        </span>
        <p>{msg.content}</p>
        <p className="text-xs opacity-70 text-right mt-1">
          {timeString}
        </p>
        {status && (
          <p className="text-[10px] text-right mt-1">
            {status}
          </p>
        )}
      </div>
    </div>
  );
});

export default Message;