import React from 'react';
import { Pin, Radio } from 'lucide-react';
import ClayAvatar from '../../../components/ClayAssets/ClayAvatar';

export const CoordinationMessageItem = ({
  msg,
  currentUser,
  isRequester,
  isClosed,
  handlePin,
}) => {
  const senderObj = msg.senderId;
  const senderIdVal = typeof senderObj === 'object' ? senderObj?._id : senderObj;
  const isSelf = senderIdVal === currentUser?._id;
  const isSystem = msg.type === 'SYSTEM' || msg.type === 'SYSTEM_EVENT' || !senderIdVal;
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
      <div className="flex justify-center my-2">
        <div className="px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-[11px] font-bold text-stone-600 flex items-center gap-1.5 shadow-2xs max-w-md text-center">
          <Radio className="w-3 h-3 text-[#d93829] animate-pulse shrink-0" />
          <span>{contentText}</span>
        </div>
      </div>
    );
  }

  return (
    <div
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
};

export default CoordinationMessageItem;
