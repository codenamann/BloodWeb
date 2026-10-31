import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Building,
  MapPin,
  Clock,
  Heart,
  Droplets,
  ShieldCheck,
  CheckCircle2,
  Users,
  Pin,
  Phone,
  AlertCircle,
  ArrowLeft,
  Info,
  Radio,
  Check,
  Lock,
  MessageSquare,
  Navigation,
  Timer,
  ChevronRight,
  Settings,
  RefreshCw,
} from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRequestById } from '../../api/request.api';
import {
  getCoordinationRoom,
  getCoordinationMessages,
  sendCoordinationMessage,
  sendCoordinationQuickAction,
  getCoordinationParticipants,
  pinCoordinationMessage,
  updateCoordinationCooldown,
  closeCoordinationRoom,
} from '../../api/coordination.api';
import { updateVolunteerStatus } from '../../api/volunteer.api';
import { subscribeToCoordinationRoom } from '../../services/socket';
import { toast } from '../../components/ui/toast';

import ClayAvatar from '../../components/ClayAssets/ClayAvatar';
import { HospitalDocumentPreview } from '../../components/HospitalDocumentPreview';
import ClayBloodDrop from '../../components/ClayAssets/ClayBloodDrop';

export const CoordinationRoomPage = () => {
  const { requestId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

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
      ROOM_CLOSED: () => {
        setRoomStatus('CLOSED');
      },
      VOLUNTEER_STATUS_CHANGED: () => {
        Promise.all([
          getRequestById(requestId),
          getCoordinationParticipants(requestId),
        ])
          .then(([reqData, partData]) => {
            if (reqData) setRequest(reqData);
            if (partData) setParticipants(partData);
          })
          .catch(console.warn);
      },
      VOLUNTEER_RESPONDED: () => {
        Promise.all([
          getRequestById(requestId),
          getCoordinationParticipants(requestId),
        ])
          .then(([reqData, partData]) => {
            if (reqData) setRequest(reqData);
            if (partData) setParticipants(partData);
          })
          .catch(console.warn);
      },
      REQUEST_COMPLETED: () => {
        setRoomStatus('CLOSED');
        getRequestById(requestId)
          .then((reqData) => {
            if (reqData) setRequest(reqData);
          })
          .catch(console.warn);
      },
      REQUEST_CANCELLED: () => {
        setRoomStatus('CLOSED');
        getRequestById(requestId)
          .then((reqData) => {
            if (reqData) setRequest(reqData);
          })
          .catch(console.warn);
      },
    });

    return cleanup;
  }, [requestId]);

  const [updatingVolunteerId, setUpdatingVolunteerId] = useState(null);

  const handleVolunteerStatusUpdate = async (responseId, newStatus) => {
    try {
      setUpdatingVolunteerId(responseId);
      await updateVolunteerStatus(responseId, newStatus);
      toast.success(
        'Volunteer Status Updated',
        `Volunteer response changed to ${newStatus}.`
      );

      const [updatedReq, updatedParts] = await Promise.all([
        getRequestById(requestId),
        getCoordinationParticipants(requestId),
      ]);
      setRequest(updatedReq);
      setParticipants(updatedParts || { requester: null, volunteers: [] });
    } catch (err) {
      toast.error(
        'Action Failed',
        err.response?.data?.message || 'Could not update volunteer status.'
      );
    } finally {
      setUpdatingVolunteerId(null);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cooldown countdown timer effect
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setTimeout(() => {
        setCooldownRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownRemaining]);

  // Derived authorization and lifecycle states
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

  // Handle send user message
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

  // Handle donor quick action
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

  // Admin controls: toggle cooldown
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

  // Admin controls: pin / unpin message
  const handlePin = async (messageId) => {
    if (!isRequester) return;
    try {
      const updated = await pinCoordinationMessage(requestId, messageId);
      setRoom(updated);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update pinned message');
    }
  };

  // Admin controls: close room
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

  // 1. Loading Skeleton State
  if (loading) {
    return (
      <div className="space-y-5 max-w-6xl mx-auto animate-pulse">
        <div className="h-10 bg-stone-200/80 rounded-xl w-64" />
        <div className="h-20 bg-stone-200/80 rounded-2xl w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[550px] bg-stone-200/80 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-64 bg-stone-200/80 rounded-3xl" />
            <div className="h-44 bg-stone-200/80 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Recoverable Error State
  if (error || !request) {
    return (
      <div className="clay-card p-10 text-center bg-white space-y-4 max-w-xl mx-auto my-12 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto text-[#d93829]">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-stone-900">
          {error?.status === 403
            ? 'Access Restricted'
            : error?.status === 404
            ? 'Room Not Found'
            : 'Connection Error'}
        </h2>
        <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
          {error?.message || 'The associated coordination room could not be loaded.'}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={loadRoomData}
            className="px-4 py-2 text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
          <Link
            to="/requests"
            className="clay-btn-crimson px-5 py-2 text-xs font-bold inline-block"
          >
            Return to Requests
          </Link>
        </div>
      </div>
    );
  }

  // Active volunteers list from participants or fallback to request.responses
  const activeVolunteers =
    participants.volunteers && participants.volunteers.length > 0
      ? participants.volunteers
      : request.responses || [];

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* ========================================================================= */}
      {/* 1. ROOM HEADER & TOP EMERGENCY SUMMARY STRIP */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link
            to={`/requests/${request._id}`}
            className="inline-flex items-center gap-1.5 text-xs font-black text-stone-500 hover:text-stone-900 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Request Details</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#1c1d22] tracking-tight">
              Coordination Room — Request #{request._id.slice(-6).toUpperCase()}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isClosed
                  ? 'bg-stone-200 text-stone-700'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {isClosed ? 'CLOSED' : 'LIVE'}
            </span>
          </div>

          <p className="text-xs text-stone-500 font-medium">
            Admin:{' '}
            <strong className="text-stone-800">
              {request.createdBy?.name || participants.requester?.name || 'Requester'}
            </strong>{' '}
            • Emergency Coordination Channel
          </p>
        </div>

        {/* Admin Controls */}
        {isRequester && !isClosed && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleToggleCooldown}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                cooldownEnabled
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              {cooldownEnabled
                ? `Cooldown: ${room?.messageCooldownSeconds || 3}s`
                : 'Cooldown: Off'}
            </button>
            <button
              onClick={handleCloseRoom}
              className="px-3.5 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-[#d93829] text-xs font-black transition-colors cursor-pointer"
            >
              Close Room
            </button>
          </div>
        )}
      </div>

      {/* Emergency Requirement Summary Banner */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-red-500 to-[#d93829] text-white flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-lg">
            {request.patientBloodGroup}
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider opacity-90">
              {request.unitsNeeded} Units Required • {request.hospitalName}
            </div>
            <div className="text-[11px] font-medium opacity-80">
              Needed by{' '}
              {request.neededBy
                ? new Date(request.neededBy).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Immediate'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-white/20 text-xs font-bold">
            {request.urgency} Urgency
          </span>
        </div>
      </div>

      {/* Fulfillment Operational Status Banner */}
      <div className="clay-card-flat p-4 bg-white/95 flex flex-wrap items-center justify-between gap-4 shadow-xs border border-stone-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#d93829] font-black text-sm flex items-center justify-center border border-red-100 shadow-2xs">
            {request.patientBloodGroup}
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black text-stone-900">
              {activeVolunteers.filter((v) => v.status === 'ACCEPTED').length} of {request.unitsNeeded || 1} Units Confirmed
            </div>
            <div className="text-[11px] text-stone-500 font-medium">
              {request.hospitalName} • Hospital Blood Bank Coordination
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="w-40 sm:w-48 h-3 rounded-full bg-stone-100 overflow-hidden p-0.5 border border-stone-200/50">
            <div
              className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  Math.round(
                    (activeVolunteers.filter((v) => v.status === 'ACCEPTED').length /
                      (request.unitsNeeded || 1)) *
                      100
                  )
                )}%`,
              }}
            />
          </div>
          <span className="text-xs font-black text-stone-800 shrink-0">
            {Math.min(
              100,
              Math.round(
                (activeVolunteers.filter((v) => v.status === 'ACCEPTED').length /
                  (request.unitsNeeded || 1)) *
                  100
              )
            )}%
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN CHAT & PARTICIPANTS GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Cols: Chat Stream */}
        <div className="lg:col-span-2 flex flex-col h-[600px] clay-card bg-white/95 shadow-sm overflow-hidden">
          {/* Pinned Message Strip */}
          {pinnedText && (
            <div className="p-3 bg-amber-50/90 border-b border-amber-200/60 flex items-start justify-between gap-2.5 text-xs text-amber-900 shrink-0">
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <Pin className="w-4 h-4 text-[#d93829] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="font-extrabold uppercase tracking-wider text-[10px] text-[#d93829] block">
                    Pinned Instructions
                  </span>
                  <span className="font-semibold">{pinnedText}</span>
                </div>
              </div>
              {isRequester && !isClosed && (
                <button
                  type="button"
                  onClick={() => handlePin(null)}
                  title="Unpin message"
                  className="text-[10px] font-bold text-amber-800 hover:text-red-700 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded cursor-pointer shrink-0"
                >
                  Unpin
                </button>
              )}
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="py-16 text-center text-xs text-stone-400 font-medium">
                Coordination room opened. Say hello or coordinate arrival.
              </div>
            ) : (
              messages.map((msg) => {
                const senderObj = msg.senderId;
                const senderIdVal =
                  typeof senderObj === 'object' ? senderObj?._id : senderObj;
                const isSelf = senderIdVal === currentUser?._id;
                const isSystem =
                  msg.type === 'SYSTEM' ||
                  msg.type === 'SYSTEM_EVENT' ||
                  !senderIdVal;
                const senderName =
                  typeof senderObj === 'object' && senderObj?.name
                    ? senderObj.name
                    : isSelf
                    ? currentUser?.name
                    : 'Member';
                const avatarType =
                  typeof senderObj === 'object' && senderObj?.avatarType
                    ? senderObj.avatarType
                    : isSelf
                    ? currentUser?.avatarType || 'alex'
                    : 'alex';
                const contentText = msg.text || msg.content;

                if (isSystem) {
                  return (
                    <div key={msg._id} className="flex justify-center my-2">
                      <div className="px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-[11px] font-bold text-stone-600 flex items-center gap-1.5 shadow-2xs max-w-md text-center">
                        <Radio className="w-3 h-3 text-[#d93829] animate-pulse shrink-0" />
                        <span>{contentText}</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg._id}
                    className={`flex items-start gap-2.5 group ${
                      isSelf ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <ClayAvatar
                      type={avatarType}
                      size={36}
                      showBadge={false}
                    />

                    <div
                      className={`space-y-1 max-w-[80%] ${
                        isSelf ? 'items-end text-right' : 'items-start text-left'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400">
                        <span className="text-stone-800 font-extrabold">
                          {senderName}
                        </span>
                        <span>
                          •{' '}
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {/* Admin Pin Button */}
                        {isRequester && !isClosed && (
                          <button
                            type="button"
                            onClick={() => handlePin(msg._id)}
                            title="Pin this message"
                            className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-[#d93829] transition-opacity cursor-pointer ml-1"
                          >
                            <Pin className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <div
                        className={`p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                          isSelf
                            ? 'clay-btn-crimson text-white rounded-tr-sm'
                            : 'bg-stone-100/90 text-stone-800 rounded-tl-sm'
                        }`}
                      >
                        {contentText}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Donor Action Buttons (Visible to active volunteers when room is LIVE) */}
          {!isClosed && isVolunteer && (
            <div className="px-4 py-2 bg-stone-50 border-t border-stone-100 flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider shrink-0">
                Donor Actions:
              </span>
              <button
                type="button"
                disabled={isActionPending}
                onClick={() => handleQuickAction('MARKED_ON_WAY')}
                className="px-3 py-1 rounded-xl bg-white border border-stone-200 text-stone-700 text-[11px] font-bold hover:bg-stone-100 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                🚗 Marked On The Way
              </button>
              <button
                type="button"
                disabled={isActionPending}
                onClick={() => handleQuickAction('DISTANCE_UPDATED')}
                className="px-3 py-1 rounded-xl bg-white border border-stone-200 text-stone-700 text-[11px] font-bold hover:bg-stone-100 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                🏥 Arrived at Blood Bank
              </button>
            </div>
          )}

          {/* Input Form Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 sm:p-4 bg-white border-t border-stone-100 flex items-center gap-2"
          >
            {isClosed ? (
              <div className="w-full py-2.5 px-4 rounded-xl bg-stone-100 text-center text-xs font-bold text-stone-500">
                This coordination room has been closed.
              </div>
            ) : (
              <>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={cooldownRemaining > 0 || isSending}
                    placeholder={
                      cooldownRemaining > 0
                        ? `Cooldown active: wait ${cooldownRemaining}s...`
                        : 'Type a coordination message...'
                    }
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#faf7f2] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30 font-medium disabled:bg-stone-100 disabled:text-stone-400"
                  />
                  {cooldownRemaining > 0 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-amber-600 flex items-center gap-1">
                      <Timer className="w-3 h-3 animate-spin" /> {cooldownRemaining}s
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || cooldownRemaining > 0 || isSending}
                  className="clay-btn-crimson p-2.5 sm:px-4 sm:py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </>
            )}
          </form>
        </div>

        {/* Right 1-Col: Participants & Hospital Details */}
        <div className="space-y-4">
          {/* Participants Card */}
          <div className="clay-card p-5 bg-white/95 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2 text-xs font-black text-stone-900 uppercase tracking-wider">
                <Users className="w-4 h-4 text-[#d93829]" />
                <span>Participants</span>
              </div>
              <span className="text-[10px] font-black text-stone-400">
                {activeVolunteers.length + 1} Connected
              </span>
            </div>

            {/* Coordinator Item */}
            <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-100 space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ClayAvatar
                    type={
                      participants.requester?.avatarType ||
                      request.createdBy?.avatarType ||
                      'sarah'
                    }
                    size={36}
                    showBadge={false}
                  />
                  <div>
                    <div className="text-xs font-black text-stone-900">
                      {participants.requester?.name ||
                        request.createdBy?.name ||
                        'Requester'}
                    </div>
                    <div className="text-[10px] font-bold text-[#d93829]">
                      Room Admin / Coordinator
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-[#d93829] text-[9px] font-black">
                  Admin
                </span>
              </div>

              {/* Requester Contact (Exposed only to creator or accepted volunteers) */}
              {participants.requester?.phone && (
                <div className="pt-1.5 border-t border-red-200/50 flex items-center justify-between text-[10px]">
                  <span className="text-stone-500 font-medium">Contact Phone:</span>
                  <a
                    href={`tel:${participants.requester.phone}`}
                    className="font-black text-[#d93829] flex items-center gap-1 hover:underline"
                  >
                    <Phone className="w-2.5 h-2.5" />
                    {participants.requester.phone}
                  </a>
                </div>
              )}
            </div>

            {/* Volunteers List with In-Room Operational Management */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">
                  Volunteers ({activeVolunteers.length})
                </span>
              </div>

              {activeVolunteers.length === 0 ? (
                <div className="text-[11px] text-stone-400 font-medium py-2">
                  No other donors connected yet.
                </div>
              ) : (
                activeVolunteers.map((r) => {
                  const donorInfo = r.donorId || r.donor || {};
                  const isAccepted = r.status === 'ACCEPTED';
                  const isPending = r.status === 'PENDING';
                  const isBackup = r.status === 'BACKUP';

                  return (
                    <div
                      key={r._id}
                      className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${
                        isAccepted
                          ? 'bg-emerald-50/50 border-emerald-100'
                          : isPending
                          ? 'bg-amber-50/40 border-amber-100'
                          : 'bg-stone-50 border-stone-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <ClayAvatar
                            type={donorInfo.avatarType || 'alex'}
                            size={32}
                            showBadge={false}
                          />
                          <div>
                            <div className="text-xs font-bold text-stone-800">
                              {donorInfo.name || 'Verified Donor'}
                            </div>
                            <div className="text-[10px] text-stone-400 font-medium">
                              Type {donorInfo.bloodGroup || request.patientBloodGroup}
                              {r.estimatedDistanceKm != null && ` • ${r.estimatedDistanceKm} km`}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                            isAccepted
                              ? 'bg-emerald-100 text-emerald-800'
                              : isPending
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>

                      {/* Contact information for accepted donors (Mutual trust boundary) */}
                      {donorInfo.phone && (
                        <div className="pt-1.5 border-t border-emerald-100 flex items-center justify-between text-[10px]">
                          <span className="text-stone-500 font-medium">Donor Phone:</span>
                          <a
                            href={`tel:${donorInfo.phone}`}
                            className="font-bold text-emerald-800 flex items-center gap-1 hover:underline"
                          >
                            <Phone className="w-2.5 h-2.5" />
                            {donorInfo.phone}
                          </a>
                        </div>
                      )}

                      {/* Requester Volunteer Management Controls */}
                      {isRequester && !isClosed && (
                        <div className="pt-1.5 border-t border-stone-200/50 flex items-center gap-1.5 justify-end">
                          {isPending && (
                            <>
                              <button
                                type="button"
                                disabled={updatingVolunteerId === r._id}
                                onClick={() => handleVolunteerStatusUpdate(r._id, 'ACCEPTED')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
                              >
                                {updatingVolunteerId === r._id ? 'Updating...' : 'Accept'}
                              </button>
                              <button
                                type="button"
                                disabled={updatingVolunteerId === r._id}
                                onClick={() => handleVolunteerStatusUpdate(r._id, 'BACKUP')}
                                className="px-2 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 text-[10px] font-bold cursor-pointer disabled:opacity-50 transition-colors"
                              >
                                Backup
                              </button>
                            </>
                          )}

                          {isAccepted && (
                            <button
                              type="button"
                              disabled={updatingVolunteerId === r._id}
                              onClick={() => handleVolunteerStatusUpdate(r._id, 'BACKUP')}
                              className="text-[9px] font-bold text-stone-500 hover:text-stone-800 underline cursor-pointer disabled:opacity-50"
                            >
                              Move to Backup
                            </button>
                          )}

                          {isBackup && (
                            <button
                              type="button"
                              disabled={updatingVolunteerId === r._id}
                              onClick={() => handleVolunteerStatusUpdate(r._id, 'ACCEPTED')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[9px] font-black cursor-pointer disabled:opacity-50 transition-colors"
                            >
                              Promote to Accepted
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Hospital Contact Info */}
          <div className="clay-card p-5 bg-white/95 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-black text-stone-900 uppercase tracking-wider">
              <Building className="w-4 h-4 text-[#d93829]" />
              <span>Hospital Blood Bank</span>
            </div>
            <div className="text-xs font-bold text-stone-800">
              {request.hospitalName}
            </div>
            <p className="text-[11px] text-stone-500 font-medium">
              {request.hospitalAddress}
            </p>
            {request.contactPhone && (
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">Emergency Contact:</span>
                <span className="font-bold text-[#d93829]">{request.contactPhone}</span>
              </div>
            )}
          </div>

          {/* Document Verification Block */}
          {request.hospitalDocument && (
            <div className="clay-card p-5 bg-white/95 space-y-3 shadow-sm">
              <div className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Verified Document
              </div>
              <HospitalDocumentPreview document={request.hospitalDocument} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoordinationRoomPage;
