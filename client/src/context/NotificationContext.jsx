import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../api/notification.api';
import { subscribeToUserNotifications } from '../services/socket';
import { toast } from '../components/ui/toast';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem('bloodweb_token');
    if (!token) {
      setNotifications([]);
      return;
    }

    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.warn('Failed to fetch notifications from backend:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Subscribe to real-time incoming in-app notifications
  useEffect(() => {
    const cleanup = subscribeToUserNotifications((newNotif) => {
      if (!newNotif?._id) return;
      setNotifications((prev) => {
        // Prevent duplicate entries
        if (prev.some((n) => n._id?.toString() === newNotif._id?.toString())) {
          return prev;
        }
        return [newNotif, ...prev];
      });

      // Show toast notification
      toast.info(newNotif.title || 'Notification', newNotif.body);
    });

    return cleanup;
  }, []);

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const getUnreadCount = (userId) => {
    return notifications.filter(
      (n) => (!userId || (n.userId?._id || n.userId)?.toString() === userId.toString()) && !n.read
    ).length;
  };

  const getNotificationsForUser = (userId) => {
    return notifications.filter(
      (n) => !userId || (n.userId?._id || n.userId)?.toString() === userId.toString() || n.userId === 'all'
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        getUnreadCount,
        getNotificationsForUser,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
