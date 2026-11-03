import React from 'react';
import { Reply, Pin, CheckCheck, Radio, ShieldCheck } from 'lucide-react';
import ClayAvatar from '../../../components/ClayAssets/ClayAvatar';

export const ChatBubble = ({
  msg,
  currentUser,
  isRequester,
  adminId,
  isClosed,
  onReply,
  onPin,
  onScrollToMessage,
}) => {
  const senderObj = msg.senderId;
  const senderIdVal = typeof senderObj === 'object' ? senderObj?._id : senderObj;
  const isSelf = senderIdVal === currentUser?._id;
  const isSystem = msg.type === 'SYSTEM' || msg.type === 'SYSTEM_EVENT' || !senderIdVal;
  const isAdmin = Boolean(
    (adminId && senderIdVal && adminId.toString() === senderIdVal.toString()) ||
    (isRequester && isSelf)
  );

  const senderName =
    typeof senderObj === 'object' && senderObj?.name
      ? senderObj.name
      : isSelf
      ? currentUser?.name || 'You'
      : 'Participant';

  const avatarSrc =
    typeof senderObj === 'object' && senderObj?.avatar
      ? senderObj.avatar
      : isSelf
      ? currentUser?.avatar
      : null;

  const contentText = msg.text || msg.content;
  const replyTo = msg.replyTo;

  if (isSystem) {
    return (
      <div id={`msg-${msg._id}`} className="flex justify-center my-3 transition-colors duration-500 rounded-xl p-1">
        <div className="px-3.5 py-1.5 rounded-full bg-stone-100/90 border border-stone-200/80 text-[11px] font-bold text-stone-600 flex items-center gap-1.5 shadow-2xs max-w-md text-center">
          <Radio className="w-3 h-3 text-[#d93829] animate-pulse shrink-0" />
          <span>{contentText}</span>
        </div>
      </div>
    );
  }

  const timeFormatted = msg.createdAt
    ? new Date(msg.createdAt).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : '';

  const quotedSenderDisplay =
    replyTo?.senderName === currentUser?.name ? 'You' : replyTo?.senderName || 'Original Message';

  return (
    <div
      id={`msg-${msg._id}`}
      className={`group flex items-start gap-1.5 transition-all duration-200 ${
        isSelf ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <ClayAvatar
        src={avatarSrc}
        type="neutral"
        size={28}
        showBadge={false}
      />

      {/* Bubble + Actions Wrapper */}
      <div className={`relative flex items-center gap-1 max-w-[85%] sm:max-w-[75%] ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* WhatsApp-Style Chat Bubble */}
        <div
          className={`relative px-3 pt-2 pb-1.5 rounded-xl shadow-2xs text-xs sm:text-[13px] leading-relaxed ${
            isSelf
              ? 'bg-[#c62828] text-white rounded-tr-[3px]'
              : 'bg-stone-100 text-stone-900 border border-stone-200/60 rounded-tl-[3px]'
          }`}
        >
          {/* Sender Name in Group Chat (WhatsApp style for incoming) */}
          {!isSelf && (
            <div
              className={`text-[11px] font-extrabold select-none flex items-center gap-1.5 leading-tight ${
                replyTo && (replyTo.text || replyTo.messageId) ? 'mb-2' : 'mb-1.5'
              } ${isAdmin ? 'text-[#c62828]' : 'text-[#ea580c]'}`}
            >
              <span>{senderName}</span>
              {isAdmin ? (
                <span className="text-[10px] font-bold text-stone-400 tracking-tight">
                  ~ Admin
                </span>
              ) : (
                typeof senderObj === 'object' && senderObj?.bloodGroup && (
                  <span className="text-[10px] font-medium text-stone-400">
                    ({senderObj.bloodGroup})
                  </span>
                )
              )}
            </div>
          )}

          {/* Quoted Reply Box (WhatsApp Structure) */}
          {replyTo && (replyTo.text || replyTo.messageId) && (
            <div
              onClick={() => replyTo.messageId && onScrollToMessage && onScrollToMessage(replyTo.messageId)}
              title="Click to jump to message"
              className={`rounded-lg px-2.5 py-1.5 mb-2 cursor-pointer text-left transition-opacity hover:opacity-90 ${
                isSelf
                  ? 'bg-black/20 border-l-[3.5px] border-l-rose-200 text-white'
                  : 'bg-stone-200/70 border-l-[3.5px] border-l-[#c62828] text-stone-800'
              }`}
            >
              <div
                className={`text-[11px] font-bold leading-tight mb-1 ${
                  isSelf ? 'text-rose-100' : 'text-[#c62828]'
                }`}
              >
                {quotedSenderDisplay}
              </div>
              <div
                className={`text-[11px] truncate leading-snug max-w-[280px] sm:max-w-[340px] ${
                  isSelf ? 'text-white/85' : 'text-stone-600'
                }`}
              >
                {replyTo.text || 'Original message'}
              </div>
            </div>
          )}

          {/* Message Text Body */}
          <div className="whitespace-pre-wrap break-words font-normal pt-0.5">
            <span>{contentText}</span>
            {/* Inline Timestamp + Ticks */}
            <span
              className={`inline-flex items-center gap-0.5 text-[10px] select-none ml-2 float-right translate-y-[2px] ${
                isSelf ? 'text-white/75 font-medium' : 'text-stone-400 font-medium'
              }`}
            >
              <span>{timeFormatted}</span>
              {isSelf && <CheckCheck className="w-3.5 h-3.5 text-white/90 shrink-0" />}
            </span>
          </div>
        </div>

        {/* Floating Quick Action Buttons (WhatsApp Hover Actions) */}
        <div
          className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 ${
            isSelf ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {/* Reply Button */}
          {!isClosed && onReply && (
            <button
              type="button"
              onClick={() => onReply(msg)}
              title="Reply to this message"
              className="p-1 rounded-full bg-white/90 hover:bg-stone-200 text-stone-600 hover:text-stone-900 shadow-xs border border-stone-200 cursor-pointer transition-colors"
            >
              <Reply className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Pin Message Button (Requester Only) */}
          {isRequester && !isClosed && onPin && (
            <button
              type="button"
              onClick={() => onPin(msg._id)}
              title="Pin instructions"
              className="p-1 rounded-full bg-white/90 hover:bg-amber-100 text-stone-500 hover:text-amber-700 shadow-xs border border-stone-200 cursor-pointer transition-colors"
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
