import RoomItem from './RoomItem';

export default function RoomList({ 
  rooms, 
  activeRoom, 
  isMobileView, 
  showSidebar, 
  onSelectRoom,
  setShowSidebar
}) {
  return (
    <>
      <div className={`fixed md:relative z-30 h-full bg-slate-800/95 border-r border-slate-700/50 transition-transform duration-300 ease-in-out
        w-full md:w-80
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="p-4 border-b border-slate-700/50 flex flex-row items-center justify-between">
          <h2 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
            Conversations
          </h2>
          {isMobileView && (
            <button
              onClick={() => setShowSidebar(false)}
              className="text-white text-xl p-2 hover:bg-slate-700/50 rounded-md transition"
              title="Close"
            >
              <div className='bg-red-700 w-10 h-10 rounded-full flex items-center justify-center'>x</div>
            </button>
          )}
        </div>
        
        <div className="flex-1">
          {rooms.map(room => (
            <RoomItem 
              key={room._id}
              room={room}
              isActive={activeRoom === room._id}
              onClick={() => onSelectRoom(room._id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}