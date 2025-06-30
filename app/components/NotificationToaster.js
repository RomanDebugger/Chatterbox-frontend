'use client';
import { useNotificationStore } from '../stores/notificationStore';

export default function NotificationToaster() {
  const toasts = useNotificationStore(state => state.toasts);
  
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className="bg-slate-800 text-white px-4 py-3 rounded-lg border border-red-700 shadow-lg"
        >
          <div className="font-bold">{toast.title}</div>
          {toast.body && <div className="text-sm">{toast.body}</div>}
        </div>
      ))}
    </div>
  );
}