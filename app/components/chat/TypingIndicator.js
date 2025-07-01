import React from 'react';

export default React.memo(function TypingIndicator({ typingUsers }) {
  const names = typingUsers.map(u => u.username);
  let text = '';
  
  if (names.length === 1) {
    text = `${names[0]} is typing...`;
  } else if (names.length === 2) {
    text = `${names[0]} and ${names[1]} are typing...`;
  } else if (names.length > 2) {
    text = `${names[0]}, ${names[1]}, and others are typing...`;
  }

  return (
    <div className="px-4 py-2 text-sm text-slate-300 italic">
      {text}
    </div>
  );
});