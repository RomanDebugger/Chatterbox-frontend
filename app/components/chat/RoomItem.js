import React from 'react';

export default React.memo(function RoomItem({ room, isActive, onClick }) {
  const participantsText = room.participants?.map(p => p.username).join(', ') || '';
  
  return (
    <div
      onClick={onClick}
      className={`p-3 border-b border-slate-700/50 hover:bg-slate-700/30 cursor-pointer transition-colors ${
        isActive ? 'bg-slate-700/30' : ''
      }`}
    >
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 flex items-center justify-center text-white font-bold mr-3">
          {(room.name || participantsText).charAt(0).toUpperCase()}
        </div>
        <div className="text-white truncate">
          {room.name || participantsText}
        </div>
      </div>
    </div>
  );
});