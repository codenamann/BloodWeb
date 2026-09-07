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
  PhoneCall,
  AlertCircle,
  ArrowLeft,
  Info,
  Radio,
  Check,
  MessageSquare,
} from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBloodRequests } from '../../context/BloodRequestContext';
import { useCoordination } from '../../context/CoordinationContext';
import AppNavbar from '../../components/layout/AppNavbar';
import PersonaSwitcher from '../../components/common/PersonaSwitcher';
import ClayAvatar from '../../components/ClayAssets/ClayAvatar';

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
  const [mobileTab, setMobileTab] = useState('CHAT'); // 'CHAT' | 'INFO'
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, mobileTab]);

  if (!request) {
    return (
      <div className="min-h-screen bg-[#f6f1eb] text-[#1c1d22]">
        <AppNavbar />
        <div className="max-w-2xl mx-auto pt-20 text-center space-y-4">
          <Droplets className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-2xl font-black">Coordination Room Not Found</h2>
          <Link to="/requests" className="clay-btn-crimson px-6 py-2.5 text-xs font-bold inline-block">
            Return to Requests
          </Link>
        </div>
      </div>
    );
  }

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendMessage(request._id, currentUser, inputMessage);
    setInputMessage('');
  };

  const isRequester = request.createdBy?._id === currentUser?._id;
  const acceptedVolunteers = request.responses?.filter((r) => r.status === 'ACCEPTED') || [];

  return (
    <div className="min-h-screen bg-[#f6f1eb] text-[#1c1d22] font-sans pb-24 sm:pb-12">
      <AppNavbar />
      <PersonaSwitcher />

      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-4 sm:space-y-6">
        
        {/* Back Link */}
        <Link
          to={`/requests/${request._id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#575965] hover:text-[#1c1d22] transition-colors p-2 rounded-xl clay-btn-cream"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Request Details</span>
        </Link>

        {/* ========================================================================= */}
        {/* 1. TOP LIVE COORDINATION ROOM HEADER & CONTEXT BANNER */}
        {/* ========================================================================= */}
        <div className="clay-card p-4 sm:p-6 bg-white shadow-xl space-y-3.5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl clay-card-crimson flex flex-col items-center justify-center text-white shrink-0 shadow-md">
                <span className="text-lg sm:text-xl font-black leading-none">{request.patientBloodGroup}</span>
                <span className="text-[8px] sm:text-[9px] font-bold opacity-80">TYPE</span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] sm:text-xs font-black text-emerald-700 bg-emerald-100 px-2 sm:px-2.5 py-0.5 rounded-full">
                    <Radio className="w-3 h-3 animate-ping text-emerald-600" />
                    Live Room Active
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-[#d93829] text-[9px] sm:text-[10px] font-black uppercase">
                    {request.urgency}
                  </span>
                </div>
                <h1 className="text-base sm:text-2xl font-black text-[#1c1d22] mt-0.5 truncate max-w-sm sm:max-w-none">
                  {request.hospitalName}
                </h1>
                <p className="text-[11px] sm:text-xs text-[#575965] font-semibold">
                  Requirement: {request.unitsNeeded} Units • {request.hospitalAddress}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 w-full lg:w-auto">
              <a
                href="tel:5557894400"
                className="clay-btn-cream flex-1 lg:flex-none px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#d93829]" />
                <span>Call Hospital</span>
              </a>

              {isRequester && (
                <button
                  onClick={() => {
                    updateRequestStatus(request._id, 'COMPLETED');
                    alert('Donation fulfillment confirmed! Request marked as COMPLETED.');
                  }}
                  className="clay-btn-crimson flex-1 lg:flex-none px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Fulfilled</span>
                </button>
              )}
            </div>

          </div>

          {/* Pinned Info Banner */}
          {pinnedText && (
            <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs flex items-center gap-2 text-amber-950 font-medium">
              <Pin className="w-3.5 h-3.5 text-[#d93829] shrink-0" />
              <span className="text-[11px] sm:text-xs"><strong>Pinned:</strong> {pinnedText}</span>
            </div>
          )}
        </div>

        {/* Mobile View Toggle Switch (lg:hidden) */}
        <div className="flex lg:hidden items-center p-1 rounded-2xl bg-white clay-card-flat">
          <button
            onClick={() => setMobileTab('CHAT')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'CHAT' ? 'clay-btn-crimson text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Live Chat ({messages.length})</span>
          </button>
          <button
            onClick={() => setMobileTab('INFO')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'INFO' ? 'clay-btn-crimson text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Participants &amp; Tracker</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN ROOM SPLIT */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel: Active Participants & Tracker (Visible on Desktop OR when INFO tab selected on mobile) */}
          <div className={`lg:col-span-4 space-y-4 sm:space-y-6 ${mobileTab === 'INFO' ? 'block' : 'hidden lg:block'}`}>
            
            {/* Fulfillment Tracker */}
            <div className="clay-card p-4 sm:p-5 bg-white space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-[#1c1d22]">Pledged Units</span>
                <span className="text-[#d93829]">{acceptedVolunteers.length} / {request.unitsNeeded} Units</span>
              </div>
              <div className="w-full bg-stone-100 h-2 sm:h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#d93829] h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (acceptedVolunteers.length / request.unitsNeeded) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#747682] font-semibold">
                {acceptedVolunteers.length >= request.unitsNeeded
                  ? 'All units pledged by active donors.'
                  : `${request.unitsNeeded - acceptedVolunteers.length} more units needed.`}
              </p>
            </div>

            {/* Participants List */}
            <div className="clay-card p-4 sm:p-5 bg-white space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#d93829]" />
                  <h3 className="font-extrabold text-sm text-[#1c1d22]">Participants</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  3 Online
                </span>
              </div>

              {/* Requester */}
              <div className="flex items-center gap-3 p-2 rounded-2xl bg-[#faf7f2]">
                <ClayAvatar type={request.createdBy?.avatarType || 'sarah'} size={38} showBadge={false} />
                <div className="overflow-hidden">
                  <div className="text-xs font-black text-[#1c1d22] truncate">{request.createdBy?.name}</div>
                  <div className="text-[10px] font-bold text-[#d93829]">Requester / Host</div>
                </div>
              </div>

              {/* Donors */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#747682]">Donors Joined</div>
                {request.responses?.map((resp) => (
                  <div
                    key={resp._id}
                    className="flex items-center justify-between p-2 rounded-2xl bg-white border border-stone-100"
                  >
                    <div className="flex items-center gap-2.5">
                      <ClayAvatar type={resp.donor?.avatarType || 'alex'} size={34} showBadge={true} badgeColor="green" />
                      <div>
                        <div className="text-xs font-bold text-[#1c1d22] truncate">{resp.donor?.name}</div>
                        <div className="text-[10px] text-[#747682] font-semibold">{resp.estimatedDistanceKm} km • ETA {resp.eta}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-red-100 text-[#d93829] text-[9px] font-black">
                      {resp.donor?.bloodGroup || 'O-'}
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* Right Panel: Chat Stream (Visible on Desktop OR when CHAT tab selected on mobile) */}
          <div className={`lg:col-span-8 ${mobileTab === 'CHAT' ? 'block' : 'hidden lg:block'}`}>
            <div className="clay-card bg-white h-[500px] sm:h-[580px] flex flex-col justify-between shadow-2xl overflow-hidden">
              
              {/* Chat Stream Header */}
              <div className="p-3 sm:p-4 bg-[#faf7f2] border-b border-stone-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#575965] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] sm:text-xs">Real-time Coordination Channel</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#747682]">Room #{request._id}</span>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 p-3 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4">
                {messages.map((msg) => {
                  const isMe = msg.senderId === currentUser?._id;
                  const isSystem = msg.type === 'SYSTEM_EVENT';

                  if (isSystem) {
                    return (
                      <div key={msg._id} className="text-center my-2 sm:my-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-[10px] sm:text-[11px] font-semibold border border-stone-200/60">
                          {msg.content}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg._id}
                      className={`flex gap-2.5 sm:gap-3 items-end ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <ClayAvatar type={msg.avatarType || 'alex'} size={32} showBadge={false} />
                      
                      <div className={`max-w-[82%] sm:max-w-[75%] space-y-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`text-[9px] sm:text-[10px] font-bold text-[#747682] px-1 ${isMe ? 'text-right' : 'text-left'}`}>
                          {msg.senderName} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>

                        <div
                          className={`p-3 sm:p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                            isMe
                              ? 'clay-card-crimson text-white bg-gradient-to-r from-[#e83e2f] to-[#c52417] shadow-md'
                              : 'clay-card-flat bg-[#faf7f2] text-[#1c1d22]'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSend} className="p-2.5 sm:p-3.5 bg-[#faf7f2] border-t border-stone-200/70 flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Message as ${currentUser?.name?.split(' ')[0]}...`}
                  className="flex-1 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm bg-white rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30"
                />
                <button
                  type="submit"
                  className="p-2.5 sm:p-3 rounded-2xl clay-btn-crimson shadow-md cursor-pointer shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default CoordinationRoomPage;
