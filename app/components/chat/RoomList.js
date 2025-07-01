import RoomItem from './RoomItem';

export default function RoomList({ 
  rooms, 
  activeRoom, 
  isMobileView, 
  showSidebar, 
  onSelectRoom, 
  onCloseSidebar 
}) {
  return (
    <>
      <aside className={`absolute md:relative z-20 w-3/4 md:w-80 h-full bg-slate-800/95 border-r border-slate-700/50 transition-transform duration-300 ease-in-out
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="p-4 border-b border-slate-700/50">
          <h2 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
            Conversations
          </h2>
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
      </aside>

      {isMobileView && showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-10" 
          onClick={onCloseSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
}