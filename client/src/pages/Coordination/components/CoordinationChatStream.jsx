import React, { useRef } from 'react';
import { Pin, Timer, Send } from 'lucide-react';
import CoordinationMessageItem from './CoordinationMessageItem';
import ChatStreamHeader from './ChatStreamHeader';
import CoordinationReplyBanner from './CoordinationReplyBanner';

export const CoordinationChatStream = ({
  messages,
  messagesEndRef,
  pinnedText,
  isRequester,
  isClosed,
  isVolunteer,
  currentUser,
  handlePin,
  handleQuickAction,
  isActionPending,
  inputMessage,
  setInputMessage,
  handleSend,
  cooldownRemaining,
  isSending,
  replyingTo,
  setReplyingTo,
  adminId,
  request,
  participants,
  room,
  cooldownEnabled,
  handleToggleCooldown,
  handleUpdateCooldown,
  handleCloseRoom,
  activeVolunteers,
}) => {
  const inputRef = useRef(null);

  const handleReply = (msg) => {
    if (setReplyingTo) {
      setReplyingTo(msg);
      inputRef.current?.focus();
    }
  };

  const handleScrollToMessage = (messageId) => {
    const el = document.getElementById(`msg-${messageId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-[#c62828]', 'bg-red-50/80');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-[#c62828]', 'bg-red-50/80');
      }, 1500);
    }
  };

  return (
    <div className="lg:col-span-2 flex flex-col h-[650px] clay-card bg-white/95 shadow-sm overflow-hidden">
      {/* Integrated Chat Window Header */}
      <ChatStreamHeader
        request={request}
        participants={participants}
        room={room}
        isClosed={isClosed}
        isRequester={isRequester}
        cooldownEnabled={cooldownEnabled}
        handleToggleCooldown={handleToggleCooldown}
        handleUpdateCooldown={handleUpdateCooldown}
        handleCloseRoom={handleCloseRoom}
        activeVolunteers={activeVolunteers}
      />

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
      <div style={{ scrollbarGutter: 'stable' }} className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-1.5 custom-scrollbar-2px">
        {messages.length === 0 ? (
          <div className="py-16 text-center text-xs text-stone-400 font-medium">
            Coordination room opened. Say hello or coordinate arrival.
          </div>
        ) : (
          messages.map((msg) => (
            <CoordinationMessageItem
              key={msg._id}
              msg={msg}
              currentUser={currentUser}
              isRequester={isRequester}
              adminId={adminId}
              isClosed={isClosed}
              handlePin={handlePin}
              onReply={handleReply}
              onScrollToMessage={handleScrollToMessage}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Donor Action Buttons */}
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

      {/* WhatsApp-Style Replying Banner */}
      {!isClosed && (
        <CoordinationReplyBanner
          replyingTo={replyingTo}
          currentUser={currentUser}
          onCancel={() => setReplyingTo(null)}
        />
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
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={cooldownRemaining > 0}
                placeholder={cooldownRemaining > 0 ? `Cooldown active: wait ${cooldownRemaining}s...` : replyingTo ? 'Type your reply...' : 'Type a coordination message...'}
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
  );
};

export default CoordinationChatStream;
