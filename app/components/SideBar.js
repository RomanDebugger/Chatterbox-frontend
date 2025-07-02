'use client';
import Logo from './Logo';
import { useAuth } from '@/app/contexts/AuthContext';
import { useState } from 'react';
import { useRouter} from 'next/navigation';
import NewRoomModal from './newRoomModal';
export default function Sidebar({ isMobileView }) {
  const { logout } = useAuth();
  const router = useRouter();
  const [showNewRoom, setShowNewRoom] = useState(false);

  return (
    <div
      className={`flex items-center ${
        isMobileView
          ? 'flex-row gap-2 pr-2' 
          : 'bg-slate-800/80 backdrop-blur-xs border-r border-slate-700/50 flex-col py-6'
      }`}
    >
      <NewRoomModal open={showNewRoom} onClose={() => setShowNewRoom(false)} />

      {!isMobileView && (
        <div className="mb-8 cursor-pointer">
          <Logo className="w-12 h-12" />
        </div>
      )}

      <nav
        className={`${
          isMobileView
            ? 'flex flex-row items-center gap-2'
            : 'space-y-6 flex flex-1 flex-col items-center'
        }`}
      >
        <button
          title="New Chat"
          className={`${
            isMobileView
              ? 'h-8 w-8 p-1.5 text-sm'
              : 'p-3 h-12 w-12 text-xl'
          } bg-slate-700/50 rounded-xl hover:bg-slate-600/50 transition-all`}
          onClick={() => setShowNewRoom(true)}
        >
          💬
        </button>

        <button
          title="Logout"
          className={`${
            isMobileView
              ? 'h-8 w-8 p-1.5 text-sm'
              : 'p-3 h-12 w-12 text-xl'
          } bg-red-600/50 rounded-xl hover:bg-red-600/70 transition-all`}
          onClick={() => {
            if (window.confirm('Are you sure you want to logout?')) {
              logout();
              router.push('/auth');
            }
          }}
        >
          🚪
        </button>
      </nav>
    </div>
  );
}
