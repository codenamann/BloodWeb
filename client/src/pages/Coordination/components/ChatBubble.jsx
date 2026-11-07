import React, { useState } from 'react';
import { Reply, Pin, CheckCheck, Radio } from 'lucide-react';
import ClayAvatar from '../../../components/ClayAssets/ClayAvatar';
import MessageActionMenu from './MessageActionMenu';

const PARTICIPANT_COLORS = [
  '#059669', '#ea580c', '#0284c7', '#7c3aed', '#db2777', '#d97706', '#0891b2', '#4f46e5',
];

const getParticipantColor = (name) => {
  if (!name) return '#059669';
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return PARTICIPANT_COLORS[Math.abs(hash) % PARTICIPANT_COLORS.length];
};

const isOnlyEmojis = (text) => {
  if (!text) return false;
  const clean = text.trim();
  if (!clean || clean.length > 12) return false;
  return /^(\p{Extended_Pictographic}|\p{Emoji_Presentation}|\s)+$/u.test(clean);
};

export const ChatBubble = ({
  msg, currentUser, isRequester, adminId, isClosed, onReply, onPin, onDelete, onScrollToMessage,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const senderObj = msg.senderId;
  const senderIdVal = typeof senderObj === 'object' ? senderObj?._id : senderObj;
  const isSelf = senderIdVal === currentUser?._id;
  const isSystem = msg.type === 'SYSTEM' || msg.type === 'SYSTEM_EVENT' || !senderIdVal;
  const isAdmin = Boolean((adminId && senderIdVal && adminId.toString() === senderIdVal.toString()) || (isRequester && isSelf));
  const senderName = typeof senderObj === 'object' && senderObj?.name ? senderObj.name : isSelf ? currentUser?.name || 'You' : 'Participant';
  const avatarSrc = typeof senderObj === 'object' && senderObj?.avatar ? senderObj.avatar : isSelf ? currentUser?.avatar : null;
  const contentText = msg.text || msg.content;
  const replyTo = msg.replyTo;
  const canDelete = Boolean(isRequester && !isClosed && onDelete);

  if (isSystem) {
    return (
      <div id={`msg-${msg._id}`} className="group animate-message-enter flex justify-center my-3 transition-colors duration-500 rounded-xl p-1 relative items-center">
        <div className="px-3.5 py-1.5 rounded-full bg-stone-100/90 border border-stone-200/80 text-[11px] font-bold text-stone-600 flex items-center gap-1.5 shadow-2xs max-w-md text-center">
          <Radio className="w-3 h-3 text-[#d93829] animate-pulse shrink-0" />
          <span>{contentText}</span>
        </div>
        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(msg._id)}
            title="Delete notification"
            className="opacity-0 group-hover:opacity-100 ml-1.5 p-1 rounded-full bg-white/90 hover:bg-red-50 text-stone-400 hover:text-red-600 shadow-xs border border-stone-200 cursor-pointer transition-all"
          >
            <span className="text-[10px] font-bold">✕</span>
          </button>
        )}
      </div>
    );
  }

  const timeFormatted = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }) : '';
  const quotedSenderDisplay = replyTo?.senderName === currentUser?.name ? 'You' : replyTo?.senderName || 'Original Message';
  const quotedColor = getParticipantColor(replyTo?.senderName || 'Donor');
  const senderColor = isAdmin ? '#c62828' : getParticipantColor(senderName);
  const isEmojiMessage = isOnlyEmojis(contentText);

  return (
    <div
      id={`msg-${msg._id}`}
      className={`group animate-message-enter flex items-start gap-1.5 transition-all duration-200 ${
        isMenuOpen ? 'z-40 relative' : 'z-10'
      } ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <ClayAvatar src={avatarSrc} type="neutral" size={28} showBadge={false} />

      <div className={`relative flex items-center gap-1 max-w-[85%] sm:max-w-[75%] ${isMenuOpen ? 'z-40' : 'z-10'} ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
        <div
          className={`relative p-1.5 sm:p-2 rounded-2xl shadow-xs text-xs sm:text-[13px] leading-relaxed ${
            isMenuOpen ? 'z-40' : 'z-10'
          } ${
            isSelf
              ? 'bg-[#c62828] text-white rounded-tr-xs'
              : 'bg-stone-100 text-stone-900 border border-stone-200/70 rounded-tl-xs'
          }`}
        >
          {canDelete && (
            <MessageActionMenu
              isSelf={isSelf}
              isOpen={isMenuOpen}
              onToggle={() => setIsMenuOpen((prev) => !prev)}
              onClose={() => setIsMenuOpen(false)}
              onDelete={onDelete}
              messageId={msg._id}
            />
          )}

          {!isSelf && (
            <div
              className={`text-[11px] font-bold select-none flex items-center gap-1.5 leading-tight px-1 pt-0.5 ${
                replyTo && (replyTo.text || replyTo.messageId) ? 'mb-1' : 'mb-0.5'
              }`}
              style={{ color: senderColor }}
            >
              <span>{senderName}</span>
              {isAdmin && <span className="text-[10px] font-semibold text-stone-400 tracking-tight">~ Admin</span>}
              {!isAdmin && typeof senderObj === 'object' && senderObj?.bloodGroup && (
                <span className="text-[10px] font-medium text-stone-400">({senderObj.bloodGroup})</span>
              )}
            </div>
          )}

          {replyTo && (replyTo.text || replyTo.messageId) && (
            <div
              onClick={() => replyTo.messageId && onScrollToMessage && onScrollToMessage(replyTo.messageId)}
              aria-label="Jump to quoted message"
              className={`relative overflow-hidden rounded-lg pl-2.5 pr-2 py-1 mb-1 cursor-pointer text-left transition-opacity hover:opacity-90 ${
                isSelf ? 'bg-black/20 text-white' : 'bg-stone-200/80 text-stone-800'
              }`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-[3.5px]" style={{ backgroundColor: isSelf ? '#fca5a5' : quotedColor }} />
              <div className="text-[11px] font-bold leading-tight mb-0.5 truncate" style={{ color: isSelf ? '#fee2e2' : quotedColor }}>
                {quotedSenderDisplay}
              </div>
              <div className={`text-[11px] truncate leading-tight max-w-[280px] sm:max-w-[340px] ${isSelf ? 'text-white/85' : 'text-stone-600'}`}>
                {replyTo.text || 'Original message'}
              </div>
            </div>
          )}

          <div className={`whitespace-pre-wrap break-words px-1 ${isEmojiMessage ? 'text-3xl sm:text-4xl py-1 text-center leading-normal' : 'pt-0.5 font-normal'}`}>
            <span>{contentText}</span>
            <span className={`inline-flex items-center gap-0.5 text-[10px] select-none ml-2.5 float-right translate-y-[2px] ${isSelf ? 'text-white/75 font-medium' : 'text-stone-400 font-medium'}`}>
              <span>{timeFormatted}</span>
              {isSelf && <CheckCheck className="w-3.5 h-3.5 text-white/90 shrink-0" />}
            </span>
          </div>

          {(msg.reaction || msg.reactions) && (
            <div className={`absolute -bottom-2 ${isSelf ? 'right-2' : 'left-2'} px-1.5 py-0.5 rounded-full bg-white shadow-xs border border-stone-200 text-xs flex items-center gap-1 select-none z-10`}>
              <span>{msg.reaction || '👍'}</span>
            </div>
          )}
        </div>

        <div className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
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
