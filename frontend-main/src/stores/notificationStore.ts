import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  
  fetchNotifications: async (userId: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const unreadCount = data?.filter(n => !n.read).length || 0;
      set({ notifications: (data || []) as Notification[], unreadCount, loading: false });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      set({ loading: false });
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      const { notifications } = get();
      set({
        notifications: notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: notifications.filter(n => !n.read && n.id !== notificationId).length,
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  markAllAsRead: async (userId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;

      const { notifications } = get();
      set({
        notifications: notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  },
}));
