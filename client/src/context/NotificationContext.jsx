import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext(null);

const INITIAL_NOTIFICATIONS = [
  {
    _id: 'notif-1',
    userId: 'user-sarah',
    type: 'ACTIONABLE',
    title: 'Donor Responded to Your Request',
    body: 'Alex Mercer (O- Universal Donor) volunteered for City General Hospital request. Distance: 1.8km.',
    redirectUrl: '/requests/req-1',
    actions: [
      { label: 'View Request & Accept', url: '/requests/req-1' },
      { label: 'Coordination Room', url: '/coordination/req-1' },
    ],
    channel: 'PUSH',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    _id: 'notif-2',
    userId: 'user-alex',
    type: 'ACTIONABLE',
    title: 'Critical O- Emergency Nearby',
    body: 'Urgent need for 2 units of O- blood at City General Hospital (1.8 km from your location).',
    redirectUrl: '/requests/req-1',
    actions: [
      { label: 'View & Volunteer', url: '/requests/req-1' },
    ],
    channel: 'PUSH',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    _id: 'notif-3',
    userId: 'user-sarah',
    type: 'INFORMATIONAL',
    title: 'Coordination Room Active',
    body: 'Live coordination room for Request #req-1 is now open with 2 volunteers connected.',
    redirectUrl: '/coordination/req-1',
    channel: 'EMAIL',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('bloodweb_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const saveNotifications = (updated) => {
    setNotifications(updated);
    localStorage.setItem('bloodweb_notifications', JSON.stringify(updated));
  };

  const addNotification = (notifData) => {
    const newNotif = {
      _id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
      ...notifData,
    };
    const updated = [newNotif, ...notifications];
    saveNotifications(updated);
  };

  const markAsRead = (id) => {
    const updated = notifications.map((n) => (n._id === id ? { ...n, read: true } : n));
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const getUnreadCount = (userId) => {
    return notifications.filter((n) => (!userId || n.userId === userId) && !n.read).length;
  };

  const getNotificationsForUser = (userId) => {
    return notifications.filter((n) => !userId || n.userId === userId || n.userId === 'all');
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
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
