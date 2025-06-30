import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  toasts: [],
  
  notify: ({ title, body = '' }, playSound = true) => {
    const id = Date.now();
    
    if (playSound && typeof window !== 'undefined') {
      const audio = new Audio('/Notification_sound.mp3');
      audio.play().catch(() => {});
    }

    set(state => ({ toasts: [...state.toasts, { id, title, body }] }));
    
    setTimeout(() => {
      set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, 4000);
  }
}));