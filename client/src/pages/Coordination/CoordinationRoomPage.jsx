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
} from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBloodRequests } from '../../context/BloodRequestContext';
import { useCoordination } from '../../context/CoordinationContext';

import ClayAvatar from '../../components/ClayAssets/ClayAvatar';
import { HospitalDocumentPreview } from '../../components/HospitalDocumentPreview';
import ClayBloodDrop from '../../components/ClayAssets/ClayBloodDrop';

export const CoordinationRoomPage = () => {
  const { requestId } = useParams();
  const { currentUser } = useAuth();
  const { getRequestById, updateRequestStatus } = useBloodRequests();
  const { getMessagesForRoom, sendMessage, pinnedByRoom } = useCoordination();
  const navigate = useNavigate();

  const request = getRequestById(requestId);
  const messages = getMessagesForRoom(requestId);
  const pinnedText = pinnedByRoom[requestId];

  const [inputMessage, setInputMessage] = useState('');
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [roomStatus, setRoomStatus] = useState('ACTIVE'); // 'ACTIVE' | 'CLOSED'
  const [cooldownEnabled, setCooldownEnabled] = useState(true);
  const [activeSideTab, setActiveSideTab] = useState('PARTICIPANTS'); // 'PARTICIPANTS' | 'DETAILS'
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cooldown countdown timer effect
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setTimeout(() => {
        setCooldownRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownRemaining]);

  if (!request) {
    return (
      <AppShell activeNav="My Requests">
        <div className="clay-card p-12 text-center bg-white space-y-4 max-w-xl mx-auto my-12">
          <Droplets className="w-12 h-12 text-stone-300 mx-auto" />
          <h2 className="text-xl font-black text-stone-900">Coordination Room Not Found</h2>
          <p className="text-xs text-stone-500">The associated blood request does not exist or has been removed.</p>
          <Link to="/requests" className="clay-btn-crimson px-5 py-2.5 text-xs font-bold inline-block">
            Return to Requests
          </Link>
        </div>
      </AppShell>
    );
  }

  const isRequester = request.createdBy?._id === currentUser?._id;
  const isClosed = roomStatus === 'CLOSED' || request.status === 'COMPLETED' || request.status === 'CANCELLED';

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isClosed || cooldownRemaining > 0) return;

    sendMessage(request._id, currentUser, inputMessage.trim());
    setInputMessage('');

    if (cooldownEnabled && !isRequester) {
      setCooldownRemaining(15); // 15 second cooldown for normal participants
    }
  };

  const handleQuickAction = (actionText, eventType) => {
    if (isClosed) return;
    sendMessage(request._id, {
      ...currentUser,
      roleTag: 'Donor Action',
    }, `${currentUser.name}: ${actionText}`);
  };

  const handleCloseRoom = () => {
    if (window.confirm('Are you sure you want to close this coordination room? No further messages can be sent.')) {
      setRoomStatus('CLOSED');
      sendMessage(request._id, {
        _id: 'system',
        name: 'System',
        roleTag: 'Bot',
      }, 'Room has been closed by the coordinator.');
    }
  };

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
                Coordination Room — Request #{request._id}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isClosed ? 'bg-stone-200 text-stone-700' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isClosed ? 'CLOSED' : 'LIVE'}
              </span>
            </div>
            
            <p className="text-xs text-stone-500 font-medium">
              Admin: <strong className="text-stone-800">{request.createdBy?.name || 'Requester'}</strong> • Real-time emergency channel
            </p>
          </div>

          {/* Admin Controls */}
          {isRequester && !isClosed && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setCooldownEnabled(!cooldownEnabled)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  cooldownEnabled ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-600'
                }`}
              >
                {cooldownEnabled ? 'Cooldown: 15s' : 'Cooldown: Off'}
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
                Needed by {request.neededBy}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-white/20 text-xs font-bold">
              {request.urgency} Urgency
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
              <div className="p-3 bg-amber-50/90 border-b border-amber-200/60 flex items-start gap-2.5 text-xs text-amber-900 shrink-0">
                <Pin className="w-4 h-4 text-[#d93829] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="font-extrabold uppercase tracking-wider text-[10px] text-[#d93829] block">
                    Pinned Instructions
                  </span>
                  <span className="font-semibold">{pinnedText}</span>
                </div>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <div className="py-12 text-center text-xs text-stone-400 font-medium">
                  Coordination room opened. Say hello or share your ETA.
                </div>
              ) : (
                messages.map((msg) => {
                  const isSelf = msg.senderId === currentUser?._id;
                  const isSystem = msg.type === 'SYSTEM_EVENT' || msg.senderId === 'system';

                  if (isSystem) {
                    return (
                      <div key={msg._id} className="flex justify-center my-2">
                        <div className="px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-[11px] font-bold text-stone-600 flex items-center gap-1.5 shadow-2xs max-w-md text-center">
                          <Radio className="w-3 h-3 text-[#d93829] animate-pulse shrink-0" />
                          <span>{msg.content}</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg._id}
                      className={`flex items-start gap-2.5 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <ClayAvatar
                        type={msg.avatarType || (isSelf ? currentUser?.avatarType : 'alex')}
                        size={36}
                        showBadge={false}
                      />

                      <div className={`space-y-1 max-w-[80%] ${isSelf ? 'items-end text-right' : 'items-start text-left'}`}>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400">
                          <span className="text-stone-800 font-extrabold">{msg.senderName || 'Member'}</span>
                          <span>• {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        <div
                          className={`p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                            isSelf
                              ? 'clay-btn-crimson text-white rounded-tr-sm'
                              : 'bg-stone-100/90 text-stone-800 rounded-tl-sm'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Donor Action Buttons */}
            {!isClosed && (
              <div className="px-4 py-2 bg-stone-50 border-t border-stone-100 flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider shrink-0">
                  Quick Actions:
                </span>
                <button
                  type="button"
                  onClick={() => handleQuickAction('I am on my way to the hospital!', 'MARKED_ON_WAY')}
                  className="px-3 py-1 rounded-xl bg-white border border-stone-200 text-stone-700 text-[11px] font-bold hover:bg-stone-100 transition-colors whitespace-nowrap cursor-pointer"
                >
                  🚗 Marked On The Way
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAction('I have arrived at the hospital blood bank desk.', 'DISTANCE_UPDATED')}
                  className="px-3 py-1 rounded-xl bg-white border border-stone-200 text-stone-700 text-[11px] font-bold hover:bg-stone-100 transition-colors whitespace-nowrap cursor-pointer"
                >
                  🏥 Arrived at Blood Bank
                </button>
              </div>
            )}

            {/* Input Form Bar */}
            <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-stone-100 flex items-center gap-2">
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
                      disabled={cooldownRemaining > 0}
                      placeholder={
                        cooldownRemaining > 0
                          ? `Cooldown active: wait ${cooldownRemaining}s...`
                          : "Type a coordination message..."
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
                    disabled={!inputMessage.trim() || cooldownRemaining > 0}
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
                  {(request.responses?.length || 0) + 1} Connected
                </span>
              </div>

              {/* Coordinator Item */}
              <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ClayAvatar type={request.createdBy?.avatarType || 'sarah'} size={36} showBadge={false} />
                  <div>
                    <div className="text-xs font-black text-stone-900">
                      {request.createdBy?.name || 'Requester'}
                    </div>
                    <div className="text-[10px] font-bold text-[#d93829]">Room Admin / Coordinator</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-[#d93829] text-[9px] font-black">
                  Admin
                </span>
              </div>

              {/* Volunteers List */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">
                  Volunteers
                </span>
                {(!request.responses || request.responses.length === 0) ? (
                  <div className="text-[11px] text-stone-400 font-medium py-2">
                    No other donors connected yet.
                  </div>
                ) : (
                  request.responses.map((r) => (
                    <div key={r._id} className="p-2 rounded-xl bg-stone-50 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ClayAvatar type={r.donor?.avatarType || 'alex'} size={32} showBadge={false} />
                        <div>
                          <div className="text-xs font-bold text-stone-800">
                            {r.donor?.name || 'Donor'}
                          </div>
                          <div className="text-[10px] text-stone-400 font-medium">
                            {r.donor?.bloodGroup || request.patientBloodGroup} • {r.estimatedDistanceKm || '2'} km
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        r.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Hospital Contact Info */}
            <div className="clay-card p-5 bg-white/95 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-black text-stone-900 uppercase tracking-wider">
                <Building className="w-4 h-4 text-[#d93829]" />
                <span>Hospital Blood Bank</span>
              </div>
              <div className="text-xs font-bold text-stone-800">{request.hospitalName}</div>
              <p className="text-[11px] text-stone-500 font-medium">{request.hospitalAddress}</p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">Hospital Helpdesk:</span>
                <span className="font-bold text-[#d93829]">+1 (555) 789-4400</span>
              </div>
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
