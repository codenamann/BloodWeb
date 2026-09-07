import React, { createContext, useContext, useState } from 'react';

const CoordinationContext = createContext(null);

const INITIAL_MESSAGES = {
  'req-1': [
    {
      _id: 'msg-1',
      roomId: 'req-1',
      senderId: 'user-sarah',
      senderName: 'Sarah Jenkins (Requester)',
      avatarType: 'sarah',
      content:
        'Hello everyone. Thank you so much for responding. The patient is currently in Trauma Ward 3 at City General Hospital.',
      type: 'CHAT',
      createdAt: new Date(Date.now() - 1000 * 60 * 16).toISOString(),
    },
    {
      _id: 'msg-2',
      roomId: 'req-1',
      senderId: 'system',
      senderName: 'BloodWeb Coordination Bot',
      content:
        'Alex Mercer (O- Donor) was accepted by the requester and is en route. Estimated distance: 1.8 km.',
      type: 'SYSTEM_EVENT',
      createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    },
    {
      _id: 'msg-3',
      roomId: 'req-1',
      senderId: 'user-alex',
      senderName: 'Alex Mercer (Donor)',
      avatarType: 'alex',
      content:
        'I am on my way via 1st Avenue. ETA is about 6 minutes. Have you registered the slip with the blood bank reception?',
      type: 'CHAT',
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
      _id: 'msg-4',
      roomId: 'req-1',
      senderId: 'user-sarah',
      senderName: 'Sarah Jenkins (Requester)',
      avatarType: 'sarah',
      content:
        'Yes! The nurse gave us Token #42. When you arrive at Desk 2, mention Token #42 and they will take you directly to the donation room.',
      type: 'CHAT',
      createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    },
  ],
};

export const CoordinationProvider = ({ children }) => {
  const [messagesByRoom, setMessagesByRoom] = useState(() => {
    const saved = localStorage.getItem('bloodweb_coordination_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  });

  const [pinnedByRoom, setPinnedByRoom] = useState({
    'req-1':
      'Token #42 registered at City General Blood Bank Desk 2. Ask for Nurse Elena.',
  });

  const saveMessages = (updated) => {
    setMessagesByRoom(updated);
    localStorage.setItem(
      'bloodweb_coordination_messages',
      JSON.stringify(updated)
    );
  };

  // Send a message in a coordination room
  const sendMessage = (roomId, user, content) => {
    if (!content.trim()) return;

    const newMessage = {
      _id: `msg-${Date.now()}`,
      roomId,
      senderId: user._id,
      senderName: `${user.name} (${user.roleTag || 'Member'})`,
      avatarType: user.avatarType || 'alex',
      content,
      type: 'CHAT',
      createdAt: new Date().toISOString(),
    };

    const currentRoomMessages = messagesByRoom[roomId] || [];
    const updated = {
      ...messagesByRoom,
      [roomId]: [...currentRoomMessages, newMessage],
    };

    saveMessages(updated);

    // Simulate realistic companion auto-reply after 2.5s if talking in req-1
    if (roomId === 'req-1' && user._id !== 'user-alex') {
      setTimeout(() => {
        const botReply = {
          _id: `msg-${Date.now() + 1}`,
          roomId: 'req-1',
          senderId: 'user-alex',
          senderName: 'Alex Mercer (Donor)',
          avatarType: 'alex',
          content:
            'Understood, parking near the emergency gate now! Will be at Desk 2 in 2 minutes.',
          type: 'CHAT',
          createdAt: new Date().toISOString(),
        };
        setMessagesByRoom((prev) => {
          const u = {
            ...prev,
            [roomId]: [...(prev[roomId] || []), botReply],
          };
          localStorage.setItem(
            'bloodweb_coordination_messages',
            JSON.stringify(u)
          );
          return u;
        });
      }, 2500);
    }
  };

  // Send system event (e.g. status change or volunteer event)
  const sendSystemEvent = (roomId, content) => {
    const newEvent = {
      _id: `sys-${Date.now()}`,
      roomId,
      senderId: 'system',
      senderName: 'BloodWeb System',
      content,
      type: 'SYSTEM_EVENT',
      createdAt: new Date().toISOString(),
    };

    const currentRoomMessages = messagesByRoom[roomId] || [];
    const updated = {
      ...messagesByRoom,
      [roomId]: [...currentRoomMessages, newEvent],
    };
    saveMessages(updated);
  };

  // Pin message
  const pinMessage = (roomId, text) => {
    setPinnedByRoom((prev) => ({
      ...prev,
      [roomId]: text,
    }));
  };

  const getMessagesForRoom = (roomId) => {
    return messagesByRoom[roomId] || [];
  };

  return (
    <CoordinationContext.Provider
      value={{
        getMessagesForRoom,
        sendMessage,
        sendSystemEvent,
        pinMessage,
        pinnedByRoom,
      }}
    >
      {children}
    </CoordinationContext.Provider>
  );
};

export const useCoordination = () => {
  const context = useContext(CoordinationContext);
  if (!context) {
    throw new Error(
      'useCoordination must be used within a CoordinationProvider'
    );
  }
  return context;
};

export default CoordinationContext;
