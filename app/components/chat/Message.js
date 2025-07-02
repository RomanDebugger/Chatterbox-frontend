'use client';
import React from 'react';

const Message = React.memo(function Message({ msg, isMine, isSystem }) {
  const timeString = new Date(msg.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  const getStatus = () => {
    if (!isMine || isSystem) return null;
    
    if (msg.seenBy && msg.seenBy.length > 0) {
      return '👀';
    } else if (msg.deliveredTo && msg.deliveredTo.length > 0) {
      return '✓✓';
    }
    return '✓';
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
      <div className={`max-w-[50%] sm:max-w-[20px] md:max-w-sm lg:max-w-md px-4 py-2 rounded-lg ${
        isSystem
          ? 'bg-slate-600 text-white'
          : isMine
          ? 'bg-gradient-to-r from-amber-400 to-rose-400 text-black'
          : 'bg-slate-700/50 text-white'
      }`}>

        {!isMine && !isSystem && (
          <span className="font-semibold block">
            {msg.sender?.username || 'unknown user'}
          </span>
        )}
        {isSystem && (
          <span className="font-semibold block">
            System
          </span>
        )}

        <p className={`${isMine ? 'text-right' : 'text-left'}`}>
          {msg.content}
        </p>

        <div className="flex justify-end">
          <p className="text-xs opacity-70 mt-1 mr-1">
            {timeString}
          </p>
          {status && (
            <p className="text-[10px] mt-1">
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

export default Message;