import { useState, useEffect, useRef } from 'react';
import { getRequestById } from '../../../api/request.api';
import {
  getCoordinationRoom,
  getCoordinationMessages,
  sendCoordinationMessage,
  sendCoordinationQuickAction,
  getCoordinationParticipants,
  pinCoordinationMessage,
  updateCoordinationCooldown,
  closeCoordinationRoom,
  deleteCoordinationMessage,
} from '../../../api/coordination.api';
import { updateVolunteerStatus } from '../../../api/volunteer.api';
import { subscribeToCoordinationRoom } from '../../../services/socket';
import { toast } from '../../../components/ui/toast';

const safeAppendMessage = (prev, newMsg) => {
  if (!newMsg) return prev;
  const targetId = (newMsg._id || newMsg.id)?.toString();
  if (targetId && prev.some((m) => (m._id || m.id)?.toString() === targetId)) {
    return prev.map((m) => {
      if ((m._id || m.id)?.toString() === targetId) {
        return { ...newMsg, _clientKey: m._clientKey || targetId };
      }
      return m;
    });
  }

  // Reconcile optimistic messages
  const optIdx = prev.findIndex((m) => {
    if (!m.isOptimistic) return false;
    const sameText = (m.text || m.content) === (newMsg.text || newMsg.content);
    const mSender = typeof m.senderId === 'object' ? m.senderId?._id : m.senderId;
    const nSender = typeof newMsg.senderId === 'object' ? newMsg.senderId?._id : newMsg.senderId;
    return sameText && mSender?.toString() === nSender?.toString();
  });

  if (optIdx !== -1) {
    const next = [...prev];
    next[optIdx] = { ...newMsg, _clientKey: prev[optIdx]._clientKey || prev[optIdx]._id };
    return next;
  }

  return [...prev, newMsg];
};

export const useCoordinationRoomPage = (requestId, currentUser) => {
  const [request, setRequest] = useState(null);
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState({ requester: null, volunteers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [inputMessage, setInputMessage] = useState('');
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [roomStatus, setRoomStatus] = useState('ACTIVE');
  const [cooldownEnabled, setCooldownEnabled] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isActionPending, setIsActionPending] = useState(false);
  const [updatingVolunteerId, setUpdatingVolunteerId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadRoomData = async () => {
    if (!requestId) return;
    setLoading(true);
    setError(null);

    try {
      const [reqData, roomData, msgData, partData] = await Promise.all([
        getRequestById(requestId),
        getCoordinationRoom(requestId),
        getCoordinationMessages(requestId),
        getCoordinationParticipants(requestId),
      ]);

      setRequest(reqData);
      setRoom(roomData);
      setMessages(msgData.messages || []);
      setCooldownRemaining(msgData.cooldownRemaining || 0);
      setCooldownEnabled(msgData.cooldownEnabled ?? roomData?.cooldownEnabled ?? false);
      setRoomStatus(msgData.roomStatus || roomData?.status || 'ACTIVE');
      setParticipants(partData || { requester: null, volunteers: [] });
    } catch (err) {
      console.error('Failed to load coordination room data:', err);
      const status = err.response?.status;
      const message =
        err.response?.data?.message ||
        (status === 403
          ? 'You are not authorized to access this coordination room.'
          : status === 404
          ? 'Coordination room not found.'
          : 'Failed to connect to the coordination room.');
      setError({ message, status });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoomData();
  }, [requestId]);

  // Subscribe to real-time coordination room events
  useEffect(() => {
    if (!requestId) return;

    const cleanup = subscribeToCoordinationRoom(requestId, {
      NEW_MESSAGE: (newMsg) => {
        setMessages((prev) => safeAppendMessage(prev, newMsg));
      },
      MESSAGE_DELETED: ({ messageId }) => {
        setMessages((prev) => prev.filter((m) => (m._id || m.id)?.toString() !== messageId?.toString()));
      },
      MESSAGE_PINNED: ({ pinnedMessage }) => {
        setRoom((prev) => (prev ? { ...prev, pinnedMessageId: pinnedMessage } : prev));
      },
      COOLDOWN_UPDATED: ({ cooldownEnabled, messageCooldownSeconds }) => {
        setCooldownEnabled(cooldownEnabled);
        if (typeof messageCooldownSeconds === 'number') {
          setRoom((prev) => (prev ? { ...prev, messageCooldownSeconds } : prev));
        }
      },
      ROOM_CLOSED: () => setRoomStatus('CLOSED'),
      VOLUNTEER_STATUS_CHANGED: () => {
        Promise.all([getRequestById(requestId), getCoordinationParticipants(requestId)])
          .then(([reqData, partData]) => {
            if (reqData) setRequest(reqData);
            if (partData) setParticipants(partData);
          })
          .catch(console.warn);
      },
      VOLUNTEER_RESPONDED: () => {
        Promise.all([getRequestById(requestId), getCoordinationParticipants(requestId)])
          .then(([reqData, partData]) => {
            if (reqData) setRequest(reqData);
            if (partData) setParticipants(partData);
          })
          .catch(console.warn);
      },
      REQUEST_COMPLETED: () => {
        setRoomStatus('CLOSED');
        getRequestById(requestId).then((reqData) => reqData && setRequest(reqData)).catch(console.warn);
      },
      REQUEST_CANCELLED: () => {
        setRoomStatus('CLOSED');
        getRequestById(requestId).then((reqData) => reqData && setRequest(reqData)).catch(console.warn);
      },
    });

    return cleanup;
  }, [requestId]);

  // Smart sync interval (every 3s) ensuring real-time multi-user consistency across serverless instances
  useEffect(() => {
    if (!requestId || roomStatus === 'CLOSED') return;

    const syncInterval = setInterval(async () => {
      try {
        const msgData = await getCoordinationMessages(requestId);
        if (msgData?.messages && Array.isArray(msgData.messages)) {
          const freshMessages = msgData.messages;
          const freshIds = new Set(freshMessages.map((m) => (m._id || m.id)?.toString()));

          setMessages((prev) => {
            // Check if any deleted messages exist in current state
            const hasDeleted = prev.some((m) => !m.isOptimistic && !freshIds.has((m._id || m.id)?.toString()));
            
            // Check if any new server messages arrived
            const prevIds = new Set(prev.map((m) => (m._id || m.id)?.toString()));
            const hasNew = freshMessages.some((m) => !prevIds.has((m._id || m.id)?.toString()));

            // Keep optimistic in-flight messages that haven't been acknowledged yet
            const pendingOptimistic = prev.filter(
              (m) => m.isOptimistic && !freshMessages.some((f) => (f.text || f.content) === (m.text || m.content))
            );

            if (!hasDeleted && !hasNew && pendingOptimistic.length === 0) {
              return prev; // Nothing changed, skip re-render
            }

            // Sync with fresh server truth while preserving in-flight optimistic sends
            return [...freshMessages, ...pendingOptimistic];
          });
        }
        if (msgData?.roomStatus && msgData.roomStatus !== roomStatus) {
          setRoomStatus(msgData.roomStatus);
        }
      } catch (err) {
        // Silent catch for background poll
      }
    }, 3000);

    return () => clearInterval(syncInterval);
  }, [requestId, roomStatus]);

  const handleVolunteerStatusUpdate = async (responseId, newStatus) => {
    try {
      setUpdatingVolunteerId(responseId);
      await updateVolunteerStatus(responseId, newStatus);
      toast.success('Volunteer Status Updated', `Volunteer response changed to ${newStatus}.`);

      const [updatedReq, updatedParts] = await Promise.all([
        getRequestById(requestId),
        getCoordinationParticipants(requestId),
      ]);
      setRequest(updatedReq);
      setParticipants(updatedParts || { requester: null, volunteers: [] });
    } catch (err) {
      toast.error('Action Failed', err.response?.data?.message || 'Could not update volunteer status.');
    } finally {
      setUpdatingVolunteerId(null);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setTimeout(() => {
        setCooldownRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownRemaining]);

  const isRequester =
    request?.createdBy?._id === currentUser?._id ||
    room?.adminId === currentUser?._id ||
    participants?.requester?._id === currentUser?._id;

  const isVolunteer = participants?.volunteers?.some((v) => {
    const donorId = v.donorId?._id || v.donorId || v.donor?._id || v.donor;
    return donorId === currentUser?._id;
  });

  const isClosed =
    roomStatus === 'CLOSED' ||
    request?.status === 'COMPLETED' ||
    request?.status === 'CANCELLED';

  const pinnedText = room?.pinnedMessageId?.text || null;

  const handleSend = async (e) => {
    e?.preventDefault?.();
    const textToSend = inputMessage.trim();
    if (!textToSend || isClosed || cooldownRemaining > 0) return;

    const currentReplying = replyingTo;
    const replyPayload = currentReplying
      ? {
          messageId: currentReplying._id,
          senderName:
            (typeof currentReplying.senderId === 'object' ? currentReplying.senderId?.name : null) ||
            (currentReplying.senderId === currentUser?._id ? 'You' : 'Participant'),
          text: currentReplying.text || currentReplying.content || '',
        }
      : null;

    // Instant optimistic UX: Clear input and reply banner immediately
    setInputMessage('');
    setReplyingTo(null);

    const tempId = `opt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const optimisticMsg = {
      _id: tempId,
      id: tempId,
      _clientKey: tempId,
      roomId: room?._id || requestId,
      senderId: currentUser,
      type: 'USER',
      text: textToSend,
      replyTo: currentReplying
        ? {
            messageId: currentReplying._id,
            senderName:
              (typeof currentReplying.senderId === 'object' ? currentReplying.senderId?.name : null) ||
              (currentReplying.senderId === currentUser?._id ? 'You' : 'Participant'),
            text: currentReplying.text || currentReplying.content || '',
          }
        : null,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });

    if (cooldownEnabled && !isRequester) {
      setCooldownRemaining(room?.messageCooldownSeconds || 3);
    }

    try {
      setIsSending(true);
      const newMsg = await sendCoordinationMessage(requestId, textToSend, replyPayload);
      if (newMsg) {
        setMessages((prev) => safeAppendMessage(prev, newMsg));
      }
    } catch (err) {
      // Revert optimistic message on failure
      setMessages((prev) => prev.filter((m) => (m._id || m.id) !== tempId));
      if (err.response?.status === 429) {
        const remaining = err.response.data?.data?.cooldownRemaining || 3;
        setCooldownRemaining(remaining);
      } else {
        toast.error('Message failed', err.response?.data?.message || 'Could not send message.');
        setInputMessage(textToSend);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickAction = async (actionType) => {
    if (isClosed || isActionPending) return;
    setIsActionPending(true);

    try {
      const newMsg = await sendCoordinationQuickAction(requestId, actionType);
      if (newMsg) {
        setMessages((prev) => safeAppendMessage(prev, newMsg));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to broadcast quick action');
    } finally {
      setIsActionPending(false);
    }
  };

  const handleToggleCooldown = async () => {
    if (!isRequester || isClosed) return;
    const nextEnabled = !cooldownEnabled;
    try {
      const updated = await updateCoordinationCooldown(requestId, { enabled: nextEnabled });
      setCooldownEnabled(updated.cooldownEnabled);
      setRoom(updated);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update cooldown settings');
    }
  };

  const handleUpdateCooldown = async ({ enabled, seconds }) => {
    if (!isRequester || isClosed) return false;
    try {
      const updated = await updateCoordinationCooldown(requestId, { enabled, seconds });
      setCooldownEnabled(updated.cooldownEnabled);
      setRoom(updated);
      toast.success('Cooldown Updated', `Cooldown ${enabled ? `set to ${seconds}s` : 'disabled'}.`);
      return true;
    } catch (err) {
      toast.error('Cooldown Update Failed', err.response?.data?.message || 'Failed to update cooldown settings');
      return false;
    }
  };

  const handlePin = async (messageId) => {
    if (!isRequester) return;
    try {
      const updated = await pinCoordinationMessage(requestId, messageId);
      setRoom(updated);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update pinned message');
    }
  };

  const handleCloseRoom = async () => {
    if (!isRequester || isClosed) return;
    if (window.confirm('Are you sure you want to close this coordination room? No further messages can be sent.')) {
      try {
        const updated = await closeCoordinationRoom(requestId);
        setRoomStatus(updated.status);
        setRoom(updated);
        const msgData = await getCoordinationMessages(requestId);
        setMessages(msgData.messages || []);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to close room');
      }
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!messageId || !isRequester) return;
    try {
      setMessages((prev) => prev.filter((m) => (m._id || m.id)?.toString() !== messageId.toString()));
      await deleteCoordinationMessage(requestId, messageId);
      toast.success('Message Deleted', 'The message was removed from the room.');
    } catch (err) {
      toast.error('Delete Failed', err.response?.data?.message || 'Failed to delete message.');
      getCoordinationMessages(requestId).then((data) => {
        if (data?.messages) setMessages(data.messages);
      });
    }
  };

  return {
    request,
    room,
    messages,
    participants,
    loading,
    error,
    inputMessage,
    setInputMessage,
    cooldownRemaining,
    roomStatus,
    cooldownEnabled,
    isSending,
    isActionPending,
    updatingVolunteerId,
    replyingTo,
    setReplyingTo,
    messagesEndRef,
    isRequester,
    isVolunteer,
    isClosed,
    pinnedText,
    loadRoomData,
    handleSend,
    handleQuickAction,
    handleToggleCooldown,
    handleUpdateCooldown,
    handlePin,
    handleDeleteMessage,
    handleCloseRoom,
    handleVolunteerStatusUpdate,
  };
};

export default useCoordinationRoomPage;
