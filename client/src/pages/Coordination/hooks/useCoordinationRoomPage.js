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
} from '../../../api/coordination.api';
import { updateVolunteerStatus } from '../../../api/volunteer.api';
import { subscribeToCoordinationRoom } from '../../../services/socket';
import { toast } from '../../../components/ui/toast';

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
        setMessages((prev) => {
          if (prev.some((m) => m._id === newMsg._id)) return prev;
          return [...prev, newMsg];
        });
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
    e.preventDefault();
    if (!inputMessage.trim() || isClosed || cooldownRemaining > 0 || isSending) return;

    const textToSend = inputMessage.trim();
    setIsSending(true);

    try {
      const newMsg = await sendCoordinationMessage(requestId, textToSend);
      setMessages((prev) => [...prev, newMsg]);
      setInputMessage('');

      if (cooldownEnabled && !isRequester) {
        setCooldownRemaining(room?.messageCooldownSeconds || 3);
      }
    } catch (err) {
      if (err.response?.status === 429) {
        const remaining = err.response.data?.data?.cooldownRemaining || 3;
        setCooldownRemaining(remaining);
      } else {
        alert(err.response?.data?.message || 'Failed to send message');
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
      setMessages((prev) => [...prev, newMsg]);
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
    messagesEndRef,
    isRequester,
    isVolunteer,
    isClosed,
    pinnedText,
    loadRoomData,
    handleSend,
    handleQuickAction,
    handleToggleCooldown,
    handlePin,
    handleCloseRoom,
    handleVolunteerStatusUpdate,
  };
};

export default useCoordinationRoomPage;
