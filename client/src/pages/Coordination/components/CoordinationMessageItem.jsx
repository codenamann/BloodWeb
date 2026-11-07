import React from 'react';
import ChatBubble from './ChatBubble';

export const CoordinationMessageItem = ({
  msg,
  currentUser,
  isRequester,
  adminId,
  isClosed,
  handlePin,
  onDelete,
  onReply,
  onScrollToMessage,
}) => {
  return (
    <ChatBubble
      msg={msg}
      currentUser={currentUser}
      isRequester={isRequester}
      adminId={adminId}
      isClosed={isClosed}
      onReply={onReply}
      onPin={handlePin}
      onDelete={onDelete}
      onScrollToMessage={onScrollToMessage}
    />
  );
};

export default CoordinationMessageItem;
