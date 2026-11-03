import React from 'react';
import { X } from 'lucide-react';

export const CoordinationReplyBanner = ({ replyingTo, currentUser, onCancel }) => {
  if (!replyingTo) return null;

  const isSelf =
    replyingTo.senderId?._id === currentUser?._id ||
    replyingTo.senderId === currentUser?._id;
  const senderName = isSelf ? 'yourself' : replyingTo.senderId?.name || 'Participant';

  return (
    <div className="px-4 py-2.5 bg-stone-100/95 border-t border-stone-200/80 flex items-center justify-between gap-3 text-xs animate-in slide-in-from-bottom-1">
      <div className="flex-1 border-l-[3.5px] border-l-[#c62828] pl-2.5 min-w-0">
        <div className="text-[11px] font-extrabold text-[#c62828]">
          Replying to {senderName}
        </div>
        <div className="text-[11px] text-stone-600 truncate font-medium">
          {replyingTo.text || replyingTo.content}
        </div>
      </div>
      <button
        type="button"
        onClick={onCancel}
        className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 cursor-pointer transition-colors"
        title="Cancel reply"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CoordinationReplyBanner;
